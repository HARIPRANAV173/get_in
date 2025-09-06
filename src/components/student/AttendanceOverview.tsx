import React from 'react';
import { Calendar, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAttendance } from '../../contexts/AttendanceContext';
import { useAuth } from '../../contexts/AuthContext';
import AttendanceChart from '../common/AttendanceChart';

const AttendanceOverview: React.FC = () => {
  const { user } = useAuth();
  const { getStudentAttendance, getSubjectAttendance, subjects } = useAttendance();
  
  const studentRecords = getStudentAttendance(user?.id || 'STU001');
  
  // Calculate overall statistics
  const totalClasses = studentRecords.length;
  const presentClasses = studentRecords.filter(r => r.status === 'present' || r.status === 'late').length;
  const absentClasses = studentRecords.filter(r => r.status === 'absent').length;
  const odLeaves = studentRecords.filter(r => r.status === 'od').length;
  const medicalLeaves = studentRecords.filter(r => r.status === 'medical').length;
  
  const attendancePercentage = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0;
  
  // Calculate subject-wise attendance
  const subjectStats = subjects.map(subject => {
    const subjectRecords = getSubjectAttendance(user?.id || 'STU001', subject.name);
    const total = subjectRecords.length;
    const present = subjectRecords.filter(r => r.status === 'present' || r.status === 'late').length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
    
    return {
      ...subject,
      total,
      present,
      percentage,
      status: percentage >= 75 ? 'good' : percentage >= 60 ? 'warning' : 'danger'
    };
  });

  // Calculate required attendance
  const requiredPercentage = 75;
  const requiredClasses = Math.ceil((requiredPercentage * totalClasses) / 100);
  const shortfall = Math.max(0, requiredClasses - presentClasses);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overall Attendance</p>
              <p className="text-2xl font-bold text-gray-900">{attendancePercentage}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Present Days</p>
              <p className="text-2xl font-bold text-gray-900">{presentClasses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Absent Days</p>
              <p className="text-2xl font-bold text-gray-900">{absentClasses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <TrendingUp className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Required Classes</p>
              <p className="text-2xl font-bold text-gray-900">{shortfall}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Overview</h3>
        <AttendanceChart
          data={[
            { label: 'Present', value: presentClasses, color: '#10B981' },
            { label: 'Absent', value: absentClasses, color: '#EF4444' },
            { label: 'OD Leave', value: odLeaves, color: '#F59E0B' },
            { label: 'Medical Leave', value: medicalLeaves, color: '#8B5CF6' },
          ]}
        />
      </div>

      {/* Subject-wise Attendance */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Subject-wise Attendance</h3>
        <div className="space-y-4">
          {subjectStats.map((subject) => (
            <div key={subject.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{subject.name}</h4>
                <p className="text-sm text-gray-600">{subject.code} • {subject.credits} Credits</p>
                <div className="mt-2 flex items-center space-x-4 text-sm">
                  <span>Present: {subject.present}</span>
                  <span>Total: {subject.total}</span>
                </div>
              </div>
              <div className="text-right">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  subject.status === 'good' ? 'bg-green-100 text-green-800' :
                  subject.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {subject.percentage}%
                </div>
                <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className={`h-2 rounded-full ${
                      subject.status === 'good' ? 'bg-green-500' :
                      subject.status === 'warning' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${subject.percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alert Section */}
      {attendancePercentage < 75 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-start">
            <AlertTriangle className="h-6 w-6 text-red-600 mt-1" />
            <div className="ml-4">
              <h4 className="text-lg font-medium text-red-900">Attendance Alert</h4>
              <p className="text-red-700 mt-1">
                Your attendance is below the required 75%. You need to attend at least {shortfall} more classes to meet the minimum requirement.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceOverview;