"use client";
import { useState } from "react";
import AdminSidebar from '../../../../components/dashboardcomponents/adminsidebar';
import AdminFireteamHomePage from "./AdminFireteamHomePage";
import { Dialog } from '@mui/material';

export default function FireteamAdminManagementPage() {
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedFireteam, setSelectedFireteam] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [fireteams, setFireteams] = useState([
    {
      id: 1,
      name: "Alpha Team",
      description: "Handles onboarding clients.",
      type: "client",
      members: ["Jane Doe", "John Smith"],
      admin: "Jane Doe",
    },
    {
      id: 2,
      name: "Bravo Team",
      description: "Coach support group.",
      type: "coach",
      members: ["Alice Brown", "Bob White"],
      admin: "Alice Brown",
    },
  ]);

  // Handlers for modal actions
  const handleAdd = () => {
    setSelectedFireteam(null);
    setShowAddEdit(true);
    setName("");
    setDescription("");
  };
  const handleEdit = (fireteam) => {
    setSelectedFireteam(fireteam);
    setShowAddEdit(true);
    setName(fireteam?.name || "");
    setDescription(fireteam?.description || "");
  };
  const handleDelete = (fireteam) => {
    setSelectedFireteam(fireteam);
    setShowDelete(true);
  };
  const handleClose = () => {
    setShowAddEdit(false);
    setShowDelete(false);
    setSelectedFireteam(null);
    setName("");
    setDescription("");
  };

  const handleSave = () => {
    if (!name.trim() || !description.trim()) return;
    if (selectedFireteam) {
      // Update existing
      setFireteams(prev => prev.map(ft => ft.id === selectedFireteam.id ? { ...ft, name, description } : ft));
    } else {
      // Create new
      const nextId = fireteams.length ? Math.max(...fireteams.map(f => f.id)) + 1 : 1;
      setFireteams(prev => [
        ...prev,
        {
          id: nextId,
          name,
          description,
          type: "client",
          members: [],
          admin: "",
        },
      ]);
    }
    handleClose();
  };

  const handleConfirmDelete = () => {
    if (selectedFireteam) {
      setFireteams(prev => prev.filter(ft => ft.id !== selectedFireteam.id));
    }
    handleClose();
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-6 md:ml-56">
        <AdminFireteamHomePage fireteams={fireteams} onAdd={handleAdd} onEdit={handleEdit} onDelete={handleDelete} />
        {/* Add/Edit Modal (placeholder) */}
        <Dialog open={showAddEdit} onClose={handleClose} maxWidth="xs" fullWidth>
          <div className="p-8">
            <h3 className="text-lg font-bold mb-4">{selectedFireteam ? 'Edit Fireteam' : 'Add Fireteam'}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter fireteam name"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter fireteam description"
                  rows={4}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>
            <div className="flex justify-end mt-6 gap-2">
              <button className="px-4 py-2 rounded bg-gray-200" onClick={handleClose}>Cancel</button>
              <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={handleSave} disabled={!name.trim() || !description.trim()}>Save</button>
            </div>
          </div>
        </Dialog>
        {/* Delete Modal (placeholder) */}
        <Dialog open={showDelete} onClose={handleClose} maxWidth="xs" fullWidth>
          <div className="p-8">
            <h3 className="text-lg font-bold mb-4 text-red-600">Delete Fireteam</h3>
            <p className="mb-6">Are you sure you want to delete the fireteam <span className="font-semibold">{selectedFireteam?.name}</span>?</p>
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 rounded bg-gray-200" onClick={handleClose}>Cancel</button>
              <button className="px-4 py-2 rounded bg-red-600 text-white" onClick={handleConfirmDelete}>Delete</button>
            </div>
          </div>
        </Dialog>
      </main>
    </div>
  );
}
