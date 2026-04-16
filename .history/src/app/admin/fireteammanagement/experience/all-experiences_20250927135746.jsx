"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { experienceService } from "../../../../services/api/experience.service";
import { Box, Typography, Divider } from "@mui/material";

export default function AllExperiencesPage({ fireteamId: propFireteamId }) {
  const params = useParams();
  const fireteamId = propFireteamId || params.fireteamId;
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchExperiences() {
      setLoading(true);
      try {
        const response = await experienceService.getExperiences(fireteamId);
        setExperiences(response.fireTeamExperiences || []);
      } catch (err) {
        setError("Failed to load experiences");
      } finally {
        setLoading(false);
      }
    }
    if (fireteamId) fetchExperiences();
  }, [fireteamId]);

  if (loading) {
    return <Box sx={{ p: 4 }}><Typography>Loading experiences...</Typography></Box>;
  }
  if (error) {
    return <Box sx={{ p: 4 }}><Typography color="error">{error}</Typography></Box>;
  }

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 4 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>All Experiences for Fireteam {fireteamId}</Typography>
      <Divider sx={{ mb: 2 }} />
      {experiences.length === 0 ? (
        <Typography>No experiences found.</Typography>
      ) : (
        <ul>
          {experiences.map(exp => (
            <li key={exp.id}>
              <strong>{exp.title}</strong> (ID: {exp.id})<br />
              {exp.experience}
              <Divider sx={{ my: 1 }} />
            </li>
          ))}
        </ul>
      )}
    </Box>
  );
}
