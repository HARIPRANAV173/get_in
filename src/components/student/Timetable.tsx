import React from 'react';
import { Clock, MapPin, User } from 'lucide-react';

const Timetable: React.FC = () => {
  const timeSlots = [
    '9:00 - 10:00',
    '10:00 - 11:00',
    '11:15 - 12:15',
    '12:15 - 1:15',
    '2:15 - 3:15',
    '3:15 - 4:15',
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const timetableData: Record<string, Record<string, { subject: string; teacher: string; room: string; type: string }>> = {
    Monday: {
      '9:00 - 10:00': { subject: 'Data Structures', teacher: 'Dr. Smith', room: 'CS101', type: 'Lecture' },
      '10:00 - 11:00': { subject: 'Database Management', teacher: 'Prof. Johnson', room: 'CS102', type: 'Lecture' },
      '11:15 - 12:15': { subject: 'Web Development', teacher: 'Dr. Wilson', room: 'CS103', type: 'Lab' },
      '12:15 - 1:15': { subject: 'Lunch Break', teacher: '', room: '', type: 'Break' },
      '2:15 - 3:15': { subject: 'Computer Networks', teacher: 'Prof. Brown', room: 'CS104', type: 'Lecture' },
      '3:15 - 4:15': { subject: 'Operating Systems', teacher: 'Dr. Davis', room: 'CS105', type: 'Tutorial' },
    },
    Tuesday: {
      '9:00 - 10:00': { subject: 'Operating Systems', teacher: 'Dr. Davis', room: 'CS105', type: 'Lecture' },
      '10:00 - 11:00': { subject: 'Data Structures', teacher: 'Dr. Smith', room: 'CS101', type: 'Lab' },
      '11:15 - 12:15': { subject: 'Database Management', teacher: 'Prof. Johnson', room: 'CS102', type: 'Tutorial' },
      '12:15 - 1:15': { subject: 'Lunch Break', teacher: '', room: '', type: 'Break' },
      '2:15 - 3:15': { subject: 'Web Development', teacher: 'Dr. Wilson', room: 'CS103', type: 'Lecture' },
      '3:15 - 4:15': { subject: 'Computer Networks', teacher: 'Prof. Brown', room: 'CS104', type: 'Lab' },
    },
    Wednesday: {
      '9:00 - 10:00': { subject: 'Computer Networks', teacher: 'Prof. Brown', room: 'CS104', type: 'Lecture' },
      '10:00 - 11:00': { subject: 'Web Development', teacher: 'Dr. Wilson', room: 'CS103', type: 'Tutorial' },
      '11:15 - 12:15': { subject: 'Operating Systems', teacher: 'Dr. Davis', room: 'CS105', type: 'Lab' },
      '12:15 - 1:15': { subject: 'Lunch Break', teacher: '', room: '', type: 'Break' },
      '2:15 - 3:15': { subject: 'Data Structures', teacher: 'Dr. Smith', room: 'CS101', type: 'Tutorial' },
      '3:15 - 4:15': { subject: 'Database Management', teacher: 'Prof. Johnson', room: 'CS102', type: 'Lab' },
    },
    Thursday: {
      '9:00 - 10:00': { subject: 'Database Management', teacher: 'Prof. Johnson', room: 'CS102', type: 'Lecture' },
      '10:00 - 11:00': { subject: 'Computer Networks', teacher: 'Prof. Brown', room: 'CS104', type: 'Tutorial' },
      '11:15 - 12:15': { subject: 'Data Structures', teacher: 'Dr. Smith', room: 'CS101', type: 'Lecture' },
      '12:15 - 1:15': { subject: 'Lunch Break', teacher: '', room: '', type: 'Break' },
      '2:15 - 3:15': { subject: 'Operating Systems', teacher: 'Dr. Davis', room: 'CS105', type: 'Lecture' },
      '3:15 - 4:15': { subject: 'Web Development', teacher: 'Dr. Wilson', room: 'CS103', type: 'Lab' },
    },
    Friday: {
      '9:00 - 10:00': { subject: 'Web Development', teacher: 'Dr. Wilson', room: 'CS103', type: 'Lecture' },
      '10:00 - 11:00': { subject: 'Operating Systems', teacher: 'Dr. Davis', room: 'CS105', type: 'Tutorial' },
      '11:15 - 12:15': { subject: 'Computer Networks', teacher: 'Prof. Brown', room: 'CS104', type: 'Lecture' },
      '12:15 - 1:15': { subject: 'Lunch Break', teacher: '', room: '', type: 'Break' },
      '2:15 - 3:15': { subject: 'Database Management', teacher: 'Prof. Johnson', room: 'CS102', type: 'Tutorial' },
      '3:15 - 4:15': { subject: 'Data Structures', teacher: 'Dr. Smith', room: 'CS101', type: 'Lab' },
    },
  };

  const getCurrentDay = () => {
    const today = new Date().getDay();
    return days[today - 1] || 'Monday'; // Default to Monday if weekend
  };

  const currentDay = getCurrentDay();

  const getSubjectColor = (type: string) => {
    switch (type) {
      case 'Lecture': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Lab': return 'bg-green-100 text-green-800 border-green-200';
      case 'Tutorial': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Break': return 'bg-gray-100 text-gray-600 border-gray-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Weekly Timetable</h3>
          <div className="flex items-center text-blue-600">
            <Clock className="h-5 w-5 mr-2" />
            Current: {currentDay}
          </div>
        </div>

        {/* Timetable Grid */}
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Header Row */}
            <div className="grid grid-cols-6 gap-2 mb-4">
              <div className="bg-gray-50 p-3 rounded-lg text-center font-medium text-gray-700">
                Time
              </div>
              {days.map(day => (
                <div key={day} className={`p-3 rounded-lg text-center font-medium ${
                  day === currentDay ? 'bg-blue-100 text-blue-800' : 'bg-gray-50 text-gray-700'
                }`}>
                  {day}
                </div>
              ))}
            </div>

            {/* Time Slots */}
            <div className="space-y-2">
              {timeSlots.map((timeSlot) => (
                <div key={timeSlot} className="grid grid-cols-6 gap-2">
                  <div className="bg-gray-50 p-3 rounded-lg text-center font-medium text-gray-700 text-sm">
                    {timeSlot}
                  </div>
                  {days.map(day => {
                    const classInfo = timetableData[day]?.[timeSlot];
                    return (
                      <div key={`${day}-${timeSlot}`} className={`p-3 rounded-lg border ${
                        classInfo ? getSubjectColor(classInfo.type) : 'bg-gray-50 border-gray-200'
                      }`}>
                        {classInfo ? (
                          <div className="text-sm">
                            <div className="font-medium mb-1">{classInfo.subject}</div>
                            {classInfo.teacher && (
                              <div className="flex items-center text-xs mb-1">
                                <User className="h-3 w-3 mr-1" />
                                {classInfo.teacher}
                              </div>
                            )}
                            {classInfo.room && (
                              <div className="flex items-center text-xs">
                                <MapPin className="h-3 w-3 mr-1" />
                                {classInfo.room}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-xs text-gray-400 text-center">Free</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Today's Schedule ({currentDay})</h4>
        <div className="space-y-3">
          {timeSlots.map((timeSlot) => {
            const classInfo = timetableData[currentDay]?.[timeSlot];
            if (!classInfo) return null;

            return (
              <div key={timeSlot} className={`p-4 rounded-lg border ${getSubjectColor(classInfo.type)}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium">{classInfo.subject}</h5>
                    <div className="text-sm opacity-75 mt-1">
                      {classInfo.teacher && `${classInfo.teacher} • `}
                      {classInfo.room && `Room ${classInfo.room} • `}
                      {classInfo.type}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{timeSlot}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Legend</h4>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-100 border border-blue-200 rounded mr-2"></div>
            <span className="text-sm text-gray-700">Lecture</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-100 border border-green-200 rounded mr-2"></div>
            <span className="text-sm text-gray-700">Lab</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-purple-100 border border-purple-200 rounded mr-2"></div>
            <span className="text-sm text-gray-700">Tutorial</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded mr-2"></div>
            <span className="text-sm text-gray-700">Break</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timetable;