import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { 
  Calendar, Clock, GraduationCap, Book, User, 
  LayoutDashboard, BookOpen, Monitor, CalendarClock, AlertTriangle 
} from 'lucide-react';
import SplashScreen from './components/SplashScreen';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TimeTable from './components/TimeTable';
import Attendance from './components/Attendance';
import SmartBoard from './components/SmartBoard';
import Events from './components/Events';
import Assignments from './components/Assignments';

interface LoginData {
  username: string;
  password: string;
}

interface AttendanceData {
  daily_attendance: Record<string, string[]>;
  subject_attendance: Record<string, string>;
  timetable: Record<string, string[]>;
}

interface EyePositionProps {
  left: number;
  top: number;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [loginData, setLoginData] = useState<LoginData>({ username: '', password: '' });
  const [attendanceData, setAttendanceData] = useState<AttendanceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [leftEyePosition, setLeftEyePosition] = useState<EyePositionProps>({ left: 50, top: 50 });
  const [rightEyePosition, setRightEyePosition] = useState<EyePositionProps>({ left: 50, top: 50 });
  const [activeInput, setActiveInput] = useState<'username' | 'password' | null>(null);
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const characterRef = useRef<HTMLDivElement>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post('https://aura-extraction.onrender.com/get-attendance', {
        username: loginData.username,
        password: loginData.password
      });
      
      if (response.data) {
        setAttendanceData(response.data);
        setShowSplash(true);
        setTimeout(() => {
          setShowSplash(false);
          setIsLoggedIn(true);
        }, 3000);
        toast.success('Login successful!');
      } else {
        toast.error('No data received from server');
      }
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
      console.error('Login error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Update eye positions based on typing and cursor position
  useEffect(() => {
    const updateEyePosition = () => {
      if (!characterRef.current) return;
      
      const characterRect = characterRef.current.getBoundingClientRect();
      const characterCenterX = characterRect.left + characterRect.width / 2;
      const characterCenterY = characterRect.top + characterRect.height / 2;
      
      let targetX = characterCenterX;
      let targetY = characterCenterY;
      
      // Determine target position based on active input
      if (activeInput === 'username' && usernameInputRef.current) {
        const inputRect = usernameInputRef.current.getBoundingClientRect();
        targetX = inputRect.left + (loginData.username.length * 8) + 10; // Approximate character width
        targetY = inputRect.top + inputRect.height / 2;
      } else if (activeInput === 'password' && passwordInputRef.current) {
        const inputRect = passwordInputRef.current.getBoundingClientRect();
        targetX = inputRect.left + (loginData.password.length * 8) + 10; // Approximate character width
        targetY = inputRect.top + inputRect.height / 2;
      }
      
      // Calculate eye movement (limited to within eye socket)
      const eyeMovementRangeX = 30; // percentage
      const eyeMovementRangeY = 30; // percentage
      
      // Calculate direction from character center to target
      const deltaX = targetX - characterCenterX;
      const deltaY = targetY - characterCenterY;
      
      // Normalize and apply movement range
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const normalizedX = distance > 0 ? deltaX / distance : 0;
      const normalizedY = distance > 0 ? deltaY / distance : 0;
      
      const leftEyeLeft = 50 + normalizedX * eyeMovementRangeX;
      const leftEyeTop = 50 + normalizedY * eyeMovementRangeY;
      const rightEyeLeft = 50 + normalizedX * eyeMovementRangeX;
      const rightEyeTop = 50 + normalizedY * eyeMovementRangeY;
      
      setLeftEyePosition({ left: leftEyeLeft, top: leftEyeTop });
      setRightEyePosition({ left: rightEyeLeft, top: rightEyeTop });
    };
    
    updateEyePosition();
    
    // Add small micro-movements when typing
    const typingInterval = setInterval(() => {
      if (activeInput) {
        updateEyePosition();
      }
    }, 50);
    
    return () => clearInterval(typingInterval);
  }, [activeInput, loginData.username, loginData.password]);

  if (showSplash) {
    return <SplashScreen />;
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative">
        <Toaster position="top-right" />
        
        {/* Fixed Cute Character Head */}
        <div 
          ref={characterRef}
          className="w-32 h-32 bg-purple-500 rounded-full mb-8 relative"
        >
          {/* Left Eye Socket */}
          <div className="absolute w-8 h-8 bg-white rounded-full left-4 top-8 overflow-hidden">
            {/* Left Eye Pupil */}
            <div 
              className="absolute w-4 h-4 bg-black rounded-full transition-all duration-100"
              style={{ 
                left: `${leftEyePosition.left}%`, 
                top: `${leftEyePosition.top}%`, 
                transform: 'translate(-50%, -50%)' 
              }}
            >
              <div className="absolute w-1 h-1 bg-white rounded-full top-1 left-1"></div>
            </div>
          </div>
          
          {/* Right Eye Socket */}
          <div className="absolute w-8 h-8 bg-white rounded-full right-4 top-8 overflow-hidden">
            {/* Right Eye Pupil */}
            <div 
              className="absolute w-4 h-4 bg-black rounded-full transition-all duration-100"
              style={{ 
                left: `${rightEyePosition.left}%`, 
                top: `${rightEyePosition.top}%`, 
                transform: 'translate(-50%, -50%)' 
              }}
            >
              <div className="absolute w-1 h-1 bg-white rounded-full top-1 left-1"></div>
            </div>
          </div>
          
          {/* Smile */}
          <div className="absolute w-16 h-8 bottom-6 left-8">
            <div className="w-full h-full border-b-4 border-white rounded-full"></div>
          </div>
        </div>

        <div className="text-6xl font-bold text-white mb-2 font-reospec">AURA</div>
        <div className="text-gray-400 mb-8 text-center">
          Academic Utility and Resource Allocator
        </div>
        <form onSubmit={handleLogin} className="w-full max-w-md space-y-4">
          <div className="border border-gray-700 rounded-lg p-6 bg-black">
            <input
              ref={usernameInputRef}
              type="text"
              placeholder="Username"
              className="w-full p-3 mb-4 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white"
              value={loginData.username}
              onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
              onFocus={() => setActiveInput('username')}
              onBlur={() => setActiveInput(null)}
              required
            />
            <input
              ref={passwordInputRef}
              type="password"
              placeholder="Password"
              className="w-full p-3 mb-6 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              onFocus={() => setActiveInput('password')}
              onBlur={() => setActiveInput(null)}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Toaster position="top-right" />
      
      <Sidebar activeView={activeView} setActiveView={setActiveView} username={loginData.username} />
      
      <main className="flex-1 p-8 ml-64">
        {activeView === 'dashboard' && <Dashboard attendanceData={attendanceData} />}
        {activeView === 'timetable' && <TimeTable timetable={attendanceData?.timetable} />}
        {activeView === 'attendance' && <Attendance attendanceData={attendanceData} />}
        {activeView === 'assignments' && <Assignments />}
        {activeView === 'smartboard' && <SmartBoard />}
        {activeView === 'events' && <Events />}
      </main>
    </div>
  );
}

export default App;
