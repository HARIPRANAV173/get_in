import { openDB, DBSchema, IDBPDatabase } from "idb";

// Define the database schema
interface AttendanceDB extends DBSchema {
  users: {
    key: string;
    value: {
      id: string;
      role: "student" | "teacher" | "parent";
      name: string;
      email?: string;
      phoneNumber?: string;
      rollNumber?: string;
      department?: string;
      section?: string;
      subject?: string;
      semester?: string;
      passwordHash: string;
      isVerified: boolean;
      createdAt: string;
      updatedAt: string;
    };
    indexes: { "by-role": string; "by-email": string };
  };
  subjects: {
    key: number;
    value: {
      id?: number;
      subjectCode: string;
      subjectName: string;
      credits: number;
      department: string;
      semester?: string;
      teacherId?: string;
      createdAt: string;
    };
    indexes: { "by-teacher": string; "by-department": string };
  };
  classes: {
    key: number;
    value: {
      id?: number;
      classCode: string;
      subjectId: number;
      teacherId: string;
      section: string;
      roomNumber?: string;
      scheduleDay?: string;
      scheduleTime?: string;
      createdAt: string;
    };
    indexes: { "by-teacher": string; "by-subject": number };
  };
  enrollments: {
    key: number;
    value: {
      id?: number;
      studentId: string;
      classId: number;
      enrolledAt: string;
    };
    indexes: { "by-student": string; "by-class": number };
  };
  attendanceRecords: {
    key: number;
    value: {
      id?: number;
      studentId: string;
      classId: number;
      date: string;
      status: "present" | "absent" | "late" | "od" | "medical";
      timeMarked?: string;
      markedBy?: string;
      qrCodeId?: string;
      latitude?: number;
      longitude?: number;
      createdAt: string;
    };
    indexes: { "by-student": string; "by-class": number; "by-date": string };
  };
  qrCodes: {
    key: string;
    value: {
      id: string;
      classId: number;
      teacherId: string;
      generatedAt: string;
      expiresAt: string;
      isActive: boolean;
      latitude?: number;
      longitude?: number;
    };
    indexes: { "by-class": number; "by-teacher": string; "by-active": number };
  };
  parentStudentRelations: {
    key: number;
    value: {
      id?: number;
      parentId: string;
      studentId: string;
      relationship: string;
      createdAt: string;
    };
    indexes: { "by-parent": string; "by-student": string };
  };
}

let db: IDBPDatabase<AttendanceDB>;

export const initDatabase = async (): Promise<IDBPDatabase<AttendanceDB>> => {
  try {
    db = await openDB<AttendanceDB>("attendance-system", 1, {
      upgrade(db) {
        // Users store
        const usersStore = db.createObjectStore("users", { keyPath: "id" });
        usersStore.createIndex("by-role", "role");
        usersStore.createIndex("by-email", "email");

        // Subjects store
        const subjectsStore = db.createObjectStore("subjects", {
          keyPath: "id",
          autoIncrement: true,
        });
        subjectsStore.createIndex("by-teacher", "teacherId");
        subjectsStore.createIndex("by-department", "department");

        // Classes store
        const classesStore = db.createObjectStore("classes", {
          keyPath: "id",
          autoIncrement: true,
        });
        classesStore.createIndex("by-teacher", "teacherId");
        classesStore.createIndex("by-subject", "subjectId");

        // Enrollments store
        const enrollmentsStore = db.createObjectStore("enrollments", {
          keyPath: "id",
          autoIncrement: true,
        });
        enrollmentsStore.createIndex("by-student", "studentId");
        enrollmentsStore.createIndex("by-class", "classId");

        // Attendance records store
        const attendanceStore = db.createObjectStore("attendanceRecords", {
          keyPath: "id",
          autoIncrement: true,
        });
        attendanceStore.createIndex("by-student", "studentId");
        attendanceStore.createIndex("by-class", "classId");
        attendanceStore.createIndex("by-date", "date");

        // QR codes store
        const qrStore = db.createObjectStore("qrCodes", { keyPath: "id" });
        qrStore.createIndex("by-class", "classId");
        qrStore.createIndex("by-teacher", "teacherId");
        qrStore.createIndex("by-active", "isActive");

        // Parent-student relations store
        const relationsStore = db.createObjectStore("parentStudentRelations", {
          keyPath: "id",
          autoIncrement: true,
        });
        relationsStore.createIndex("by-parent", "parentId");
        relationsStore.createIndex("by-student", "studentId");
      },
    });

    await seedDatabase();
    console.log("Database initialized successfully");
    return db;
  } catch (error) {
    console.error("Failed to initialize database:", error);
    throw error;
  }
};

