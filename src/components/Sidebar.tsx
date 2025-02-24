import React from 'react';
import { 
  LayoutDashboard, Calendar, Clock, BookOpen, 
  Monitor, CalendarClock, User, LogOut 
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  username: string;
}

const Sidebar = ({ activeView, setActiveView, username }: SidebarProps) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'timetable', icon: Calendar, label: 'Time Table' },
    { id: 'attendance', icon: Clock, label: 'Attendance' },
    { id: 'assignments', icon: BookOpen, label: 'Assignments' },
    { id: 'smartboard', icon: Monitor, label: 'Smart Board' },
    { id: 'events', icon: CalendarClock, label: 'College Events' },
  ];

  return (
    <div className="fixed w-64 h-screen bg-gray-900 border-r border-gray-800 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-reospec">AURA</h1>
        <p className="text-gray-400 text-sm">Academic Dashboard</p>
      </div>

      <div className="space-y-2">
        {menuItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveView(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeView === id 
                ? 'bg-white text-black' 
                : 'text-gray-400 hover:bg-gray-800'
            }`}
          >
            <Icon size={20} />
            {label}
          </button>
        ))}
      </div>

      <div className="absolute bottom-6 left-6 right-6">
        <div className="border-t border-gray-800 pt-6">
          <div className="flex items-center gap-3 px-4 py-3 text-gray-400">
            <User size={20} />
            <span className="truncate">{username}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;