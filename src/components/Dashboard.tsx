import React from 'react';
import { Clock } from 'lucide-react';

const Dashboard = ({ attendanceData }: { attendanceData: any }) => {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todayClasses = attendanceData?.timetable?.[today] || [];

  const formatSubject = (subject: string) => {
    if (!subject || subject === "No Class") return "No Class";
    const match = subject.match(/^([A-Z]+\d+)\s*-\s*(.+?)(?:\[\s*Theory\s*\].*)?$/);
    return match ? match[2].trim() : subject;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="col-span-2">
        <h2 className="text-2xl font-bold mb-6">Today's Schedule</h2>
        <div className="grid gap-4">
          {todayClasses.map((subject: string, index: number) => (
            <div key={index} className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <div className="flex items-center gap-4">
                <div className="bg-gray-800 rounded-full w-10 h-10 flex items-center justify-center">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Period {index + 1}</p>
                  <p className="font-medium">{formatSubject(subject)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
