import React, { useState, useEffect } from 'react';
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

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [loginData, setLoginData] = useState<LoginData>({ username: '', password: '' });
  const [attendanceData, setAttendanceData] = useState<AttendanceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');

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

  if (showSplash) {
    return <SplashScreen />;
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <Toaster position="top-right" />
        <div className="text-6xl font-bold text-white mb-2 font-reospec">AURA</div>
        <div className="text-gray-400 mb-8 text-center">
          Academic Utility and Resource Allocator
        </div>
        <form onSubmit={handleLogin} className="w-full max-w-md space-y-4">
          <div className="border border-gray-700 rounded-lg p-6 bg-black">
            <input
              type="text"
              placeholder="Username"
              className="w-full p-3 mb-4 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white"
              value={loginData.username}
              onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 mb-6 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
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