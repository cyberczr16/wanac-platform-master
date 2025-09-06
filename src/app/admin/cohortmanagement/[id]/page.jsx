"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminSidebar from "../../../../../components/dashboardcomponents/adminsidebar";
import { Box, Typography, Button, Stack, Chip, Table, TableHead, TableBody, TableRow, TableCell, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Divider } from "@mui/material";
import { cohortService } from "../../../../services/api/cohort.service";
import { sessionsService } from "../../../../services/api/sessions.service";
import { clientsService } from "../../../../services/api/clients.service";
import Autocomplete from "@mui/material/Autocomplete";

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
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [newMember, setNewMember] = useState({ user_id: '' });
  const [addingMember, setAddingMember] = useState(false);
  const [memberError, setMemberError] = useState(null);
  const [memberSuccess, setMemberSuccess] = useState(null);
  const [userOptions, setUserOptions] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [userLoading, setUserLoading] = useState(false);
  const [membersWithDetails, setMembersWithDetails] = useState([]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await cohortService.getCohorts();
        const list = Array.isArray(data) ? data : (Array.isArray(data?.cohorts) ? data.cohorts : []);
        const found = list.find(c => String(c.id) === String(cohortId));
        setCohort(found || null);
        
        // Fetch member details if cohort is found
        if (found) {
          await loadMemberDetails(found);
        }
      } catch (e) {
        setError("Failed to load cohort");
      } finally {
        setLoading(false);
      }
    }
    if (cohortId) load();
  }, [cohortId]);

  const loadMemberDetails = async (cohortData) => {
    try {
      const clientIds = cohortData.clients || [];
      const coachIds = cohortData.coaches || [];
      
      console.log('Cohort data:', cohortData);
      console.log('Client IDs:', clientIds);
      console.log('Coach IDs:', coachIds);
      
      // Fetch all clients and coaches
      const [clientsResponse, coachesResponse] = await Promise.all([
        clientsService.getClients(),
        cohortService.getCoaches()
      ]);
      
      const allClients = Array.isArray(clientsResponse?.clients) ? clientsResponse.clients : [];
      const allCoaches = Array.isArray(coachesResponse?.coaches?.data) ? coachesResponse.coaches.data : [];
      
      console.log('All clients:', allClients);
      console.log('All coaches:', allCoaches);
      console.log('Looking for client IDs:', clientIds);
      
      // Debug: Check if any clients match the IDs we're looking for
      const matchingClients = allClients.filter(client => clientIds.includes(client.user_id));
      console.log('Matching clients found:', matchingClients);
      
      // Map IDs to full objects
      const clientMembers = allClients
        .filter(client => clientIds.includes(client.user_id))
        .map(client => ({
          type: 'Client',
          id: client.user_id,
          name: client.user?.name || 'Unknown',
          email: client.user?.email || 'No email'
        }));
      
      const coachMembers = allCoaches
        .filter(coach => coachIds.includes(coach.user_id))
        .map(coach => ({
          type: 'Coach',
          id: coach.user_id,
          name: coach.user?.name || 'Unknown',
          email: coach.user?.email || 'No email'
        }));
      
      console.log('Client members found:', clientMembers);
      console.log('Coach members found:', coachMembers);
      
      const allMembers = [...clientMembers, ...coachMembers];
      console.log('All members to display:', allMembers);
      console.log('Setting members with details:', allMembers);
      
      setMembersWithDetails(allMembers);
    } catch (e) {
      console.error('Failed to load member details:', e);
      setMembersWithDetails([]);
    }
  };

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
            <Button variant="contained" sx={{ mb: 2 }} onClick={() => {
              setAddMemberOpen(true);
              setMemberError(null);
              setMemberSuccess(null);
            }}>Add Member</Button>
            {memberSuccess && (
              <Typography color="success" sx={{ color: 'green', mb: 2 }}>
                {memberSuccess}
              </Typography>
            )}
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {membersWithDetails.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">No members found</TableCell>
                  </TableRow>
                ) : (
                  membersWithDetails.map((member, index) => (
                    <TableRow key={`${member.type}-${member.id}-${index}`}>
                      <TableCell>{member.type}</TableCell>
                      <TableCell>{member.name}</TableCell>
                      <TableCell>{member.email}</TableCell>
                    </TableRow>
                  ))
                )}
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
      <Dialog open={addMemberOpen} onClose={() => setAddMemberOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Add Client to Cohort</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Autocomplete
              options={userOptions}
              getOptionLabel={option => option.user?.name + (option.user?.email ? ` (${option.user.email})` : "")}
              loading={userLoading}
              onInputChange={async (e, value) => {
                setUserSearch(value);
                if (value.length < 2) {
                  setUserOptions([]);
                  return;
                }
                setUserLoading(true);
                try {
                  const response = await clientsService.getClients();
                  const clients = Array.isArray(response?.clients) ? response.clients : [];
                  const results = clients.filter(client =>
                    (client.user?.name && client.user.name.toLowerCase().includes(value.toLowerCase())) ||
                    (client.user?.email && client.user.email.toLowerCase().includes(value.toLowerCase()))
                  );
                  setUserOptions(results);
                } catch {
                  setUserOptions([]);
                } finally {
                  setUserLoading(false);
                }
              }}
              onChange={(e, value) => {
                setNewMember({ user_id: value ? value.user_id : "" });
              }}
              renderInput={params => (
                <TextField {...params} label="Search client by name or email" fullWidth required />
              )}
            />
            {memberError && <Typography color="error">{memberError}</Typography>}
            {memberSuccess && <Typography color="success" sx={{ color: 'green' }}>{memberSuccess}</Typography>}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setAddMemberOpen(false);
            setMemberError(null);
            setMemberSuccess(null);
          }}>Cancel</Button>
          <Button variant="contained" disabled={addingMember || !newMember.user_id} onClick={async () => {
            setAddingMember(true);
            setMemberError(null);
            try {
              const payload = {
                cohort_id: parseInt(cohortId),
                member_id: parseInt(newMember.user_id),
                role: 'client',
              };
              console.log('Sending payload:', payload);
              const response = await cohortService.addCohortMember(payload);
              console.log('Add member response:', response);
              
              setMemberSuccess('Member added successfully!');
              setMemberError(null);
              
              setAddMemberOpen(false);
              setNewMember({ user_id: '' });
              setUserOptions([]);
              setUserSearch("");
              
              // Update cohort data locally by adding the new member
              if (cohort) {
                const updatedCohort = {
                  ...cohort,
                  clients: [...(cohort.clients || []), parseInt(newMember.user_id)]
                };
                setCohort(updatedCohort);
                
                // Reload member details with updated cohort
                await loadMemberDetails(updatedCohort);
              }
              
              // Clear success message after 3 seconds
              setTimeout(() => setMemberSuccess(null), 3000);
            } catch (e) {
              setMemberError('Failed to add member');
              setMemberSuccess(null);
            } finally {
              setAddingMember(false);
            }
          }}>Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}


