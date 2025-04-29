const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^\+?[1-9]\d{1,14}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  name: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  profilePicture: String,
  isAdmin: {
    type: Boolean,
    default: false
  },
  fcmToken: String
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);