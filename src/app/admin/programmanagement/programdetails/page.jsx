"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody, Chip, Stack } from "@mui/material";
import { ProgramsService } from "../../../../services/api/programs.service";
import { cohortService } from "../../../../services/api/cohort.service";
import AdminSidebar from "../../../../../components/dashboardcomponents/adminsidebar";

export default function ProgramDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  // If no id param, show error and do not proceed
  if (!id) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <main className="flex-1 p-8 ml-16 md:ml-56">
          <Typography color="error">No program selected. Please go back and select a program.</Typography>
        </main>
      </div>
    );
  }

  const [program, setProgram] = useState(null);
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const prog = await ProgramsService.getById(id);
        const resolvedProgram = prog?.program ?? prog;
        setProgram(resolvedProgram);

        // Fetch cohorts and filter by this program id
        const cohortsResponse = await cohortService.getCohorts();
        const rawCohorts = Array.isArray(cohortsResponse)
          ? cohortsResponse
          : (Array.isArray(cohortsResponse?.data)
              ? cohortsResponse.data
              : (Array.isArray(cohortsResponse?.cohorts)
                  ? cohortsResponse.cohorts
                  : []));
        const filtered = rawCohorts.filter(c => {
          const programIdFromCohort = c.program_id ?? c.programId ?? c.program?.id;
          return String(programIdFromCohort) === String(resolvedProgram?.id);
        });
        setCohorts(filtered);
      } catch (err) {
        setError("Failed to fetch program details");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetails();
  }, [id]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-8 ml-16 md:ml-56">
        <Button variant="outlined" sx={{ mb: 1 }} onClick={() => router.push("/admin/programmanagement")}>Back to Program Management</Button>
        {/* Description under Back button */}
        {!loading && !error && program && (
          <Typography variant="body1" sx={{ mb: 2 }}>{program.description || <em>No description provided.</em>}</Typography>
        )}
        {loading ? (
          <Typography>Loading...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : program ? (
          <Box sx={{ bgcolor: '#fff', borderRadius: 2, p: 3, boxShadow: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>{program.name || program.title}</Typography>
            {/* Actions Section */}
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <Button variant="outlined" color="primary" onClick={() => {/* TODO: Implement Edit */}}>Edit</Button>
              <Button variant="outlined" color="error" onClick={() => {/* TODO: Implement Delete */}}>Delete</Button>
              <Button variant="contained" color="success" onClick={() => {/* TODO: Implement Add Session */}}>Add Session</Button>
            </Stack>

            <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Cohorts</Typography>
            {Array.isArray(cohorts) && cohorts.length > 0 ? (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Members</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>End Date</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cohorts.map(cohort => {
                    const memberCount = Array.isArray(cohort.members)
                      ? cohort.members.length
                      : (Array.isArray(cohort.cohort_members)
                          ? cohort.cohort_members.length
                          : (cohort.members_count ?? cohort.member_count ?? cohort.total_members ?? 0));
                    const startDateRaw = cohort.start_date ?? cohort.startDate ?? cohort.starts_at ?? cohort.startAt;
                    const endDateRaw = cohort.end_date ?? cohort.endDate ?? cohort.ends_at ?? cohort.endAt;
                    const startDate = startDateRaw ? new Date(startDateRaw).toLocaleDateString() : '—';
                    const endDate = endDateRaw ? new Date(endDateRaw).toLocaleDateString() : '—';
                    return (
                      <TableRow key={cohort.id}>
                        <TableCell>{cohort.name || cohort.title || `Cohort ${cohort.id}`}</TableCell>
                        <TableCell>{memberCount}</TableCell>
                        <TableCell>{startDate}</TableCell>
                        <TableCell>{endDate}</TableCell>
                        <TableCell align="right">
                          <Button size="small" variant="outlined" onClick={() => router.push(`/admin/cohortmanagement?id=${cohort.id}`)}>View</Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <Typography variant="body2"><em>No cohorts for this program.</em></Typography>
            )}
          </Box>
        ) : (
          <Typography>Program not found.</Typography>
        )}
      </main>
    </div>
  );
}
