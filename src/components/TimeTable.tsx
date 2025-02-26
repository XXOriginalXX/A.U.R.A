import React, { useState } from 'react';
import { Calendar, ChevronDown, ChevronRight } from 'lucide-react';

const TimeTable = ({ timetable }: { timetable: Record<string, string[]> | undefined }) => {
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  
  const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const sortedDays = Object.keys(timetable || {}).sort(
    (a, b) => daysOrder.indexOf(a) - daysOrder.indexOf(b)
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Time Table</h2>
      <div className="grid gap-4">
        {sortedDays.map((day) => (
          <div key={day} className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <div 
              className="flex justify-between items-center cursor-pointer" 
              onClick={() => setExpandedDay(expandedDay === day ? null : day)}
            >
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Calendar size={24} />
                {day}
              </h3>
              {expandedDay === day ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </div>
            {expandedDay === day && (
              <div className="grid gap-2 mt-4">
                {timetable?.[day].map((subject, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-gray-800 rounded-lg">
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
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeTable;
