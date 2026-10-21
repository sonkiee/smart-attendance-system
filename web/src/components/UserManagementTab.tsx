import React, { useState } from "react";
import {
  Search,
  UserPlus,
  Shield,
  Smartphone,
  Power,
  GraduationCap,
  Briefcase,
  AlertCircle,
  X,
  CheckCircle,
} from "lucide-react";
import { api, type StudentRecord, type LecturerRecord, type UserRecord } from "../services/api";

interface UserManagementTabProps {
  users: UserRecord[];
  students: StudentRecord[];
  lecturers: LecturerRecord[];
  onRefresh: () => void;
}

export const UserManagementTab: React.FC<UserManagementTabProps> = ({
  users,
  students,
  lecturers,
  onRefresh,
}) => {
  const [activeFilter, setActiveFilter] = useState<"all" | "student" | "lecturer" | "admin">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  // New Lecturer Modal State
  const [showAddLecturerModal, setShowAddLecturerModal] = useState(false);
  const [newStaffNumber, setNewStaffNumber] = useState("");
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newDepartment, setNewDepartment] = useState("Computer Science");

  // Build unified user display list
  const studentMap = new Map(students.map((s) => [s.userId, s]));
  const lecturerMap = new Map(lecturers.map((l) => [l.userId, l]));

  const combinedList = users.map((u) => {
    const student = studentMap.get(u.id);
    const lecturer = lecturerMap.get(u.id);

    let name = "System Administrator";
    let identifier = "ADMIN";
    let department = "IT Services";

    if (student) {
      name = `${student.firstName} ${student.lastName}`.trim();
      identifier = student.matricNumber;
      department = `${student.department} (L${student.level})`;
    } else if (lecturer) {
      name = `Dr. ${lecturer.firstName} ${lecturer.lastName}`.trim();
      identifier = lecturer.staffNumber;
      department = lecturer.department;
    }

    return {
      ...u,
      name,
      identifier,
      department,
    };
  });

  // Filter & Search
  const filteredUsers = combinedList.filter((u) => {
    const matchesRole = activeFilter === "all" || u.role === activeFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      u.name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      u.identifier.toLowerCase().includes(query) ||
      u.department.toLowerCase().includes(query);
    return matchesRole && matchesSearch;
  });

  const handleToggleStatus = async (userId: string, currentActive: boolean) => {
    setIsSubmitting(true);
    setActionMessage(null);
    try {
      await api.toggleUserStatus(userId);
      setActionMessage({
        type: "success",
        text: `Account successfully ${currentActive ? "deactivated" : "activated"}.`,
      });
      onRefresh();
    } catch (err: any) {
      setActionMessage({ type: "error", text: err.message || "Failed to update account status." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetDevice = async (userId: string, userName: string) => {
    if (!window.confirm(`Are you sure you want to unbind the hardware device for ${userName}? This will permit the student to link a new physical mobile device.`)) {
      return;
    }
    setIsSubmitting(true);
    setActionMessage(null);
    try {
      await api.resetDevice(userId);
      setActionMessage({
        type: "success",
        text: `Device ID binding successfully wiped for ${userName}.`,
      });
      onRefresh();
    } catch (err: any) {
      setActionMessage({ type: "error", text: err.message || "Failed to reset device ID." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    setIsSubmitting(true);
    setActionMessage(null);
    try {
      await api.updateUserRole(userId, newRole);
      setActionMessage({
        type: "success",
        text: `User role successfully assigned to ${newRole.toUpperCase()}.`,
      });
      onRefresh();
    } catch (err: any) {
      setActionMessage({ type: "error", text: err.message || "Failed to update user role." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateLecturer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffNumber || !newFirstName || !newLastName || !newEmail) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setActionMessage(null);
    try {
      await api.createLecturer({
        staffNumber: newStaffNumber,
        firstName: newFirstName,
        lastName: newLastName,
        email: newEmail,
        department: newDepartment,
      });
      setActionMessage({
        type: "success",
        text: `Lecturer Dr. ${newFirstName} ${newLastName} successfully onboarded.`,
      });
      setShowAddLecturerModal(false);
      setNewStaffNumber("");
      setNewFirstName("");
      setNewLastName("");
      setNewEmail("");
      onRefresh();
    } catch (err: any) {
      setActionMessage({ type: "error", text: err.message || "Failed to create lecturer." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Account Management</h1>
          <p className="text-sm text-gray-500">
            Audit student matriculations, lecturer appointments, account activation, and device bindings.
          </p>
        </div>

        <button
          onClick={() => setShowAddLecturerModal(true)}
          className="inline-flex items-center space-x-2 bg-[#004ac6] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition shadow-xs cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Onboard Academic Staff</span>
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

      {/* Filter and Search Controls */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Role Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto">
          {(
            [
              { id: "all", label: `All Users (${users.length})` },
              { id: "student", label: `Students (${students.length})`, icon: GraduationCap },
              { id: "lecturer", label: `Lecturers (${lecturers.length})`, icon: Briefcase },
              { id: "admin", label: "Admins", icon: Shield },
            ] as const
          ).map((item) => {
            const isSelected = activeFilter === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveFilter(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center space-x-1.5 ${
                  isSelected
                    ? "bg-[#004ac6] text-white shadow-2xs"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, matric, staff ID, email..."
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#004ac6] focus:border-transparent bg-gray-50/50"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
            <thead className="bg-gray-50/75 text-gray-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">User Details</th>
                <th className="py-3 px-4">Identifier / Matric</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4">Device Binding</th>
                <th className="py-3 px-4 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    No user accounts match the selected filter or search query.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  return (
                    <tr key={user.id} className="hover:bg-gray-50/60 transition">
                      {/* Name & Email */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-gray-900">{user.name}</div>
                        <div className="text-gray-500 text-[11px] font-mono">{user.email}</div>
                      </td>

                      {/* ID / Matric */}
                      <td className="py-3.5 px-4 font-mono font-bold text-gray-700">
                        {user.identifier}
                      </td>

                      {/* Department */}
                      <td className="py-3.5 px-4 text-gray-600 truncate max-w-[150px]">
                        {user.department}
                      </td>

                      {/* Role Selector */}
                      <td className="py-3.5 px-4">
                        <select
                          value={user.role}
                          disabled={isSubmitting}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="bg-gray-50 border border-gray-200 text-gray-800 text-[11px] font-semibold rounded-md px-2 py-1 focus:ring-1 focus:ring-[#004ac6] cursor-pointer"
                        >
                          <option value="student">Student</option>
                          <option value="lecturer">Lecturer</option>
                          <option value="admin">Administrator</option>
                        </select>
                      </td>

                      {/* Account Status Badge */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            user.isActive
                              ? "bg-emerald-50 text-[#006c4a] border border-emerald-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}
                        >
                          {user.isActive ? "ACTIVE" : "DEACTIVATED"}
                        </span>
                      </td>

                      {/* Hardware Device Binding */}
                      <td className="py-3.5 px-4">
                        {user.deviceId ? (
                          <div className="flex items-center space-x-1.5">
                            <span className="inline-flex items-center text-[11px] text-blue-700 font-medium">
                              <Smartphone className="w-3.5 h-3.5 mr-1" />
                              Bound ({user.deviceId.substring(0, 8)}...)
                            </span>
                            <button
                              onClick={() => handleResetDevice(user.id, user.name)}
                              title="Unbind hardware fingerprint to allow student to change phones"
                              className="text-xs text-rose-600 hover:text-rose-800 font-semibold underline cursor-pointer"
                            >
                              Reset
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-gray-400 italic">No Device Linked</span>
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleToggleStatus(user.id, user.isActive)}
                          disabled={isSubmitting}
                          className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-semibold border transition cursor-pointer ${
                            user.isActive
                              ? "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                              : "bg-emerald-50 text-[#006c4a] border-emerald-200 hover:bg-emerald-100"
                          }`}
                        >
                          <Power className="w-3 h-3" />
                          <span>{user.isActive ? "Deactivate" : "Activate"}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Onboard New Lecturer Modal */}
      {showAddLecturerModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-gray-100">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#004ac6] flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-gray-900">Onboard Academic Staff</h3>
              </div>
              <button
                onClick={() => setShowAddLecturerModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLecturer} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Staff Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. L999"
                  value={newStaffNumber}
                  onChange={(e) => setNewStaffNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004ac6] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Grace"
                    value={newFirstName}
                    onChange={(e) => setNewFirstName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004ac6] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hopper"
                    value={newLastName}
                    onChange={(e) => setNewLastName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004ac6] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Institutional Email *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. grace.hopper@attendance.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004ac6] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Department *</label>
                <select
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004ac6] focus:outline-none bg-white"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="Cyber Security">Cyber Security</option>
                  <option value="Information Systems">Information Systems</option>
                </select>
              </div>

              <p className="text-[11px] text-gray-500 pt-1">
                Default password will be initialized to <code>Password123!</code>.
              </p>

              <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddLecturerModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[#004ac6] text-white rounded-lg font-semibold hover:bg-blue-700 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Save Lecturer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
