import React from 'react';
import { AlertTriangle, CheckCircle, Clock, Bell, Calendar, TrendingDown } from 'lucide-react';
import AttendanceChart from '../common/AttendanceChart';

const ParentOverview: React.FC = () => {
  // Mock student data for parent view
  const studentData = {
    name: 'John Doe',
    rollNumber: 'CS21001',
    class: '6th Semester',
    department: 'Computer Science',
    overallAttendance: 78,
    requiredAttendance: 75,
  };

  const subjectAttendance = [
    { subject: 'Data Structures', attendance: 85, total: 20, present: 17, status: 'good' },
    { subject: 'Database Management', attendance: 92, total: 18, present: 16, status: 'good' },
    { subject: 'Web Development', attendance: 67, total: 15, present: 10, status: 'warning' },
    { subject: 'Computer Networks', attendance: 58, total: 19, present: 11, status: 'danger' },
    { subject: 'Operating Systems', attendance: 88, total: 16, present: 14, status: 'good' },
  ];

  const recentNotifications = [
    {
      date: '2024-01-15',
      type: 'absent',
      message: 'John was absent from Computer Networks class',
      time: '10:30 AM',
    },
    {
      date: '2024-01-14',
      type: 'late',
      message: 'John arrived late to Web Development class',
      time: '2:15 PM',
    },
    {
      date: '2024-01-12',
      type: 'absent',
      message: 'John was absent from Database Management class',
      time: '11:00 AM',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'danger': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'absent': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'late': return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'present': return <CheckCircle className="h-5 w-5 text-green-600" />;
      default: return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Student Overview */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Student Overview</h3>
            <p className="text-gray-600">{studentData.name} • {studentData.rollNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">{studentData.department}</p>
            <p className="text-sm text-gray-600">{studentData.class}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-sm font-medium text-gray-600">Overall Attendance</p>
            <p className="text-2xl font-bold text-purple-600">{studentData.overallAttendance}%</p>
          </div>

          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-sm font-medium text-gray-600">This Week</p>
            <p className="text-2xl font-bold text-blue-600">4/5</p>
            <p className="text-xs text-gray-500">Days Present</p>
          </div>

          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingDown className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-sm font-medium text-gray-600">Required</p>
            <p className="text-2xl font-bold text-green-600">{studentData.requiredAttendance}%</p>
          </div>

          <div className="text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              studentData.overallAttendance >= studentData.requiredAttendance ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {studentData.overallAttendance >= studentData.requiredAttendance ? (
                <CheckCircle className="h-8 w-8 text-green-600" />
              ) : (
                <AlertTriangle className="h-8 w-8 text-red-600" />
              )}
            </div>
            <p className="text-sm font-medium text-gray-600">Status</p>
            <p className={`text-lg font-bold ${
              studentData.overallAttendance >= studentData.requiredAttendance ? 'text-green-600' : 'text-red-600'
            }`}>
              {studentData.overallAttendance >= studentData.requiredAttendance ? 'Good' : 'At Risk'}
            </p>
          </div>
        </div>
      </div>

      {/* Alert Section */}
      {studentData.overallAttendance < studentData.requiredAttendance && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-start">
            <AlertTriangle className="h-6 w-6 text-red-600 mt-1" />
            <div className="ml-4">
              <h4 className="text-lg font-medium text-red-900">Attendance Alert</h4>
              <p className="text-red-700 mt-1">
                Your child's attendance is below the required {studentData.requiredAttendance}%. 
                Please ensure regular attendance to meet academic requirements.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Subject-wise Attendance */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 mb-6">Subject-wise Attendance</h4>
        <div className="space-y-4">
          {subjectAttendance.map((subject, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex-1">
                <h5 className="font-medium text-gray-900">{subject.subject}</h5>
                <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                  <span>Present: {subject.present}</span>
                  <span>Total: {subject.total}</span>
                </div>
              </div>
              <div className="text-right">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(subject.status)}`}>
                  {subject.attendance}%
                </div>
                <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className={`h-2 rounded-full ${
                      subject.status === 'good' ? 'bg-green-500' :
                      subject.status === 'warning' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${subject.attendance}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Attendance Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Attendance Overview</h4>
        <AttendanceChart
          data={[
            { label: 'Present', value: 65, color: '#10B981' },
            { label: 'Absent', value: 12, color: '#EF4444' },
            { label: 'Late', value: 8, color: '#F59E0B' },
            { label: 'OD/Medical', value: 5, color: '#8B5CF6' },
          ]}
        />
      </div>

      {/* Recent Notifications */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-semibold text-gray-900">Recent Notifications</h4>
          <Bell className="h-5 w-5 text-gray-400" />
        </div>

        <div className="space-y-4">
          {recentNotifications.map((notification, index) => (
            <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 mt-1">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="ml-4 flex-1">
                <p className="text-gray-900">{notification.message}</p>
                <div className="flex items-center mt-1 text-sm text-gray-500">
                  <span>{notification.date}</span>
                  <span className="mx-2">•</span>
                  <span>{notification.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
            View All Notifications
          </button>
        </div>
      </div>

      {/* Communication */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h5 className="font-semibold text-gray-900 mb-4">Contact Teachers</h5>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Class Teacher</span>
              <button className="text-purple-600 hover:text-purple-700 font-medium">Contact</button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Academic Coordinator</span>
              <button className="text-purple-600 hover:text-purple-700 font-medium">Contact</button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">HOD</span>
              <button className="text-purple-600 hover:text-purple-700 font-medium">Contact</button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h5 className="font-semibold text-gray-900 mb-4">Quick Actions</h5>
          <div className="space-y-3">
            <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
              Request Leave
            </button>
            <button className="w-full border border-purple-600 text-purple-600 py-2 px-4 rounded-lg hover:bg-purple-50 transition-colors">
              Download Report
            </button>
            <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
              Schedule Meeting
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentOverview;