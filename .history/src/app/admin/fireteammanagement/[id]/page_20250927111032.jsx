"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminSidebar from "../../../../../components/dashboardcomponents/adminsidebar";
import {
  Box,
  Typography,
  Button,
  Stack,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
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
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import {
  ArrowBack,
  Edit,
  Delete,
  Add,
  PersonAdd,
  PersonRemove,
  VideoCall,
} from "@mui/icons-material";
import { fireteamService } from "../../../../services/api/fireteam.service";
import { experienceService } from "../../../../services/api/experience.service";
import { clientsService } from "../../../../services/api/clients.service";
import { generateFireteamMeetingLink } from "../../../../lib/jitsi.utils";
import ExperienceVideoModal from "../../../../../components/ExperienceVideoModal";

export default function FireteamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [fireteam, setFireteam] = useState(null);
  const [cohort, setCohort] = useState(null);
  const [members, setMembers] = useState([]);
  const [clients, setClients] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showRemoveMember, setShowRemoveMember] = useState(false);
  const [showAddExperience, setShowAddExperience] = useState(false);
  const [showVideoMeeting, setShowVideoMeeting] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedMemberToRemove, setSelectedMemberToRemove] = useState("");
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    cohort_id: "",
  });
  const [experienceData, setExperienceData] = useState({
    title: "",
    experience: "",
  });
  const [showEditExperience, setShowEditExperience] = useState(false);
  const [selectedExperienceToEdit, setSelectedExperienceToEdit] = useState(null);
  const [editExperienceData, setEditExperienceData] = useState({
    title: '',
    experience: '',
    agenda: [{ title: '', duration: '' }],
    exhibits: [{ name: '', type: 'link', link: '', file: null }],
    videoAdminId: '',
    meetingLink: '',
  });

  useEffect(() => {
    if (id) {
      fetchFireteamDetails();
    }
  }, [id]);

  const fetchFireteamDetails = async () => {
    setLoading(true);
    try {
      const fireteamData = await fireteamService.getFireteam(id);
      const fireTeam = fireteamData.fireTeam;
      setFireteam(fireTeam);
      setMembers(Array.isArray(fireTeam.members) ? fireTeam.members : []);
      setExperiences(Array.isArray(fireTeam.experiences) ? fireTeam.experiences : []);
      setCohort(fireTeam.cohort);
      setEditData({
        title: fireTeam.title || "",
        description: fireTeam.description || "",
        date: fireTeam.date || "",
        time: fireTeam.time || "",
        cohort_id: fireTeam.cohort_id || "",
      });

      try {
        const clientsResponse = await clientsService.getClients();
        const clientsArray = Array.isArray(clientsResponse?.clients) ? clientsResponse.clients : [];
        const mappedClients = clientsArray.map(client => ({
          id: client.id,
          name: client.user?.name || 'Unknown',
          email: client.user?.email || ''
        }));
        setClients(mappedClients);
      } catch (err) {
        console.error("Error fetching clients:", err);
        setClients([]);
      }

    } catch (err) {
      console.error("Error fetching fireteam:", err);
      setError("Failed to load fireteam details");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => setShowEdit(true);

  const handleSaveEdit = async () => {
    try {
      await fireteamService.updateFireteam(id, editData);
      setSuccess("Fireteam updated successfully!");
      setShowEdit(false);
      fetchFireteamDetails();
    } catch (err) {
      setError("Failed to update fireteam");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this fireteam?")) {
      try {
        await fireteamService.deleteFireteam(id);
        setSuccess("Fireteam deleted successfully!");
        router.push("/admin/fireteammanagement");
      } catch (err) {
        setError("Failed to delete fireteam");
      }
    }
  };

  const handleAddMember = async () => {
    if (!selectedClient) return;
    try {
      await fireteamService.addFireteamMember({ client_id: selectedClient, fire_team_id: id });
      setSuccess("Member added successfully!");
      setShowAddMember(false);
      setSelectedClient("");
      fetchFireteamDetails();
    } catch (err) {
      console.error("Error adding member:", err);
      setError("Failed to add member");
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (window.confirm("Are you sure you want to remove this member from the fireteam?")) {
      try {
        await fireteamService.deleteFireteamMember(memberId);
        setSuccess("Member removed successfully!");
        fetchFireteamDetails();
      } catch (err) {
        setError("Failed to remove member");
      }
    }
  };

  const handleRemoveMemberFromDialog = async () => {
    if (!selectedMemberToRemove) return;
    try {
      await fireteamService.deleteFireteamMember(selectedMemberToRemove);
      setSuccess("Member removed successfully!");
      setShowRemoveMember(false);
      setSelectedMemberToRemove("");
      fetchFireteamDetails();
    } catch (err) {
      setError("Failed to remove member");
    }
  };

  const handleAddExperience = () => {
    setExperienceData({ title: "", experience: "" });
    setShowAddExperience(true);
  };

  const handleSaveExperience = async () => {
    try {
      await experienceService.addExperience({ fire_team_id: id, ...experienceData });
      setSuccess("Experience added successfully!");
      setShowAddExperience(false);
      fetchFireteamDetails();
    } catch (err) {
      setError("Failed to add experience");
    }
  };

  const handleDeleteExperience = async (experienceId) => {
    if (window.confirm("Are you sure you want to delete this experience?")) {
      try {
        await experienceService.deleteExperience(experienceId);
        setSuccess("Experience deleted successfully!");
        fetchFireteamDetails();
      } catch (err) {
        setError("Failed to delete experience");
      }
    }
  };

  const handleStartExperience = async (experienceId) => {
    try {
      const experience = experiences.find(exp => exp.id === experienceId);
      if (!experience) return setError("Experience not found");
      await experienceService.startExperience(experienceId);
      setSelectedExperience(experience);
      setShowVideoMeeting(true);
      setSuccess("Experience started successfully!");
    } catch (err) {
      setError("Failed to start experience");
    }
  };

  const handleCloseVideoMeeting = () => {
    setShowVideoMeeting(false);
    if (selectedExperience) {
      experienceService.endExperience(selectedExperience.id).catch(console.error);
    }
    setSelectedExperience(null);
  };

  // Agenda and Exhibit handlers
  const handleAddAgendaStep = async () => {
    if (!selectedExperienceToEdit) return;
    const newStep = { title: '', duration: '' };
    setEditExperienceData(prev => ({ ...prev, agenda: [...prev.agenda, newStep] }));
  };

  const handleDeleteAgendaStep = (idx) => {
    setEditExperienceData(prev => ({
      ...prev,
      agenda: prev.agenda.filter((_, i) => i !== idx),
    }));
  };

  const handleAddExhibit = () => {
    const newExhibit = { name: '', type: 'link', link: '', file: null };
    setEditExperienceData(prev => ({ ...prev, exhibits: [...prev.exhibits, newExhibit] }));
  };

  const handleDeleteExhibit = (idx) => {
    setEditExperienceData(prev => ({
      ...prev,
      exhibits: prev.exhibits.filter((_, i) => i !== idx),
    }));
  };

  if (loading) return <Box sx={{ p: 4 }}>Loading...</Box>;
  if (!fireteam) return <Box sx={{ p: 4 }}>Fireteam not found</Box>;

  return (
    <div className="flex w-full h-full">
      <AdminSidebar />
      <Box sx={{ flexGrow: 1, p: 4 }}>
        <Button startIcon={<ArrowBack />} onClick={() => router.push("/admin/fireteammanagement")}>
          Back
        </Button>

        <Typography variant="h4" sx={{ mb: 2 }}>{fireteam.title}</Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>{fireteam.description}</Typography>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Button variant="contained" onClick={handleEdit}>Edit</Button>
          <Button variant="outlined" color="error" onClick={handleDelete}>Delete</Button>
          <Button variant="contained" onClick={handleAddMember} startIcon={<PersonAdd />}>Add Member</Button>
          <Button variant="outlined" onClick={() => setShowRemoveMember(true)} startIcon={<PersonRemove />}>Remove Member</Button>
        </Stack>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Members</Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {members.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>{member.client?.user?.name || "Unknown"}</TableCell>
                        <TableCell>{member.client?.user?.email || "Unknown"}</TableCell>
                        <TableCell><Chip label={member.role || 'Member'} size="small" /></TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleRemoveMember(member.id)} color="error">
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6">Experiences</Typography>
                  <Button variant="outlined" size="small" onClick={handleAddExperience}>Add</Button>
                </Stack>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {experiences.map((exp) => (
                      <TableRow key={exp.id}>
                        <TableCell>{exp.title}</TableCell>
                        <TableCell>{exp.experience}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleStartExperience(exp.id)} color="primary">
                            <VideoCall />
                          </IconButton>
                          <IconButton onClick={() => { setSelectedExperienceToEdit(exp); setShowEditExperience(true); }}>
                            <Edit />
                          </IconButton>
                          <IconButton onClick={() => handleDeleteExperience(exp.id)} color="error">
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Add Member Dialog */}
        <Dialog open={showAddMember} onClose={() => setShowAddMember(false)}>
          <DialogTitle>Add Member</DialogTitle>
          <DialogContent>
            <FormControl fullWidth>
              <InputLabel>Client</InputLabel>
              <Select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
              >
                {clients.map((client) => (
                  <MenuItem key={client.id} value={client.id}>
                    {client.name} ({client.email})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowAddMember(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleAddMember}>Add</Button>
          </DialogActions>
        </Dialog>

        {/* Remove Member Dialog */}
        <Dialog open={showRemoveMember} onClose={() => setShowRemoveMember(false)}>
          <DialogTitle>Remove Member</DialogTitle>
          <DialogContent>
            <FormControl fullWidth>
              <InputLabel>Member</InputLabel>
              <Select
                value={selectedMemberToRemove}
                onChange={(e) => setSelectedMemberToRemove(e.target.value)}
              >
                {members.map((member) => (
                  <MenuItem key={member.id} value={member.id}>
                    {member.client?.user?.name || 'Unknown'} ({member.client?.user?.email || 'Unknown'})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowRemoveMember(false)}>Cancel</Button>
            <Button variant="contained" color="error" onClick={handleRemoveMemberFromDialog}>
              Remove
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Experience Dialog */}
        <Dialog open={showAddExperience} onClose={() => setShowAddExperience(false)}>
          <DialogTitle>Add Experience</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Title"
              margin="normal"
              value={experienceData.title}
              onChange={(e) => setExperienceData(prev => ({ ...prev, title: e.target.value }))}
            />
            <TextField
              fullWidth
              label="Description"
              margin="normal"
              multiline
              rows={4}
              value={experienceData.experience}
              onChange={(e) => setExperienceData(prev => ({ ...prev, experience: e.target.value }))}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowAddExperience(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSaveExperience}>Save</Button>
          </DialogActions>
        </Dialog>

        {/* Video Meeting Modal */}
        {selectedExperience && showVideoMeeting && (
          <ExperienceVideoModal
            open={showVideoMeeting}
            onClose={handleCloseVideoMeeting}
            experience={selectedExperience}
          />
        )}

        <Snackbar
          open={!!success}
          autoHideDuration={4000}
          onClose={() => setSuccess("")}
        >
          <Alert severity="success">{success}</Alert>
        </Snackbar>
        <Snackbar
          open={!!error}
          autoHideDuration={4000}
          onClose={() => setError("")}
        >
          <Alert severity="error">{error}</Alert>
        </Snackbar>
      </Box>
    </div>
  );
}
