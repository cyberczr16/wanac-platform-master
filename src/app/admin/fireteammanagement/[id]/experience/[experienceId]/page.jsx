"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminSidebar from "../../../../../../../components/dashboardcomponents/adminsidebar";
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
  Snackbar,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  Link as MuiLink,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  ArrowBack,
  Edit,
  Delete,
  Schedule,
  VideoCall,
  Description,
  Link as LinkIcon,
  Image,
  VideoLibrary,
  AttachFile,
  Add,
  Person,
  Save,
} from "@mui/icons-material";
import { fireteamService } from "../../../../../../services/api/fireteam.service";
import { experienceService } from "../../../../../../services/api/experience.service";
import { generateFireteamMeetingLink } from "../../../../../../lib/jitsi.utils";
import EditExperienceModal from "../../../../../../../components/EditExperienceModal";

export default function ExperienceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id: fireteamId, experienceId } = params;
  
  const [experience, setExperience] = useState(null);
  const [fireteam, setFireteam] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editExperienceData, setEditExperienceData] = useState({
    title: '',
    experience: '',
    agenda: [],
    exhibits: [],
    videoAdminId: '',
    link: '',
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [showAddAgendaDialog, setShowAddAgendaDialog] = useState(false);
  const [newAgendaStep, setNewAgendaStep] = useState({
    title: '',
    duration: '',
  });
  const [showAddExhibitDialog, setShowAddExhibitDialog] = useState(false);
  const [newExhibit, setNewExhibit] = useState({
    name: '',
    type: 'link',
    link: '',
  });
  const [selectedVideoAdminId, setSelectedVideoAdminId] = useState('');
  const [isUpdatingVideoAdmin, setIsUpdatingVideoAdmin] = useState(false);

  useEffect(() => {
    if (fireteamId && experienceId) {
      fetchExperienceDetails();
    }
  }, [fireteamId, experienceId]);

  // Set initial video admin when experience loads
  useEffect(() => {
    if (experience && experience.videoAdminId) {
      setSelectedVideoAdminId(experience.videoAdminId.toString());
    }
  }, [experience]);

  // Update modal data whenever experience changes
  useEffect(() => {
    if (experience && showEditModal) {
      const agendaSource = experience.agenda || experience.agenda_steps || [];
      const agendaData = Array.isArray(agendaSource) && agendaSource.length > 0
        ? agendaSource.map(step => ({
            ...step,
            title: typeof step.title === 'string' ? step.title : '',
            duration: typeof step.duration === 'string' ? step.duration : '',
          }))
        : [];
      
      const exhibitsData = experience.exhibits && Array.isArray(experience.exhibits) && experience.exhibits.length > 0
        ? experience.exhibits.map(ex => ({ ...ex, file: null }))
        : [];
      
      console.log("Syncing modal data with experience:", { agendaData, exhibitsData });
      
      setEditExperienceData(prev => ({
        ...prev,
        agenda: agendaData,
        exhibits: exhibitsData,
      }));
    }
  }, [experience, showEditModal]);

  const fetchExperienceDetails = async () => {
    setLoading(true);
    try {
      // Fetch fireteam data (includes experiences)
      const fireteamData = await fireteamService.getFireteam(fireteamId);
      const fireTeam = fireteamData.fireTeam;
      setFireteam(fireTeam);
      setMembers(Array.isArray(fireTeam.members) ? fireTeam.members : []);

      // Find the specific experience
      const experiences = Array.isArray(fireTeam.experiences) ? fireTeam.experiences : [];
      const currentExperience = experiences.find(exp => exp.id === parseInt(experienceId));
      
      if (currentExperience) {
        console.log("Experience details:", currentExperience);
        
        // Normalize the field names - API might return agenda_steps or agenda
        const normalizedExperience = {
          ...currentExperience,
          agenda: currentExperience.agenda || currentExperience.agenda_steps || [],
          exhibits: currentExperience.exhibits || [],
        };
        
        console.log("Normalized experience:", normalizedExperience);
        setExperience(normalizedExperience);
      } else {
        setError("Experience not found");
      }
    } catch (err) {
      console.error("Error fetching experience:", err);
      setError("Failed to load experience details");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (!experience) return;
    
    // Handle both agenda and agenda_steps field names
    const agendaSource = experience.agenda || experience.agenda_steps || [];
    const agendaData = Array.isArray(agendaSource) && agendaSource.length > 0
      ? agendaSource.map(step => ({
          ...step,
          title: typeof step.title === 'string' ? step.title : '',
          duration: typeof step.duration === 'string' ? step.duration : '',
        }))
      : [];
    
    const exhibitsData = experience.exhibits && Array.isArray(experience.exhibits) && experience.exhibits.length > 0
      ? experience.exhibits.map(ex => ({ ...ex, file: null }))
      : [];
    
    console.log("Opening edit modal with agenda:", agendaData);
    console.log("Opening edit modal with exhibits:", exhibitsData);
    
    setEditExperienceData({
      title: experience.title || '',
      experience: experience.experience || '',
      agenda: agendaData,
      exhibits: exhibitsData,
      videoAdminId: experience.videoAdminId || '',
      link: experience.link || '',
    });
    setShowEditModal(true);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this experience?")) {
      try {
        await experienceService.deleteExperience(experienceId);
        setSuccess("Experience deleted successfully!");
        setTimeout(() => {
          router.push(`/admin/fireteammanagement/${fireteamId}`);
        }, 1000);
      } catch (err) {
        setError("Failed to delete experience");
      }
    }
  };

  const handleAddAgendaStep = async ({ title, duration }) => {
    if (!experience) return;
    try {
      const stepTitle = title && typeof title === 'string' && title.trim() 
        ? title 
        : 'New Step';
      
      const requestData = {
        fire_team_experience_id: experience.id,
        title: stepTitle,
        duration: typeof duration === 'string' ? duration : '5 minutes',
      };

      console.log("✅ [ADD AGENDA STEP] Sending request to backend:", requestData);
      const newStep = await experienceService.addAgendaStep(requestData);
      console.log("✅ [ADD AGENDA STEP] Received response from API:", newStep);
      console.log("✅ [ADD AGENDA STEP] Step ID from backend:", newStep.id);
      
      const safeStep = {
        ...newStep,
        title: typeof newStep.title === 'string' ? newStep.title : stepTitle,
        duration: typeof newStep.duration === 'string' ? newStep.duration : '5 minutes',
      };
      
      console.log("✅ [ADD AGENDA STEP] Successfully saved to backend - Adding to local state:", safeStep);
      
      setEditExperienceData((prev) => ({
        ...prev,
        agenda: [...prev.agenda, safeStep],
      }));

      // REMOVED: fetchExperienceDetails() - This was causing the page refresh
      // The new step is already added to local state with the correct ID from the backend

      return safeStep;
    } catch (err) {
      console.error("❌ [ADD AGENDA STEP] Error adding agenda step:", err);
      console.error("❌ [ADD AGENDA STEP] Error response:", err.response?.data);
      setError("Failed to add agenda step");
      throw err;
    }
  };

  const handleAddExhibit = async () => {
    if (!experience) return;
    try {
      const newExhibit = await experienceService.addExhibit({
        fire_team_experience_id: experience.id,
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
      setError('Failed to add exhibit');
      throw err;
    }
  };

  const handleSubmitAgendaStep = async () => {
    if (!newAgendaStep.title.trim()) {
      setError('Agenda step title is required');
      return;
    }
    
    try {
      const requestData = {
        fire_team_experience_id: experience.id,
        title: newAgendaStep.title,
        duration: newAgendaStep.duration || '5 minutes',
      };

      console.log("Adding agenda step:", requestData);
      await experienceService.addAgendaStep(requestData);
      
      setSuccess('Agenda step added successfully!');
      setShowAddAgendaDialog(false);
      setNewAgendaStep({ title: '', duration: '' });
      
      // Refresh experience details to show the new step
      await fetchExperienceDetails();
    } catch (err) {
      console.error('Error adding agenda step:', err);
      setError('Failed to add agenda step');
    }
  };

  const handleSubmitExhibit = async () => {
    if (!newExhibit.name.trim()) {
      setError('Exhibit name is required');
      return;
    }
    
    if (newExhibit.type === 'link' && !newExhibit.link.trim()) {
      setError('Link is required for link-type exhibits');
      return;
    }
    
    try {
      const requestData = {
        fire_team_experience_id: experience.id,
        name: newExhibit.name,
        type: newExhibit.type,
        ...(newExhibit.type === 'link' && { link: newExhibit.link }),
      };

      console.log("Adding exhibit:", requestData);
      await experienceService.addExhibit(requestData);
      
      setSuccess('Exhibit added successfully!');
      setShowAddExhibitDialog(false);
      setNewExhibit({ name: '', type: 'link', link: '' });
      
      // Refresh experience details to show the new exhibit
      await fetchExperienceDetails();
    } catch (err) {
      console.error('Error adding exhibit:', err);
      setError('Failed to add exhibit');
    }
  };

  const handleUpdateVideoAdmin = async () => {
    if (!selectedVideoAdminId) {
      setError('Please select a video admin');
      return;
    }

    setIsUpdatingVideoAdmin(true);
    try {
      console.log('🎯 [VIDEO ADMIN UPDATE] Selected meeting facilitator ID:', selectedVideoAdminId);
      console.log('🎯 [VIDEO ADMIN UPDATE] Selected meeting facilitator type:', typeof selectedVideoAdminId);
      
      const updateData = {
        title: experience.title,
        experience: experience.experience,
        // NOTE: This is the MEETING CHAIR/FACILITATOR, not the system admin
        // added_by should remain unchanged (tracks who created the experience)
        // admin/videoAdminId tracks who will CHAIR/HOST the meeting
        videoAdminId: selectedVideoAdminId,
        admin: selectedVideoAdminId,
        video_admin_id: selectedVideoAdminId,
        // DO NOT send added_by - that should remain as the creator
      };
      
      console.log('🎯 [VIDEO ADMIN UPDATE] Sending data:', updateData);
      console.log('🎯 [VIDEO ADMIN UPDATE] NOTE: This sets the MEETING FACILITATOR, not system admin');
      
      const result = await experienceService.updateExperience(experience.id, updateData);
      console.log('🎯 [VIDEO ADMIN UPDATE] Backend response:', result);
      
      if (result.fireTeamExperience?.admin === null) {
        console.error('⚠️ [VIDEO ADMIN UPDATE] Backend did not update admin field!');
        console.error('⚠️ [VIDEO ADMIN UPDATE] This requires backend API modification to accept the admin field');
        setError('Backend does not support setting meeting facilitator. Please contact backend team.');
      } else {
        setSuccess('Meeting facilitator updated successfully!');
      }
      
      await fetchExperienceDetails();
    } catch (err) {
      console.error('❌ [VIDEO ADMIN UPDATE] Error updating meeting facilitator:', err);
      console.error('❌ [VIDEO ADMIN UPDATE] Error response:', err.response?.data);
      setError('Failed to update meeting facilitator');
    } finally {
      setIsUpdatingVideoAdmin(false);
    }
  };

  const validateExperienceData = () => {
    const errors = {};
    
    if (!editExperienceData.title.trim()) {
      errors.title = 'Experience title is required';
    }
    
    if (!editExperienceData.experience.trim()) {
      errors.experience = 'Experience content is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const clearValidationErrors = () => {
    setValidationErrors({});
  };

  const getExhibitIcon = (type) => {
    switch(type) {
      case 'image': return <Image />;
      case 'video': return <VideoLibrary />;
      case 'document': return <Description />;
      case 'link': return <LinkIcon />;
      default: return <AttachFile />;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#faf9f7]">
        <AdminSidebar />
        <main className="flex-1 p-8 ml-16 md:ml-56">
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
            <Typography>Loading experience details...</Typography>
          </Box>
        </main>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="flex min-h-screen bg-[#faf9f7]">
        <AdminSidebar />
        <main className="flex-1 p-8 ml-16 md:ml-56">
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
            <Typography color="error">Experience not found</Typography>
          </Box>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#faf9f7]">
      <AdminSidebar />
      <main className="flex-1 ml-16 md:ml-56 overflow-hidden">
        {/* Compact Header with Actions */}
        <Box sx={{ 
          background: '#002147',
          color: 'white',
          p: 2,
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <IconButton 
              onClick={() => router.push(`/admin/fireteammanagement/${fireteamId}`)}
              sx={{ color: 'white' }}
            >
              <ArrowBack />
            </IconButton>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                {experience.title}
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
              {fireteam && (
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {fireteam.title}
                </Typography>
              )}
                {experience.status && (
                  <Chip 
                    label={experience.status} 
                    size="small"
                    sx={{ 
                      bgcolor: experience.status === 'completed' ? 'rgba(76, 175, 80, 0.3)' : 'rgba(255,255,255,0.2)',
                      color: 'white',
                      fontWeight: 600
                    }}
                  />
                )}
              </Stack>
            </Box>
            <Button
              variant="contained"
              size="small"
              startIcon={<Edit />}
              onClick={handleEdit}
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Delete />}
              onClick={handleDelete}
              sx={{ 
                borderColor: 'rgba(255,255,255,0.5)', 
                color: 'white',
                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
              }}
            >
              Delete
            </Button>
          </Stack>
        </Box>

        {/* Main Content Grid - Compact Layout */}
        <Box sx={{ height: 'calc(100vh - 130px)', overflow: 'auto', p: 2 }}>
          <Grid container spacing={2}>
            {/* Left Column - Primary Content */}
            <Grid item xs={12} lg={8}>
              <Grid container spacing={2}>
          {/* Experience Content */}
                <Grid item xs={12}>
                  <Card sx={{ 
                    borderLeft: '4px solid #002147',
                    height: '100%',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                  }}>
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: '#002147' }}>
                       Experience Content
                </Typography>
                      <Box sx={{ maxHeight: '150px', overflow: 'auto', mb: 1 }}>
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                  {experience.experience}
                </Typography>
                      </Box>
                      
                      {/* Compact Summary & Report */}
                      {(experience.summary || experience.report) && (
                        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                          {experience.summary && (
                            <Box sx={{ flex: 1, p: 1.5, bgcolor: '#e6f2ff', borderRadius: 1 }}>
                              <Typography variant="caption" sx={{ fontWeight: 600, color: '#002147', display: 'block', mb: 0.5 }}>
                                Summary
                              </Typography>
                              <Typography variant="caption" sx={{ display: 'block', maxHeight: '60px', overflow: 'auto' }}>
                                {experience.summary}
                              </Typography>
                            </Box>
                          )}
                          {experience.report && (
                            <Box sx={{ flex: 1, p: 1.5, bgcolor: '#fff5f0', borderRadius: 1 }}>
                              <Typography variant="caption" sx={{ fontWeight: 600, color: '#ff5e1a', display: 'block', mb: 0.5 }}>
                                Report
                              </Typography>
                              <Typography variant="caption" sx={{ display: 'block', maxHeight: '60px', overflow: 'auto' }}>
                                {experience.report}
                              </Typography>
                            </Box>
                          )}
                        </Stack>
                      )}
                      
                      {/* Links Row */}
                      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                        {experience.link && (
                          <Button
                            size="small"
                            variant="contained"
                            startIcon={<VideoCall />}
                            onClick={() => {
                              // Navigate to client experience page with admin privileges
                              const clientUrl = `/client/fireteam/experience/${experienceId}?id=${experienceId}&fireteamId=${fireteamId}&link=${encodeURIComponent(experience.link)}&admin=true`;
                              router.push(clientUrl);
                            }}
                            sx={{ fontSize: '0.75rem' }}
                          >
                            Join Meeting as Admin
                          </Button>
                        )}
                      </Stack>
              </CardContent>
            </Card>
                </Grid>

                {/* Agenda & Exhibits Side by Side */}
                <Grid item xs={12} md={6}>
                  <Card sx={{ 
                    height: '100%',
                    borderLeft: '4px solid #002147',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                  }}>
                    <CardContent sx={{ p: 2 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#002147' }}>
                          Agenda Steps 
                        </Typography>
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<Add />}
                          style={{ margin: '15px' }}
                          onClick={() => setShowAddAgendaDialog(true)}
                          sx={{ 
                            bgcolor: '#002147',
                            '&:hover': { bgcolor: '#003366' },
                            textTransform: 'none',
                            fontSize: '0.75rem'
                          }}
                        >
                          Add Step
                        </Button>
                      </Stack>
                      <Box sx={{ maxHeight: '200px', overflow: 'auto' }}>
                {experience.agenda && experience.agenda.length > 0 ? (
                          <Stack spacing={1}>
                    {experience.agenda.map((step, index) => (
                              <Box 
                                key={step.id || index}
                                sx={{ 
                                  p: 1.5, 
                                  bgcolor: index % 2 === 0 ? '#e6f2ff' : 'white',
                                  borderRadius: 1,
                                  border: '1px solid #e0e0e0'
                                }}
                              >
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <Chip 
                                    label={index + 1} 
                                    size="small" 
                                    sx={{ 
                                      minWidth: '32px',
                                      height: '24px',
                                      bgcolor: '#002147',
                                      color: 'white',
                                      fontWeight: 600
                                    }} 
                                  />
                                  <Typography variant="body2" fontWeight={600} sx={{ flex: 1 }}>
                                  {step.title}
                                </Typography>
                              </Stack>
                                <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.5, ml: 4.5 }}>
                                  <Schedule sx={{ fontSize: 14, color: 'text.secondary' }} />
                                  <Typography variant="caption" color="text.secondary">
                                  {step.duration}
                                </Typography>
                              </Stack>
                              </Box>
                            ))}
                          </Stack>
                        ) : (
                          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                            No agenda steps yet
                  </Typography>
                )}
                      </Box>
              </CardContent>
            </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card sx={{ 
                    height: '100%',
                    borderLeft: '4px solid #ff5e1a',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                  }}>
                    <CardContent sx={{ p: 2 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#ff5e1a' }}>
                          Exhibits & Resources 
                        </Typography>
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<Add />}
                          style={{ margin: '15px' }}
                          onClick={() => setShowAddExhibitDialog(true)}
                          sx={{ 
                            bgcolor: '#ff5e1a',
                            '&:hover': { bgcolor: '#e04d0a' },
                            textTransform: 'none',
                            fontSize: '0.75rem'
                          }}
                        >
                          Add Exhibit
                        </Button>
                      </Stack>
                      <Box sx={{ maxHeight: '200px', overflow: 'auto' }}>
                {experience.exhibits && experience.exhibits.length > 0 ? (
                          <Stack spacing={5}>
                    {experience.exhibits.map((exhibit, index) => (
                              <Box 
                                key={exhibit.id || index}
                                sx={{ 
                                  p: 1.5, 
                                  bgcolor: index % 2 === 0 ? '#fff5f0' : 'white',
                                  borderRadius: 1,
                                  border: '1px solid #e0e0e0'
                                }}
                              >
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <Box sx={{ color: '#ff5e1a', display: 'flex' }}>
                              {getExhibitIcon(exhibit.type)}
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                    <Typography variant="body2" fontWeight={600}>
                                {exhibit.name}
                              </Typography>
                              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                                      <Chip 
                                        label={exhibit.type} 
                                        size="small" 
                                        sx={{ height: '20px', fontSize: '0.7rem' }}
                                      />
                                {exhibit.type === 'link' && exhibit.link && (
                                  <MuiLink 
                                    href={exhibit.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                          sx={{ fontSize: '0.7rem' }}
                                  >
                                          Open →
                                  </MuiLink>
                                )}
                              </Stack>
                            </Box>
                          </Stack>
                              </Box>
                    ))}
                          </Stack>
                ) : (
                          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                            No exhibits yet
                  </Typography>
                )}
                      </Box>
              </CardContent>
            </Card>
                </Grid>
              </Grid>
          </Grid>

            {/* Right Column - Metadata & Stats */}
            <Grid item xs={12} lg={8}>
              <Stack spacing={2}>
                {/* Meeting Facilitator Selection Card */}
                <Card sx={{ 
                  borderLeft: '4px solid #9333ea',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}>
                  <CardContent sx={{ p: 2 }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                      <Person sx={{ color: '#9333ea' }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#9333ea' }}>
                        Meeting Facilitator
                      </Typography>
                    </Stack>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>
                      Select the fireteam member who will chair/host this experience meeting
                    </Typography>
                    <Stack spacing={2}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="video-admin-select-label">Select Meeting Facilitator</InputLabel>
                        <Select
                          labelId="video-admin-select-label"
                          value={selectedVideoAdminId}
                          onChange={(e) => setSelectedVideoAdminId(e.target.value)}
                          label="Select Meeting Facilitator"
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {members.map((member) => (
                            <MenuItem 
                              key={member.id} 
                              value={member.client?.user?.id || member.user_id || member.id}
                            >
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Box sx={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: '50%',
                                  bgcolor: '#9333ea',
                                  color: 'white',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '0.75rem',
                                  fontWeight: 600
                                }}>
                                  {member.client?.user?.name?.charAt(0).toUpperCase() || 
                                   member.user?.name?.charAt(0).toUpperCase() || 
                                   member.name?.charAt(0).toUpperCase() || 
                                   'U'}
                                </Box>
                                <Typography variant="body2">
                                  {member.client?.user?.name || member.user?.name || member.name || `User #${member.client?.user?.id || member.user_id || member.id}`}
                                </Typography>
                              </Stack>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<Save />}
                        onClick={handleUpdateVideoAdmin}
                        disabled={isUpdatingVideoAdmin || !selectedVideoAdminId}
                        sx={{
                          bgcolor: '#9333ea',
                          '&:hover': { bgcolor: '#7e22ce' },
                          textTransform: 'none',
                        }}
                      >
                        {isUpdatingVideoAdmin ? 'Saving...' : 'Save Meeting Facilitator'}
                      </Button>
                      {experience.videoAdminId && (
                        <Box sx={{ p: 1.5, bgcolor: '#f3e8ff', borderRadius: 1 }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                            Current Meeting Facilitator
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {(() => {
                              const currentAdmin = members.find(m => {
                                const userId = m.client?.user?.id || m.user_id || m.id;
                                return userId.toString() === experience.videoAdminId?.toString();
                              });
                              return currentAdmin?.client?.user?.name || 
                                     currentAdmin?.user?.name || 
                                     currentAdmin?.name || 
                                     `User #${experience.videoAdminId}`;
                            })()}
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  </CardContent>
                </Card>

                {/* Experience Link Card */}
                <Card sx={{ 
                  borderLeft: '4px solid #10b981',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}>
                  <CardContent sx={{ p: 2 }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                      <LinkIcon sx={{ color: '#10b981' }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#10b981' }}>
                        Experience Link
                      </Typography>
                    </Stack>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>
                      Direct link to access this experience
                    </Typography>
                    {experience.link ? (
                      <Stack spacing={2}>
                        <Box sx={{ p: 1.5, bgcolor: '#ecfdf5', borderRadius: 1, border: '1px solid #d1fae5' }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
                            Meeting URL
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              wordBreak: 'break-all',
                              fontFamily: 'monospace',
                              fontSize: '0.8rem',
                              color: '#065f46'
                            }}
                          >
                            {experience.link}
                          </Typography>
                        </Box>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<VideoCall />}
                          onClick={() => {
                            // Navigate to client experience page with admin privileges
                            const clientUrl = `/client/fireteam/experience/${experienceId}?id=${experienceId}&fireteamId=${fireteamId}&link=${encodeURIComponent(experience.link)}&admin=true`;
                            router.push(clientUrl);
                          }}
                          sx={{
                            bgcolor: '#10b981',
                            '&:hover': { bgcolor: '#059669' },
                            textTransform: 'none',
                          }}
                        >
                          Join Meeting as Admin
                        </Button>
                      </Stack>
                    ) : (
                      <Box sx={{ p: 2, textAlign: 'center', bgcolor: '#f3f4f6', borderRadius: 1 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                          No meeting link available
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>

               
                {/* Metadata Card */}
                <Card sx={{ 
                  borderLeft: '4px solid #9333ea',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5, color: '#9333ea' }}>
                       Metadata
                    </Typography>
                    <Stack spacing={1.5}>
                      {/* ID Grid */}
                      <Box sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: '1fr 1fr',
                        gap: 1
                      }}>
                        <Box sx={{ p: 1, bgcolor: '#e6f2ff', borderRadius: 1 }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                            Experience ID
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#002147' }}>
                            #{experience.id}
                          </Typography>
                        </Box>
                        <Box sx={{ p: 1, bgcolor: '#e6f2ff', borderRadius: 1 }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                            Fireteam ID
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#002147' }}>
                            #{experience.fire_team_id || fireteamId}
                    </Typography>
                  </Box>
                      </Box>

                  <Divider />

                      {/* User Info */}
                      {experience.added_by && (
                        <Box sx={{ p: 1, bgcolor: '#e3f2fd', borderRadius: 1 }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                            Added By
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            User #{experience.added_by}
                          </Typography>
                        </Box>
                      )}

                      {experience.admin && (
                        <Box sx={{ p: 1, bgcolor: '#fff5f0', borderRadius: 1 }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                             Admin
                    </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {typeof experience.admin === 'object' 
                              ? (experience.admin.name || experience.admin.email || 'Admin')
                              : experience.admin}
                    </Typography>
                  </Box>
                      )}

                  <Divider />

                      {/* Timestamps */}
                  <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            Created
                          </Typography>
                          <Typography variant="caption" sx={{ fontWeight: 600 }}>
                            {experience.created_at 
                              ? new Date(experience.created_at).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric',
                                  year: 'numeric'
                                })
                              : 'N/A'}
                          </Typography>
                        </Box>
                        {experience.updated_at && (
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="caption" color="text.secondary">
                              Updated
                    </Typography>
                            <Typography variant="caption" sx={{ fontWeight: 600 }}>
                              {new Date(experience.updated_at).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric'
                              })}
                    </Typography>
                          </Box>
                        )}
                  </Box>
                </Stack>
              </CardContent>
            </Card>
              </Stack>
            </Grid>
          </Grid>
        </Box>

        {/* Edit Modal */}
        <EditExperienceModal
          open={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            clearValidationErrors();
          }}
          editExperienceData={editExperienceData}
          setEditExperienceData={setEditExperienceData}
          validationErrors={validationErrors}
          clearValidationErrors={clearValidationErrors}
          handleAddAgendaStep={handleAddAgendaStep}
          handleAddExhibit={handleAddExhibit}
          handleSave={async () => {
            if (!experience) return;
            if (!validateExperienceData()) {
              setError('Please fix validation errors before saving');
              return;
            }
            try {
              // Prepare agenda data - filter out items without required fields
              const agendaData = editExperienceData.agenda
                .filter(step => step.title?.trim())
                .map(step => ({
                  id: step.id,
                  title: step.title,
                  duration: step.duration || '5 minutes',
                }));

              // Prepare exhibits data - filter out items without required fields
              const exhibitsData = editExperienceData.exhibits
                .filter(ex => ex.name?.trim())
                .map(ex => ({
                  id: ex.id,
                  name: ex.name,
                  type: ex.type || 'link',
                  link: ex.type === 'link' ? ex.link : undefined,
                }));

              await experienceService.updateExperience(experience.id, {
                title: editExperienceData.title,
                experience: editExperienceData.experience,
                // Send field names for meeting facilitator (NOT system admin/creator)
                // added_by should NOT be sent - that tracks the system admin who created it
                videoAdminId: editExperienceData.videoAdminId,
                admin: editExperienceData.videoAdminId,
                video_admin_id: editExperienceData.videoAdminId,
                link: editExperienceData.link,
                agenda: agendaData,
                exhibits: exhibitsData,
              });
              
              // Handle exhibits that were deleted (not in the new list)
              const currentExhibitIds = experience.exhibits?.map(ex => ex.id).filter(Boolean) || [];
              const updatedExhibitIds = exhibitsData.map(ex => ex.id).filter(Boolean);
              
              for (const exhibitId of currentExhibitIds) {
                if (!updatedExhibitIds.includes(exhibitId)) {
                  try {
                    await experienceService.deleteExhibit(exhibitId);
                  } catch (err) {
                    console.warn('Failed to delete exhibit:', err);
                  }
                }
              }
              
              // Handle agenda steps that were deleted (not in the new list)
              const currentAgendaIds = experience.agenda?.map(step => step.id).filter(Boolean) || [];
              const updatedAgendaIds = agendaData.map(step => step.id).filter(Boolean);
              
              for (const stepId of currentAgendaIds) {
                if (!updatedAgendaIds.includes(stepId)) {
                  try {
                    await experienceService.deleteAgendaStep(stepId);
                  } catch (err) {
                    console.warn('Failed to delete agenda step:', err);
                  }
                }
              }
              
              setShowEditModal(false);
              clearValidationErrors();
              setSuccess('Experience updated successfully!');
              fetchExperienceDetails();
            } catch (err) {
              console.error('Failed to update experience:', err);
              setError('Failed to update experience: ' + (err.message || 'Unknown error'));
            }
          }}
          setError={setError}
          members={members}
          selectedExperienceToEdit={experience}
          generateFireteamMeetingLink={generateFireteamMeetingLink}
          id={fireteamId}
          fireteam={fireteam}
          experienceService={experienceService}
        />

        {/* Add Agenda Step Dialog */}
        <Dialog 
          open={showAddAgendaDialog} 
          onClose={() => {
            setShowAddAgendaDialog(false);
            setNewAgendaStep({ title: '', duration: '' });
          }}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ bgcolor: '#002147', color: 'white', fontWeight: 700 }}>
            Add Agenda Step
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <Stack spacing={2}>
              <TextField
                label="Step Title"
                fullWidth
                required
                value={newAgendaStep.title}
                onChange={(e) => setNewAgendaStep(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Introduction & Icebreaker"
                sx={{ mt: 1 }}
              />
              <TextField
                label="Duration"
                fullWidth
                value={newAgendaStep.duration}
                onChange={(e) => setNewAgendaStep(prev => ({ ...prev, duration: e.target.value }))}
                placeholder="e.g., 10 minutes"
                helperText="Optional - specify the estimated duration"
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button 
              onClick={() => {
                setShowAddAgendaDialog(false);
                setNewAgendaStep({ title: '', duration: '' });
              }}
              sx={{ color: 'text.secondary' }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitAgendaStep}
              variant="contained"
              sx={{ 
                bgcolor: '#002147',
                '&:hover': { bgcolor: '#003366' }
              }}
            >
              Add Step
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Exhibit Dialog */}
        <Dialog 
          open={showAddExhibitDialog} 
          onClose={() => {
            setShowAddExhibitDialog(false);
            setNewExhibit({ name: '', type: 'link', link: '' });
          }}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ bgcolor: '#ff5e1a', color: 'white', fontWeight: 700 }}>
            Add Exhibit
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <Stack spacing={2}>
              <TextField
                label="Exhibit Name"
                fullWidth
                required
                value={newExhibit.name}
                onChange={(e) => setNewExhibit(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Leadership Framework"
                sx={{ mt: 1 }}
              />
              <TextField
                label="Type"
                fullWidth
                required
                select
                value={newExhibit.type}
                onChange={(e) => setNewExhibit(prev => ({ ...prev, type: e.target.value }))}
                SelectProps={{
                  native: true,
                }}
              >
                <option value="link">Link</option>
                <option value="image">Image</option>
                <option value="video">Video</option>
                <option value="document">Document</option>
              </TextField>
              {newExhibit.type === 'link' && (
                <TextField
                  label="Link URL"
                  fullWidth
                  required
                  value={newExhibit.link}
                  onChange={(e) => setNewExhibit(prev => ({ ...prev, link: e.target.value }))}
                  placeholder="https://example.com"
                  helperText="Enter the full URL including https://"
                />
              )}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button 
              onClick={() => {
                setShowAddExhibitDialog(false);
                setNewExhibit({ name: '', type: 'link', link: '' });
              }}
              sx={{ color: 'text.secondary' }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitExhibit}
              variant="contained"
              sx={{ 
                bgcolor: '#ff5e1a',
                '&:hover': { bgcolor: '#e04d0a' }
              }}
            >
              Add Exhibit
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

