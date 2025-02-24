import React from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

const Attendance = ({ attendanceData }: { attendanceData: any }) => {
  if (!attendanceData || !attendanceData.subject_attendance) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)]">
        <AlertTriangle size={64} className="text-yellow-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-400">Attendance Records</h2>
        <p className="text-gray-600 mt-2">No attendance data available</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Attendance Records</h2>
      
      <div className="grid gap-6">
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h3 className="text-xl font-semibold mb-4">Subject-wise Attendance</h3>
          <div className="grid gap-4">
            {Object.entries(attendanceData.subject_attendance).map(([subject, attendance], index) => (
              <div key={index} className="flex justify-between items-center p-4 bg-gray-800 rounded-lg">
                <div className="font-medium">{subject}</div>
                <div className="text-green-400 font-semibold">
                  {typeof attendance === 'string' ? attendance : 'N/A'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;