import React, { useState } from 'react';
import {
    TextField,
    Button,
    Typography,
    Container,
    Grid,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Autocomplete,
} from "@mui/material";
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useNavigate } from 'react-router-dom';
import API from '../../utils/api';
import LocationPicker from '../Map/LocationPicker';

function CreateMeeting() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(null);
    const [time, setTime] = useState(null);
    const [duration, setDuration] = useState(60);
    const [attendees, setAttendees] = useState([]);
    const [location, setLocation] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    navigate('/dashboard');
    
    const [contacts, setContacts] = useState([
        {name: 'Kartik Kharat', phone: '+1234567890'},
        {name: 'Pankaj Bhalke', phone: '+9876543210'},
    ]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!date || !time) {
            setError('Please select both date and time');
            setLoading(false);
            return;
        }

    
        const meetingDateTime = new Date(date);
        meetingDateTime.setHours(time.getHours());
        meetingDateTime.setMinutes(time.getMinutes());

        try {
            const meetingData = {
                title,
                description,
                datetime: meetingDateTime,
                duration,
                invitees: attendees.map(attendee => attendee.phone),
                location: location ? {
                    lat: location.lat,
                    lng: location.lng
                } : null
            };

            const res = await API.post('/meetings', meetingData);
        
            navigate(`/meeting/${res.data.meeting._id}`);
          } catch (err) {
            console.error('Meeting creation failed:', err);

        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth='md'>
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Typography variant='h4' gutterBottom>Create New Meeting</Typography>
                {error && (
                    <Typography color="error" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                )}
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label='Meeting Title'
                                variant='outlined'
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label='Description'
                                variant='outlined'
                                multiline
                                rows={4}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label='Meeting Date'
                                    value={date}
                                    onChange={(newValue) => setDate(newValue)}
                                    renderInput={(params) => <TextField {...params} fullWidth required />}
                                />
                            </LocalizationProvider>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <TimePicker
                                    label='Meeting Time'
                                    value={time}
                                    onChange={(newValue) => setTime(newValue)}
                                    renderInput={(params) => <TextField {...params} fullWidth required />}
                                />
                            </LocalizationProvider>
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Duration (minutes)</InputLabel>
                                <Select
                                    value={duration}
                                    label='Duration (minutes)'
                                    onChange={(e) => setDuration(e.target.value)}
                                >
                                    <MenuItem value={30}>30 minutes</MenuItem>
                                    <MenuItem value={60}>1 hour</MenuItem>
                                    <MenuItem value={90}>1.5 hours</MenuItem>
                                    <MenuItem value={120}>2 hours</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <Autocomplete
                                multiple
                                options={contacts}
                                getOptionLabel={(option) => `${option.name} (${option.phone})`}
                                value={attendees}
                                onChange={(_, newValue) => setAttendees(newValue)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label='Invite Attendees'
                                        placeholder='Search contacts'
                                    />
                                )}
                                isOptionEqualToValue={(option, value) => option.phone === value.phone}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <LocationPicker
                                onLocationSelect={setLocation}
                                initialLocation={location}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                type='submit'
                                variant='contained'
                                color='primary'
                                size='large'
                                fullWidth
                                disabled={loading}
                            >
                                {loading ? 'Creating...' : 'Create Meeting'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
}

export default CreateMeeting;