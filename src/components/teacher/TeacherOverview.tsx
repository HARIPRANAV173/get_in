import React, { useState } from 'react';
import { Users, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import AttendanceMarking from './AttendanceMarking';

const TeacherOverview: React.FC = () => {
  const [showAttendanceMarking, setShowAttendanceMarking] = useState(false);

  // Mock data for the overview
  const todayStats = {
    totalStudents: 45,
    present: 38,
    absent: 5,
    late: 2,
    od: 0,
    medical: 0,
  };

  const attendancePercentage = Math.round((todayStats.present / todayStats.totalStudents) * 100);

  const recentActivity = [
    { time: '10:15 AM', student: 'Vennila Devi P', action: 'Marked Present', subject: 'Data Structures' },
    { time: '10:12 AM', student: 'Jayashree R', action: 'Marked Late', subject: 'Data Structures' },
    { time: '10:10 AM', student: 'Krisha Sri V V', action: 'Marked Present', subject: 'Data Structures' },
    { time: '10:08 AM', student: 'Kanishka J', action: 'Marked Present', subject: 'Data Structures' },
  ];

  const missedPeriods = [
    { date: '2024-01-15', subject: 'Database Management', section: 'B', reason: 'Faculty meeting' },
    { date: '2024-01-12', subject: 'Web Development', section: 'A', reason: 'Conference' },
  ];

  if (showAttendanceMarking) {
    return <AttendanceMarking onBack={() => setShowAttendanceMarking(false)} />;
  }

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={() => setShowAttendanceMarking(true)}
            className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors text-left"
          >
            <CheckCircle className="h-6 w-6 mb-2" />
            <div className="font-medium">Mark Attendance</div>
            <div className="text-sm opacity-90">Take attendance for current class</div>
          </button>
          <button className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors text-left">
            <Clock className="h-6 w-6 mb-2" />
            <div className="font-medium">Generate QR Code</div>
            <div className="text-sm opacity-90">Create QR for student scanning</div>
          </button>
        </div>
      </div>

      {/* Today's Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-xl font-bold text-gray-900">{todayStats.totalStudents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Present</p>
              <p className="text-xl font-bold text-gray-900">{todayStats.present}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-lg">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Absent</p>
              <p className="text-xl font-bold text-gray-900">{todayStats.absent}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Late</p>
              <p className="text-xl font-bold text-gray-900">{todayStats.late}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Attendance</p>
            <p className="text-2xl font-bold text-green-600">{attendancePercentage}%</p>
          </div>
        </div>
      </div>

      {/* Live Attendance & Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h4>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{activity.student}</p>
                  <p className="text-sm text-gray-600">{activity.action} • {activity.subject}</p>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Missed Periods Alert */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
            <h4 className="text-lg font-semibold text-gray-900">Missed Periods</h4>
          </div>
          
          {missedPeriods.length > 0 ? (
            <div className="space-y-3">
              {missedPeriods.map((period, index) => (
                <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{period.subject}</p>
                      <p className="text-sm text-gray-600">Section {period.section} • {period.date}</p>
                      <p className="text-sm text-yellow-700 mt-1">Reason: {period.reason}</p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Reschedule
                    </button>
                  </div>
                </div>
              ))}
              <button className="w-full mt-4 bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors">
                Send Notification to Students
              </button>
            </div>
          ) : (
            <p className="text-gray-600">No missed periods this week.</p>
          )}
        </div>
      </div>

      {/* Weekly Overview Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Weekly Attendance Overview</h4>
        <div className="grid grid-cols-5 gap-4">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, index) => {
            const attendance = [92, 88, 95, 90, 87][index];
            return (
              <div key={day} className="text-center">
                <div className="bg-gray-100 rounded-lg p-4 mb-2">
                  <div className="text-sm font-medium text-gray-600 mb-2">{day}</div>
                  <div className="h-20 flex items-end justify-center">
                    <div
                      className="bg-blue-500 rounded-t w-8 transition-all duration-500"
                      style={{ height: `${(attendance / 100) * 80}px` }}
                    ></div>
                  </div>
                  <div className="text-sm font-bold text-gray-900 mt-2">{attendance}%</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TeacherOverview;