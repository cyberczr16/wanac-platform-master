"use client";
import { useState } from "react";
import AdminSidebar from '../../../../../components/dashboardcomponents/adminsidebar';
import AdminFireteamHomePage from "./AdminFireteamHomePage";
import { Dialog } from '@mui/material';

export default function FireteamAdminManagementPage() {
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedFireteam, setSelectedFireteam] = useState(null);

  // Handlers for modal actions
  const handleAdd = () => {
    setSelectedFireteam(null);
    setShowAddEdit(true);
  };
  const handleEdit = (fireteam) => {
    setSelectedFireteam(fireteam);
    setShowAddEdit(true);
  };
  const handleDelete = (fireteam) => {
    setSelectedFireteam(fireteam);
    setShowDelete(true);
  };
  const handleClose = () => {
    setShowAddEdit(false);
    setShowDelete(false);
    setSelectedFireteam(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-6 md:ml-56">
        <AdminFireteamHomePage onAdd={handleAdd} onEdit={handleEdit} onDelete={handleDelete} />
        {/* Add/Edit Modal (placeholder) */}
        <Dialog open={showAddEdit} onClose={handleClose} maxWidth="xs" fullWidth>
          <div className="p-8">
            <h3 className="text-lg font-bold mb-4">{selectedFireteam ? 'Edit Fireteam' : 'Add Fireteam'}</h3>
            <p className="text-gray-500">(Form goes here...)</p>
            <div className="flex justify-end mt-6 gap-2">
              <button className="px-4 py-2 rounded bg-gray-200" onClick={handleClose}>Cancel</button>
              <button className="px-4 py-2 rounded bg-blue-600 text-white">Save</button>
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
              <button className="px-4 py-2 rounded bg-red-600 text-white">Delete</button>
            </div>
          </div>
        </Dialog>
      </main>
    </div>
  );
}
