const User = require('../models/User');
const Otp = require('../models/Otp');
const jwt = require('jsonwebtoken');
const { sendSMS } = require('../services/smsService');

exports.sendOTP = async (req, res) => {
  try {
    const { phone } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    await Otp.create({ phone, code: otp });
    
    // In production: await sendSMS(phone, `Your OTP is: ${otp}`);
    console.log(`OTP for ${phone}: ${otp}`);
    
    res.json({ success: true, message: 'OTP sent' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { phone, code } = req.body;
    const otp = await Otp.findOne({ phone, code }).sort({ createdAt: -1 });
    
    if (!otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
    
    let user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({ phone });
    }
    
    const token = jwt.sign(
      { userId: user._id, phone: user.phone },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({ 
      success: true, 
      token,
      user: {
        _id: user._id,
        phone: user.phone,
        name: user.name,
        isAdmin: user.isAdmin
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};