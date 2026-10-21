const API_BASE = "http://localhost:3000/api";

export interface AdminStats {
  totalStudents: number;
  totalLecturers: number;
  totalCourses: number;
  totalVenues: number;
  activeSessions: number;
  recentActivity: Array<{
    id: string;
    status: string;
    markedAt: string;
    studentName: string;
    matricNumber: string;
    courseCode: string;
    courseTitle: string;
    venueName: string;
  }>;
  activeSessionsList?: SessionRecord[];
}

export interface UserRecord {
  id: string;
  email: string;
  role: "student" | "lecturer" | "admin";
  isActive: boolean;
  isActivated: boolean;
  deviceId: string | null;
  createdAt: string;
}

export interface StudentRecord {
  id: string;
  userId: string;
  matricNumber: string;
  firstName: string;
  lastName: string;
  department: string;
  level: number;
  email: string;
  role: string;
  isActive: boolean;
  isActivated: boolean;
  deviceId: string | null;
  createdAt: string;
}

export interface LecturerRecord {
  id: string;
  userId: string;
  staffNumber: string;
  firstName: string;
  lastName: string;
  department: string;
  email?: string;
}

export interface CourseRecord {
  id: string;
  courseCode: string;
  courseTitle: string;
  unit: number;
  department: string;
  level: number;
  lecturerIds?: string[];
}

export interface VenueRecord {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
}

export interface SessionRecord {
  id: string;
  courseCode?: string;
  courseTitle?: string;
  venueName?: string;
  status: string;
  attendanceCode?: string;
  startTime?: string;
  endTime?: string;
  sessionDate?: string;
  allowRepMarking?: boolean;
}

export const api = {
  async getStats(): Promise<AdminStats> {
    const res = await fetch(`${API_BASE}/admin/stats`);
    if (!res.ok) throw new Error("Failed to fetch admin stats");
    return res.json();
  },

  async getUsers(): Promise<UserRecord[]> {
    const res = await fetch(`${API_BASE}/users`);
    if (!res.ok) throw new Error("Failed to fetch users");
    return res.json();
  },

  async getStudents(): Promise<StudentRecord[]> {
    const res = await fetch(`${API_BASE}/students`);
    if (!res.ok) throw new Error("Failed to fetch students");
    return res.json();
  },

  async getLecturers(): Promise<LecturerRecord[]> {
    const res = await fetch(`${API_BASE}/lecturers`);
    if (!res.ok) throw new Error("Failed to fetch lecturers");
    return res.json();
  },

  async getCourses(): Promise<CourseRecord[]> {
    const res = await fetch(`${API_BASE}/courses`);
    if (!res.ok) throw new Error("Failed to fetch courses");
    return res.json();
  },

  async getCourseLecturers(courseId: string): Promise<LecturerRecord[]> {
    const res = await fetch(`${API_BASE}/courses/${courseId}/lecturers`);
    if (!res.ok) return [];
    return res.json();
  },

  async createCourse(data: {
    courseCode: string;
    courseTitle: string;
    unit: number;
    department: string;
    level: number;
  }): Promise<CourseRecord> {
    const res = await fetch(`${API_BASE}/courses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to create course");
    }
    return res.json();
  },

  async updateCourse(
    id: string,
    data: {
      courseCode?: string;
      courseTitle?: string;
      unit?: number;
      department?: string;
      level?: number;
    }
  ): Promise<CourseRecord> {
    const res = await fetch(`${API_BASE}/courses/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update course");
    return res.json();
  },

  async deleteCourse(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/courses/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete course");
  },

  async assignLecturers(courseId: string, lecturerIds: string[]): Promise<void> {
    const res = await fetch(`${API_BASE}/courses/${courseId}/lecturers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lecturerIds }),
    });
    if (!res.ok) throw new Error("Failed to assign lecturers");
  },

  async getVenues(): Promise<VenueRecord[]> {
    const res = await fetch(`${API_BASE}/venues`);
    if (!res.ok) throw new Error("Failed to fetch venues");
    return res.json();
  },

  async createVenue(data: {
    name: string;
    latitude: number;
    longitude: number;
    radiusMeters: number;
  }): Promise<VenueRecord> {
    const res = await fetch(`${API_BASE}/venues`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create venue");
    return res.json();
  },

  async createLecturer(data: {
    staffNumber: string;
    firstName: string;
    lastName: string;
    email: string;
    department: string;
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/lecturers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to create lecturer");
    }
    return res.json();
  },

  async toggleUserStatus(userId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/users/${userId}/toggle-status`, {
      method: "PATCH",
    });
    if (!res.ok) throw new Error("Failed to toggle user status");
    return res.json();
  },

  async updateUserRole(userId: string, role: string): Promise<any> {
    const res = await fetch(`${API_BASE}/users/${userId}/role`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    if (!res.ok) throw new Error("Failed to update role");
    return res.json();
  },

  async resetDevice(userId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/users/${userId}/reset-device`, {
      method: "POST",
    });
    if (!res.ok) throw new Error("Failed to reset device ID");
    return res.json();
  },

  async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/admin/stats`, { signal: AbortSignal.timeout(2000) });
      return res.ok;
    } catch {
      return false;
    }
  },

  async adminSignin(data: { email: string; password: string }): Promise<{
    token: string;
    user: { id: string; email: string; role: string };
  }> {
    const res = await fetch(`${API_BASE}/auth/admin/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Invalid administrative credentials");
    }
    return res.json();
  },

  getCourseExportUrl(courseId: string): string {
    return `${API_BASE}/courses/${courseId}/export`;
  },
};
