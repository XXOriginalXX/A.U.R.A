import React from 'react';
import { Calendar } from 'lucide-react';

const TimeTable = ({ timetable }: { timetable: Record<string, string[]> | undefined }) => {
  const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const sortedDays = Object.keys(timetable || {}).sort(
    (a, b) => daysOrder.indexOf(a) - daysOrder.indexOf(b)
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Time Table</h2>
      <div className="grid gap-6">
        {sortedDays.map((day) => (
          <div key={day} className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Calendar size={24} />
              {day}
            </h3>
            <div className="grid gap-4">
              {timetable?.[day].map((subject, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg">
                  <div className="bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Period {index + 1}</p>
                    <p className="font-medium">{subject || 'No Class'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeTable;