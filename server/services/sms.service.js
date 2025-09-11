const axios = require("axios");
require("dotenv").config();

const MSG91_AUTHKEY = process.env.MSG91_AUTHKEY;
const MSG91_SENDER_ID = process.env.MSG91_SENDER_ID;
const MSG91_TEMPLATE_ID = process.env.MSG91_TEMPLATE_ID;
const MSG91_DLT_ENTITY_ID = process.env.MSG91_DLT_ENTITY_ID;
const SMS_DEFAULT_COUNTRY_CODE = process.env.SMS_DEFAULT_COUNTRY_CODE || "+91";

console.log(
    `MSG91 configured: AUTHKEY=${MSG91_AUTHKEY ? "set" : "missing"}, SENDER=${MSG91_SENDER_ID || "missing"}, TEMPLATE=${MSG91_TEMPLATE_ID || "missing"}`
);

const normalizePhoneNumber = (rawNumber) => {
    if (!rawNumber) return rawNumber;
    const number = String(rawNumber).replace(/\s+/g, "");
    if (number.startsWith("+")) return number;
    if (/^\d{10}$/.test(number)) return `${SMS_DEFAULT_COUNTRY_CODE}${number}`;
    if (/^\d{11,15}$/.test(number)) return `+${number}`;
    return number;
};

const ensureConfigured = () => {
    if (!MSG91_AUTHKEY || !MSG91_SENDER_ID || !MSG91_TEMPLATE_ID) {
        const error = new Error("SMS service not configured: missing MSG91 credentials/sender/template");
        error.code = "SMS_CONFIG_MISSING";
        throw error;
    }
};

const sendSMS = async (to, message) => {
    try {
        ensureConfigured();
        const normalizedTo = normalizePhoneNumber(to);

        const url = "https://control.msg91.com/api/v5/flow/";
        const payload = {
            template_id: MSG91_TEMPLATE_ID,
            sender: MSG91_SENDER_ID,
            short_url: "1",
            recipients: [
                {
                    mobiles: normalizedTo.replace(/^\+/, ""),
                    message: message,
                },
            ],
        };
        if (MSG91_DLT_ENTITY_ID) payload.dlt_entity_id = MSG91_DLT_ENTITY_ID;

        const headers = {
            accept: "application/json",
            "content-type": "application/json",
            authkey: MSG91_AUTHKEY,
        };

        const { data, status } = await axios.post(url, payload, { headers });
        if (status >= 200 && status < 300) {
            console.log("SMS sent via MSG91:", data);
            return { success: true, data };
        }
        return { success: false, error: `MSG91 error status ${status}` };
    } catch (error) {
        console.error("Error sending SMS via MSG91:", error.response?.data || error.message || error);
        return { success: false, error: error.response?.data || error.message || String(error) };
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
