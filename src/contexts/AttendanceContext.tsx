import React, { createContext, useContext, useState } from 'react';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  name?: string;
  subject: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'od' | 'medical';
  time?: string;
  markedBy?: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
}

interface AttendanceContextType {
  attendanceRecords: AttendanceRecord[];
  subjects: Subject[];
  markAttendance: (record: Omit<AttendanceRecord, 'id'>) => void;
  getStudentAttendance: (studentId: string) => AttendanceRecord[];
  getSubjectAttendance: (studentId: string, subject: string) => AttendanceRecord[];
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (context === undefined) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};

// Mock data for demonstration
const mockSubjects: Subject[] = [
  { id: '1', name: 'Data Structures', code: 'CS101', credits: 4 },
  { id: '2', name: 'Database Management', code: 'CS102', credits: 3 },
  { id: '3', name: 'Web Development', code: 'CS103', credits: 3 },
  { id: '4', name: 'Computer Networks', code: 'CS104', credits: 4 },
  { id: '5', name: 'Operating Systems', code: 'CS105', credits: 4 },
];

const generateMockAttendance = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const statuses: AttendanceRecord['status'][] = ['present', 'absent', 'late', 'od', 'medical'];
  
  for (let i = 0; i < 60; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    mockSubjects.forEach((subject, index) => {
      if (Math.random() > 0.3) { // 70% chance of having a record for each subject
        records.push({
          id: `${i}-${index}`,
          studentId: 'STU001',
          subject: subject.name,
          date: date.toISOString().split('T')[0],
          status: statuses[Math.floor(Math.random() * statuses.length)],
          time: `${8 + Math.floor(Math.random() * 8)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
          markedBy: 'Dr. Smith'
        });
      }
    });
  }
  
  return records;
};

export const AttendanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(generateMockAttendance());
  const [subjects] = useState<Subject[]>(mockSubjects);

  const markAttendance = (record: Omit<AttendanceRecord, 'id'>) => {
    const newRecord: AttendanceRecord = {
      ...record,
      id: Date.now().toString(),
    };
    setAttendanceRecords(prev => [...prev, newRecord]);
  };

  const getStudentAttendance = (studentId: string) => {
    return attendanceRecords.filter(record => record.studentId === studentId);
  };

  const getSubjectAttendance = (studentId: string, subject: string) => {
    return attendanceRecords.filter(
      record => record.studentId === studentId && record.subject === subject
    );
  };

  return (
    <AttendanceContext.Provider value={{
      attendanceRecords,
      subjects,
      markAttendance,
      getStudentAttendance,
      getSubjectAttendance
    }}>
      {children}
    </AttendanceContext.Provider>
  );
};