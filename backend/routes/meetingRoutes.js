const express = require('express');
const router = express.Router();
const { auth } = require('../config/auth');
const {
  createMeeting,
  getMeetings,
  updateLocation
} = require('../controllers/meetingController');

router.use(auth);

router.post('/', createMeeting);
router.get('/', getMeetings);
router.put('/:id/location', updateLocation);

module.exports = router;