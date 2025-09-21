import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  IconButton,
  Card,
  CardContent,
  Stack,
  Button,
} from '@mui/material';
import {
  PersonAdd,
  PersonRemove,
} from '@mui/icons-material';

export default function FireteamMembersList({
  members = [],
  onAddMember,
  onRemoveMember,
  loading = false
}) {
  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Fireteam Members
          </Typography>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">
              Loading members...
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h6">
            Fireteam Members
          </Typography>
          <Button
            variant="outlined"
            size="small"
            startIcon={<PersonAdd />}
            onClick={onAddMember}
          >
            Add Member
          </Button>
        </Stack>
        
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
            {members.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Box sx={{ py: 3 }}>
                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                      No members found
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<PersonAdd />}
                      onClick={onAddMember}
                    >
                      Add First Member
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {member.name || member.user?.name || 'Unknown'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {member.email || member.user?.email || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={member.role || 'Member'} 
                      size="small" 
                      color="primary"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => onRemoveMember(member.id)}
                      title="Remove member from fireteam"
                    >
                      <PersonRemove />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
