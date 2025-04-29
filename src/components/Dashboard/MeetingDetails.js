import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Grid, Avatar, Chip, Button, IconButton, List, 
  ListItem, ListItemAvatar, ListItemText, TextField, Tabs, Tab
} from '@mui/material';
import { 
  LocationOn, People, CalendarToday, Edit, Share, Directions, 
  Message, Add, Close, MyLocation 
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import LocationPicker from '../Map/LocationPicker';
import API from '../../utils/api';

function MeetingDetails({ meeting, onClose }) {
  const [activeTab, setActiveTab] = useState(0);
  const [newMessage, setNewMessage] = useState('');
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [editedLocation, setEditedLocation] = useState(meeting.location);
  const [isSharingLocation, setIsSharingLocation] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  const formattedDate = format(parseISO(meeting.date), 'EEEE, MMMM d, yyyy');
  const formattedTime = format(parseISO(`${meeting.date}T${meeting.time}`), 'h:mm a');

  const [messages, setMessages] = useState([
    { id: 1, sender: 'You', text: 'Are we still meeting at 2:30?', time: '2:15 PM' },
    { id: 2, sender: 'Jane Smith', text: 'Yes, I\'ll be there!', time: '2:18 PM' },
  ]);

  const attendees = [
    { id: 1, name: 'You', status: 'confirmed' },
    { id: 2, name: 'Jane Smith', status: 'confirmed' },
    { id: 3, name: 'Mike Johnson', status: 'pending' },
    { id: 4, name: 'Sarah Williams', status: 'declined' },
  ];

  const confirmedCount = attendees.filter(a => a.status === 'confirmed').length;

  // Real-time location sharing effect
  useEffect(() => {
    let watchId = null;
    
    if (isSharingLocation && navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(newLocation);
          
          API.put(`/meetings/${meeting.id}/location`, newLocation)
            .catch(error => console.error('Location update failed:', error));
        },
        (error) => console.error('Geolocation error:', error),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [isSharingLocation, meeting.id]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { 
        id: messages.length + 1, 
        sender: 'You', 
        text: newMessage, 
        time: format(new Date(), 'h:mm a') 
      }]);
      setNewMessage('');
    }
  };

  const handleLocationSave = () => {
    setIsEditingLocation(false);
    meeting.location = editedLocation;
  };

  const toggleLocationSharing = () => {
    setIsSharingLocation(!isSharingLocation);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5" fontWeight="bold">{meeting.title}</Typography>
        <IconButton onClick={onClose}><Close /></IconButton>
      </Box>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>{meeting.description}</Typography>

      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 2 }}>
        <Tab label="Details" />
        <Tab label="Attendees" />
        <Tab label="Chat" />
      </Tabs>

      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            {[{ icon: <CalendarToday />, text: `${formattedDate} • ${formattedTime} • ${meeting.duration} mins` },
              { icon: <People />, text: `${confirmedCount} of ${attendees.length} attending` },
              { icon: <LocationOn />, text: meeting.location ? 'Location set' : 'No location set', 
                action: (
                  <>
                    <Edit fontSize="small" onClick={() => setIsEditingLocation(true)} sx={{ mr: 1 }} />
                    <MyLocation 
                      fontSize="small" 
                      color={isSharingLocation ? 'primary' : 'inherit'} 
                      onClick={toggleLocationSharing} 
                    />
                  </>
                ) 
              }
            ].map((item, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {item.icon}
                <Typography variant="body1" sx={{ flexGrow: 1, ml: 1 }}>{item.text}</Typography>
                {item.action}
              </Box>
            ))}

            {isEditingLocation && (
              <Box>
                <LocationPicker onLocationSelect={setEditedLocation} initialLocation={meeting.location} />
                <Box sx={{ mt: 2 }}>
                  <Button variant="contained" onClick={handleLocationSave} sx={{ mr: 1 }}>Save</Button>
                  <Button variant="outlined" onClick={() => setIsEditingLocation(false)}>Cancel</Button>
                </Box>
              </Box>
            )}

            {isSharingLocation && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="body2" color="primary">
                  Sharing your location in real-time...
                </Typography>
              </Box>
            )}

            <Button 
              variant="contained" 
              startIcon={<Directions />} 
              sx={{ mr: 2 }} 
              disabled={!meeting.location}
            >
              Get Directions
            </Button>
            <Button variant="outlined" startIcon={<Share />}>Share Meeting</Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              height: 300, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              bgcolor: meeting.location ? 'transparent' : 'grey.100', 
              borderRadius: 1 
            }}>
              {meeting.location ? (
                <LocationPicker 
                  onLocationSelect={() => {}} 
                  initialLocation={meeting.location} 
                  interactive={false} 
                  userLocation={userLocation}
                />
              ) : (
                <Typography color="text.secondary">No location set</Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>Attendees ({attendees.length})</Typography>
          <List>
            {attendees.map((attendee) => (
              <ListItem 
                key={attendee.id} 
                secondaryAction={
                  <Chip 
                    label={attendee.status} 
                    size="small" 
                    color={
                      attendee.status === 'confirmed' ? 'success' : 
                      attendee.status === 'pending' ? 'warning' : 'error'
                    } 
                  />
                }
              >
                <ListItemAvatar><Avatar>{attendee.name.charAt(0)}</Avatar></ListItemAvatar>
                <ListItemText primary={attendee.name} secondary={attendee.id === 1 ? 'Organizer' : ''} />
              </ListItem>
            ))}
          </List>
          <Button variant="outlined" startIcon={<Add />} sx={{ mt: 2 }}>Add Attendees</Button>
        </Box>
      )}

      {activeTab === 2 && (
        <Box>
          <Box sx={{ height: 300, overflowY: 'auto', mb: 2, p: 1 }}>
            {messages.map(message => (
              <Box 
                key={message.id} 
                sx={{ 
                  mb: 2, 
                  display: 'flex', 
                  flexDirection: message.sender === 'You' ? 'row-reverse' : 'row' 
                }}
              >
                <Avatar sx={{ 
                  width: 32, 
                  height: 32, 
                  mr: message.sender === 'You' ? 0 : 1, 
                  ml: message.sender === 'You' ? 1 : 0 
                }}>
                  {message.sender.charAt(0)}
                </Avatar>
                <Box sx={{ 
                  maxWidth: '70%', 
                  bgcolor: message.sender === 'You' ? 'primary.light' : 'grey.100', 
                  color: message.sender === 'You' ? 'primary.contrastText' : 'text.primary', 
                  p: 1.5, 
                  borderRadius: 2 
                }}>
                  <Typography variant="subtitle2">{message.sender}</Typography>
                  <Typography variant="body1">{message.text}</Typography>
                  <Typography variant="caption" textAlign="right">{message.time}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
          <Box sx={{ display: 'flex' }}>
            <TextField 
              fullWidth 
              variant="outlined" 
              placeholder="Type a message..." 
              value={newMessage} 
              onChange={(e) => setNewMessage(e.target.value)} 
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} 
            />
            <Button 
              variant="contained" 
              startIcon={<Message />} 
              onClick={handleSendMessage} 
              sx={{ ml: 1 }} 
              disabled={!newMessage.trim()}
            >
              Send
            </Button>
          </Box>
        </Box>
      )}
    </Paper>
  );
}

export default MeetingDetails;
