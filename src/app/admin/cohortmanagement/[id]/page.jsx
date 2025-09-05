"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminSidebar from "../../../../../components/dashboardcomponents/adminsidebar";
import { Box, Typography, Button, Stack, Chip, Table, TableHead, TableBody, TableRow, TableCell, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Divider } from "@mui/material";
import { cohortService } from "../../../../services/api/cohort.service";
import { sessionsService } from "../../../../services/api/sessions.service";

export default function CohortDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const cohortId = params?.id;

  const [cohort, setCohort] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [newSession, setNewSession] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
  });

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await cohortService.getCohorts();
        const list = Array.isArray(data) ? data : (Array.isArray(data?.cohorts) ? data.cohorts : []);
        const found = list.find(c => String(c.id) === String(cohortId));
        setCohort(found || null);
      } catch (e) {
        setError("Failed to load cohort");
      } finally {
        setLoading(false);
      }
    }
    if (cohortId) load();
  }, [cohortId]);

  useEffect(() => {
    async function loadSessions() {
      if (!cohortId) return;
      setSessionsLoading(true);
      try {
        const all = await sessionsService.getSessions();
        const list = Array.isArray(all)
          ? all
          : Array.isArray(all?.data)
          ? all.data
          : Array.isArray(all?.sessions?.data)
          ? all.sessions.data
          : [];
        const filtered = list.filter((s) => String(s.cohort_id ?? s.cohortId) === String(cohortId));
        setSessions(filtered);
      } catch (e) {
        // silently fail; keep sessions empty
      } finally {
        setSessionsLoading(false);
      }
    }
    loadSessions();
  }, [cohortId]);

  const handleCreateSession = async (e) => {
    e?.preventDefault?.();
    if (!newSession.title || !newSession.date) return;
    try {
      await sessionsService.addSession({
        title: newSession.title,
        description: newSession.description,
        date: newSession.date,
        time: newSession.time,
        cohort_id: cohortId,
      });
      setSessionModalOpen(false);
      setNewSession({ title: "", description: "", date: "", time: "" });
      // reload sessions
      const all = await sessionsService.getSessions();
      const list = Array.isArray(all)
        ? all
        : Array.isArray(all?.data)
        ? all.data
        : Array.isArray(all?.sessions?.data)
        ? all.sessions.data
        : [];
      const filtered = list.filter((s) => String(s.cohort_id ?? s.cohortId) === String(cohortId));
      setSessions(filtered);
    } catch (e) {
      console.error("Failed to create session:", e);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-8 ml-16 md:ml-56">
        <Button variant="outlined" sx={{ mb: 2 }} onClick={() => router.push("/admin/cohortmanagement")}>Back to Cohort Management</Button>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : cohort ? (
          <Box sx={{ bgcolor: '#fff', borderRadius: 2, p: 3, boxShadow: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>{cohort.name || `Cohort ${cohort.id}`}</Typography>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>{cohort.description || 'No description'}</Typography>

            <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
              <Chip label={`Members: ${(Array.isArray(cohort.clients) ? cohort.clients.length : 0) + (Array.isArray(cohort.coaches) ? cohort.coaches.length : 0)}`} />
              <Chip label={`Start: ${cohort.start_date ? new Date(cohort.start_date).toLocaleDateString() : '—'}`} />
              <Chip label={`End: ${cohort.end_date ? new Date(cohort.end_date).toLocaleDateString() : '—'}`} />
            </Stack>

            <Typography variant="h6" sx={{ mb: 1 }}>Members</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>ID</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(cohort.coaches || []).map(id => (
                  <TableRow key={`coach-${id}`}>
                    <TableCell>Coach</TableCell>
                    <TableCell>{id}</TableCell>
                  </TableRow>
                ))}
                {(cohort.clients || []).map(id => (
                  <TableRow key={`client-${id}`}>
                    <TableCell>Client</TableCell>
                    <TableCell>{id}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Divider sx={{ my: 3 }} />

            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography variant="h6">Cohort Sessions</Typography>
              <Button variant="contained" onClick={() => setSessionModalOpen(true)}>Add Session</Button>
            </Stack>
            {sessionsLoading ? (
              <Typography>Loading sessions...</Typography>
            ) : sessions.length === 0 ? (
              <Typography color="text.secondary">No sessions for this cohort.</Typography>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sessions.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>{s.title || '-'}</TableCell>
                      <TableCell>{s.date || '-'}</TableCell>
                      <TableCell>{s.description || '-'}</TableCell>
                      <TableCell>{s.time || '-'}</TableCell>
                      <TableCell>{s.status || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Box>
        ) : (
          <Typography>Cohort not found.</Typography>
        )}
      </main>
      <Dialog open={sessionModalOpen} onClose={() => setSessionModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add Session to Cohort</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              value={newSession.title}
              onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={newSession.description}
              onChange={(e) => setNewSession({ ...newSession, description: e.target.value })}
              fullWidth
              multiline
              minRows={2}
            />
            <TextField
              label="Date"
              type="date"
              value={newSession.date}
              onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
            <TextField
              label="Time"
              type="time"
              value={newSession.time}
              onChange={(e) => setNewSession({ ...newSession, time: e.target.value })}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSessionModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateSession}>Create</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}


