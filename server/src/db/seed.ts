import { db, pool } from "./index.js";
import { users, lecturers, students, venues, courses, courseEnrollments, courseLecturers, attendanceSessions, attendanceRecords } from "./schema/index.js";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

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
  console.log("🌱 Starting seeding...");

  // 1. Clear existing seed-related records to enable re-running the script
  console.log("🧹 Cleaning up existing seed records...");
  
  // Delete course (cascades to enrollments and lecturer assignments)
  await db.delete(courses).where(eq(courses.courseCode, "CSC401"));
  
  // Delete users (cascades to lecturer and student profiles)
  await db.delete(users).where(eq(users.email, "lecturer@attendance.com"));
  await db.delete(users).where(eq(users.email, "student@attendance.com"));
  
  // Delete venue
  await db.delete(venues).where(eq(venues.name, "Computer Science Lab"));

  console.log("✅ Cleanup complete.");

  // 2. Hash passwords
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync("Password123!", salt);

  // 3. Create Lecturer User
  console.log("👤 Creating Lecturer...");
  const [lecturerUser] = await db.insert(users).values({
    email: "lecturer@attendance.com",
    passwordHash,
    role: "lecturer",
    isActivated: true,
    isActive: true,
  }).returning();

  const [lecturerRecord] = await db.insert(lecturers).values({
    userId: lecturerUser.id,
    staffNumber: "L123",
    firstName: "John",
    lastName: "Doe",
    department: "Computer Science",
  }).returning();

  // 4. Create Student User
  console.log("👤 Creating Student...");
  const [studentUser] = await db.insert(users).values({
    email: "student@attendance.com",
    passwordHash,
    role: "student",
    isActivated: true,
    isActive: true,
  }).returning();

  const [studentRecord] = await db.insert(students).values({
    userId: studentUser.id,
    matricNumber: "csc/2020/001",
    firstName: "Jane",
    lastName: "Smith",
    department: "Computer Science",
    level: 400,
  }).returning();

  // 5. Create Venue
  console.log("📍 Creating Venue with Google Maps coordinates...");
  const [venueRecord] = await db.insert(venues).values({
    name: "Computer Science Lab",
    latitude: 10.4904007,
    longitude: 7.4512039,
    radiusMeters: 50.0,
  }).returning();

  // 6. Create Course
  console.log("📚 Creating Course...");
  const [courseRecord] = await db.insert(courses).values({
    courseCode: "CSC401",
    courseTitle: "Mobile App Development",
    unit: 3,
    department: "Computer Science",
    level: 400,
  }).returning();

  // 7. Enroll Student in Course
  console.log("🔗 Enrolling Student in Course...");
  await db.insert(courseEnrollments).values({
    studentId: studentRecord.id,
    courseId: courseRecord.id,
  });

  // 8. Assign Lecturer to Course
  console.log("🔗 Assigning Lecturer to Course...");
  await db.insert(courseLecturers).values({
    lecturerId: lecturerRecord.id,
    courseId: courseRecord.id,
  });

  // 9. Generate active & past sessions
  console.log("📅 Seeding active and past attendance sessions...");
  
  const now = new Date();

  // Active session details
  const activeSessionDate = formatDate(now);
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const twoHoursHence = new Date(now.getTime() + 2 * 60 * 60 * 1000);
  const activeStartTime = formatTime(oneHourAgo);
  const activeEndTime = formatTime(twoHoursHence);

  const [activeSession] = await db.insert(attendanceSessions).values({
    courseId: courseRecord.id,
    lecturerId: lecturerRecord.id,
    venueId: venueRecord.id,
    sessionDate: activeSessionDate,
    startTime: activeStartTime,
    endTime: activeEndTime,
    attendanceCode: "CSC401-ACTIVE",
    status: "active",
    allowRepMarking: false,
    lateThresholdMinutes: 15,
  }).returning();

  // Past Session 1 (Yesterday, student was present)
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const past1SessionDate = formatDate(yesterday);
  const past1StartTime = "09:00:00";
  const past1EndTime = "11:00:00";

  const [pastSession1] = await db.insert(attendanceSessions).values({
    courseId: courseRecord.id,
    lecturerId: lecturerRecord.id,
    venueId: venueRecord.id,
    sessionDate: past1SessionDate,
    startTime: past1StartTime,
    endTime: past1EndTime,
    attendanceCode: "CSC401-PAST1",
    status: "completed",
    allowRepMarking: false,
    lateThresholdMinutes: 15,
  }).returning();

  // Create attendance record for student in Past Session 1 (Present)
  await db.insert(attendanceRecords).values({
    sessionId: pastSession1.id,
    studentId: studentRecord.id,
    latitude: 10.4904007,
    longitude: 7.4512039,
    distanceMeters: 0.0,
    locationVerified: true,
    codeVerified: true,
    bleVerified: true,
    isManual: false,
    status: "present",
    markedAt: yesterday,
  });

  // Past Session 2 (2 days ago, student was late)
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
  const past2SessionDate = formatDate(twoDaysAgo);
  const past2StartTime = "14:00:00";
  const past2EndTime = "16:00:00";

  const [pastSession2] = await db.insert(attendanceSessions).values({
    courseId: courseRecord.id,
    lecturerId: lecturerRecord.id,
    venueId: venueRecord.id,
    sessionDate: past2SessionDate,
    startTime: past2StartTime,
    endTime: past2EndTime,
    attendanceCode: "CSC401-PAST2",
    status: "completed",
    allowRepMarking: false,
    lateThresholdMinutes: 15,
  }).returning();

  // Create attendance record for student in Past Session 2 (Late)
  await db.insert(attendanceRecords).values({
    sessionId: pastSession2.id,
    studentId: studentRecord.id,
    latitude: 10.4904007,
    longitude: 7.4512039,
    distanceMeters: 0.0,
    locationVerified: true,
    codeVerified: true,
    bleVerified: true,
    isManual: false,
    status: "late",
    markedAt: twoDaysAgo,
  });

  console.log("🎉 Seeding completed successfully!");
  console.log("\n🔑 LOGIN DETAILS:");
  console.log("--------------------------------------");
  console.log("Lecturer:");
  console.log("  Staff Number: L123");
  console.log("  Password:     Password123!");
  console.log("  Email:        lecturer@attendance.com");
  console.log("--------------------------------------");
  console.log("Student:");
  console.log("  Matric Number: csc/2020/001");
  console.log("  Password:      Password123!");
  console.log("  Email:         student@attendance.com");
  console.log("--------------------------------------");
  console.log("Venue Coordinates:");
  console.log(`  Latitude:  ${venueRecord.latitude}`);
  console.log(`  Longitude: ${venueRecord.longitude}`);
  console.log(`  Radius:    ${venueRecord.radiusMeters}m`);
  console.log("--------------------------------------");
  console.log("Seeded Sessions:");
  console.log(`  Active Session:  ID: ${activeSession.id}, Date: ${activeSessionDate}, Time: ${activeStartTime} - ${activeEndTime}, Code: CSC401-ACTIVE`);
  console.log(`  Past Session 1:  ID: ${pastSession1.id}, Date: ${past1SessionDate}, Status: completed, Code: CSC401-PAST1 (Student: Present)`);
  console.log(`  Past Session 2:  ID: ${pastSession2.id}, Date: ${past2SessionDate}, Status: completed, Code: CSC401-PAST2 (Student: Late)`);
  console.log("--------------------------------------");
}

main()
  .catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
