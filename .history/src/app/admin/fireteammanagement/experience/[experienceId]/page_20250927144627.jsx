
"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Snackbar,
  Alert,
  Divider,
} from "@mui/material";
import { experienceService } from "../../../services/api/experience.service";
import { generateFireteamMeetingLink } from "../../../lib/jitsi.utils";


export default function ExperienceDetailsRoutePage(props) {
  const params = React.use(props.params);
  const experienceId = params?.experienceId;
  const searchParams = React.use(props.searchParams);
  const fireteamId = searchParams?.fireteamId || null;

  const [experience, setExperience] = useState(null);
  const [fireTeamExperiences, setFireTeamExperiences] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (experienceId && fireteamId) {
      fetchExperience();
    }
    // eslint-disable-next-line
  }, [experienceId, fireteamId]);

  const fetchExperience = async () => {
    setLoading(true);
    try {
      const response = await experienceService.getExperiences(fireteamId);
      const experiences = response.fireTeamExperiences || [];
      setFireTeamExperiences(experiences);
      const expWrapper = experiences.find(e => Number(e.experience?.id) === Number(experienceId));
      let exp = null;
      if (expWrapper) {
        exp = {
          ...expWrapper.experience,
          agenda: expWrapper.agenda ?? [],
          exhibits: expWrapper.exhibits ?? [],
          videoAdminId: expWrapper.videoAdminId ?? '',
          meetingLink: expWrapper.meetingLink ?? '',
          fireTeamExperienceId: expWrapper.id,
          fire_team_id: expWrapper.fire_team_id,
          added_by: expWrapper.added_by,
        };
      }
      setExperience(exp);
      setEditData(exp ? { ...exp } : null);
    } catch (err) {
      setError("Failed to load experience");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditMode(true);
    setEditData(experience ? { ...experience } : null);
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditData(experience ? { ...experience } : null);
  };

  const handleSave = async () => {
    if (!editData) return;
    try {
      await experienceService.updateExperience(experienceId, {
        title: editData.title,
        experience: editData.experience,
      });
      setSuccess("Experience updated successfully!");
      setEditMode(false);
      fetchExperience();
    } catch (err) {
      setError("Failed to update experience");
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Loading experience...</Typography>
      </Box>
    );
  }
  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }
  if (!experience) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">Experience not found. Please check the experience ID and fireteam ID.</Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6">All Experiences for Fireteam:</Typography>
        <ul>
          {fireTeamExperiences.map(exp => (
            <li key={exp.id}>
              <strong>{exp.title}</strong> (ID: {exp.id})<br />
              {exp.experience}
            </li>
          ))}
        </ul>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 4 }}>
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {editMode ? (
                <TextField
                  label="Title"
                  value={editData.title}
                  onChange={e => setEditData({ ...editData, title: e.target.value })}
                  fullWidth
                  required
                />
              ) : (
                experience.title
              )}
            </Typography>
            <Divider />
            <Typography variant="h6">Description</Typography>
            {editMode ? (
              <TextField
                label="Description"
                value={editData.experience}
                onChange={e => setEditData({ ...editData, experience: e.target.value })}
                fullWidth
                multiline
                rows={4}
                required
              />
            ) : (
              <Typography>{experience.experience}</Typography>
            )}
            <Divider />
            <Typography variant="h6">Agenda Steps</Typography>
            <Stack spacing={1}>
              {(editMode ? editData.agenda : experience.agenda)?.map((step, idx) => (
                <Stack direction="row" spacing={2} alignItems="center" key={step.id || idx}>
                  {editMode ? (
                    <>
                      <TextField
                        label="Step Title"
                        value={step.title ?? ""}
                        onChange={e => {
                          const agenda = [...editData.agenda];
                          agenda[idx] = { ...agenda[idx], title: e.target.value };
                          setEditData({ ...editData, agenda });
                        }}
                        sx={{ flex: 2 }}
                      />
                      <TextField
                        label="Duration"
                        value={step.duration ?? ""}
                        onChange={e => {
                          const agenda = [...editData.agenda];
                          agenda[idx] = { ...agenda[idx], duration: e.target.value };
                          setEditData({ ...editData, agenda });
                        }}
                        sx={{ flex: 1 }}
                      />
                      <Button
                        color="error"
                        size="small"
                        onClick={() => {
                          setEditData({
                            ...editData,
                            agenda: editData.agenda.filter((_, i) => i !== idx),
                          });
                        }}
                        disabled={editData.agenda.length === 1}
                      >Remove</Button>
                    </>
                  ) : (
                    <>
                      <Typography sx={{ flex: 2 }}>{step.title}</Typography>
                      <Typography sx={{ flex: 1 }}>{step.duration}</Typography>
                    </>
                  )}
                </Stack>
              ))}
              {editMode && (
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    setEditData({
                      ...editData,
                      agenda: [
                        ...editData.agenda,
                        { title: "", duration: "", id: null },
                      ],
                    });
                  }}
                >+ Add Step</Button>
              )}
            </Stack>
            <Divider />
            <Typography variant="h6">Exhibits</Typography>
            <Stack spacing={1}>
              {(editMode ? editData.exhibits : experience.exhibits)?.map((exhibit, idx) => (
                <Stack direction="row" spacing={2} alignItems="center" key={exhibit.id || idx}>
                  {editMode ? (
                    <>
                      <TextField
                        label="Exhibit Name"
                        value={exhibit.name}
                        onChange={e => {
                          const exhibits = [...editData.exhibits];
                          exhibits[idx].name = e.target.value;
                          setEditData({ ...editData, exhibits });
                        }}
                        sx={{ flex: 2 }}
                      />
                      <FormControl sx={{ minWidth: 120 }}>
                        <InputLabel>Type</InputLabel>
                        <Select
                          value={exhibit.type}
                          label="Type"
                          onChange={e => {
                            const exhibits = [...editData.exhibits];
                            exhibits[idx].type = e.target.value;
                            setEditData({ ...editData, exhibits });
                          }}
                        >
                          <MenuItem value="link">Link</MenuItem>
                          <MenuItem value="document">Document</MenuItem>
                          <MenuItem value="image">Image</MenuItem>
                          <MenuItem value="video">Video</MenuItem>
                        </Select>
                      </FormControl>
                      <TextField
                        label="Link"
                        value={exhibit.link}
                        onChange={e => {
                          const exhibits = [...editData.exhibits];
                          exhibits[idx].link = e.target.value;
                          setEditData({ ...editData, exhibits });
                        }}
                        sx={{ flex: 2 }}
                      />
                      <Button
                        color="error"
                        size="small"
                        onClick={() => {
                          setEditData({
                            ...editData,
                            exhibits: editData.exhibits.filter((_, i) => i !== idx),
                          });
                        }}
                        disabled={editData.exhibits.length === 1}
                      >Remove</Button>
                    </>
                  ) : (
                    <>
                      <Typography sx={{ flex: 2 }}>{exhibit.name}</Typography>
                      <Typography sx={{ flex: 1 }}>{exhibit.type}</Typography>
                      <Typography sx={{ flex: 2 }}>{exhibit.link}</Typography>
                    </>
                  )}
                </Stack>
              ))}
              {editMode && (
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    setEditData({
                      ...editData,
                      exhibits: [
                        ...editData.exhibits,
                        { name: "", type: "link", link: "", file: null },
                      ],
                    });
                  }}
                >+ Add Exhibit</Button>
              )}
            </Stack>
            <Divider />
            <Typography variant="h6">Video Admin & Meeting Link</Typography>
            {editMode ? (
              <>
                <TextField
                  label="Video Admin ID"
                  value={editData.videoAdminId}
                  onChange={e => setEditData({ ...editData, videoAdminId: e.target.value })}
                  fullWidth
                />
                <TextField
                  label="Meeting Link"
                  value={editData.meetingLink}
                  onChange={e => setEditData({ ...editData, meetingLink: e.target.value })}
                  fullWidth
                />
              </>
            ) : (
              <>
                <Typography>Admin ID: {experience.videoAdminId}</Typography>
                <Typography>Meeting Link: {experience.meetingLink}</Typography>
              </>
            )}
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              {editMode ? (
                <>
                  <Button variant="outlined" onClick={handleCancel}>Cancel</Button>
                  <Button variant="contained" onClick={handleSave}>Save</Button>
                </>
              ) : (
                <Button variant="contained" onClick={handleEdit}>Edit</Button>
              )}
            </Stack>
          </Stack>
        </CardContent>
      </Card>
      <Snackbar open={!!success} autoHideDuration={3000} onClose={() => setSuccess("")}> <Alert onClose={() => setSuccess("")} severity="success" sx={{ width: '100%' }}>{success}</Alert> </Snackbar>
      <Snackbar open={!!error} autoHideDuration={3000} onClose={() => setError("")}> <Alert onClose={() => setError("")} severity="error" sx={{ width: '100%' }}>{error}</Alert> </Snackbar>
    </Box>
  );
}
