const Meeting = require('../models/Meeting');
const User = require('../models/User');
const { calculateMidpoint } = require('../services/locationService');
const { getNearbyPlaces } = require('../services/mapService');

exports.createMeeting = async (req, res) => {
  try {
    const { title, description, datetime, invitees } = req.body;
    
    const meeting = new Meeting({
      title,
      description,
      datetime,
      creator: req.user.userId,
      attendees: [
        { user: req.user.userId, status: 'accepted' },
        ...invitees.map(phone => ({ phone, status: 'pending' }))
      ]
    });
    
    await meeting.save();
    res.status(201).json({ success: true, meeting });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find({
      'attendees.user': req.user.userId
    }).populate('creator attendees.user', 'name phone');
    
    res.json({ success: true, meetings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const meeting = await Meeting.findOneAndUpdate(
      {
        _id: req.params.id,
        'attendees.user': req.user.userId
      },
      {
        $set: {
          'attendees.$.location': { lat, lng, timestamp: new Date() }
        }
      },
      { new: true }
    );
    
    // Recalculate midpoint
    const locatedAttendees = meeting.attendees.filter(a => a.location);
    if (locatedAttendees.length >= 2) {
      const midpoint = calculateMidpoint(locatedAttendees.map(a => a.location));
      meeting.midpoint = midpoint;
      meeting.suggestedLocations = await getNearbyPlaces(midpoint);
      await meeting.save();
    }
    
    res.json({ success: true, meeting });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};