const seedDatabase = async () => {
  // Check if data already exists
  const userCount = await db.count("users");
  if (userCount > 0) {
    return; // Database already seeded
  }

  const tx = db.transaction(
    ["users", "subjects", "classes", "enrollments", "parentStudentRelations"],
    "readwrite"
  );

  // Seed users
  const users = [
    // Teachers
    {
      id: "TCH001",
      role: "teacher" as const,
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@college.edu",
      phoneNumber: "+1234567890",
      department: "Computer Science",
      subject: "Data Structures",
      passwordHash: "hashed_password_1",
      isVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "TCH002",
      role: "teacher" as const,
      name: "Prof. Michael Brown",
      email: "michael.brown@college.edu",
      phoneNumber: "+1234567891",
      department: "Computer Science",
      subject: "Database Management",
      passwordHash: "hashed_password_2",
      isVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "TCH003",
      role: "teacher" as const,
      name: "Dr. Emily Davis",
      email: "emily.davis@college.edu",
      phoneNumber: "+1234567892",
      department: "Computer Science",
      subject: "Web Development",
      passwordHash: "hashed_password_3",
      isVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    // Students
    {
      id: "STU001",
      role: "student" as const,
      name: "John Doe",
      email: "john.doe@student.college.edu",
      phoneNumber: "+1234567893",
      rollNumber: "CS21001",
      department: "Computer Science",
      section: "A",
      semester: "3",
      passwordHash: "hashed_password_4",
      isVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "STU002",
      role: "student" as const,
      name: "Jane Smith",
      email: "jane.smith@student.college.edu",
      phoneNumber: "+1234567894",
      rollNumber: "CS21002",
      department: "Computer Science",
      section: "A",
      semester: "3",
      passwordHash: "hashed_password_5",
      isVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "STU003",
      role: "student" as const,
      name: "Mike Johnson",
      email: "mike.johnson@student.college.edu",
      phoneNumber: "+1234567895",
      rollNumber: "CS21003",
      department: "Computer Science",
      section: "A",
      semester: "3",
      passwordHash: "hashed_password_6",
      isVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    // Parents
    {
      id: "PAR001",
      role: "parent" as const,
      name: "Robert Doe",
      email: "robert.doe@gmail.com",
      phoneNumber: "+1234567897",
      passwordHash: "hashed_password_8",
      isVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "PAR002",
      role: "parent" as const,
      name: "Mary Smith",
      email: "mary.smith@gmail.com",
      phoneNumber: "+1234567898",
      passwordHash: "hashed_password_9",
      isVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  for (const user of users) {
    await tx.objectStore("users").add(user);
  }

  // Seed subjects
  const subjects = [
    {
      subjectCode: "CS101",
      subjectName: "Data Structures",
      credits: 4,
      department: "Computer Science",
      semester: "3",
      teacherId: "TCH001",
      createdAt: new Date().toISOString(),
    },
    {
      subjectCode: "CS102",
      subjectName: "Database Management",
      credits: 3,
      department: "Computer Science",
      semester: "3",
      teacherId: "TCH002",
      createdAt: new Date().toISOString(),
    },
    {
      subjectCode: "CS103",
      subjectName: "Web Development",
      credits: 3,
      department: "Computer Science",
      semester: "3",
      teacherId: "TCH003",
      createdAt: new Date().toISOString(),
    },
  ];

  const subjectIds: number[] = [];
  for (const subject of subjects) {
    const id = await tx.objectStore("subjects").add(subject);
    subjectIds.push(id as number);
  }

  // Seed classes
  const classes = [
    {
      classCode: "CS101-A",
      subjectId: subjectIds[0],
      teacherId: "TCH001",
      section: "A",
      roomNumber: "Room 101",
      scheduleDay: "Monday",
      scheduleTime: "09:00",
      createdAt: new Date().toISOString(),
    },
    {
      classCode: "CS102-A",
      subjectId: subjectIds[1],
      teacherId: "TCH002",
      section: "A",
      roomNumber: "Room 102",
      scheduleDay: "Tuesday",
      scheduleTime: "10:00",
      createdAt: new Date().toISOString(),
    },
    {
      classCode: "CS103-A",
      subjectId: subjectIds[2],
      teacherId: "TCH003",
      section: "A",
      roomNumber: "Room 103",
      scheduleDay: "Wednesday",
      scheduleTime: "11:00",
      createdAt: new Date().toISOString(),
    },
  ];

  const classIds: number[] = [];
  for (const classData of classes) {
    const id = await tx.objectStore("classes").add(classData);
    classIds.push(id as number);
  }

  // Seed enrollments
  const enrollments = [
    {
      studentId: "STU001",
      classId: classIds[0],
      enrolledAt: new Date().toISOString(),
    },
    {
      studentId: "STU001",
      classId: classIds[1],
      enrolledAt: new Date().toISOString(),
    },
    {
      studentId: "STU001",
      classId: classIds[2],
      enrolledAt: new Date().toISOString(),
    },
    {
      studentId: "STU002",
      classId: classIds[0],
      enrolledAt: new Date().toISOString(),
    },
    {
      studentId: "STU002",
      classId: classIds[1],
      enrolledAt: new Date().toISOString(),
    },
    {
      studentId: "STU002",
      classId: classIds[2],
      enrolledAt: new Date().toISOString(),
    },
    {
      studentId: "STU003",
      classId: classIds[0],
      enrolledAt: new Date().toISOString(),
    },
    {
      studentId: "STU003",
      classId: classIds[1],
      enrolledAt: new Date().toISOString(),
    },
    {
      studentId: "STU003",
      classId: classIds[2],
      enrolledAt: new Date().toISOString(),
    },
  ];

  for (const enrollment of enrollments) {
    await tx.objectStore("enrollments").add(enrollment);
  }

  // Seed parent-student relations
  const relations = [
    {
      parentId: "PAR001",
      studentId: "STU001",
      relationship: "father",
      createdAt: new Date().toISOString(),
    },
    {
      parentId: "PAR002",
      studentId: "STU002",
      relationship: "mother",
      createdAt: new Date().toISOString(),
    },
  ];

  for (const relation of relations) {
    await tx.objectStore("parentStudentRelations").add(relation);
  }

  await tx.done;
  console.log("Database seeded with sample data");
};

export const getDatabase = () => {
  if (!db) {
    throw new Error("Database not initialized. Call initDatabase() first.");
  }
  return db;
};
