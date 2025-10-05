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
  Divider,
} from "@mui/material";
import {
  ArrowBack,
  Edit,
  Delete,
  Add,
  PersonAdd,
  PersonRemove,
} from "@mui/icons-material";
import { fireteamService } from "../../../../services/api/fireteam.service";
import { experienceService } from "../../../../services/api/experience.service";
import { clientsService } from "../../../../services/api/clients.service";
import { notificationService } from "../../../../services/api/notification.service";
import { generateFireteamMeetingLink } from "../../../../lib/jitsi.utils";


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
      console.log("Fireteam data:", fireteamData.fireTeam);
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

      

      // Fetch clients for the add member dropdown
      try {
        const clientsResponse = await clientsService.getClients();
        const clientsArray = Array.isArray(clientsResponse?.clients) ? clientsResponse.clients : [];
        const mappedClients = clientsArray.map(client => ({
          id: client.id, // Use the top-level client.id
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

  const handleEdit = () => {
    setShowEdit(true);
  };

  const handleSaveEdit = async () => {
    try {
      await fireteamService.updateFireteam(id, editData);
      setSuccess("Fireteam updated successfully!");
      setShowEdit(false);
      fetchFireteamDetails(); // Refresh data
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
      console.log("Adding member with data:", {
        client_id: selectedClient,
        fire_team_id: id,
      });
      const result = await fireteamService.addFireteamMember({
        client_id: selectedClient,
        fire_team_id: id,
      });
      console.log("Add member result:", result);
      
      // Send notification to the added member
      try {
        await notificationService.sendNotification({
          user_id: selectedClient,
          title: "Added to Fireteam",
          message: `You have been added to the fireteam: ${fireteam?.title || 'Unknown Fireteam'}`,
          type: "fireteam",
          metadata: {
            fireteam_id: id,
          }
        });
        console.log("Notification sent successfully");
      } catch (notifErr) {
        console.error("Error sending notification:", notifErr);
        // Don't fail the whole operation if notification fails
      }
      
      setSuccess("Member added successfully!");
      setShowAddMember(false);
      setSelectedClient("");
      fetchFireteamDetails(); // Refresh data
    } catch (err) {
      console.error("Error adding member:", err);
      console.error("Error details:", err.response?.data);
      setError("Failed to add member");
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (window.confirm("Are you sure you want to remove this member from the fireteam?")) {
      try {
        await fireteamService.deleteFireteamMember(memberId);
        setSuccess("Member removed successfully!");
        fetchFireteamDetails(); // Refresh data
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
      fetchFireteamDetails(); // Refresh data
    } catch (err) {
      setError("Failed to remove member");
    }
  };

  const handleAddExperience = () => {
    setExperienceData({
      title: "",
      experience: "",
    });
    setShowAddExperience(true);
  };

  const handleSaveExperience = async () => {
    try {
      // Generate a unique meeting link for this experience
      // Using fireteam ID, a temporary experience ID (timestamp), and a generic identifier
      const timestamp = Date.now();
      const meetingLink = generateFireteamMeetingLink(
        id,                    // fireteam ID
        `new-${timestamp}`,    // temporary experience ID
        'system',              // generic identifier (not tied to any user)
        fireteam?.title || 'Fireteam Meeting'  // meeting display name
      );
      
      console.log('🔗 [CREATE EXPERIENCE] Generated meeting link:', meetingLink);
      
      await experienceService.addExperience({
        fire_team_id: id,
        ...experienceData,
        link: meetingLink,     // Add the generated meeting link
      });
      setSuccess("Experience added successfully!");
      setShowAddExperience(false);
      fetchFireteamDetails(); // Refresh data
    } catch (err) {
      console.error('Failed to add experience:', err);
      setError("Failed to add experience");
    }
  };

  const handleDeleteExperience = async (id) => {
    if (window.confirm("Are you sure you want to delete this experience?")) {
      try {
        await experienceService.deleteExperience(id);
        setSuccess("Experience deleted successfully!");
        fetchFireteamDetails(); // Refresh data
      } catch (err) {
        setError("Failed to delete experience");
      }
    }
  };


// Add handler for adding an agenda step
const handleAddAgendaStep = async ({ title, duration }) => {
  if (!selectedExperienceToEdit) return;
  try {
    // Ensure title is not empty - API requires it
    const stepTitle = title && typeof title === 'string' && title.trim() 
      ? title 
      : 'New Step';
    
    const requestData = {
      fire_team_experience_id: selectedExperienceToEdit.id,
      title: stepTitle,
      duration: typeof duration === 'string' ? duration : '5 minutes',
    };
    console.log("✅ [ADD AGENDA STEP] Sending request to backend:", requestData);

    const newStep = await experienceService.addAgendaStep(requestData);
    console.log("✅ [ADD AGENDA STEP] Received response from API:", newStep);
    console.log("✅ [ADD AGENDA STEP] Step ID from backend:", newStep.id);

    // Ensure newStep has title/duration as strings
    const safeStep = {
      ...newStep,
      title: typeof newStep.title === 'string' ? newStep.title : stepTitle,
      duration: typeof newStep.duration === 'string' ? newStep.duration : '5 minutes',
    };
    
    console.log("✅ [ADD AGENDA STEP] Successfully saved to backend - Adding to local state:", safeStep);
    
    setEditExperienceData((prev) => ({
      ...prev,
      agenda: [
        ...prev.agenda,
        safeStep,
      ],
    }));

    return safeStep;
  } catch (err) {
    console.error("❌ [ADD AGENDA STEP] Error adding agenda step:", err);
    console.error("❌ [ADD AGENDA STEP] Error response:", err.response?.data);
    setError("Failed to add agenda step");
    throw err; // Re-throw so the caller can handle it
  }
};


  // Exhibit handlers
  const handleAddExhibit = async () => {
    if (!selectedExperienceToEdit) return;
    try {
      // Provide default name - API requires it
      const newExhibit = await experienceService.addExhibit({
        fire_team_experience_id: selectedExperienceToEdit.id,
        name: 'New Exhibit',
        type: 'link',
        link: 'https://',
      });
      setEditExperienceData(prev => ({
        ...prev,
        exhibits: [...prev.exhibits, { ...newExhibit, file: null }],
      }));
    } catch (err) {
      console.error('Error adding exhibit:', err);
      console.error('Error response:', err.response?.data);
      setError('Failed to add exhibit');
      throw err;
    }
  };


  const handleDeleteExhibit = async (exhibitId, idx) => {
    if (!selectedExperienceToEdit) return;
    try {
      if (exhibitId) {
        await experienceService.deleteExhibit(exhibitId);
      }
      setEditExperienceData(prev => ({
        ...prev,
        exhibits: prev.exhibits.filter((_, i) => i !== idx),
      }));
    } catch (err) {
      setError('Failed to delete exhibit');
    }
  };

  // Validation functions
  const validateExperienceData = () => {
    const errors = {};
    
    if (!editExperienceData.title.trim()) {
      errors.title = 'Experience title is required';
    }
    
    if (!editExperienceData.experience.trim()) {
      errors.experience = 'Experience content is required';
    }
    
    // Validate agenda steps
    const invalidAgendaSteps = editExperienceData.agenda.filter(step => 
      !step.title.trim() || !step.duration.trim()
    );
    if (invalidAgendaSteps.length > 0) {
      errors.agenda = 'All agenda steps must have both title and duration';
    }
    
    // Validate exhibits
    const invalidExhibits = editExperienceData.exhibits.filter(exhibit => {
      if (!exhibit.name.trim()) return true;
      if (exhibit.type === 'link' && !exhibit.link.trim()) return true;
      if (exhibit.type !== 'link' && !exhibit.file) return true;
      return false;
    });
    if (invalidExhibits.length > 0) {
      errors.exhibits = 'All exhibits must be properly configured';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const clearValidationErrors = () => {
    setValidationErrors({});
  };


  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <main className="flex-1 p-8 ml-16 md:ml-56">
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
            <Typography>Loading fireteam details...</Typography>
          </Box>
        </main>
      </div>
    );
  }

  if (!fireteam) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <main className="flex-1 p-8 ml-16 md:ml-56">
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
            <Typography color="error">Fireteam not found</Typography>
          </Box>
        </main>
      </div>
    );
  }

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        background: '#f8fafc', // fallback for bg-gray-50
      }}
    >
      <AdminSidebar />
      <main
        className="flex-1 p-8 ml-16 md:ml-56"
        style={{
          height: '100vh',
          overflow: 'hidden', // prevent main from scrolling
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <IconButton onClick={() => router.back()}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {fireteam.title }
            </Typography>
          </Stack>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={handleEdit}
            >
              Edit Fireteam
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={handleDelete}
            >
              Delete Fireteam
            </Button>
          </Stack>
        </Box>
        {/* Content area: make it take all remaining space and scroll only inside tables */}
        <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <Grid container spacing={3} sx={{ flex: 1, minHeight: 0 }}>
          {/* Fireteam Details */}
            <Grid item xs={12} md={8} sx={{ minHeight: 0 }}>
              <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Fireteam Information
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Title
                    </Typography>
                    <Typography variant="body1">
                      {fireteam.title}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Description
                    </Typography>
                    <Typography variant="body1">
                      {fireteam.description}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Cohort
                    </Typography>
                    <Typography variant="body1">
                      {cohort ? (cohort.name || cohort.title || `Cohort ${cohort.id}`) : `Cohort ${fireteam.cohort_id}`}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Date & Time
                    </Typography>
                    <Typography variant="body1">
                      {fireteam.date} {fireteam.time && `at ${fireteam.time}`}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Created
                    </Typography>
                    <Typography variant="body1">
                      {fireteam.created_at ? new Date(fireteam.created_at).toLocaleDateString() : 'N/A'}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Actions */}
            <Grid item xs={12} md={4} sx={{ minHeight: 0 }}>
              <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Quick Actions
                </Typography>
                <Stack spacing={2}>
                  <Button
                    variant="outlined"
                    startIcon={<PersonAdd />}
                    onClick={() => setShowAddMember(true)}
                    fullWidth
                  >
                    Add Member
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<PersonRemove />}
                    onClick={() => setShowRemoveMember(true)}
                    fullWidth
                  >
                    Remove Member
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Members List */}
            <Grid item xs={12} sx={{ minHeight: 0 }}>
              <Card sx={{ height: 300, display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Fireteam Members
                </Typography>
                  <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {members.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          No members found
                        </TableCell>
                      </TableRow>
                    ) : (
                      members.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell>{member.client.user.name}</TableCell>
                          <TableCell>{member.client.user.email}</TableCell>
                          <TableCell>
                            <Chip label={member.role || 'Member'} size="small" />
                          </TableCell>
                          <TableCell>
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleRemoveMember(member.id)}
                            >
                              <PersonRemove />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
                  </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Experiences List */}
            <Grid item xs={12} sx={{ minHeight: 0 }}>
              <Card sx={{ height: 300, display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="h6">
                    Fireteam Experiences
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleAddExperience}
                    size="small"
                  >
                    Add Experience
                  </Button>
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Create learning experiences and discussion sessions for your fireteam members.
                </Typography>
                  <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
                {experiences.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                      No experiences created yet
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<Add />}
                      onClick={handleAddExperience}
                    >
                      Create First Experience
                    </Button>
                  </Box>
                ) : (
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {experiences.map((experience) => (
                            <TableRow
                              key={experience.id}
                              hover
                              style={{ cursor: 'pointer' }}
                              onClick={(e) => {
                                // Prevent navigation if clicking on action buttons
                                if (e.target.closest('.experience-action-btn')) return;
                                console.log("Navigating to experience:", experience);
                                router.push(`/admin/fireteammanagement/${id}/experience/${experience.id}`);
                              }}
                            >
                          <TableCell>{experience.title}</TableCell>
                          <TableCell>{experience.experience}</TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1}>
                              <Button
                                size="small"
                                variant="contained"
                                startIcon={<Edit />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  router.push(`/admin/fireteammanagement/${id}/experience/${experience.id}`);
                                }}
                                className="experience-action-btn"
                              >
                                View Experience
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteExperience(experience.id);
                                }}
                                className="experience-action-btn"
                              >
                                Delete
                              </Button>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
                  </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        </Box>

        {/* Edit Dialog */}
        <Dialog open={showEdit} onClose={() => setShowEdit(false)} fullWidth maxWidth="sm">
          <DialogTitle>Edit Fireteam</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Title"
                value={editData.title}
                onChange={(e) => setEditData({...editData, title: e.target.value})}
                fullWidth
              />
              <TextField
                label="Description"
                value={editData.description}
                onChange={(e) => setEditData({...editData, description: e.target.value})}
                fullWidth
                multiline
                rows={3}
              />
              <TextField
                label="Date"
                type="date"
                value={editData.date}
                onChange={(e) => setEditData({...editData, date: e.target.value})}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                label="Time"
                type="time"
                value={editData.time}
                onChange={(e) => setEditData({...editData, time: e.target.value})}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowEdit(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSaveEdit}>Save</Button>
          </DialogActions>
        </Dialog>

        {/* Add Member Dialog */}
        <Dialog open={showAddMember} onClose={() => setShowAddMember(false)} fullWidth maxWidth="sm">
          <DialogTitle>Add Member to Fireteam</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <FormControl fullWidth>
                <InputLabel>Select Client</InputLabel>
                <Select
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                  label="Select Client"
                >
                  {clients.map((client) => (
                    <MenuItem key={client.id} value={client.id}>
                      {client.name} ({client.email})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowAddMember(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleAddMember}>Add Member</Button>
          </DialogActions>
        </Dialog>

        {/* Remove Member Dialog */}
        <Dialog open={showRemoveMember} onClose={() => setShowRemoveMember(false)} fullWidth maxWidth="sm">
          <DialogTitle>Remove Member from Fireteam</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <FormControl fullWidth>
                <InputLabel>Select Member to Remove</InputLabel>
                <Select
                  value={selectedMemberToRemove}
                  onChange={(e) => setSelectedMemberToRemove(e.target.value)}
                  label="Select Member to Remove"
                >
                  {members.map((member) => (
                    <MenuItem key={member.id} value={member.id}>
                      {member.name} ({member.email})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowRemoveMember(false)}>Cancel</Button>
            <Button 
              variant="contained" 
              color="error" 
              onClick={handleRemoveMemberFromDialog}
              disabled={!selectedMemberToRemove}
            >
              Remove Member
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Experience Dialog */}
        <Dialog open={showAddExperience} onClose={() => setShowAddExperience(false)} fullWidth maxWidth="sm">
          <DialogTitle>Add New Experience</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField
                label="Experience Title"
                value={experienceData.title}
                onChange={(e) => setExperienceData({...experienceData, title: e.target.value})}
                fullWidth
                required
                placeholder="e.g., Leadership in Crisis Management"
                helperText="Enter a descriptive title for this experience"
              />
              <TextField
                label="Experience Content"
                value={experienceData.experience}
                onChange={(e) => setExperienceData({...experienceData, experience: e.target.value})}
                fullWidth
                multiline
                rows={4}
                required
                placeholder="Describe the experience content, learning objectives, and what participants will gain..."
                helperText="Provide the detailed content and description of the experience"
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowAddExperience(false)}>Cancel</Button>
            <Button 
              variant="contained" 
              onClick={handleSaveExperience}
              disabled={!experienceData.title.trim() || !experienceData.experience.trim()}
            >
              Create Experience
            </Button>
          </DialogActions>
        </Dialog>

        {/* Success/Error Snackbars */}
        <Snackbar open={!!success} autoHideDuration={3000} onClose={() => setSuccess("")}>
          <Alert onClose={() => setSuccess("")} severity="success" sx={{ width: '100%' }}>
            {success}
          </Alert>
        </Snackbar>
        <Snackbar open={!!error} autoHideDuration={3000} onClose={() => setError("")}>
          <Alert onClose={() => setError("")} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      </main>
    </div>
  );
}
