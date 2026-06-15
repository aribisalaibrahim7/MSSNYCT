// Use require because africastalking is a CommonJS module
const africastalking = require('africastalking');

const credentials = {
    apiKey: process.env.AT_API_KEY || '',
    username: process.env.AT_USERNAME || 'sandbox',
};

// Handle potential initialization differences
let sms: any = null;
try {
    const AT = africastalking(credentials);
    sms = AT.SMS;
} catch (e) {
    console.error("Failed to initialize Africa's Talking:", e);
}

/**
 * Send an SMS notification using Africa's Talking
 * @param to Phone number in international format (e.g., +2348000000000)
 * @param message The text message to send
 */
export async function sendSMS(to: string, message: string) {
    // If credentials aren't set, just log it (prevents crashes during development)
    if (!process.env.AT_API_KEY || process.env.AT_API_KEY === 'your_africastalking_key') {
        console.log(`[SMS Simulation] To: ${to} | Message: ${message}`);
        return { success: true, simulated: true };
    }

    try {
        if (!sms) {
            console.error("SMS service not initialized");
            return { success: false, error: "Not initialized" };
        }
        const result = await sms.send({
            to: [to],
            message: message,
            // from: 'MSSN-HUB' // You need an approved AlphaNumeric Sender ID to use this
        });
        console.log('SMS sent successfully:', result);
        return { success: true, data: result };
    } catch (error) {
        console.error('Africa\'s Talking SMS Error:', error);
        return { success: false, error };
    }
}
