const twilio = require('twilio');
require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

const sendSMS = async (to, message) => {
    try {
        if (!accountSid || !authToken || !fromNumber) {
            console.warn('Twilio credentials not configured, SMS will not be sent');
            return { success: false, message: 'SMS service not configured' };
        }

        const result = await client.messages.create({
            body: message,
            from: fromNumber,
            to: to
        });

        console.log('SMS sent successfully:', result.sid);
        return { success: true, messageId: result.sid };
    } catch (error) {
        console.error('Error sending SMS:', error);
        return { success: false, error: error.message };
    }
};

const sendOTP = async (phoneNumber, otp) => {
    const message = `Your Arogya Rahita OTP is: ${otp}. Valid for 5 minutes.`;
    return await sendSMS(phoneNumber, message);
};

module.exports = {
    sendSMS,
    sendOTP
};
