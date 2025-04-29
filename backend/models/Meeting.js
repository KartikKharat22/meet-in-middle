const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  datetime: {
    type: Date,
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  attendees: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined'],
      default: 'pending'
    },
    location: {
      lat: Number,
      lng: Number,
      timestamp: Date
    }
  }],
  suggestedLocations: [{
    placeId: String,
    name: String,
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    },
    rating: Number,
    types: [String],
    distanceFromMidpoint: Number
  }],
  midpoint: {
    lat: Number,
    lng: Number
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Meeting', meetingSchema);