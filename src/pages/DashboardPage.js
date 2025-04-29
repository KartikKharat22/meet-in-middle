// src/pages/DashboardPage.js
import React from 'react';
import { Container, Box, Tabs, Tab, Paper } from '@mui/material';
import Header from '../components/Layout/Header';
import Sidebar from '../components/Layout/Sidebar';
import CreateMeeting from '../components/Dashboard/CreateMeeting';
import MeetingCard from '../components/Dashboard/MeetingCard';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function DashboardPage() {
  const [value, setValue] = React.useState(0);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Sample meetings data
  const upcomingMeetings = [
    {
      id: 1,
      title: 'Team Sync',
      description: 'Weekly team sync meeting',
      date: '2023-06-15',
      time: '10:00',
      location: 'Central Cafe',
      attendees: 5,
    },
    {
      id: 2,
      title: 'Project Review',
      description: 'Review of Q2 project milestones',
      date: '2023-06-18',
      time: '14:00',
      location: 'Virtual',
      attendees: 8,
    },
  ];

  const pastMeetings = [
    {
      id: 3,
      title: 'Sprint Planning',
      description: 'Planning for sprint 23',
      date: '2023-06-01',
      time: '09:30',
      location: 'Office Conference Room',
      attendees: 7,
    },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <Header handleDrawerToggle={handleDrawerToggle} />
      <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
      
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Container maxWidth="lg">
          <Paper sx={{ mb: 4 }}>
            <Tabs value={value} onChange={handleChange} centered>
              <Tab label="Upcoming Meetings" />
              <Tab label="Create New Meeting" />
              <Tab label="Past Meetings" />
            </Tabs>
          </Paper>
          
          <TabPanel value={value} index={0}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {upcomingMeetings.map((meeting) => (
                <MeetingCard key={meeting.id} meeting={meeting} />
              ))}
            </Box>
          </TabPanel>
          
          <TabPanel value={value} index={1}>
            <CreateMeeting />
          </TabPanel>
          
          <TabPanel value={value} index={2}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {pastMeetings.map((meeting) => (
                <MeetingCard key={meeting.id} meeting={meeting} past />
              ))}
            </Box>
          </TabPanel>
        </Container>
      </Box>
    </Box>
  );
}

export default DashboardPage;