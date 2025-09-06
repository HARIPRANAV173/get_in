import React from 'react';
import { Clock, MapPin, Users } from 'lucide-react';

const TeacherTimetable: React.FC = () => {
  const timeSlots = [
    '9:00 - 10:00',
    '10:00 - 11:00',
    '11:15 - 12:15',
    '12:15 - 1:15',
    '2:15 - 3:15',
    '3:15 - 4:15',
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const teacherSchedule: Record<string, Record<string, { subject: string; section: string; room: string; type: string; students: number }>> = {
    Monday: {
      '9:00 - 10:00': { subject: 'Data Structures', section: 'A', room: 'CS101', type: 'Lecture', students: 45 },
      '10:00 - 11:00': { subject: 'Database Management', section: 'B', room: 'CS102', type: 'Lecture', students: 42 },
      '11:15 - 12:15': { subject: 'Data Structures', section: 'A', room: 'CS Lab 1', type: 'Lab', students: 45 },
      '12:15 - 1:15': { subject: 'Lunch Break', section: '', room: '', type: 'Break', students: 0 },
      '2:15 - 3:15': { subject: 'Web Development', section: 'C', room: 'CS103', type: 'Lecture', students: 40 },
      '3:15 - 4:15': { subject: 'Office Hours', section: '', room: 'Faculty Room', type: 'Office', students: 0 },
    },
    Tuesday: {
      '9:00 - 10:00': { subject: 'Database Management', section: 'B', room: 'CS102', type: 'Tutorial', students: 42 },
      '10:00 - 11:00': { subject: 'Web Development', section: 'C', room: 'CS Lab 2', type: 'Lab', students: 40 },
      '11:15 - 12:15': { subject: 'Data Structures', section: 'A', room: 'CS101', type: 'Tutorial', students: 45 },
      '12:15 - 1:15': { subject: 'Lunch Break', section: '', room: '', type: 'Break', students: 0 },
      '2:15 - 3:15': { subject: 'Faculty Meeting', section: '', room: 'Conference Room', type: 'Meeting', students: 0 },
      '3:15 - 4:15': { subject: 'Research Work', section: '', room: 'Faculty Room', type: 'Research', students: 0 },
    },
    Wednesday: {
      '9:00 - 10:00': { subject: 'Web Development', section: 'C', room: 'CS103', type: 'Lecture', students: 40 },
      '10:00 - 11:00': { subject: 'Data Structures', section: 'A', room: 'CS101', type: 'Lecture', students: 45 },
      '11:15 - 12:15': { subject: 'Database Management', section: 'B', room: 'CS Lab 3', type: 'Lab', students: 42 },
      '12:15 - 1:15': { subject: 'Lunch Break', section: '', room: '', type: 'Break', students: 0 },
      '2:15 - 3:15': { subject: 'Web Development', section: 'C', room: 'CS103', type: 'Tutorial', students: 40 },
      '3:15 - 4:15': { subject: 'Student Consultation', section: '', room: 'Faculty Room', type: 'Consultation', students: 0 },
    },
    Thursday: {
      '9:00 - 10:00': { subject: 'Database Management', section: 'B', room: 'CS102', type: 'Lecture', students: 42 },
      '10:00 - 11:00': { subject: 'Data Structures', section: 'A', room: 'CS Lab 1', type: 'Lab', students: 45 },
      '11:15 - 12:15': { subject: 'Web Development', section: 'C', room: 'CS103', type: 'Lecture', students: 40 },
      '12:15 - 1:15': { subject: 'Lunch Break', section: '', room: '', type: 'Break', students: 0 },
      '2:15 - 3:15': { subject: 'Data Structures', section: 'A', room: 'CS101', type: 'Tutorial', students: 45 },
      '3:15 - 4:15': { subject: 'Department Meeting', section: '', room: 'Conference Room', type: 'Meeting', students: 0 },
    },
    Friday: {
      '9:00 - 10:00': { subject: 'Web Development', section: 'C', room: 'CS Lab 2', type: 'Lab', students: 40 },
      '10:00 - 11:00': { subject: 'Database Management', section: 'B', room: 'CS102', type: 'Tutorial', students: 42 },
      '11:15 - 12:15': { subject: 'Data Structures', section: 'A', room: 'CS101', type: 'Lecture', students: 45 },
      '12:15 - 1:15': { subject: 'Lunch Break', section: '', room: '', type: 'Break', students: 0 },
      '2:15 - 3:15': { subject: 'Project Review', section: 'All', room: 'CS104', type: 'Review', students: 127 },
      '3:15 - 4:15': { subject: 'Free Period', section: '', room: '', type: 'Free', students: 0 },
    },
  };

  const getCurrentDay = () => {
    const today = new Date().getDay();
    return days[today - 1] || 'Monday';
  };

  const currentDay = getCurrentDay();

  const getClassColor = (type: string) => {
    switch (type) {
      case 'Lecture': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Lab': return 'bg-green-100 text-green-800 border-green-200';
      case 'Tutorial': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Break': return 'bg-gray-100 text-gray-600 border-gray-200';
      case 'Office': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Meeting': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Research': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Consultation': return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'Review': return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'Free': return 'bg-gray-50 text-gray-500 border-gray-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Teaching Schedule</h3>
          <div className="flex items-center text-green-600">
            <Clock className="h-5 w-5 mr-2" />
            Today: {currentDay}
          </div>
        </div>

        {/* Weekly Overview */}
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Header Row */}
            <div className="grid grid-cols-6 gap-2 mb-4">
              <div className="bg-gray-50 p-3 rounded-lg text-center font-medium text-gray-700">
                Time
              </div>
              {days.map(day => (
                <div key={day} className={`p-3 rounded-lg text-center font-medium ${
                  day === currentDay ? 'bg-green-100 text-green-800' : 'bg-gray-50 text-gray-700'
                }`}>
                  {day}
                </div>
              ))}
            </div>

            {/* Schedule Grid */}
            <div className="space-y-2">
              {timeSlots.map((timeSlot) => (
                <div key={timeSlot} className="grid grid-cols-6 gap-2">
                  <div className="bg-gray-50 p-3 rounded-lg text-center font-medium text-gray-700 text-sm">
                    {timeSlot}
                  </div>
                  {days.map(day => {
                    const classInfo = teacherSchedule[day]?.[timeSlot];
                    return (
                      <div key={`${day}-${timeSlot}`} className={`p-3 rounded-lg border ${
                        classInfo ? getClassColor(classInfo.type) : 'bg-gray-50 border-gray-200'
                      }`}>
                        {classInfo ? (
                          <div className="text-sm">
                            <div className="font-medium mb-1">{classInfo.subject}</div>
                            {classInfo.section && (
                              <div className="text-xs mb-1">Section {classInfo.section}</div>
                            )}
                            {classInfo.room && (
                              <div className="flex items-center text-xs mb-1">
                                <MapPin className="h-3 w-3 mr-1" />
                                {classInfo.room}
                              </div>
                            )}
                            {classInfo.students > 0 && (
                              <div className="flex items-center text-xs">
                                <Users className="h-3 w-3 mr-1" />
                                {classInfo.students}
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
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Today's Classes ({currentDay})</h4>
        <div className="space-y-4">
          {timeSlots.map((timeSlot) => {
            const classInfo = teacherSchedule[currentDay]?.[timeSlot];
            if (!classInfo || classInfo.type === 'Free') return null;

            return (
              <div key={timeSlot} className={`p-4 rounded-lg border ${getClassColor(classInfo.type)}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium">{classInfo.subject}</h5>
                    <div className="text-sm opacity-75 mt-1">
                      {classInfo.section && `Section ${classInfo.section} • `}
                      {classInfo.room && `${classInfo.room} • `}
                      {classInfo.type}
                      {classInfo.students > 0 && ` • ${classInfo.students} students`}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{timeSlot}</div>
                    {classInfo.students > 0 && (
                      <button className="text-sm text-blue-600 hover:text-blue-700 mt-1">
                        Take Attendance
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weekly Summary */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h5 className="font-semibold text-gray-900 mb-4">This Week</h5>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Classes</span>
              <span className="font-medium">18</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Lectures</span>
              <span className="font-medium">8</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Labs</span>
              <span className="font-medium">6</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tutorials</span>
              <span className="font-medium">4</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h5 className="font-semibold text-gray-900 mb-4">Subjects Teaching</h5>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Data Structures</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">Section A</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Database Management</span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Section B</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Web Development</span>
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">Section C</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h5 className="font-semibold text-gray-900 mb-4">Quick Actions</h5>
          <div className="space-y-3">
            <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm">
              Mark Current Class
            </button>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm">
              Generate QR Code
            </button>
            <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm">
              View All Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherTimetable;