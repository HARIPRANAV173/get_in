import React, { useState } from 'react';
import { BarChart3, TrendingDown, TrendingUp, AlertTriangle, Users } from 'lucide-react';

const ClassPerformance: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState('Data Structures');
  const [selectedPeriod, setSelectedPeriod] = useState('this-month');

  const subjects = ['Data Structures', 'Database Management', 'Web Development', 'Computer Networks', 'Operating Systems'];
  const periods = [
    { value: 'this-week', label: 'This Week' },
    { value: 'this-month', label: 'This Month' },
    { value: 'this-semester', label: 'This Semester' },
  ];

  // Mock performance data
  const classStats = {
    averageAttendance: 78.5,
    totalStudents: 45,
    regularAttendees: 32,
    irregularAttendees: 13,
    criticalAttendance: 8,
  };

  const performanceTrend = [
    { week: 'Week 1', attendance: 85 },
    { week: 'Week 2', attendance: 82 },
    { week: 'Week 3', attendance: 78 },
    { week: 'Week 4', attendance: 75 },
    { week: 'Week 5', attendance: 79 },
  ];

  const studentPerformance = [
    { name: 'Vennila Devi P', rollNumber: 'CS21001', attendance: 92, trend: 'up', risk: 'low' },
    { name: 'Jayashree R', rollNumber: 'CS21002', attendance: 88, trend: 'stable', risk: 'low' },
    { name: 'Krisha Sri V V', rollNumber: 'CS21003', attendance: 65, trend: 'down', risk: 'medium' },
    { name: 'Kanishka J', rollNumber: 'CS21004', attendance: 45, trend: 'down', risk: 'high' },
    { name: 'Yuvasri R', rollNumber: 'CS21005', attendance: 78, trend: 'up', risk: 'low' },
    { name: 'Shijitha S', rollNumber: 'CS21006', attendance: 58, trend: 'down', risk: 'high' },
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Period
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {periods.map(period => (
                <option key={period.value} value={period.value}>{period.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Class Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="text-center">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-sm font-medium text-gray-600">Avg Attendance</p>
            <p className="text-2xl font-bold text-blue-600">{classStats.averageAttendance}%</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="text-center">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-sm font-medium text-gray-600">Regular</p>
            <p className="text-2xl font-bold text-green-600">{classStats.regularAttendees}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="text-center">
            <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingDown className="h-6 w-6 text-yellow-600" />
            </div>
            <p className="text-sm font-medium text-gray-600">Irregular</p>
            <p className="text-2xl font-bold text-yellow-600">{classStats.irregularAttendees}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="text-center">
            <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <p className="text-sm font-medium text-gray-600">Critical</p>
            <p className="text-2xl font-bold text-red-600">{classStats.criticalAttendance}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="text-center">
            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <p className="text-sm font-medium text-gray-600">Total</p>
            <p className="text-2xl font-bold text-purple-600">{classStats.totalStudents}</p>
          </div>
        </div>
      </div>

      {/* Performance Trend Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 mb-6">Attendance Trend</h4>
        <div className="h-64 flex items-end justify-center space-x-8">
          {performanceTrend.map((data, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="bg-gray-100 w-16 rounded-lg flex items-end justify-center h-48 relative">
                <div
                  className="bg-blue-500 rounded-t w-12 transition-all duration-1000"
                  style={{ height: `${(data.attendance / 100) * 180}px` }}
                ></div>
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-sm font-medium text-gray-900">
                  {data.attendance}%
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">{data.week}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Student Performance Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900">Individual Student Performance</h4>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Roll Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trend
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {studentPerformance.map((student, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 font-medium text-sm">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                    {student.rollNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">{student.attendance}%</div>
                      <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            student.attendance >= 75 ? 'bg-green-500' :
                            student.attendance >= 60 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${student.attendance}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getTrendIcon(student.trend)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(student.risk)}`}>
                      {student.risk}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      View Details
                    </button>
                    <button className="text-green-600 hover:text-green-900">
                      Notify Parent
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-start">
          <AlertTriangle className="h-6 w-6 text-red-600 mt-1" />
          <div className="ml-4">
            <h4 className="text-lg font-medium text-red-900">Students Requiring Attention</h4>
            <p className="text-red-700 mt-1">
              {classStats.criticalAttendance} students have attendance below 60%. Consider sending notifications to parents and scheduling counseling sessions.
            </p>
            <button className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
              Send Bulk Notifications
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassPerformance;