import React, { useState } from 'react';
import { 
  LayoutDashboard, Calendar, Clock, BookOpen, 
  Monitor, CalendarClock, User, LogOut, ChevronLeft, ChevronRight,
  GraduationCap, Book
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  username: string;
}

const Sidebar = ({ activeView, setActiveView, username }: SidebarProps) => {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];
  const [logoColor, setLogoColor] = useState(colors[0]);
  const [isColorChanging, setIsColorChanging] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogoClick = () => {
    if (isColorChanging) return;
    
    setIsColorChanging(true);
    let colorIndex = 0;
    const interval = setInterval(() => {
      setLogoColor(colors[colorIndex]);
      colorIndex = (colorIndex + 1) % colors.length;
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setLogoColor(colors[Math.floor(Math.random() * colors.length)]);
      setIsColorChanging(false);
    }, 2000);
  };

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'timetable', icon: Calendar, label: 'Time Table' },
    { id: 'attendance', icon: Clock, label: 'Attendance' },
    { id: 'assignments', icon: BookOpen, label: 'Assignments' },
    { id: 'notes', icon: Book, label: 'Notes' },
    { id: 'activity-points', icon: Monitor, label: 'Activity Points' },
    { id: 'results', icon: GraduationCap, label: 'Results' },
    { id: 'smartboard', icon: Monitor, label: 'Smart Board' },
    { id: 'events', icon: CalendarClock, label: 'College Events' },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div 
      className={`fixed h-screen bg-gray-900 border-r border-gray-800 transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div 
        className="absolute -right-3 top-10 bg-gray-800 rounded-full p-1 cursor-pointer z-10"
        onClick={toggleSidebar}
      >
        {isCollapsed ? 
          <ChevronRight size={16} className="text-gray-400" /> : 
          <ChevronLeft size={16} className="text-gray-400" />
        }
      </div>

      <div className={`p-6 ${isCollapsed ? 'px-4' : ''}`}>
        <div className="mb-8 relative">
          <h1 
            className={`font-bold font-reospec cursor-pointer transition-colors duration-300 ${
              isCollapsed ? 'text-2xl text-center' : 'text-3xl'
            }`}
            style={{ color: logoColor }}
            onClick={handleLogoClick}
          >
            {isCollapsed ? 'A' : 'AURA'}
            {isColorChanging && (
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: `${logoColor} transparent transparent transparent` }}></div>
              </div>
            )}
          </h1>
          {!isCollapsed && <p className="text-gray-400 text-sm">Academic Dashboard</p>}
        </div>

        <div className="space-y-2">
          {menuItems.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveView(id)}
              className={`w-full flex items-center gap-3 rounded-lg transition-colors ${
                isCollapsed ? 'justify-center px-2 py-3' : 'px-4 py-3'
              } ${
                activeView === id 
                  ? 'bg-white text-black' 
                  : 'text-gray-400 hover:bg-gray-800'
              }`}
              title={isCollapsed ? label : ''}
            >
              <Icon size={20} />
              {!isCollapsed && label}
            </button>
          ))}
        </div>

        <div className={`absolute bottom-6 ${isCollapsed ? 'left-0 right-0 px-2' : 'left-6 right-6'}`}>
          <div className="border-t border-gray-800 pt-6">
            <div className={`flex items-center gap-3 text-gray-400 ${
              isCollapsed ? 'justify-center' : 'px-4 py-3'
            }`}>
              <User size={20} />
              {!isCollapsed && <span className="truncate">{username}</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;