import React, { useState } from "react";
import {
  BookOpen,
  Plus,
  Trash2,
  Edit,
  UserCheck,
  Search,
  CheckCircle,
  AlertCircle,
  X,
  Download,
} from "lucide-react";
import {
  api,
  type CourseRecord,
  type LecturerRecord,
} from "../services/api";

interface CourseManagementTabProps {
  courses: CourseRecord[];
  lecturers: LecturerRecord[];
  onRefresh: () => void;
}

export const CourseManagementTab: React.FC<CourseManagementTabProps> = ({
  courses,
  lecturers,
  onRefresh,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionMessage, setActionMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Add Course Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [courseCode, setCourseCode] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [unit, setUnit] = useState(3);
  const [department, setDepartment] = useState("Computer Science");
  const [level, setLevel] = useState(400);

  // Edit Course Modal State
  const [editingCourse, setEditingCourse] = useState<CourseRecord | null>(null);

  // Assign Lecturer Modal State
  const [assigningCourse, setAssigningCourse] = useState<CourseRecord | null>(null);
  const [selectedLecturerIds, setSelectedLecturerIds] = useState<string[]>([]);

  // Filter courses
  const filteredCourses = courses.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      !q ||
      c.courseCode.toLowerCase().includes(q) ||
      c.courseTitle.toLowerCase().includes(q) ||
      c.department.toLowerCase().includes(q)
    );
  });

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseCode || !courseTitle) return;

    setIsSubmitting(true);
    setActionMessage(null);
    try {
      await api.createCourse({
        courseCode: courseCode.toUpperCase().trim(),
        courseTitle: courseTitle.trim(),
        unit: Number(unit),
        department,
        level: Number(level),
      });
      setActionMessage({
        type: "success",
        text: `Course ${courseCode.toUpperCase()} created successfully.`,
      });
      setShowAddModal(false);
      setCourseCode("");
      setCourseTitle("");
      setUnit(3);
      onRefresh();
    } catch (err: any) {
      setActionMessage({ type: "error", text: err.message || "Failed to create course." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;

    setIsSubmitting(true);
    setActionMessage(null);
    try {
      await api.updateCourse(editingCourse.id, {
        courseCode: editingCourse.courseCode,
        courseTitle: editingCourse.courseTitle,
        unit: Number(editingCourse.unit),
        department: editingCourse.department,
        level: Number(editingCourse.level),
      });
      setActionMessage({
        type: "success",
        text: `Course ${editingCourse.courseCode} updated successfully.`,
      });
      setEditingCourse(null);
      onRefresh();
    } catch (err: any) {
      setActionMessage({ type: "error", text: err.message || "Failed to update course." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCourse = async (id: string, code: string) => {
    if (!window.confirm(`Are you sure you want to delete course ${code}? This will cascade delete its attendance records and sessions.`)) {
      return;
    }

    setIsSubmitting(true);
    setActionMessage(null);
    try {
      await api.deleteCourse(id);
      setActionMessage({
        type: "success",
        text: `Course ${code} deleted successfully.`,
      });
      onRefresh();
    } catch (err: any) {
      setActionMessage({ type: "error", text: err.message || "Failed to delete course." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openAssignModal = async (course: CourseRecord) => {
    setAssigningCourse(course);
    // Fetch currently assigned lecturers
    try {
      const currentLecturers = await api.getCourseLecturers(course.id);
      setSelectedLecturerIds(currentLecturers.map((l) => l.id));
    } catch {
      setSelectedLecturerIds([]);
    }
  };

  const handleSaveAssignments = async () => {
    if (!assigningCourse) return;

    setIsSubmitting(true);
    setActionMessage(null);
    try {
      await api.assignLecturers(assigningCourse.id, selectedLecturerIds);
      setActionMessage({
        type: "success",
        text: `Instructors updated for ${assigningCourse.courseCode}.`,
      });
      setAssigningCourse(null);
      onRefresh();
    } catch (err: any) {
      setActionMessage({ type: "error", text: err.message || "Failed to assign lecturers." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Add Course Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Course & Curriculum Catalog</h1>
          <p className="text-sm text-gray-500">
            Provision academic courses, credit units, and manage academic lecturer assignments.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center space-x-2 bg-[#004ac6] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Course</span>
        </button>
      </div>

      {/* Action Notification Alert */}
      {actionMessage && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between text-sm ${
            actionMessage.type === "success"
              ? "bg-emerald-50 text-[#006c4a] border border-emerald-200"
              : "bg-rose-50 text-rose-700 border border-rose-200"
          }`}
        >
          <div className="flex items-center space-x-2">
            {actionMessage.type === "success" ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span>{actionMessage.text}</span>
          </div>
          <button
            onClick={() => setActionMessage(null)}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by course code, title, or department..."
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#004ac6] bg-gray-50/50"
          />
        </div>

        <span className="text-xs text-gray-500 font-medium">
          Showing {filteredCourses.length} of {courses.length} courses
        </span>
      </div>

      {/* Courses Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCourses.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-xl border border-gray-200">
            No courses match the search query.
          </div>
        ) : (
          filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-xs font-black tracking-wider uppercase px-2.5 py-1 rounded-md bg-blue-50 text-[#004ac6] border border-blue-200">
                    {course.courseCode}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                    {course.unit} Units
                  </span>
                </div>

                <h3 className="font-bold text-gray-900 mt-2.5 text-base leading-snug">
                  {course.courseTitle}
                </h3>

                <div className="mt-3 space-y-1.5 text-xs text-gray-500">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-semibold text-gray-700">Department:</span>
                    <span>{course.department}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-semibold text-gray-700">Academic Level:</span>
                    <span>{course.level} Level</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3.5 border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={() => openAssignModal(course)}
                  className="inline-flex items-center space-x-1.5 text-xs text-[#004ac6] font-semibold hover:text-blue-800 cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Assign Instructors</span>
                </button>

                <div className="flex items-center space-x-1">
                  <a
                    href={api.getCourseExportUrl(course.id)}
                    download={`attendance_${course.courseCode}.csv`}
                    title="Export Attendance Sheet (CSV)"
                    className="p-1.5 text-emerald-600 hover:text-emerald-800 rounded-md hover:bg-emerald-50 cursor-pointer flex items-center gap-1 text-[11px] font-semibold border border-emerald-200"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export</span>
                  </a>
                  <button
                    onClick={() => setEditingCourse(course)}
                    title="Edit Course"
                    className="p-1.5 text-gray-400 hover:text-gray-700 rounded-md hover:bg-gray-100 cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(course.id, course.courseCode)}
                    title="Delete Course"
                    className="p-1.5 text-rose-400 hover:text-rose-700 rounded-md hover:bg-rose-50 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Course Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-gray-100">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#004ac6] flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-gray-900">Register New Course</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-gray-700 font-semibold mb-1">Course Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CSC405"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004ac6] focus:outline-none uppercase font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Units *</label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    required
                    value={unit}
                    onChange={(e) => setUnit(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004ac6] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Course Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Computing Systems"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004ac6] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Department *</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004ac6] bg-white"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Cyber Security">Cyber Security</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Academic Level *</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004ac6] bg-white"
                  >
                    <option value={100}>100 Level</option>
                    <option value={200}>200 Level</option>
                    <option value={300}>300 Level</option>
                    <option value={400}>400 Level</option>
                    <option value={500}>500 Level</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[#004ac6] text-white rounded-lg font-semibold hover:bg-blue-700 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Save Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Course Modal */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-gray-100">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">
                Edit Course ({editingCourse.courseCode})
              </h3>
              <button
                onClick={() => setEditingCourse(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateCourse} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Course Code</label>
                <input
                  type="text"
                  required
                  value={editingCourse.courseCode}
                  onChange={(e) =>
                    setEditingCourse({ ...editingCourse, courseCode: e.target.value.toUpperCase() })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg uppercase font-mono"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  value={editingCourse.courseTitle}
                  onChange={(e) =>
                    setEditingCourse({ ...editingCourse, courseTitle: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Units</label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    required
                    value={editingCourse.unit}
                    onChange={(e) =>
                      setEditingCourse({ ...editingCourse, unit: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Level</label>
                  <input
                    type="number"
                    step={100}
                    min={100}
                    max={500}
                    required
                    value={editingCourse.level}
                    onChange={(e) =>
                      setEditingCourse({ ...editingCourse, level: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[#004ac6] text-white rounded-lg font-semibold hover:bg-blue-700 cursor-pointer"
                >
                  {isSubmitting ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Lecturer Modal */}
      {assigningCourse && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-gray-100">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Assign Instructors to {assigningCourse.courseCode}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">{assigningCourse.courseTitle}</p>
              </div>
              <button
                onClick={() => setAssigningCourse(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
              <p className="text-xs text-gray-500 font-semibold mb-2">
                Select lecturers authorized to teach and launch attendance sessions:
              </p>

              {lecturers.map((lec) => {
                const isAssigned = selectedLecturerIds.includes(lec.id);
                return (
                  <label
                    key={lec.id}
                    className={`flex items-center justify-between p-3 rounded-lg border text-xs cursor-pointer transition ${
                      isAssigned
                        ? "bg-blue-50 border-blue-300 text-blue-900 font-bold"
                        : "border-gray-200 hover:bg-gray-50 text-gray-700 font-medium"
                    }`}
                  >
                    <div>
                      <div>Dr. {lec.firstName} {lec.lastName}</div>
                      <div className="text-[11px] font-mono text-gray-500 font-normal">
                        Staff ID: {lec.staffNumber} • {lec.department}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={isAssigned}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedLecturerIds([...selectedLecturerIds, lec.id]);
                        } else {
                          setSelectedLecturerIds(selectedLecturerIds.filter((id) => id !== lec.id));
                        }
                      }}
                      className="w-4 h-4 text-[#004ac6] rounded focus:ring-[#004ac6]"
                    />
                  </label>
                );
              })}
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100 mt-4">
              <button
                type="button"
                onClick={() => setAssigningCourse(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 cursor-pointer text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAssignments}
                disabled={isSubmitting}
                className="px-4 py-2 bg-[#004ac6] text-white rounded-lg font-semibold hover:bg-blue-700 cursor-pointer text-xs"
              >
                {isSubmitting ? "Saving..." : "Save Assignments"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
