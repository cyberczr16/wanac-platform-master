import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Button,
  Stack,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Snackbar,
  Alert,
} from "@mui/material";
import { cohortService } from "../../src/services/api/cohort.service";
import { fireteamService } from "../../src/services/api/fireteam.service";
import { generateJitsiMeetingLink } from "../../src/lib/jitsi.utils";

export default function FireteamManagement({ sidebar: SidebarComponent }) {
  const router = useRouter();
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedFireteam, setSelectedFireteam] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cohortId, setCohortId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [fireteams, setFireteams] = useState([]);
  const [cohorts, setCohorts] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const cohortsData = await cohortService.getCohorts();
        setCohorts(cohortsData);
      } catch (err) {
        setError("Error fetching cohorts");
      }
      try {
        const fireteamsData = await fireteamService.getFireteams();
        setFireteams(fireteamsData);
      } catch (err) {
        if (err.response?.status === 401) {
          setError("Authentication required. Please log in to view fireteams.");
        } else {
          setError("Error fetching fireteams");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Modal handlers
  const handleAdd = () => {
    setSelectedFireteam(null);
    setShowAddEdit(true);
    setName("");
    setDescription("");
    setCohortId("");
    setDate("");
    setTime("");
    setError("");
  };
  const handleEdit = (fireteam) => {
    setSelectedFireteam(fireteam);
    setShowAddEdit(true);
    setName(fireteam?.title || fireteam?.name || "");
    setDescription(fireteam?.description || "");
    setCohortId(String(fireteam?.cohort_id || ""));
    setDate(fireteam?.date || "");
    setTime(fireteam?.time || "");
    setError("");
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
    setCohortId("");
    setDate("");
    setTime("");
    setError("");
  };

  // Save Fireteam (create or update)
  const handleSave = async () => {
    const validationErrors = [];
    if (!name.trim()) validationErrors.push("Name is required");
    if (!description.trim()) validationErrors.push("Description is required");
    if (!cohortId) validationErrors.push("Cohort is required");
    if (!date.trim()) validationErrors.push("Date is required");
    if (!time.trim()) validationErrors.push("Time is required");
    if (validationErrors.length > 0) {
      setError(validationErrors.join(". "));
      return;
    }
    setError("");
    setLoading(true);
    try {
      if (selectedFireteam) {
        const currentTitle = selectedFireteam?.title || selectedFireteam?.name || "";
        const dateTime = `${date}T${time}:00`;
        await fireteamService.updateFireteam(selectedFireteam.id, {
          cohort_id: cohortId,
          title: name,
          description,
          date: dateTime,
          time,
        });
        const updated = await fireteamService.getFireteams();
        setFireteams(updated);
        setSuccess("Fireteam updated successfully!");
      } else {
        const dateTime = `${date}T${time}:00`;
        // Generate a unique meeting link for the fireteam
        const roomName = `wanac-fireteam-${cohortId}-${Date.now()}`;
        const meetingLink = generateJitsiMeetingLink(roomName);
        
        const createdFireteam = await fireteamService.addFireteam({
          cohort_id: cohortId,
          title: name,
          description,
          date: dateTime,
          time,
          link: meetingLink
        });
        if (createdFireteam && createdFireteam.id) {
          await fireteamService.updateFireteam(createdFireteam.id, {
            cohort_id: cohortId,
            title: name,
            description,
            date: dateTime,
            time,
          });
        }
        const refreshed = await fireteamService.getFireteams();
        setFireteams(refreshed);
        setSuccess("Fireteam created successfully!");
      }
      handleClose();
    } catch (err) {
      let errorMessage = "Network or server error. Please try again.";
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data.error) {
          errorMessage = err.response.data.error;
        } else if (err.response.data.errors) {
          const errors = Array.isArray(err.response.data.errors) 
            ? err.response.data.errors 
            : Object.values(err.response.data.errors).flat();
          errorMessage = errors.join(". ");
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Delete Fireteam
  const handleConfirmDelete = async () => {
    if (!selectedFireteam) return;
    try {
      await fireteamService.deleteFireteam(selectedFireteam.id);
      setFireteams((prev) => prev.filter((ft) => ft.id !== selectedFireteam.id));
      setSuccess("Fireteam deleted successfully!");
      handleClose();
    } catch (err) {
      setError("Failed to delete fireteam.");
    }
  };

  // Filtered fireteams
  const filteredFireteams = fireteams.filter((f) => {
    const nameVal = typeof f.name === "string" ? f.name : f.title || "";
    const descriptionVal = typeof f.description === "string" ? f.description : "";
    return (
      nameVal.toLowerCase().includes(search.toLowerCase()) ||
      descriptionVal.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      {SidebarComponent && <SidebarComponent />}
      <main className="flex-1 p-8 ml-16 md:ml-56">
        <Box sx={{ bgcolor: "#fff", borderRadius: 2, p: 3, boxShadow: 1 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>Fireteam Management</Typography>
            <Button variant="contained" onClick={handleAdd}>Add Fireteam</Button>
          </Stack>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
            <TextField
              label="Search Fireteams"
              value={search}
              onChange={e => setSearch(e.target.value)}
              sx={{ width: { xs: "100%", sm: 300 } }}
            />
          </Stack>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Cohort</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow key="loading">
                  <TableCell colSpan={7} align="center">Loading...</TableCell>
                </TableRow>
              ) : filteredFireteams.length === 0 ? (
                <TableRow key="empty">
                  <TableCell colSpan={7} align="center">
                    {error && typeof error === "string" && error.includes("Authentication required") ? (
                      <div>
                        <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                          {error}
                        </Typography>
                        <Button 
                          variant="contained" 
                          color="primary" 
                          onClick={() => window.location.href = '/login'}
                        >
                          Go to Login
                        </Button>
                      </div>
                    ) : error && error.message && error.message.includes("Authentication required") ? (
                      <div>
                        <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                          {error.message}
                        </Typography>
                        <Button 
                          variant="contained" 
                          color="primary" 
                          onClick={() => window.location.href = '/login'}
                        >
                          Go to Login
                        </Button>
                      </div>
                    ) : (
                      "No fireteams found."
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                filteredFireteams.map((f) => {
                  const cohort = cohorts.find(c => c.id === f.cohort_id);
                  return (
                    <TableRow 
                      key={f.id}
                      hover
                      sx={{ cursor: 'pointer' }}
                      onClick={() => router.push(`/admin/fireteammanagement/${f.id}`)}
                    >
                      <TableCell>{f.title || f.name}</TableCell>
                      <TableCell>{f.description}</TableCell>
                      <TableCell>{cohort ? (cohort.name || cohort.title || `Cohort ${cohort.id}`) : f.cohort_id}</TableCell>
                      <TableCell>{f.date}</TableCell>
                      <TableCell>{f.time}</TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Button size="small" color="primary" onClick={() => handleEdit(f)} sx={{ mr: 1 }}>Edit</Button>
                        <Button size="small" color="error" onClick={() => handleDelete(f)}>Delete</Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Box>
        {/* Add/Edit Dialog */}
        <Dialog open={showAddEdit} onClose={handleClose} fullWidth maxWidth="xs">
          <DialogTitle>{selectedFireteam ? "Edit Fireteam" : "Add Fireteam"}</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <FormControl fullWidth required>
                <InputLabel id="cohort-label">Cohort</InputLabel>
                <Select
                  labelId="cohort-label"
                  value={cohortId}
                  label="Cohort"
                  onChange={e => setCohortId(String(e.target.value))}
                >
                  <MenuItem value="">Select a cohort</MenuItem>
                  {cohorts.map((cohort) => (
                    <MenuItem key={cohort.id} value={cohort.id}>
                      {cohort.name || cohort.title || `Cohort ${cohort.id}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
                fullWidth
                multiline
                minRows={2}
              />
              <TextField
                label="Date"
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
                fullWidth
              />
              <TextField
                label="Time"
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
                fullWidth
              />
              
              {error && <Alert severity="error">{error}</Alert>}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} disabled={loading}>Cancel</Button>
            <Button variant="contained" onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </DialogActions>
        </Dialog>
        {/* Delete Dialog */}
        <Dialog open={showDelete} onClose={handleClose} fullWidth maxWidth="xs">
          <DialogTitle>Delete Fireteam</DialogTitle>
          <DialogContent dividers>
            <Typography>Are you sure you want to delete the fireteam <b>{selectedFireteam?.title || selectedFireteam?.name}</b>?</Typography>
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button variant="contained" color="error" onClick={handleConfirmDelete}>Delete</Button>
          </DialogActions>
        </Dialog>
        {/* Success Snackbar */}
        <Snackbar open={!!success} autoHideDuration={3000} onClose={() => setSuccess("")}> 
          <Alert onClose={() => setSuccess("")} severity="success" sx={{ width: '100%' }}>{success}</Alert>
        </Snackbar>
      </main>
    </div>
  );
}
