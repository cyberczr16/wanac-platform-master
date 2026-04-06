"use client";

import React, { useState, useMemo } from "react";
import AdminSidebar from "../../../../components/dashboardcomponents/adminsidebar";
import {
  Shield,
  Users,
  Lock,
  Edit,
  Trash2,
  Plus,
  X,
  Search,
  Eye,
  FileText,
  BarChart3,
  Settings,
  MessageSquare,
  Bell,
} from "lucide-react";

const MODULES = [
  { id: "user_management", label: "User Management", icon: Users },
  { id: "coach_management", label: "Coach Management", icon: Shield },
  { id: "program_management", label: "Program Management", icon: FileText },
  { id: "session_management", label: "Session Management", icon: Eye },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "community", label: "Community", icon: MessageSquare },
  { id: "announcements", label: "Announcements", icon: Bell },
];

const PERMISSIONS = ["view", "create", "edit", "delete"];

const INITIAL_ROLES = [
  {
    id: 1,
    name: "Super Admin",
    description: "Full access to all features and settings",
    color: "bg-red-100",
    textColor: "text-red-700",
    users: 2,
    editable: false,
    permissions: {
      user_management: ["view", "create", "edit", "delete"],
      coach_management: ["view", "create", "edit", "delete"],
      program_management: ["view", "create", "edit", "delete"],
      session_management: ["view", "create", "edit", "delete"],
      analytics: ["view", "create", "edit", "delete"],
      settings: ["view", "create", "edit", "delete"],
      community: ["view", "create", "edit", "delete"],
      announcements: ["view", "create", "edit", "delete"],
    },
  },
  {
    id: 2,
    name: "Program Manager",
    description: "Manage programs, cohorts, and enrollments",
    color: "bg-blue-100",
    textColor: "text-blue-700",
    users: 5,
    editable: true,
    permissions: {
      user_management: ["view"],
      coach_management: ["view"],
      program_management: ["view", "create", "edit"],
      session_management: ["view"],
      analytics: ["view"],
      settings: [],
      community: ["view"],
      announcements: ["view"],
    },
  },
  {
    id: 3,
    name: "Coach Supervisor",
    description: "View all coaches, sessions, and analytics",
    color: "bg-purple-100",
    textColor: "text-purple-700",
    users: 3,
    editable: true,
    permissions: {
      user_management: ["view"],
      coach_management: ["view"],
      program_management: ["view"],
      session_management: ["view"],
      analytics: ["view"],
      settings: [],
      community: ["view"],
      announcements: ["view"],
    },
  },
  {
    id: 4,
    name: "Content Manager",
    description: "Manage resources, announcements, and community",
    color: "bg-green-100",
    textColor: "text-green-700",
    users: 4,
    editable: true,
    permissions: {
      user_management: [],
      coach_management: [],
      program_management: ["view"],
      session_management: [],
      analytics: [],
      settings: [],
      community: ["view", "create", "edit"],
      announcements: ["view", "create", "edit", "delete"],
    },
  },
  {
    id: 5,
    name: "Viewer",
    description: "Read-only access to all data",
    color: "bg-gray-100",
    textColor: "text-gray-700",
    users: 8,
    editable: true,
    permissions: {
      user_management: ["view"],
      coach_management: ["view"],
      program_management: ["view"],
      session_management: ["view"],
      analytics: ["view"],
      settings: [],
      community: ["view"],
      announcements: ["view"],
    },
  },
];

const MOCK_USERS = [
  { id: 1, name: "Sarah Johnson", email: "sarah@example.com", roleId: 1 },
  { id: 2, name: "Michael Chen", email: "michael@example.com", roleId: 2 },
  { id: 3, name: "Emma Wilson", email: "emma@example.com", roleId: 3 },
  { id: 4, name: "James Martinez", email: "james@example.com", roleId: 4 },
  { id: 5, name: "Lisa Anderson", email: "lisa@example.com", roleId: 2 },
  { id: 6, name: "David Taylor", email: "david@example.com", roleId: 5 },
  { id: 7, name: "Rachel Brown", email: "rachel@example.com", roleId: 3 },
  { id: 8, name: "Chris Lee", email: "chris@example.com", roleId: 5 },
];

