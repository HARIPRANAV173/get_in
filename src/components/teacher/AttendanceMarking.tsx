import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Clock, FileText, Heart, Save } from 'lucide-react';
import { useAttendance } from '../../contexts/AttendanceContext';

interface AttendanceMarkingProps {
  onBack: () => void;
}

// Mock student data
const mockStudents = [
  { id: 'STU001', name: 'Vennila Devi P', rollNumber: 'CS21001', currentStatus: null },
  { id: 'STU002', name: 'Jayashree R', rollNumber: 'CS21002', currentStatus: null },
  { id: 'STU003', name: 'Krisha Sri V V', rollNumber: 'CS21003', currentStatus: null },
  { id: 'STU004', name: 'Kanishka J', rollNumber: 'CS21004', currentStatus: null },
  { id: 'STU005', name: 'Yuvasri R', rollNumber: 'CS21005', currentStatus: null },
  { id: 'STU006', name: 'Shijitha S', rollNumber: 'CS21006', currentStatus: null },
  { id: 'STU007', name: 'Sushmitha', rollNumber: 'CS21007', currentStatus: null },
  { id: 'STU008', name: 'Subarna ', rollNumber: 'CS21008', currentStatus: null },
];

type AttendanceStatus = 'present' | 'absent' | 'late' | 'od' | 'medical';

const AttendanceMarking: React.FC<AttendanceMarkingProps> = ({ onBack }) => {
  const { markAttendance } = useAttendance();
  const [students, setStudents] = useState(mockStudents.map(s => ({ ...s, currentStatus: null as AttendanceStatus | null })));
  const [selectedSubject, setSelectedSubject] = useState('Data Structures');
  const [currentTime] = useState(new Date().toLocaleTimeString());
  const [isSaving, setIsSaving] = useState(false);

  const subjects = ['Data Structures', 'Database Management', 'Web Development', 'Computer Networks', 'Operating Systems'];

  const updateStudentStatus = (studentId: string, status: AttendanceStatus) => {
    setStudents(prev => prev.map(student => 
      student.id === studentId ? { ...student, currentStatus: status } : student
    ));
  };

  const getStatusIcon = (status: AttendanceStatus | null) => {
    switch (status) {
      case 'present': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'absent': return <XCircle className="h-5 w-5 text-red-600" />;
      case 'late': return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'od': return <FileText className="h-5 w-5 text-blue-600" />;
      case 'medical': return <Heart className="h-5 w-5 text-purple-600" />;
      default: return <div className="h-5 w-5 border-2 border-gray-300 rounded-full" />;
    }
  };

  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800 border-green-200';
      case 'absent': return 'bg-red-100 text-red-800 border-red-200';
      case 'late': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'od': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'medical': return 'bg-purple-100 text-purple-800 border-purple-200';
    }
  };

  const handleSaveAttendance = async () => {
    setIsSaving(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    students.forEach(student => {
      if (student.currentStatus) {
        markAttendance({
          studentId: student.id,
          subject: selectedSubject,
          date: new Date().toISOString().split('T')[0],
          status: student.currentStatus,
          time: currentTime,
          markedBy: 'Dr. Sarah Wilson'
        });
      }
    });
    
    setIsSaving(false);
    onBack();
  };

  const markedCount = students.filter(s => s.currentStatus !== null).length;
  const presentCount = students.filter(s => s.currentStatus === 'present').length;
  const absentCount = students.filter(s => s.currentStatus === 'absent').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-green-600 hover:text-green-700 font-medium"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Overview
          </button>
          
          <div className="text-right">
            <p className="text-lg font-semibold text-gray-900">Mark Attendance</p>
            <p className="text-sm text-gray-600">{new Date().toLocaleDateString()} • {currentTime}</p>
          </div>
        </div>

        {/* Subject Selection */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Subject
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

          <div className="flex items-end">
            <div className="grid grid-cols-3 gap-4 w-full text-center">
              <div>
                <p className="text-sm text-gray-600">Marked</p>
                <p className="text-xl font-bold text-gray-900">{markedCount}/{students.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Present</p>
                <p className="text-xl font-bold text-green-600">{presentCount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Absent</p>
                <p className="text-xl font-bold text-red-600">{absentCount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Students List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900">Students ({students.length})</h4>
        </div>

        <div className="divide-y divide-gray-200">
          {students.map((student) => (
            <div key={student.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {getStatusIcon(student.currentStatus)}
                  <div className="ml-4">
                    <h5 className="font-medium text-gray-900">{student.name}</h5>
                    <p className="text-sm text-gray-600">{student.rollNumber}</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  {(['present', 'absent', 'late', 'od', 'medical'] as AttendanceStatus[]).map((status) => (
                    <button
                      key={status}
                      onClick={() => updateStudentStatus(student.id, status)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors border ${
                        student.currentStatus === status
                          ? getStatusColor(status)
                          : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h4>
        <div className="grid md:grid-cols-3 gap-4">
          <button
            onClick={() => {
              setStudents(prev => prev.map(s => ({ ...s, currentStatus: 'present' as AttendanceStatus })));
            }}
            className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Mark All Present
          </button>
          <button
            onClick={() => {
              setStudents(prev => prev.map(s => ({ ...s, currentStatus: 'absent' as AttendanceStatus })));
            }}
            className="bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            Mark All Absent
          </button>
          <button
            onClick={() => {
              setStudents(prev => prev.map(s => ({ ...s, currentStatus: null })));
            }}
            className="bg-gray-600 text-white p-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <button
          onClick={handleSaveAttendance}
          disabled={markedCount === 0 || isSaving}
          className={`w-full flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-colors ${
            markedCount > 0 && !isSaving
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-gray-400 cursor-not-allowed text-white'
          }`}
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Saving Attendance...
            </>
          ) : (
            <>
              <Save className="h-5 w-5 mr-2" />
              Save Attendance ({markedCount} marked)
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AttendanceMarking;