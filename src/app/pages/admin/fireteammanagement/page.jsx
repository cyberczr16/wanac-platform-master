"use client";
import { useState, useEffect } from "react";
import AdminSidebar from '../../../../../components/dashboardcomponents/adminsidebar';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack, Typography, Box, IconButton, Autocomplete, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { clientsService } from '../../../../services/api/clients.service';

export default function FireteamAdminManagementPage() {
  const [fireteams, setFireteams] = useState([]);
  const [selectedFireteam, setSelectedFireteam] = useState(null);
  const [showFireteamDialog, setShowFireteamDialog] = useState(false);
  const [fireteamForm, setFireteamForm] = useState({ name: '', description: '', members: [], admin: '' });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    clientsService.getClients().then((data) => {
      // Ensure users is always an array
      if (Array.isArray(data)) {
        setUsers(data);
      } else if (data && typeof data === 'object') {
        setUsers(Object.values(data));
      } else {
        setUsers([]);
      }
    });
  }, []);

  // Handlers for Fireteams
  const handleOpenAddFireteam = () => {
    setFireteamForm({ name: '', description: '', members: [], admin: '' });
    setSelectedFireteam(null);
    setShowFireteamDialog(true);
  };
  const handleOpenEditFireteam = (fireteam) => {
    setFireteamForm({
      name: fireteam.name,
      description: fireteam.description,
      members: fireteam.members || [],
      admin: fireteam.admin || '',
    });
    setSelectedFireteam(fireteam);
    setShowFireteamDialog(true);
  };
  const handleFireteamFormChange = (e) => {
    setFireteamForm({ ...fireteamForm, [e.target.name]: e.target.value });
  };
  const handleMembersChange = (event, value) => {
    setFireteamForm(form => ({ ...form, members: value, admin: value.includes(form.admin) ? form.admin : '' }));
  };
  const handleAdminChange = (e) => {
    setFireteamForm({ ...fireteamForm, admin: e.target.value });
  };
  const handleSaveFireteam = () => {
    if (selectedFireteam) {
      setFireteams(fireteams.map(f => f.id === selectedFireteam.id ? { ...f, ...fireteamForm } : f));
    } else {
      setFireteams([...fireteams, { id: Date.now(), ...fireteamForm }]);
    }
    setShowFireteamDialog(false);
  };
  const handleOpenDeleteFireteam = (fireteam) => {
    setSelectedFireteam(fireteam);
    setShowDeleteDialog(true);
  };
  const handleDeleteFireteam = () => {
    setFireteams(fireteams.filter(f => f.id !== selectedFireteam.id));
    setShowDeleteDialog(false);
    setSelectedFireteam(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-6 md:ml-56">
        <div className="flex items-center justify-between mb-6">
          <Typography variant="h5" className="font-bold">Fireteam Management</Typography>
          <Button variant="contained" color="primary" startIcon={<FaPlus />} onClick={handleOpenAddFireteam}>
            Add Fireteam
          </Button>
        </div>
        <Box className="bg-white rounded shadow p-4">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="text-left py-2">Name</th>
                <th className="text-left py-2">Description</th>
                <th className="text-left py-2">Members</th>
                <th className="text-left py-2">Admin</th>
                <th className="text-left py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {fireteams.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-4 text-gray-400">No fireteams found.</td></tr>
              ) : fireteams.map((fireteam) => (
                <tr key={fireteam.id} className="border-t">
                  <td className="py-2">{fireteam.name}</td>
                  <td className="py-2">{fireteam.description}</td>
                  <td className="py-2">
                    {fireteam.members?.map(memberId => {
                      const user = users.find(u => u.id === memberId);
                      return user ? (
                        <span key={user.id} className="inline-block bg-gray-100 rounded px-2 py-1 text-xs mr-1 mb-1">{user.name}</span>
                      ) : null;
                    })}
                  </td>
                  <td className="py-2">
                    {(() => {
                      const adminUser = users.find(u => u.id === fireteam.admin);
                      return adminUser ? (
                        <span className="inline-block bg-blue-100 rounded px-2 py-1 text-xs font-semibold text-blue-700">{adminUser.name}</span>
                      ) : '--';
                    })()}
                  </td>
                  <td className="py-2">
                    <IconButton color="primary" onClick={() => handleOpenEditFireteam(fireteam)}><FaEdit /></IconButton>
                    <IconButton color="error" onClick={() => handleOpenDeleteFireteam(fireteam)}><FaTrash /></IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
        {/* Fireteam Dialog */}
        <Dialog open={showFireteamDialog} onClose={() => setShowFireteamDialog(false)} maxWidth="xs" fullWidth scroll="paper">
          <DialogTitle>{selectedFireteam ? 'Edit Fireteam' : 'Add Fireteam'}</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField
                label="Fireteam Name"
                name="name"
                value={fireteamForm.name}
                onChange={handleFireteamFormChange}
                fullWidth
                autoFocus
                variant="outlined"
                required
              />
              <TextField
                label="Description"
                name="description"
                value={fireteamForm.description}
                onChange={handleFireteamFormChange}
                fullWidth
                multiline
                minRows={2}
                maxRows={4}
                variant="outlined"
              />
              <Autocomplete
                multiple
                options={users}
                getOptionLabel={option => option.name}
                value={users.filter(u => fireteamForm.members.includes(u.id))}
                onChange={(e, value) => handleMembersChange(e, value.map(u => u.id))}
                renderInput={(params) => <TextField {...params} label="Members" placeholder="Select members" />}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                disableCloseOnSelect
              />
              <FormControl fullWidth>
                <InputLabel id="admin-label">Admin</InputLabel>
                <Select
                  labelId="admin-label"
                  value={fireteamForm.admin}
                  label="Admin"
                  onChange={handleAdminChange}
                  disabled={fireteamForm.members.length === 0}
                >
                  {users.filter(u => fireteamForm.members.includes(u.id)).map(user => (
                    <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setShowFireteamDialog(false)} color="inherit">Cancel</Button>
            <Button onClick={handleSaveFireteam} variant="contained" color="primary" disabled={!fireteamForm.name.trim() || !fireteamForm.admin || fireteamForm.members.length === 0}>
              {selectedFireteam ? 'Save Changes' : 'Add Fireteam'}
            </Button>
          </DialogActions>
        </Dialog>
        {/* Delete Dialog */}
        <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
          <DialogTitle>Delete Fireteam</DialogTitle>
          <DialogContent>
            Are you sure you want to delete the fireteam "{selectedFireteam?.name}"?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button onClick={handleDeleteFireteam} color="error" variant="contained">Delete</Button>
          </DialogActions>
        </Dialog>
      </main>
    </div>
  );
}
