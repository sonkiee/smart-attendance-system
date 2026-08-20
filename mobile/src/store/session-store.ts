import { create } from "zustand";

export interface Session {
  id: string;
  courseCode: string;
  courseTitle: string;
  venue: string;
  radius: number; // in meters
  duration: number; // in minutes
  createdAt: string; // ISO string
  isActive: boolean;
  courseRepEnabled?: boolean; // Toggles course rep permissions
}

export interface StudentRoll {
  id: string;
  name: string;
  matricNumber: string;
  status: "submitted" | "waiting" | "present" | "absent";
  submittedAt?: string;
}

interface SessionState {
  activeSession: Session | null;
  pastSessions: Session[];
  studentsBySession: Record<string, StudentRoll[]>;
  createSession: (sessionData: Omit<Session, "id" | "createdAt" | "isActive">) => Session;
  endActiveSession: () => void;
  toggleCourseRep: (sessionId: string) => void;
  submitStudentAttendance: (sessionId: string, studentId: string) => void;
}

// Mock student base list for generating session rolls
const MOCK_STUDENTS = [
  { id: "1", name: "Alex Johnson", matricNumber: "KASU/22/CSC/1001" },
  { id: "2", name: "Sarah Miller", matricNumber: "KASU/22/CSC/1042" },
  { id: "3", name: "Thomas Wright", matricNumber: "KASU/22/CSC/1015" },
  { id: "4", name: "Jane Doe", matricNumber: "KASU/22/CSC/1102" },
  { id: "5", name: "Michael Smith", matricNumber: "KASU/22/CSC/1088" },
];

export const useSessionStore = create<SessionState>((set) => ({
  activeSession: null,
  pastSessions: [
    {
      id: "past-1",
      courseCode: "CSC 423",
      courseTitle: "Operating Systems II",
      venue: "CS Lab 1",
      radius: 20,
      duration: 15,
      createdAt: "2026-08-17T09:00:00.000Z",
      isActive: false,
      courseRepEnabled: false,
    },
    {
      id: "past-2",
      courseCode: "ARC 301",
      courseTitle: "Architectural Design",
      venue: "Lecture Hall 4B",
      radius: 50,
      duration: 30,
      createdAt: "2026-08-15T11:00:00.000Z",
      isActive: false,
      courseRepEnabled: true,
    }
  ],
  studentsBySession: {
    "past-1": [
      { id: "1", name: "Alex Johnson", matricNumber: "KASU/22/CSC/1001", status: "present" },
      { id: "2", name: "Sarah Miller", matricNumber: "KASU/22/CSC/1042", status: "present" },
      { id: "3", name: "Thomas Wright", matricNumber: "KASU/22/CSC/1015", status: "absent" },
      { id: "4", name: "Jane Doe", matricNumber: "KASU/22/CSC/1102", status: "present" },
      { id: "5", name: "Michael Smith", matricNumber: "KASU/22/CSC/1088", status: "absent" },
    ],
    "past-2": [
      { id: "1", name: "Alex Johnson", matricNumber: "KASU/22/CSC/1001", status: "present" },
      { id: "2", name: "Sarah Miller", matricNumber: "KASU/22/CSC/1042", status: "present" },
      { id: "3", name: "Thomas Wright", matricNumber: "KASU/22/CSC/1015", status: "present" },
      { id: "4", name: "Jane Doe", matricNumber: "KASU/22/CSC/1102", status: "absent" },
      { id: "5", name: "Michael Smith", matricNumber: "KASU/22/CSC/1088", status: "present" },
    ]
  },
  
  createSession: (sessionData) => {
    const id = `session-${Date.now()}`;
    const newSession: Session = {
      ...sessionData,
      id,
      createdAt: new Date().toISOString(),
      isActive: true,
    };
    
    // Generate fresh roll call for active session with "waiting" status
    const initialRoll: StudentRoll[] = MOCK_STUDENTS.map((student) => ({
      ...student,
      status: "waiting",
    }));

    set((state) => ({
      activeSession: newSession,
      studentsBySession: {
        ...state.studentsBySession,
        [id]: initialRoll,
      },
    }));

    return newSession;
  },

  endActiveSession: () => set((state) => {
    if (!state.activeSession) return state;

    const endedSession: Session = {
      ...state.activeSession,
      isActive: false,
    };

    // Convert active statuses to past statuses (submitted -> present, waiting -> absent)
    const activeRolls = state.studentsBySession[state.activeSession.id] || [];
    const pastRolls: StudentRoll[] = activeRolls.map((student) => ({
      ...student,
      status: student.status === "submitted" ? "present" : "absent",
    }));

    return {
      activeSession: null,
      pastSessions: [endedSession, ...state.pastSessions],
      studentsBySession: {
        ...state.studentsBySession,
        [endedSession.id]: pastRolls,
      },
    };
  }),

  toggleCourseRep: (sessionId) => set((state) => {
    // If updating active session
    if (state.activeSession?.id === sessionId) {
      return {
        activeSession: {
          ...state.activeSession,
          courseRepEnabled: !state.activeSession.courseRepEnabled,
        },
      };
    }

    // If updating past session
    const updatedPast = state.pastSessions.map((s) =>
      s.id === sessionId ? { ...s, courseRepEnabled: !s.courseRepEnabled } : s
    );

    return {
      pastSessions: updatedPast,
    };
  }),

  submitStudentAttendance: (sessionId, studentId) => set((state) => {
    const sessionRoll = state.studentsBySession[sessionId] || [];
    const updatedRoll = sessionRoll.map((student) =>
      student.id === studentId
        ? { ...student, status: "submitted" as const, submittedAt: new Date().toISOString() }
        : student
    );

    return {
      studentsBySession: {
        ...state.studentsBySession,
        [sessionId]: updatedRoll,
      },
    };
  }),
}));
