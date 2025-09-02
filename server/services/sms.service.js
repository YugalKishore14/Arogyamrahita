const twilio = require("twilio");
require("dotenv").config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;
const defaultCountryCode = process.env.SMS_DEFAULT_COUNTRY_CODE || "+91";

// Avoid logging secrets; only indicate presence
console.log(
    `Twilio configured: SID=${accountSid ? "set" : "missing"}, Token=${authToken ? "set" : "missing"}, From=${fromNumber || "missing"}`
);

let client;
if (accountSid && authToken) {
    client = twilio(accountSid, authToken);
}

const normalizePhoneNumber = (rawNumber) => {
    if (!rawNumber) return rawNumber;
    const number = String(rawNumber).replace(/\s+/g, "");
    if (number.startsWith("+")) return number; // already E.164
    // If it's a 10-digit number (common for India), prefix default country code
    if (/^\d{10}$/.test(number)) return `${defaultCountryCode}${number}`;
    // If it's 11+ digits without +, prefix +
    if (/^\d{11,15}$/.test(number)) return `+${number}`;
    return number; // fallback
};

const ensureConfigured = () => {
    if (!accountSid || !authToken || !fromNumber) {
        const error = new Error("SMS service not configured: missing Twilio credentials or from number");
        error.code = "SMS_CONFIG_MISSING";
        throw error;
    }
};

const sendSMS = async (to, message) => {
    try {
        ensureConfigured();
        const normalizedTo = normalizePhoneNumber(to);
        const result = await client.messages.create({
            body: message,
            from: fromNumber,
            to: normalizedTo,
        });
        console.log("SMS sent successfully:", result.sid);
        return { success: true, messageId: result.sid };
    } catch (error) {
        console.error("Error sending SMS:", error.message || error);
        return { success: false, error: error.message || String(error) };
    }
};

const sendOTP = async (phoneNumber, otp) => {
    const message = `Your Arogya Rahita OTP is: ${otp}. Valid for 5 minutes.`;
    return await sendSMS(phoneNumber, message);
};

module.exports = {
    sendSMS,
    sendOTP,
};
