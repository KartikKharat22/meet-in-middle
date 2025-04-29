// src/components/Dashboard/MeetingCard.js
import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Avatar,
  Box,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  LocationOn,
  People,
  CalendarToday,
  Directions,
  Edit,
  Delete,
  Share,
  MoreVert,
} from "@mui/icons-material";
import { format, parseISO } from "date-fns";

function MeetingCard({ meeting, past = false, attendees = [] }) {
  // Format date & time
  const formatMeetingTime = (date, time) => format(parseISO(`${date}T${time}`), "h:mm a");
  const formattedTime = formatMeetingTime(meeting.date,meeting.time);

  //Meeting time status
  const getTimeStatus = () => {
    if (past) return 'Past meeting';
    const now= new Date();
    const meetingDateTime = new Date(`${meeting.date}T${meeting.time}`);
    const diffInHours = (meetingDateTime - now) / (1000*60*60);

    if (diffInHours<0) return 'Meeting in progress';
    if (diffInHours<24) return `Today . ${formattedTime}`;
    if (diffInHours<48) return 'Tomorrow';
    return format(meetingDateTime, "MMMM d, yyyy");
  };

  // optimize meeting detail rendering
  const meetingDateTimetails = [
    {icon: <CalendarToday color="action" sx={{fontSize: 18}}/>,text: getTimeStatus()},
    {icon: <LocationOn color='action' sx={{fontSize: 18}}/>, text: meeting.location || 'Location not specified'},
    {icon: <People color="action" sx={{fontSize: 18}} />, text: `${meeting.attendees} ${meeting.attendees ===1 ? "attendee" : attendees}`},
  ];

  //optimize action buttons dynamically
  const actionButtons = past
  ? [{icon: <Share/>, label: 'Share Recap'}]
  :[
    {icon: <Directions/>, label: 'Get Directions'},
    {icon: <Edit fontSize="small" />, tooltip: 'Edit'},
    {icon: <Delete fontSize="small" color="error"/>,tooltip:'Delete'},
  ];
  return (
    <Card 
        sx={{
            width: '100%',
            maxWidth: 400,
            minWidth: 300,
            m: 1,
            boxShadow: 3,
            transition: 'transform 0.2s',
            '&:hover': {transform: 'scale(1.02)'},
        }}
        >
            <CardContent>
                <Box sx={{display: "flex", justifyContent:"space-between", mb: 1}}>
                    <Typography variant="h6" sx={{fontWeight: 'bold'}}>
                        {meeting.title}
                    </Typography>
                    <IconButton size="small">
                        <MoreVert/>
                    </IconButton>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>
                    {meeting.description}
                </Typography>
                
                <Divider sx={{my: 1}}/>

                {/* Dynamically render meeting details */}

                {meetingDateTimetails.map((detail,index) => (
                    <Box sx={{display: 'flex', alignItems:'center', mb:1}}>
                        {detail.icon}
                        <Typography variant="body2">{detail.text}</Typography>
                    </Box>
                ))}

                {/* render participant avatars */}
                {meeting.participants?.length > 0 && (
                    <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
                     {meeting.participants.slice(0, 3).map((participant, index) => (
                        <Tooltip key={index} title={participant.name}>
                            <Avatar
                                src={participant.avatar}
                                sx={{
                                    width: 32,
                                    height: 32,
                                    mr: -1,
                                    border: "2px solid white",
                                    zIndex: meeting.participants.length - index,
                                }}
                             >
                                {participant.name.charAt(0)}
                            </Avatar>
                        </Tooltip>
                ))}

                {meeting.participants.length > 3 && (
                    <Avatar
                        sx={{
                        width: 32,
                        height: 32,
                        fontSize: 12,
                        bgcolor: "grey.300",
                        color: "grey.800",
                        }}
                    >
                        +{meeting.participants.length - 3}
                    </Avatar>
                )}
                </Box>
                )}
            </CardContent>

             {/* Dynamically render action buttons */}
            <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
                {actionButtons.map((action, index) =>
                action.tooltip ? (
                    <Tooltip key={index} title={action.tooltip}>
                    <IconButton size="small">{action.icon}</IconButton>
                    </Tooltip>
                ) : (
                    <Button key={index} size="small" startIcon={action.icon} sx={{ textTransform: "none" }}>
                    {action.label}
                    </Button>
                )
                )}
            </CardActions>
        </Card>
  );
}

export default MeetingCard;
