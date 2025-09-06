import { getDatabase } from "./database";
import type { User } from "../contexts/AuthContext";
import type { AttendanceRecord, Subject } from "../contexts/AttendanceContext";

// User service functions
export const userService = {
  // Authenticate user
  authenticateUser: async (
    userId: string,
    password: string
  ): Promise<User | null> => {
    const db = getDatabase();
    const user = await db.get("users", userId);

    if (user && user.passwordHash === password) {
      return {
        id: user.id,
        role: user.role,
        name: user.name,
        email: user.email || "",
        phoneNumber: user.phoneNumber,
        rollNumber: user.rollNumber,
        department: user.department,
        section: user.section,
        subject: user.subject,
        semester: user.semester,
        isVerified: user.isVerified || false,
      };
    }

    return null;
  },

  // Get user by ID
  getUserById: async (userId: string): Promise<User | null> => {
    const db = getDatabase();
    const user = await db.get("users", userId);

    if (user) {
      return {
        id: user.id,
        role: user.role,
        name: user.name,
        email: user.email || "",
        phoneNumber: user.phoneNumber,
        rollNumber: user.rollNumber,
        department: user.department,
        section: user.section,
        subject: user.subject,
        semester: user.semester,
        isVerified: user.isVerified || false,
      };
    }

    return null;
  },

  // Create new user
  createUser: async (
    userData: Omit<User, "id"> & { password: string }
  ): Promise<boolean> => {
    try {
      const db = getDatabase();
      const userId = `${userData.role.toUpperCase()}${Date.now()}`;

      await db.add("users", {
        id: userId,
        role: userData.role,
        name: userData.name,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        rollNumber: userData.rollNumber,
        department: userData.department,
        section: userData.section,
        subject: userData.subject,
        semester: userData.semester,
        passwordHash: userData.password,
        isVerified: userData.isVerified || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      return true;
    } catch (error) {
      console.error("Error creating user:", error);
      return false;
    }
  },

  // Update user
  updateUser: async (
    userId: string,
    updates: Partial<User>
  ): Promise<boolean> => {
    try {
      const db = getDatabase();
      const user = await db.get("users", userId);

      if (!user) return false;

      const updatedUser = {
        ...user,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await db.put("users", updatedUser);
      return true;
    } catch (error) {
      console.error("Error updating user:", error);
      return false;
    }
  },
};

// Subject service functions
export const subjectService = {
  // Get all subjects
  getAllSubjects: async (): Promise<Subject[]> => {
    const db = getDatabase();
    const subjects = await db.getAll("subjects");

    return subjects.map((s) => ({
      id: s.id?.toString() || "0",
      name: s.subjectName,
      code: s.subjectCode,
      credits: s.credits,
    }));
  },

  // Get subjects for a teacher
  getSubjectsByTeacher: async (teacherId: string): Promise<Subject[]> => {
    const db = getDatabase();
    const subjects = await db.getAllFromIndex(
      "subjects",
      "by-teacher",
      teacherId
    );

    return subjects.map((s) => ({
      id: s.id?.toString() || "0",
      name: s.subjectName,
      code: s.subjectCode,
      credits: s.credits,
    }));
  },

  // Get subjects for a student (enrolled classes)
  getSubjectsForStudent: async (studentId: string): Promise<Subject[]> => {
    const db = getDatabase();
    const enrollments = await db.getAllFromIndex(
      "enrollments",
      "by-student",
      studentId
    );
    const subjects: Subject[] = [];

    for (const enrollment of enrollments) {
      const classData = await db.get("classes", enrollment.classId);
      if (classData) {
        const subject = await db.get("subjects", classData.subjectId);
        if (subject) {
          subjects.push({
            id: subject.id?.toString() || "0",
            name: subject.subjectName,
            code: subject.subjectCode,
            credits: subject.credits,
          });
        }
      }
    }

    return subjects;
  },
};

// Attendance service functions
export const attendanceService = {
  // Mark attendance
  markAttendance: async (record: {
    studentId: string;
    classId: number;
    date: string;
    status: AttendanceRecord["status"];
    timeMarked?: string;
    markedBy?: string;
    qrCodeId?: string;
    latitude?: number;
    longitude?: number;
  }): Promise<boolean> => {
    try {
      const db = getDatabase();

      // Check if attendance already exists for this student, class, and date
      const existingRecords = await db.getAllFromIndex(
        "attendanceRecords",
        "by-student",
        record.studentId
      );
      const existingRecord = existingRecords.find(
        (r) => r.classId === record.classId && r.date === record.date
      );

      if (existingRecord) {
        // Update existing record
        await db.put("attendanceRecords", {
          ...existingRecord,
          status: record.status,
          timeMarked: record.timeMarked || new Date().toISOString(),
          markedBy: record.markedBy,
          qrCodeId: record.qrCodeId,
          latitude: record.latitude,
          longitude: record.longitude,
        });
      } else {
        // Create new record
        await db.add("attendanceRecords", {
          studentId: record.studentId,
          classId: record.classId,
          date: record.date,
          status: record.status,
          timeMarked: record.timeMarked || new Date().toISOString(),
          markedBy: record.markedBy,
          qrCodeId: record.qrCodeId,
          latitude: record.latitude,
          longitude: record.longitude,
          createdAt: new Date().toISOString(),
        });
      }

      return true;
    } catch (error) {
      console.error("Error marking attendance:", error);
      return false;
    }
  },

  // Get attendance records for a student
  getStudentAttendance: async (
    studentId: string,
    startDate?: string,
    endDate?: string
  ): Promise<AttendanceRecord[]> => {
    const db = getDatabase();
    const records = await db.getAllFromIndex(
      "attendanceRecords",
      "by-student",
      studentId
    );

    const attendanceRecords: AttendanceRecord[] = [];

    for (const record of records) {
      // Filter by date range if provided
      if (startDate && record.date < startDate) continue;
      if (endDate && record.date > endDate) continue;

      const classData = await db.get("classes", record.classId);
      const subject = classData
        ? await db.get("subjects", classData.subjectId)
        : null;
      const markedByUser = record.markedBy
        ? await db.get("users", record.markedBy)
        : null;

      attendanceRecords.push({
        id: record.id?.toString() || "",
        studentId: record.studentId,
        subject: subject?.subjectName || "Unknown",
        date: record.date,
        status: record.status,
        time: record.timeMarked,
        markedBy: markedByUser?.name,
      });
    }

    return attendanceRecords.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  },

  // Get attendance for a specific subject
  getSubjectAttendance: async (
    studentId: string,
    subjectName: string
  ): Promise<AttendanceRecord[]> => {
    const db = getDatabase();
    const records = await db.getAllFromIndex(
      "attendanceRecords",
      "by-student",
      studentId
    );
    const attendanceRecords: AttendanceRecord[] = [];

    for (const record of records) {
      const classData = await db.get("classes", record.classId);
      const subject = classData
        ? await db.get("subjects", classData.subjectId)
        : null;

      if (subject?.subjectName === subjectName) {
        const markedByUser = record.markedBy
          ? await db.get("users", record.markedBy)
          : null;

        attendanceRecords.push({
          id: record.id?.toString() || "",
          studentId: record.studentId,
          subject: subject.subjectName,
          date: record.date,
          status: record.status,
          time: record.timeMarked,
          markedBy: markedByUser?.name,
        });
      }
    }

    return attendanceRecords.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  },

  // Get class attendance for teachers
  getClassAttendance: async (
    classId: number,
    date?: string
  ): Promise<
    Array<{
      studentId: string;
      studentName: string;
      rollNumber: string;
      status: AttendanceRecord["status"];
      timeMarked?: string;
    }>
  > => {
    const db = getDatabase();
    const enrollments = await db.getAllFromIndex(
      "enrollments",
      "by-class",
      classId
    );
    const attendanceList: Array<{
      studentId: string;
      studentName: string;
      rollNumber: string;
      status: AttendanceRecord["status"];
      timeMarked?: string;
    }> = [];

    for (const enrollment of enrollments) {
      const student = await db.get("users", enrollment.studentId);
      if (student) {
        let attendance = null;

        if (date) {
          const records = await db.getAllFromIndex(
            "attendanceRecords",
            "by-student",
            enrollment.studentId
          );
          attendance = records.find(
            (r) => r.classId === classId && r.date === date
          );
        }

        attendanceList.push({
          studentId: student.id,
          studentName: student.name,
          rollNumber: student.rollNumber || "",
          status: attendance?.status || "absent",
          timeMarked: attendance?.timeMarked,
        });
      }
    }

    return attendanceList.sort((a, b) =>
      a.rollNumber.localeCompare(b.rollNumber)
    );
  },
};

// QR Code service functions
export const qrService = {
  // Generate QR code
  generateQRCode: async (data: {
    classId: number;
    teacherId: string;
    expiresAt: string;
    latitude?: number;
    longitude?: number;
  }): Promise<string> => {
    const db = getDatabase();
    const qrCodeId = `QR${Date.now()}${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    await db.add("qrCodes", {
      id: qrCodeId,
      classId: data.classId,
      teacherId: data.teacherId,
      generatedAt: new Date().toISOString(),
      expiresAt: data.expiresAt,
      isActive: true,
      latitude: data.latitude,
      longitude: data.longitude,
    });

    return qrCodeId;
  },

  // Validate QR code
  validateQRCode: async (
    qrCodeId: string
  ): Promise<{ isValid: boolean; classId?: number; teacherId?: string }> => {
    const db = getDatabase();
    const qrData = await db.get("qrCodes", qrCodeId);

    if (!qrData || !qrData.isActive) {
      return { isValid: false };
    }

    const now = new Date();
    const expiresAt = new Date(qrData.expiresAt);

    if (now > expiresAt) {
      // Deactivate expired QR code
      await db.put("qrCodes", { ...qrData, isActive: false });
      return { isValid: false };
    }

    return {
      isValid: true,
      classId: qrData.classId,
      teacherId: qrData.teacherId,
    };
  },

  // Deactivate QR code
  deactivateQRCode: async (qrCodeId: string): Promise<boolean> => {
    try {
      const db = getDatabase();
      const qrData = await db.get("qrCodes", qrCodeId);

      if (qrData) {
        await db.put("qrCodes", { ...qrData, isActive: false });
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error deactivating QR code:", error);
      return false;
    }
  },
};

// Class service functions
export const classService = {
  // Get classes for a teacher
  getTeacherClasses: async (teacherId: string) => {
    const db = getDatabase();
    const classes = await db.getAllFromIndex(
      "classes",
      "by-teacher",
      teacherId
    );
    const result = [];

    for (const classData of classes) {
      const subject = await db.get("subjects", classData.subjectId);
      if (subject) {
        result.push({
          id: classData.id,
          classCode: classData.classCode,
          subjectName: subject.subjectName,
          subjectCode: subject.subjectCode,
          section: classData.section,
          roomNumber: classData.roomNumber || "",
          scheduleDay: classData.scheduleDay || "",
          scheduleTime: classData.scheduleTime || "",
        });
      }
    }

    return result;
  },

  // Get enrolled students for a class
  getClassStudents: async (classId: number) => {
    const db = getDatabase();
    const enrollments = await db.getAllFromIndex(
      "enrollments",
      "by-class",
      classId
    );
    const result = [];

    for (const enrollment of enrollments) {
      const student = await db.get("users", enrollment.studentId);
      if (student) {
        result.push({
          studentId: student.id,
          studentName: student.name,
          rollNumber: student.rollNumber || "",
          email: student.email || "",
          phoneNumber: student.phoneNumber || "",
        });
      }
    }

    return result.sort((a, b) => a.rollNumber.localeCompare(b.rollNumber));
  },
};

// Parent service functions
export const parentService = {
  // Get children for a parent
  getParentChildren: async (parentId: string) => {
    const db = getDatabase();
    const relations = await db.getAllFromIndex(
      "parentStudentRelations",
      "by-parent",
      parentId
    );
    const result = [];

    for (const relation of relations) {
      const student = await db.get("users", relation.studentId);
      if (student) {
        result.push({
          studentId: student.id,
          studentName: student.name,
          rollNumber: student.rollNumber || "",
          department: student.department || "",
          section: student.section || "",
          semester: student.semester || "",
          relationship: relation.relationship,
        });
      }
    }

    return result;
  },

  // Add parent-student relationship
  addParentStudentRelation: async (
    parentId: string,
    studentId: string,
    relationship: string = "parent"
  ): Promise<boolean> => {
    try {
      const db = getDatabase();

      await db.add("parentStudentRelations", {
        parentId,
        studentId,
        relationship,
        createdAt: new Date().toISOString(),
      });

      return true;
    } catch (error) {
      console.error("Error adding parent-student relation:", error);
      return false;
    }
  },
};
