const twilio = require('twilio');

const sendSMS = async (to, body) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`SMS to ${to}: ${body}`);
    return;
  }

  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
  
  await client.messages.create({
    body,
    from: process.env.TWILIO_PHONE_NUMBER,
    to
  });
};

module.exports = { sendSMS };
