// server/utils/utils.js (NEW FILE)

/**
 * A simple logger utility that prefixes the message with a timestamp.
 * This is useful for consistent server-side logging.
 * @param {string} message - The message to log.
 */
exports.log = (message) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
};

/**
 * Utility function to validate common input strings (e.g., usernames, message content).
 * @param {string} str - The string to validate.
 * @returns {boolean} True if valid, false otherwise.
 */
exports.isValidInput = (str) => {
    if (!str || typeof str !== 'string') return false;
    const trimmed = str.trim();
    if (trimmed.length === 0 || trimmed.length > 255) return false;
    return true;
};