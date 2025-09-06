import React, { createContext, useContext, useEffect, useState } from "react";
import { initDatabase } from "../lib/database";
import {
  userService,
  attendanceService,
  subjectService,
  qrService,
  classService,
  parentService,
} from "../lib/db-service";
import type { User } from "./AuthContext";
import type { AttendanceRecord, Subject } from "./AttendanceContext";

interface DatabaseContextType {
  isInitialized: boolean;
  // User operations
  authenticateUser: (userId: string, password: string) => Promise<User | null>;
  getUserById: (userId: string) => Promise<User | null>;
  createUser: (
    userData: Omit<User, "id"> & { password: string }
  ) => Promise<boolean>;
  updateUser: (userId: string, updates: Partial<User>) => Promise<boolean>;

  // Subject operations
  getAllSubjects: () => Promise<Subject[]>;
  getSubjectsByTeacher: (teacherId: string) => Promise<Subject[]>;
  getSubjectsForStudent: (studentId: string) => Promise<Subject[]>;

  // Attendance operations
  markAttendance: (record: {
    studentId: string;
    classId: number;
    date: string;
    status: AttendanceRecord["status"];
    timeMarked?: string;
    markedBy?: string;
    qrCodeId?: string;
    latitude?: number;
    longitude?: number;
  }) => Promise<boolean>;
  getStudentAttendance: (
    studentId: string,
    startDate?: string,
    endDate?: string
  ) => Promise<AttendanceRecord[]>;
  getSubjectAttendance: (
    studentId: string,
    subjectName: string
  ) => Promise<AttendanceRecord[]>;
  getClassAttendance: (
    classId: number,
    date?: string
  ) => Promise<
    Array<{
      studentId: string;
      studentName: string;
      rollNumber: string;
      status: AttendanceRecord["status"];
      timeMarked?: string;
    }>
  >;

  // QR Code operations
  generateQRCode: (data: {
    classId: number;
    teacherId: string;
    expiresAt: string;
    latitude?: number;
    longitude?: number;
  }) => Promise<string>;
  validateQRCode: (
    qrCodeId: string
  ) => Promise<{ isValid: boolean; classId?: number; teacherId?: string }>;
  deactivateQRCode: (qrCodeId: string) => Promise<boolean>;

  // Class operations
  getTeacherClasses: (teacherId: string) => Promise<
    Array<{
      id: number | undefined;
      classCode: string;
      subjectName: string;
      subjectCode: string;
      section: string;
      roomNumber: string;
      scheduleDay: string;
      scheduleTime: string;
    }>
  >;
  getClassStudents: (classId: number) => Promise<
    Array<{
      studentId: string;
      studentName: string;
      rollNumber: string;
      email: string;
      phoneNumber: string;
    }>
  >;

  // Parent operations
  getParentChildren: (parentId: string) => Promise<
    Array<{
      studentId: string;
      studentName: string;
      rollNumber: string;
      department: string;
      section: string;
      semester: string;
      relationship: string;
    }>
  >;
  addParentStudentRelation: (
    parentId: string,
    studentId: string,
    relationship?: string
  ) => Promise<boolean>;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(
  undefined
);

// eslint-disable-next-line react-refresh/only-export-components
export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error("useDatabase must be used within a DatabaseProvider");
  }
  return context;
};

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initDB = async () => {
      try {
        await initDatabase();
        setIsInitialized(true);
        console.log("Database initialized successfully");
      } catch (error) {
        console.error("Failed to initialize database:", error);
      }
    };

    initDB();
  }, []);

  const contextValue: DatabaseContextType = {
    isInitialized,

    // User operations
    authenticateUser: userService.authenticateUser,
    getUserById: userService.getUserById,
    createUser: userService.createUser,
    updateUser: userService.updateUser,

    // Subject operations
    getAllSubjects: subjectService.getAllSubjects,
    getSubjectsByTeacher: subjectService.getSubjectsByTeacher,
    getSubjectsForStudent: subjectService.getSubjectsForStudent,

    // Attendance operations
    markAttendance: attendanceService.markAttendance,
    getStudentAttendance: attendanceService.getStudentAttendance,
    getSubjectAttendance: attendanceService.getSubjectAttendance,
    getClassAttendance: attendanceService.getClassAttendance,

    // QR Code operations
    generateQRCode: qrService.generateQRCode,
    validateQRCode: qrService.validateQRCode,
    deactivateQRCode: qrService.deactivateQRCode,

    // Class operations
    getTeacherClasses: classService.getTeacherClasses,
    getClassStudents: classService.getClassStudents,

    // Parent operations
    getParentChildren: parentService.getParentChildren,
    addParentStudentRelation: parentService.addParentStudentRelation,
  };

  return (
    <DatabaseContext.Provider value={contextValue}>
      {children}
    </DatabaseContext.Provider>
  );
};
