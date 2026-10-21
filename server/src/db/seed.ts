import { db, pool } from "./index.js";
import {
  users,
  lecturers,
  students,
  venues,
  courses,
  courseEnrollments,
  courseLecturers,
  courseReps,
  attendanceSessions,
  attendanceRecords,
  verificationLogs,
} from "./schema/index.js";
import bcrypt from "bcryptjs";

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatTime(date: Date): string {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

async function main() {
  console.log("🌱 Starting comprehensive database seeding...");

  // 1. Clean existing records in reverse-dependency order
  console.log("🧹 Cleaning up existing records...");
  await db.delete(verificationLogs);
  await db.delete(attendanceRecords);
  await db.delete(attendanceSessions);
  await db.delete(courseReps);
  await db.delete(courseEnrollments);
  await db.delete(courseLecturers);
  await db.delete(courses);
  await db.delete(venues);
  await db.delete(students);
  await db.delete(lecturers);
  await db.delete(users);
  console.log("✅ Cleanup complete.");

  // 2. Hash default password
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync("Password123!", salt);

  // Create System Administrator
  console.log("🛡️ Creating System Administrator...");
  await db.insert(users).values({
    email: "admin@attendance.com",
    passwordHash,
    role: "admin",
    isActivated: true,
    isActive: true,
  });

  // 3. Create Lecturers
  console.log("👨‍🏫 Creating Lecturers...");
  const lecturerData = [
    {
      email: "lecturer@attendance.com",
      staffNumber: "L123",
      firstName: "John",
      lastName: "Doe",
      department: "Computer Science",
    },
    {
      email: "sarah.connor@attendance.com",
      staffNumber: "L456",
      firstName: "Sarah",
      lastName: "Connor",
      department: "Software Engineering",
    },
    {
      email: "alan.turing@attendance.com",
      staffNumber: "L789",
      firstName: "Alan",
      lastName: "Turing",
      department: "Artificial Intelligence",
    },
  ];

  const createdLecturers: any[] = [];
  for (const item of lecturerData) {
    const [u] = await db
      .insert(users)
      .values({
        email: item.email,
        passwordHash,
        role: "lecturer",
        isActivated: true,
        isActive: true,
      })
      .returning();

    const [lec] = await db
      .insert(lecturers)
      .values({
        userId: u.id,
        staffNumber: item.staffNumber,
        firstName: item.firstName,
        lastName: item.lastName,
        department: item.department,
      })
      .returning();

    createdLecturers.push({ ...lec, email: item.email });
  }

  // 4. Create Students
  console.log("🎓 Creating Students...");
  const studentData = [
    {
      email: "student@attendance.com",
      matricNumber: "csc/2020/001",
      firstName: "Jane",
      lastName: "Smith",
      department: "Computer Science",
      level: 400,
    },
    {
      email: "david.adeleke@attendance.com",
      matricNumber: "csc/2020/002",
      firstName: "David",
      lastName: "Adeleke",
      department: "Computer Science",
      level: 400,
    },
    {
      email: "aisha.bello@attendance.com",
      matricNumber: "csc/2020/003",
      firstName: "Aisha",
      lastName: "Bello",
      department: "Computer Science",
      level: 400,
    },
    {
      email: "emeka.okafor@attendance.com",
      matricNumber: "csc/2020/004",
      firstName: "Emeka",
      lastName: "Okafor",
      department: "Computer Science",
      level: 400,
    },
    {
      email: "fatima.umar@attendance.com",
      matricNumber: "csc/2020/005",
      firstName: "Fatima",
      lastName: "Umar",
      department: "Computer Science",
      level: 400,
    },
    {
      email: "michael.johnson@attendance.com",
      matricNumber: "csc/2020/006",
      firstName: "Michael",
      lastName: "Johnson",
      department: "Computer Science",
      level: 400,
    },
  ];

  const createdStudents: any[] = [];
  for (const item of studentData) {
    const [u] = await db
      .insert(users)
      .values({
        email: item.email,
        passwordHash,
        role: "student",
        isActivated: true,
        isActive: true,
      })
      .returning();

    const [std] = await db
      .insert(students)
      .values({
        userId: u.id,
        matricNumber: item.matricNumber,
        firstName: item.firstName,
        lastName: item.lastName,
        department: item.department,
        level: item.level,
      })
      .returning();

    createdStudents.push({ ...std, email: item.email });
  }

  // 5. Create Venues
  console.log("📍 Creating Campus Venues...");
  const venueData = [
    {
      name: "Computer Science Lab",
      latitude: 10.4904007,
      longitude: 7.4512039,
      radiusMeters: 50.0,
    },
    {
      name: "Faculty Lecture Theatre A",
      latitude: 10.4912,
      longitude: 7.452,
      radiusMeters: 75.0,
    },
    {
      name: "Engineering Auditorium",
      latitude: 10.4895,
      longitude: 7.4505,
      radiusMeters: 100.0,
    },
    {
      name: "ICT Innovation Hub",
      latitude: 10.492,
      longitude: 7.453,
      radiusMeters: 60.0,
    },
  ];

  const createdVenues: any[] = [];
  for (const item of venueData) {
    const [v] = await db.insert(venues).values(item).returning();
    createdVenues.push(v);
  }

  // 6. Create Courses
  console.log("📚 Creating Courses...");
  const courseData = [
    {
      courseCode: "CSC401",
      courseTitle: "Mobile App Development",
      unit: 3,
      department: "Computer Science",
      level: 400,
      lecturerIndex: 0, // Dr. John Doe
    },
    {
      courseCode: "CSC423",
      courseTitle: "Compiler Construction I",
      unit: 3,
      department: "Computer Science",
      level: 400,
      lecturerIndex: 1, // Dr. Sarah Connor
    },
    {
      courseCode: "CSC411",
      courseTitle: "Artificial Intelligence & Robotics",
      unit: 3,
      department: "Computer Science",
      level: 400,
      lecturerIndex: 2, // Prof. Alan Turing
    },
  ];

  const createdCourses: any[] = [];
  for (const item of courseData) {
    const [c] = await db
      .insert(courses)
      .values({
        courseCode: item.courseCode,
        courseTitle: item.courseTitle,
        unit: item.unit,
        department: item.department,
        level: item.level,
      })
      .returning();

    // Assign lecturer
    await db.insert(courseLecturers).values({
      courseId: c.id,
      lecturerId: createdLecturers[item.lecturerIndex].id,
    });

    createdCourses.push(c);
  }

  // 7. Enroll Students in Courses
  console.log("🔗 Enrolling Students in Courses...");
  // All 6 students enroll in CSC401 (Mobile App Development)
  for (const s of createdStudents) {
    await db.insert(courseEnrollments).values({
      studentId: s.id,
      courseId: createdCourses[0].id,
    });
  }

  // Jane, David, Aisha also enroll in CSC423 and CSC411
  for (let i = 0; i < 3; i++) {
    await db.insert(courseEnrollments).values({
      studentId: createdStudents[i].id,
      courseId: createdCourses[1].id,
    });
    await db.insert(courseEnrollments).values({
      studentId: createdStudents[i].id,
      courseId: createdCourses[2].id,
    });
  }

  // Assign Jane Smith as Course Rep for CSC401
  await db.insert(courseReps).values({
    courseId: createdCourses[0].id,
    studentId: createdStudents[0].id,
  });

  // 8. Seed Attendance Sessions
  console.log("📅 Seeding active and past attendance sessions...");
  const now = new Date();
  const todayStr = formatDate(now);
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const twoHoursHence = new Date(now.getTime() + 2 * 60 * 60 * 1000);

  // Active Session 1: CSC401 by Dr. John Doe in CS Lab
  const [activeSession1] = await db
    .insert(attendanceSessions)
    .values({
      courseId: createdCourses[0].id,
      lecturerId: createdLecturers[0].id,
      venueId: createdVenues[0].id,
      sessionDate: todayStr,
      startTime: formatTime(oneHourAgo),
      endTime: formatTime(twoHoursHence),
      attendanceCode: "4921",
      status: "active",
      allowRepMarking: true,
      lateThresholdMinutes: 15,
    })
    .returning();

  // Seed 2 present students in active session (Jane and David marked)
  // Remaining 4 students (Aisha, Emeka, Fatima, Michael) are pending
  await db.insert(attendanceRecords).values({
    sessionId: activeSession1.id,
    studentId: createdStudents[0].id,
    latitude: 10.4904007,
    longitude: 7.4512039,
    distanceMeters: 5.2,
    locationVerified: true,
    codeVerified: true,
    bleVerified: true,
    isManual: false,
    status: "present",
    markedAt: new Date(now.getTime() - 25 * 60 * 1000),
  });

  await db.insert(attendanceRecords).values({
    sessionId: activeSession1.id,
    studentId: createdStudents[1].id,
    latitude: 10.49041,
    longitude: 7.45121,
    distanceMeters: 8.4,
    locationVerified: true,
    codeVerified: true,
    bleVerified: true,
    isManual: false,
    status: "present",
    markedAt: new Date(now.getTime() - 15 * 60 * 1000),
  });

  // Past Session 1: CSC401 yesterday (Completed)
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const [pastSession1] = await db
    .insert(attendanceSessions)
    .values({
      courseId: createdCourses[0].id,
      lecturerId: createdLecturers[0].id,
      venueId: createdVenues[0].id,
      sessionDate: formatDate(yesterday),
      startTime: "09:00:00",
      endTime: "11:00:00",
      attendanceCode: "8312",
      status: "completed",
      allowRepMarking: false,
      lateThresholdMinutes: 15,
    })
    .returning();

  // Past records for 4 students in pastSession1
  for (let i = 0; i < 4; i++) {
    await db.insert(attendanceRecords).values({
      sessionId: pastSession1.id,
      studentId: createdStudents[i].id,
      latitude: 10.4904,
      longitude: 7.4512,
      distanceMeters: 4.0,
      locationVerified: true,
      codeVerified: true,
      bleVerified: true,
      isManual: false,
      status: i === 3 ? "late" : "present",
      markedAt: yesterday,
    });
  }

  // Past Session 2: CSC401 3 days ago (Completed)
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  const [pastSession2] = await db
    .insert(attendanceSessions)
    .values({
      courseId: createdCourses[0].id,
      lecturerId: createdLecturers[0].id,
      venueId: createdVenues[0].id,
      sessionDate: formatDate(threeDaysAgo),
      startTime: "14:00:00",
      endTime: "16:00:00",
      attendanceCode: "1094",
      status: "completed",
      allowRepMarking: false,
      lateThresholdMinutes: 15,
    })
    .returning();

  for (let i = 0; i < 5; i++) {
    await db.insert(attendanceRecords).values({
      sessionId: pastSession2.id,
      studentId: createdStudents[i].id,
      latitude: 10.4904,
      longitude: 7.4512,
      distanceMeters: 6.0,
      locationVerified: true,
      codeVerified: true,
      bleVerified: true,
      isManual: false,
      status: i === 4 ? "late" : "present",
      markedAt: threeDaysAgo,
    });
  }

  // Active Session 2: CSC423 by Dr. Sarah Connor in Faculty Lecture Theatre A
  const [activeSession2] = await db
    .insert(attendanceSessions)
    .values({
      courseId: createdCourses[1].id,
      lecturerId: createdLecturers[1].id,
      venueId: createdVenues[1].id,
      sessionDate: todayStr,
      startTime: formatTime(new Date(now.getTime() - 30 * 60 * 1000)),
      endTime: formatTime(new Date(now.getTime() + 90 * 60 * 1000)),
      attendanceCode: "5571",
      status: "active",
      allowRepMarking: false,
      lateThresholdMinutes: 15,
    })
    .returning();

  console.log("🎉 Seeding completed successfully!\n");
  console.log("==================================================");
  console.log("👥 SEEDED LECTURERS (Password: Password123!)");
  console.log("==================================================");
  for (const l of createdLecturers) {
    console.log(`- ${l.firstName} ${l.lastName} (${l.department})`);
    console.log(`  Staff ID: ${l.staffNumber} | Email: ${l.email}`);
  }

  console.log("\n==================================================");
  console.log("🎓 SEEDED STUDENTS (Password: Password123!)");
  console.log("==================================================");
  for (const s of createdStudents) {
    console.log(`- ${s.firstName} ${s.lastName} (${s.department}, Level ${s.level})`);
    console.log(`  Matric: ${s.matricNumber} | Email: ${s.email}`);
  }

  console.log("\n==================================================");
  console.log("📍 SEEDED VENUES");
  console.log("==================================================");
  for (const v of createdVenues) {
    console.log(`- ${v.name} (Radius: ${v.radiusMeters}m, Lat: ${v.latitude}, Lng: ${v.longitude})`);
  }

  console.log("\n==================================================");
  console.log("📚 SEEDED COURSES");
  console.log("==================================================");
  for (const c of createdCourses) {
    console.log(`- ${c.courseCode}: ${c.courseTitle} (${c.unit} Units)`);
  }

  console.log("\n==================================================");
  console.log("📅 SEEDED ACTIVE SESSIONS");
  console.log("==================================================");
  console.log(`- CSC401 Active Session: ID ${activeSession1.id} | Code: 4921 | Enrolled: 6 | Marked: 2 (Jane, David) | Pending: 4`);
  console.log(`- CSC423 Active Session: ID ${activeSession2.id} | Code: 5571 | Enrolled: 3`);
  console.log("==================================================\n");
}

main()
  .catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
