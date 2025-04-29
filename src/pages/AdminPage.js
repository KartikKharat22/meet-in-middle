// src/pages/AdminPage.js
import React, { useState, useEffect } from 'react';
import {
  Grid,
  Box,
  Typography,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Button,
  IconButton,
  Stack,
  Chip,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Search,
  FilterList,
  Edit,
  Delete,
  Refresh,
  Add,
  Visibility,
  CalendarMonth
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { AdminPanelSettings, Person, Group } from '@mui/icons-material';

// Mock data - replace with API calls in production
const mockUsers = [
  { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'admin', meetings: 12, status: 'active' },
  { id: 2, name: 'Regular User', email: 'user@example.com', role: 'user', meetings: 5, status: 'active' },
  { id: 3, name: 'New User', email: 'new@example.com', role: 'user', meetings: 0, status: 'pending' },
];

const mockMeetings = [
  { id: 1, title: 'Team Sync', participants: 5, location: 'Central Cafe', date: '2023-06-15', status: 'upcoming' },
  { id: 2, title: 'Project Review', participants: 8, location: 'Virtual', date: '2023-05-30', status: 'completed' },
];

export default function AdminPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Filter data based on search term
  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMeetings = mockMeetings.filter(meeting => 
    meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    meeting.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = (id) => {
    // TODO: Implement delete functionality
    console.log('Delete item with id:', id);
  };

  // Verify admin role
  if (user?.role !== 'admin') {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="error" gutterBottom>
            Access Denied
          </Typography>
          <Typography>
            You don't have permission to access this page.
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
        Admin Dashboard
      </Typography>

      {/* Tabs and Actions */}
      <Paper elevation={2} sx={{ mb: 3, p: 2 }}>
        <Stack 
          direction={isMobile ? 'column' : 'row'} 
          spacing={2}
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" spacing={1}>
            <Button
              variant={activeTab === 'users' ? 'contained' : 'outlined'}
              startIcon={<Person />}
              onClick={() => setActiveTab('users')}
            >
              Users
            </Button>
            <Button
              variant={activeTab === 'meetings' ? 'contained' : 'outlined'}
              startIcon={<Group />}
              onClick={() => setActiveTab('meetings')}
            >
              Meetings
            </Button>
          </Stack>

          <Stack direction="row" spacing={1} sx={{ width: isMobile ? '100%' : 'auto' }}>
            <TextField
              size="small"
              placeholder={`Search ${activeTab}...`}
              InputProps={{
                startAdornment: <Search color="action" sx={{ mr: 1 }} />
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ minWidth: isMobile ? '100%' : 300 }}
            />
            <IconButton>
              <FilterList />
            </IconButton>
            <Button variant="contained" startIcon={<Add />}>
              Add {activeTab === 'users' ? 'User' : 'Meeting'}
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Data Table */}
      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: theme.palette.grey[100] }}>
                {activeTab === 'users' ? (
                  <>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Meetings</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>Title</TableCell>
                    <TableCell>Participants</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {(activeTab === 'users' ? filteredUsers : filteredMeetings)
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item) => (
                  <TableRow key={item.id} hover>
                    {activeTab === 'users' ? (
                      <>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            {item.role === 'admin' && <AdminPanelSettings color="primary" />}
                            <Typography>{item.name}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>{item.email}</TableCell>
                        <TableCell>
                          <Chip 
                            label={item.role} 
                            size="small"
                            color={item.role === 'admin' ? 'primary' : 'default'}
                          />
                        </TableCell>
                        <TableCell>{item.meetings}</TableCell>
                        <TableCell>
                          <Chip 
                            label={item.status} 
                            size="small"
                            color={item.status === 'active' ? 'success' : 'warning'}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton size="small"><Edit /></IconButton>
                          <IconButton size="small" color="error" onClick={() => handleDelete(item.id)}>
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell>{item.title}</TableCell>
                        <TableCell>{item.participants}</TableCell>
                        <TableCell>{item.location}</TableCell>
                        <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Chip 
                            label={item.status} 
                            size="small"
                            color={item.status === 'upcoming' ? 'primary' : 'default'}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton size="small"><Visibility /></IconButton>
                          <IconButton size="small"><Edit /></IconButton>
                          <IconButton size="small" color="error" onClick={() => handleDelete(item.id)}>
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={activeTab === 'users' ? filteredUsers.length : filteredMeetings.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Stats Cards - Optional */}
      <Box sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Total Users" 
              value={mockUsers.length} 
              icon={<Person fontSize="large" />}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Active Meetings" 
              value={mockMeetings.filter(m => m.status === 'upcoming').length} 
              icon={<Group fontSize="large" />}
              color="secondary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Pending Users" 
              value={mockUsers.filter(u => u.status === 'pending').length} 
              icon={<AdminPanelSettings fontSize="large" />}
              color="warning"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Completed Meetings" 
              value={mockMeetings.filter(m => m.status === 'completed').length} 
              icon={<CalendarMonth fontSize="large" />}
              color="success"
            />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

// Reusable StatCard component
function StatCard({ title, value, icon, color = 'primary' }) {
  return (
    <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h4" fontWeight={700}>
            {value}
          </Typography>
        </Box>
        <Box sx={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          bgcolor: `${color}.light`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: `${color}.contrastText`
        }}>
          {icon}
        </Box>
      </Stack>
    </Paper>
  );
}