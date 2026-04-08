"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import AdminSidebar from "../../../../components/dashboardcomponents/adminsidebar";
import {
  FaUserPlus,
  FaUserEdit,
  FaUserTimes,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";
import { X, Loader2, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import { usersService } from "../../../services/api/users.service";

const STATUS_OPTIONS = ["Active", "Inactive", "Suspended"];
const ROLE_OPTIONS = ["All", "client", "coach", "admin"];
const PAGE_SIZE_OPTIONS = [10, 25, 50];

/* ------------------------------------------------------------------ */
/*  Add / Edit User Modal                                             */
/* ------------------------------------------------------------------ */
function UserFormModal({ user, onClose, onSuccess }) {
  const isEditing = Boolean(user);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("client");
  const [status, setStatus] = useState("Active");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setName(user.name === "—" ? "" : user.name);
    setEmail(user.email === "—" ? "" : user.email);
    setPhone(user.phone === "—" ? "" : user.phone);
    setRole(user.role || "client");
    setStatus(STATUS_OPTIONS.includes(user.status) ? user.status : "Active");
  }, [user]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      role,
      status,
    };
    if (!trimmed.name || !trimmed.email) {
      toast.error("Name and email are required.");
      return;
    }
    setSaving(true);
    try {
      if (isEditing) {
        await usersService.updateUser(user.id, trimmed);
        toast.success("User updated successfully.");
      } else {
        await usersService.createUser(trimmed);
        toast.success("User added successfully.");
      }
      onSuccess();
      onClose();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        (isEditing ? "Failed to update user." : "Failed to add user.");
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/80">
          <h2 className="text-lg font-bold text-[#002147]">
            {isEditing ? "Edit User" : "Add New User"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <FormField label="Name" id="user-name" required>
            <input
              id="user-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="field-input"
              autoComplete="name"
              placeholder="Full name"
            />
          </FormField>
          <FormField label="Email" id="user-email" required>
            <input
              id="user-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field-input"
              autoComplete="email"
              placeholder="email@example.com"
            />
          </FormField>
          <FormField label="Phone" id="user-phone">
            <input
              id="user-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="field-input"
              autoComplete="tel"
              placeholder="+1 (555) 000-0000"
            />
          </FormField>
          <FormField label="Role" id="user-role">
            <select
              id="user-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="field-input bg-white"
            >
              {["client", "coach", "admin"].map((r) => (
                <option key={r} value={r}>
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Status" id="user-status">
            <select
              id="user-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="field-input bg-white"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </FormField>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-sm rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition font-medium disabled:opacity-60 flex items-center gap-2"
            >
              {saving && <Loader2 size={16} className="animate-spin" />}
              {isEditing ? "Save Changes" : "Add User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Confirm Delete Modal                                              */
/* ------------------------------------------------------------------ */
function ConfirmDeleteModal({ user, onClose, onConfirm, deleting }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!user) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm border border-gray-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle size={24} className="text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Remove User</h3>
          <p className="text-sm text-gray-600 mb-6">
            Are you sure you want to remove <strong>{user.name}</strong>? This
            action cannot be undone.
          </p>
          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={deleting}
              onClick={onConfirm}
              className="px-4 py-2 text-sm rounded-xl bg-red-600 text-white hover:bg-red-700 transition font-medium disabled:opacity-60 flex items-center gap-2"
            >
              {deleting && <Loader2 size={16} className="animate-spin" />}
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */
function FormField({ label, id, required, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-gray-600 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      <style jsx global>{`
        .field-input {
          width: 100%;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
          transition: box-shadow 0.15s, border-color 0.15s;
        }
        .field-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
        }
      `}</style>
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    Active: "bg-green-100 text-green-700",
    Inactive: "bg-gray-200 text-gray-600",
    Suspended: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
        colors[status] || "bg-gray-200 text-gray-600"
      }`}
    >
      {status || "—"}
    </span>
  );
}

function RoleBadge({ role }) {
  const colors = {
    admin: "bg-purple-100 text-purple-700",
    coach: "bg-blue-100 text-blue-700",
    client: "bg-teal-100 text-teal-700",
  };
  const display = role ? role.charAt(0).toUpperCase() + role.slice(1) : "—";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
        colors[role] || "bg-gray-200 text-gray-600"
      }`}
    >
      {display}
    </span>
  );
}

/* ================================================================== */
/*  MAIN PAGE                                                         */
/* ================================================================== */
export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search & filter
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");

  // Sort
  const [sortField, setSortField] = useState("name");
  const [sortDir, setSortDir] = useState("asc");

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals
  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  /* ---- Fetch ---- */
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await usersService.getUsers();
      setUsers(data);
    } catch {
      setError("Failed to load users. Please try again.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  /* ---- Filter + Sort + Paginate ---- */
  const filtered = useMemo(() => {
    let list = [...users];
    if (statusFilter !== "All") {
      list = list.filter((u) => u.status === statusFilter);
    }
    if (roleFilter !== "All") {
      list = list.filter((u) => u.role === roleFilter);
    }
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (u) =>
          String(u.name).toLowerCase().includes(q) ||
          String(u.email).toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      const aVal = String(a[sortField] || "").toLowerCase();
      const bVal = String(b[sortField] || "").toLowerCase();
      return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
    return list;
  }, [users, search, statusFilter, roleFilter, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, roleFilter, pageSize]);

  /* ---- Sort toggle ---- */
  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDir === "asc" ? (
      <FaSortUp className="inline ml-1 -mb-0.5" size={12} />
    ) : (
      <FaSortDown className="inline ml-1 -mt-0.5" size={12} />
    );
  };

  /* ---- Delete handler ---- */
  const handleDelete = async () => {
    if (!deletingUser) return;
    setDeleteLoading(true);
    try {
      await usersService.deleteUser(deletingUser.id);
      toast.success("User removed successfully.");
      setUsers((prev) => prev.filter((u) => String(u.id) !== String(deletingUser.id)));
      setDeletingUser(null);
    } catch {
      toast.error("Failed to remove user.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="h-screen flex bg-gray-50 font-sans">
      <AdminSidebar />
      <div className="flex-1 flex flex-col h-full transition-all duration-300">
        <main className="flex-1 h-0 overflow-y-auto px-4 md:px-10 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[#002147] tracking-tight">
                  User Management
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  {filtered.length} user{filtered.length !== 1 && "s"} found
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingUser(null);
                  setFormOpen(true);
                }}
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium text-sm shadow-sm"
              >
                <FaUserPlus size={14} /> Add User
              </button>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <div className="relative flex-1 max-w-md">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {ROLE_OPTIONS.map((r) => (
                  <option key={r} value={r}>
                    {r === "All" ? "All Roles" : r.charAt(0).toUpperCase() + r.slice(1)}
                  </option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="All">All Statuses</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Table */}
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 size={28} className="animate-spin text-blue-600" />
                <span className="ml-3 text-gray-500">Loading users...</span>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <p className="text-red-500 mb-3">{error}</p>
                <button
                  onClick={fetchUsers}
                  className="text-blue-600 hover:underline text-sm font-medium"
                >
                  Retry
                </button>
              </div>
            ) : (
              <>
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {[
                            { key: "name", label: "Name" },
                            { key: "email", label: "Email" },
                            { key: "role", label: "Role" },
                            { key: "status", label: "Status" },
                            { key: "created_at", label: "Registered" },
                          ].map((col) => (
                            <th
                              key={col.key}
                              onClick={() => toggleSort(col.key)}
                              className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:text-gray-900 select-none"
                            >
                              {col.label}
                              <SortIcon field={col.key} />
                            </th>
                          ))}
                          <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Profile
                          </th>
                          <th className="px-5 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {paged.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="px-5 py-10 text-center text-gray-500">
                              No users match your search.
                            </td>
                          </tr>
                        ) : (
                          paged.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50/60 transition">
                              <td className="px-5 py-3.5 whitespace-nowrap text-sm font-medium text-gray-900">
                                {user.name}
                              </td>
                              <td className="px-5 py-3.5 whitespace-nowrap text-sm text-gray-600">
                                <div className="flex items-center gap-1.5">
                                  {user.email}
                                  {user.email_verified_at && (
                                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-green-100 text-green-600 flex-shrink-0" title="Email verified">
                                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-5 py-3.5 whitespace-nowrap">
                                <RoleBadge role={user.role} />
                              </td>
                              <td className="px-5 py-3.5 whitespace-nowrap">
                                <StatusBadge status={user.status} />
                              </td>
                              <td className="px-5 py-3.5 whitespace-nowrap text-sm text-gray-500">
                                {user.created_at
                                  ? new Date(user.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                                  : "—"}
                              </td>
                              <td className="px-5 py-3.5 whitespace-nowrap text-sm">
                                <div className="flex gap-1">
                                  {user.has_client_profile && (
                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">Client</span>
                                  )}
                                  {user.has_coach_profile && (
                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">Coach</span>
                                  )}
                                  {!user.has_client_profile && !user.has_coach_profile && (
                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">No profile</span>
                                  )}
                                </div>
                              </td>
                              <td className="px-5 py-3.5 whitespace-nowrap text-right">
                                <div className="flex gap-1 justify-end">
                                  <button
                                    onClick={() => {
                                      setEditingUser(user);
                                      setFormOpen(true);
                                    }}
                                    className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition"
                                    title="Edit User"
                                    disabled={!user.id}
                                  >
                                    <FaUserEdit size={15} />
                                  </button>
                                  <button
                                    onClick={() => setDeletingUser(user)}
                                    className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition"
                                    title="Remove User"
                                    disabled={!user.id}
                                  >
                                    <FaUserTimes size={15} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pagination */}
                {filtered.length > 0 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span>Rows per page:</span>
                      <select
                        value={pageSize}
                        onChange={(e) => setPageSize(Number(e.target.value))}
                        className="border border-gray-300 rounded px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {PAGE_SIZE_OPTIONS.map((n) => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>
                        {(safePage - 1) * pageSize + 1}–
                        {Math.min(safePage * pageSize, filtered.length)} of{" "}
                        {filtered.length}
                      </span>
                      <button
                        disabled={safePage <= 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                      >
                        <FaChevronLeft size={12} />
                      </button>
                      <button
                        disabled={safePage >= totalPages}
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                      >
                        <FaChevronRight size={12} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      {formOpen && (
        <UserFormModal
          user={editingUser}
          onClose={() => {
            setFormOpen(false);
            setEditingUser(null);
          }}
          onSuccess={fetchUsers}
        />
      )}
      {deletingUser && (
        <ConfirmDeleteModal
          user={deletingUser}
          onClose={() => setDeletingUser(null)}
          onConfirm={handleDelete}
          deleting={deleteLoading}
        />
      )}
    </div>
  );
}
