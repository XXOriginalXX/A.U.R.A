import React, { useState, useMemo } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';

const Attendance = ({ attendanceData }: { attendanceData: any }) => {
  const [showDailyAttendance, setShowDailyAttendance] = useState(false);
  const [showAttendanceDetails, setShowAttendanceDetails] = useState(true);

  // Extract subject mappings from timetable data
  const subjectMapping = useMemo(() => {
    if (!attendanceData?.timetable) return {};

    const mapping: Record<string, string> = {};
    Object.values(attendanceData.timetable).forEach((periods: any) => {
      if (Array.isArray(periods)) {
        periods.forEach(period => {
          if (typeof period === 'string') {
            const match = period.match(/([A-Z]+\d+)\s*-\s*([^[]+)/);
            if (match) {
              const [, code, name] = match;
              mapping[code.trim()] = name.trim();
            }
          }
        });
      }
    });
    return mapping;
  }, [attendanceData?.timetable]);

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

  // Sort and filter out invalid subjects
  const validSubjects = hasSubjectData
    ? Object.entries(attendanceData.subject_attendance)
        .filter(([subject, data]: [string, any]) => {
          // Filter out subjects with N/A percentage or non-existent subjects
          return data.percentage !== 'N/A' && subjectMapping[subject];
        })
    : [];

  // Calculate classes needed for target percentages
  const calculateClassesNeeded = (current: string, total: string) => {
    const [attended, totalClasses] = current.split('/').map(Number);
    if (!attended || !totalClasses) return null;

    const calculateForTarget = (targetPercentage: number) => {
      const currentPercentage = (attended / totalClasses) * 100;
      if (currentPercentage >= targetPercentage) {
        return {
          canCut: Math.floor(attended - (totalClasses * targetPercentage / 100)),
          needToAttend: 0
        };
      } else {
        const totalNeeded = Math.ceil((targetPercentage * totalClasses) / 100);
        return {
          canCut: 0,
          needToAttend: totalNeeded - attended
        };
      }
    };

    return {
      '90%': calculateForTarget(90),
      '80%': calculateForTarget(80),
      '75%': calculateForTarget(75)
    };
  };

  // Sort daily attendance
  const sortedDailyAttendance = hasDailyData
    ? Object.entries(attendanceData.daily_attendance).sort(([a], [b]) => {
        const numA = parseInt(a.replace(/\D/g, ''));
        const numB = parseInt(b.replace(/\D/g, ''));
        return numA - numB;
      })
    : [];

  const getPercentageColor = (percentage: string) => {
    const value = parseFloat(percentage);
    if (isNaN(value)) return "text-gray-400";
    if (value >= 90) return "text-green-400";
    if (value >= 75) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Attendance Records</h2>

      {hasSubjectData && (
        <div className="grid gap-6 mb-8">
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Subject-wise Attendance</h3>
              <button
                onClick={() => setShowAttendanceDetails(!showAttendanceDetails)}
                className="flex items-center gap-2 text-gray-400 hover:text-white"
              >
                {showAttendanceDetails ? <EyeOff size={20} /> : <Eye size={20} />}
                {showAttendanceDetails ? 'Hide Details' : 'Show Details'}
              </button>
            </div>
            <div className="grid gap-4">
              {validSubjects.map(([subject, data]: [string, any], index) => {
                const classesNeeded = calculateClassesNeeded(data.count, data.count.split('/')[1]);
                
                return (
                  <div key={index} className="bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-medium">{subjectMapping[subject] || subject}</div>
                      <div className="flex items-center gap-4">
                        {showAttendanceDetails && (
                          <span className="text-gray-300">{data.count}</span>
                        )}
                        <span className={`${getPercentageColor(data.percentage)} font-semibold`}>
                          {data.percentage}
                        </span>
                      </div>
                    </div>
                    
                    {showAttendanceDetails && classesNeeded && (
                      <div className="mt-3 text-sm grid gap-2">
                        {Object.entries(classesNeeded).map(([target, calc]) => (
                          <div key={target} className="text-gray-400">
                            <span className="font-medium">{target}:</span>
                            {calc.canCut > 0 ? (
                              <span className="text-green-400 ml-2">
                                Can skip {calc.canCut} {calc.canCut === 1 ? 'class' : 'classes'}
                              </span>
                            ) : calc.needToAttend > 0 ? (
                              <span className="text-yellow-400 ml-2">
                                Need to attend {calc.needToAttend} more {calc.needToAttend === 1 ? 'class' : 'classes'}
                              </span>
                            ) : (
                              <span className="text-gray-400 ml-2">Target achieved</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
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
                              <td 
                                key={idx} 
                                className={`p-3 ${
                                  period === 'Present' ? 'text-green-400' : 
                                  period === 'Absent' ? 'text-red-400' : 
                                  'text-gray-400'
                                }`}
                              >
                                {period ? period.split('\n')[0] : 'No Class'}
                              </td>
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