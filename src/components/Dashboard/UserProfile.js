
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Button,
  Divider,
  TextField,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Chip
} from '@mui/material';
import {
  Edit,
  Save,
  Close,
  Email,
  Phone,
  LocationOn,
  CalendarToday,
  Person
} from '@mui/icons-material';
import { format } from 'date-fns';

const profileFields = [
  {
    id: 'name',
    label: 'Full Name',
    icon: <Person />,
    type: 'text'
  },
  {
    id: 'email',
    label: 'Email',
    icon: <Email />,
    type: 'email'
  },
  {
    id: 'phone',
    label: 'Phone',
    icon: <Phone />,
    type: 'tel'
  },
  {
    id: 'location',
    label: 'Location',
    icon: <LocationOn />,
    type: 'text'
  },
  {
    id: 'joinedDate',
    label: 'Member Since',
    icon: <CalendarToday />,
    type: 'date',
    readOnly: true
  }
];

const initialUserData = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  location: 'New York, USA',
  joinedDate: '2022-03-15',
  avatar: '',
  upcomingMeetings: 3,
  pastMeetings: 12
};

function UserProfile() {
  const [userData, setUserData] = useState(initialUserData);
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState({...initialUserData});

  const handleEdit = () => {
    setEditedData({...userData});
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
  };

  const handleSave = () => {
    setUserData({...editedData});
    setEditMode(false);
  };

  const handleChange = (fieldId, value) => {
    setEditedData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };


  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMMM yyyy');
  };

  
  const statsItems = [
    {
      label: 'Upcoming Meetings',
      value: userData.upcomingMeetings,
      color: 'primary'
    },
    {
      label: 'Past Meetings',
      value: userData.pastMeetings,
      color: 'secondary'
    }
  ];

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          My Profile
        </Typography>
        {editMode ? (
          <Box>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSave}
              sx={{ mr: 1 }}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              startIcon={<Close />}
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </Box>
        ) : (
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={handleEdit}
          >
            Edit Profile
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar
              src={userData.avatar}
              sx={{
                width: 120,
                height: 120,
                fontSize: 48,
                mb: 2
              }}
            >
              {userData.name.charAt(0)}
            </Avatar>
            {editMode && (
              <Button variant="outlined" sx={{ mb: 2 }}>
                Change Photo
              </Button>
            )}
          </Box>

          <List sx={{ mt: 2 }}>
  {statsItems.map((item, index) => (
    <ListItem key={index}>
      <ListItemText
        primary={
          <Typography 
            variant="h6" 
            color={item.color} 
            textAlign="center"
          >
            {item.value}
          </Typography>
        }
        secondary={
          <Typography textAlign="center">
            {item.label}
          </Typography>
        }
      />
    </ListItem>
  ))}
</List>
            
        </Grid>

        <Grid item xs={12} md={8}>
          <List>
            {profileFields.map((field) => (
              <React.Fragment key={field.id}>
                <ListItem>
                  <ListItemAvatar>
                    {field.icon}
                  </ListItemAvatar>
                  {editMode && !field.readOnly ? (
                    <TextField
                      fullWidth
                      label={field.label}
                      value={editedData[field.id]}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                      type={field.type}
                      variant="outlined"
                    />
                  ) : (
                    <ListItemText
                      primary={field.label}
                      secondary={
                        <Typography sx={{ wordBreak: 'break-word' }}>
                          {field.id === 'joinedDate' 
                            ? formatDate(userData[field.id]) 
                            : userData[field.id]}
                        </Typography>
                      }
                    />
                  )}
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default UserProfile;