export default function RolesPage() {
  const [roles, setRoles] = useState(INITIAL_ROLES);
  const [users, setUsers] = useState(MOCK_USERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserRole, setSelectedUserRole] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: {},
  });

  // Initialize permission structure
  const initializePermissions = () => {
    const perms = {};
    MODULES.forEach((module) => {
      perms[module.id] = [];
    });
    return perms;
  };

  const openCreateModal = () => {
    setEditingRole(null);
    setFormData({
      name: "",
      description: "",
      permissions: initializePermissions(),
    });
    setIsModalOpen(true);
  };

  const openEditModal = (role) => {
    if (role.editable) {
      setEditingRole(role);
      setFormData({
        name: role.name,
        description: role.description,
        permissions: { ...role.permissions },
      });
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRole(null);
    setFormData({
      name: "",
      description: "",
      permissions: initializePermissions(),
    });
  };

  const handlePermissionChange = (moduleId, permission) => {
    setFormData((prev) => {
      const modulePermissions = [...(prev.permissions[moduleId] || [])];
      const index = modulePermissions.indexOf(permission);

      if (index > -1) {
        modulePermissions.splice(index, 1);
      } else {
        modulePermissions.push(permission);
      }

      return {
        ...prev,
        permissions: {
          ...prev.permissions,
          [moduleId]: modulePermissions,
        },
      };
    });
  };

  const handleSaveRole = () => {
    if (!formData.name.trim()) {
      alert("Please enter a role name");
      return;
    }

    if (editingRole) {
      setRoles(
        roles.map((role) =>
          role.id === editingRole.id
            ? {
                ...role,
                name: formData.name,
                description: formData.description,
                permissions: formData.permissions,
              }
            : role
        )
      );
    } else {
      const newRole = {
        id: Math.max(...roles.map((r) => r.id), 0) + 1,
        name: formData.name,
        description: formData.description,
        color: "bg-indigo-100",
        textColor: "text-indigo-700",
        users: 0,
        editable: true,
        permissions: formData.permissions,
      };
      setRoles([...roles, newRole]);
    }

    closeModal();
  };

  const handleDeleteRole = (roleId) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      setRoles(roles.filter((role) => role.id !== roleId));
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, users]);

  const handleRoleChange = (userId, newRoleId) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, roleId: newRoleId } : user
      )
    );
  };

  const getRoleById = (roleId) => roles.find((role) => role.id === roleId);

  const stats = [
    { label: "Total Roles", value: roles.length, icon: Shield },
    {
      label: "Total Admins",
      value: users.filter((u) => getRoleById(u.roleId)?.name === "Super Admin")
        .length,
      icon: Users,
    },
    {
      label: "Recent Changes",
      value: "3",
      icon: FileText,
    },
  ];

  return (
    <div className="h-screen flex bg-white font-body overflow-hidden">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#002147] to-blue-900 text-white px-8 py-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Shield size={32} />
                Role & Permissions Manager
              </h1>
              <p className="text-blue-100 mt-1">
                Manage user roles and assign permissions
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* Stats Strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {stats.map((stat, idx) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex items-start gap-4"
                >
                  <div className="p-3 bg-[#002147] bg-opacity-10 rounded-xl">
                    <IconComponent
                      size={24}
                      className="text-[#002147]"
                      strokeWidth={2}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-600 text-sm font-medium">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-[#002147] mt-1">
                      {stat.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Roles Overview Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-[#002147]">
                  Roles Overview
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Manage system roles and permissions
                </p>
              </div>
              <button
                onClick={openCreateModal}
                className="flex items-center gap-2 bg-[#f97316] hover:bg-orange-500 text-white px-6 py-3 rounded-2xl font-medium transition-colors"
              >
                <Plus size={20} />
                Create Role
              </button>
            </div>

            {/* Roles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roles.map((role) => (
                <div
                  key={role.id}
                  className={`${role.color} rounded-2xl shadow-sm border border-gray-200 p-6 transition-all hover:shadow-md`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className={`text-lg font-bold ${role.textColor}`}>
                        {role.name}
                      </h3>
                      {!role.editable && (
                        <span className="inline-block mt-1 text-xs font-medium bg-gray-300 text-gray-700 px-2 py-1 rounded">
                          System Role
                        </span>
                      )}
                    </div>
                    {role.editable && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(role)}
                          className="p-2 hover:bg-white hover:bg-opacity-60 rounded-lg transition-colors"
                        >
                          <Edit size={18} className={role.textColor} />
                        </button>
                        <button
                          onClick={() => handleDeleteRole(role.id)}
                          className="p-2 hover:bg-white hover:bg-opacity-60 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} className="text-red-600" />
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="text-gray-700 text-sm mb-4">
                    {role.description}
                  </p>

                  <div className="flex items-center gap-2 pt-4 border-t border-gray-300 border-opacity-50">
                    <Users size={16} className={role.textColor} />
                    <span className={`text-sm font-medium ${role.textColor}`}>
                      {role.users} user{role.users !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User-Role Assignment Section */}
          <div>
            <h2 className="text-2xl font-bold text-[#002147] mb-6">
              User Role Assignment
            </h2>

            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search
                  size={20}
                  className="absolute left-4 top-3.5 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-transparent"
                />
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        User
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Current Role
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Change Role
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => {
                        const currentRole = getRoleById(user.roleId);
                        return (
                          <tr
                            key={user.id}
                            className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                              {user.name}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {user.email}
                            </td>
                            <td className="px-6 py-4">
                              {currentRole && (
                                <span
                                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${currentRole.color} ${currentRole.textColor}`}
                                >
                                  {currentRole.name}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <select
                                value={user.roleId}
                                onChange={(e) =>
                                  handleRoleChange(user.id, parseInt(e.target.value))
                                }
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-transparent"
                              >
                                {roles.map((role) => (
                                  <option key={role.id} value={role.id}>
                                    {role.name}
                                  </option>
                                ))}
                              </select>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="px-6 py-8 text-center text-gray-500"
                        >
                          No users found matching your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create/Edit Role Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-[#002147] to-blue-900">
              <h2 className="text-xl font-bold text-white">
                {editingRole ? "Edit Role" : "Create New Role"}
              </h2>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <X size={24} className="text-white" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Role Name Input */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Role Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Program Coordinator"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-transparent"
                />
              </div>

              {/* Description Textarea */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe the purpose and responsibilities of this role..."
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-transparent resize-none"
                />
              </div>

              {/* Permissions Grid */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">
                  Module Permissions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {MODULES.map((module) => {
                    const IconComponent = module.icon;
                    const hasAnyPermission = (formData.permissions[module.id] || [])
                      .length > 0;

                    return (
                      <div
                        key={module.id}
                        className={`border rounded-xl p-4 transition-colors ${
                          hasAnyPermission
                            ? "border-[#f97316] bg-orange-50"
                            : "border-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <IconComponent
                            size={18}
                            className="text-[#002147]"
                          />
                          <h4 className="font-semibold text-gray-800 text-sm">
                            {module.label}
                          </h4>
                        </div>

                        <div className="space-y-2">
                          {PERMISSIONS.map((permission) => (
                            <label
                              key={permission}
                              className="flex items-center gap-3 cursor-pointer group"
                            >
                              <input
                                type="checkbox"
                                checked={(
                                  formData.permissions[module.id] || []
                                ).includes(permission)}
                                onChange={() =>
                                  handlePermissionChange(module.id, permission)
                                }
                                className="w-4 h-4 text-[#f97316] border-gray-300 rounded cursor-pointer focus:ring-[#f97316]"
                              />
                              <span className="text-sm text-gray-700 group-hover:text-gray-900 capitalize">
                                {permission}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
                <button
                  onClick={closeModal}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveRole}
                  className="px-6 py-2 bg-[#f97316] hover:bg-orange-500 text-white rounded-lg font-medium transition-colors"
                >
                  {editingRole ? "Update Role" : "Create Role"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
