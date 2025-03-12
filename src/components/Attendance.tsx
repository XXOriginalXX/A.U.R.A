import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

const Attendance = ({ attendanceData }: { attendanceData: any }) => {
  const [showDailyAttendance, setShowDailyAttendance] = useState(false);

  if (!attendanceData || (!attendanceData.subject_attendance && !attendanceData.daily_attendance)) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)]">
        <AlertTriangle size={64} className="text-yellow-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-400">Attendance Records</h2>
        <p className="text-gray-600 mt-2">No attendance data available</p>
      </div>
    );
  }

  const hasSubjectData = attendanceData.subject_attendance && Object.keys(attendanceData.subject_attendance).length > 0;
  const hasDailyData = attendanceData.daily_attendance && Object.keys(attendanceData.daily_attendance).length > 0;

  // Sort daily attendance by date (assuming dates are in a sortable format like '10th', '11th', etc.)
  const sortedDailyAttendance = hasDailyData
    ? Object.entries(attendanceData.daily_attendance).sort(([a], [b]) => parseInt(a) - parseInt(b))
    : [];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Attendance Records</h2>

      {hasSubjectData && (
        <div className="grid gap-6 mb-8">
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
      )}

      {hasDailyData && (
        <div className="grid gap-6">
          <button
            onClick={() => setShowDailyAttendance(!showDailyAttendance)}
            className="w-full flex justify-between items-center p-4 bg-gray-900 rounded-lg border border-gray-800 text-left text-xl font-semibold"
          >
            Daily Attendance
            {showDailyAttendance ? <ChevronUp /> : <ChevronDown />}
          </button>

          {showDailyAttendance && (
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="p-3 border-b border-gray-700">Date</th>
                      <th className="p-3 border-b border-gray-700">Period 1</th>
                      <th className="p-3 border-b border-gray-700">Period 2</th>
                      <th className="p-3 border-b border-gray-700">Period 3</th>
                      <th className="p-3 border-b border-gray-700">Period 4</th>
                      <th className="p-3 border-b border-gray-700">Period 5</th>
                      <th className="p-3 border-b border-gray-700">Period 6</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedDailyAttendance.map(([date, periods], index) => (
                      <tr key={index} className="border-b border-gray-800">
                        <td className="p-3 font-medium">{date}</td>
                        {Array.isArray(periods)
                          ? periods.map((period, idx) => (
                              <td key={idx} className="p-3">{period ? period.split('\n')[0] : 'No Class'}</td>
                            ))
                          : <td colSpan={6} className="p-3">Invalid data format</td>
                        }
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {!hasSubjectData && !hasDailyData && (
        <div className="flex flex-col items-center justify-center mt-12">
          <AlertTriangle size={48} className="text-yellow-500 mb-4" />
          <p className="text-gray-400">No attendance data found. Please check your API response.</p>
        </div>
      )}
    </div>
  );
};

export default Attendance;
