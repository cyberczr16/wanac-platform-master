"use client";
import { useState, useEffect, useCallback } from "react";
import AdminSidebar from '../../../../components/dashboardcomponents/adminsidebar';
import { FaUserPlus, FaUserEdit, FaUserTimes, FaSearch } from "react-icons/fa";
import { X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { clientsService } from '../../../services/api/clients.service';

/** Align with GET /api/v1/clients shapes: nested `user` or flat fields. */
function normalizeClient(raw) {
  const id = raw?.id ?? raw?.user_id ?? raw?.user?.id;
  const u = raw?.user;
  return {
    id,
    name: u?.name ?? raw?.name ?? "—",
    email: u?.email ?? raw?.email ?? "—",
    phone: u?.phone ?? raw?.phone ?? "—",
    status: raw?.status ?? "Active",
  };
}

function extractClientList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.clients)) return data.clients;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

const STATUS_OPTIONS = ["Active", "Inactive", "Suspended"];

function EditClientProfileModal({ client, onClose, onSaveSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("Active");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!client) return;
    setName(client.name === "—" ? "" : client.name);
    setEmail(client.email === "—" ? "" : client.email);
    setPhone(client.phone === "—" ? "" : client.phone);
    setStatus(
      STATUS_OPTIONS.includes(client.status) ? client.status : "Active"
    );
  }, [client]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!client?.id) {
      toast.error("Cannot update this client (missing id).");
      return;
    }
    setSaving(true);
    try {
      await clientsService.updateClient(client.id, {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        status,
      });
      onSaveSuccess(client.id, {
        name: name.trim() || "—",
        email: email.trim() || "—",
        phone: phone.trim() || "—",
        status,
      });
      toast.success("Client profile updated.");
      onClose();
    } catch {
      toast.error("Could not save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!client) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-client-title"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/80">
          <h2
            id="edit-client-title"
            className="text-lg font-bold text-[#002147]"
          >
            Edit client profile
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
          <div>
            <label
              htmlFor="edit-client-name"
              className="block text-xs font-semibold text-gray-600 mb-1.5"
            >
              Name
            </label>
            <input
              id="edit-client-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoComplete="name"
            />
          </div>
          <div>
            <label
              htmlFor="edit-client-email"
              className="block text-xs font-semibold text-gray-600 mb-1.5"
            >
              Email
            </label>
            <input
              id="edit-client-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoComplete="email"
            />
          </div>
          <div>
            <label
              htmlFor="edit-client-phone"
              className="block text-xs font-semibold text-gray-600 mb-1.5"
            >
              Phone
            </label>
            <input
              id="edit-client-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoComplete="tel"
            />
          </div>
          <div>
            <label
              htmlFor="edit-client-status"
              className="block text-xs font-semibold text-gray-600 mb-1.5"
            >
              Status
            </label>
            <select
              id="edit-client-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
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
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ManageClients() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredClients, setFilteredClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingClient, setEditingClient] = useState(null);

  useEffect(() => {
    setLoading(true);
    clientsService.getClients()
      .then((data) => {
        const clientList = extractClientList(data).map(normalizeClient);
        setClients(clientList);
        setFilteredClients(clientList);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch clients.");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      setFilteredClients(clients);
      return;
    }
    setFilteredClients(
      clients.filter(
        (client) =>
          String(client.name).toLowerCase().includes(q) ||
          String(client.email).toLowerCase().includes(q)
      )
    );
  }, [search, clients]);

  const handleSaveSuccess = useCallback((clientId, updated) => {
    setClients((prev) =>
      prev.map((c) =>
        String(c.id) === String(clientId) ? { ...c, ...updated } : c
      )
    );
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#002147] mb-2">Manage Clients</h1>
            <p className="text-gray-600">View, search, and manage all WANAC clients.</p>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold mt-4 md:mt-0">
            <FaUserPlus /> Add Client
          </button>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center mb-4">
            <div className="relative w-full md:w-1/3">
              <input
                type="text"
                placeholder="Search clients..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-300 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FaSearch className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
          </div>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading clients...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 text-[#002147]">
                    <th className="py-2 px-4 text-left">Name</th>
                    <th className="py-2 px-4 text-left">Email</th>
                    <th className="py-2 px-4 text-left">Phone</th>
                    <th className="py-2 px-4 text-left">Status</th>
                    <th className="py-2 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-6 text-gray-500">
                        No clients found.
                      </td>
                    </tr>
                  ) : (
                    filteredClients.map((client) => (
                      <tr key={client.id ?? client.email} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4">{client.name}</td>
                        <td className="py-2 px-4">{client.email}</td>
                        <td className="py-2 px-4">{client.phone}</td>
                        <td className="py-2 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${client.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}>{client.status}</span>
                        </td>
                        <td className="py-2 px-4 flex gap-2">
                          <button
                            type="button"
                            className="p-2 rounded hover:bg-blue-100 text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed"
                            title={client.id ? "Edit client" : "Cannot edit — missing client id"}
                            disabled={!client.id}
                            onClick={() => setEditingClient(client)}
                          >
                            <FaUserEdit />
                          </button>
                          <button className="p-2 rounded hover:bg-red-100 text-red-600" title="Remove Client">
                            <FaUserTimes />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {editingClient && (
        <EditClientProfileModal
          client={editingClient}
          onClose={() => setEditingClient(null)}
          onSaveSuccess={handleSaveSuccess}
        />
      )}
    </div>
  );
}
