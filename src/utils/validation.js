/**
 * BeeFund Input Validation Utilities
 * Strict validation for Indian Mobile numbers, Emails, PAN, and Pincode
 */

// Common dummy / test mobile numbers to block
const BLOCKED_MOBILE_NUMBERS = new Set([
    '0000000000',
    '1111111111',
    '2222222222',
    '3333333333',
    '4444444444',
    '5555555555',
    '6666666666',
    '7777777777',
    '8888888888',
    '9999999999',
    '1234567890',
    '0123456789',
    '9876543210',
    '9999988888',
    '9898989898',
    '9090909090',
    '8080808080',
    '7070707070'
]);

/**
 * Validate 10-digit Indian mobile number
 * - Must be exactly 10 digits
 * - Must start with 6, 7, 8, or 9
 * - Must not be a repeated dummy sequence
 */
export const validateIndianMobile = (mobile) => {
    if (!mobile) {
        return { isValid: false, message: 'Mobile number is required.' };
    }

    // Strip all non-digits (handles spaces, hyphens, leading +91)
    let cleaned = mobile.toString().replace(/\D/g, '');

    // Strip leading 91 if 12 digits (e.g. 919876543210)
    if (cleaned.length === 12 && cleaned.startsWith('91')) {
        cleaned = cleaned.substring(2);
    }
    // Strip leading 0 if 11 digits (e.g. 09876543210)
    if (cleaned.length === 11 && cleaned.startsWith('0')) {
        cleaned = cleaned.substring(1);
    }

    if (cleaned.length !== 10) {
        return { isValid: false, message: 'Please enter a valid 10-digit mobile number.' };
    }

    const firstDigit = cleaned.charAt(0);
    if (!['6', '7', '8', '9'].includes(firstDigit)) {
        return { isValid: false, message: 'Indian mobile numbers must start with 6, 7, 8, or 9.' };
    }

    if (BLOCKED_MOBILE_NUMBERS.has(cleaned)) {
        return { isValid: false, message: 'Please provide a genuine, active mobile number.' };
    }

    // Check if all 10 digits are the same
    if (/^(\d)\1{9}$/.test(cleaned)) {
        return { isValid: false, message: 'Please enter a valid, non-repeated mobile number.' };
    }

    return { isValid: true, cleaned, message: '' };
};

/**
 * Clean & format mobile number input (only digits, max 10)
 */
export const cleanMobileInput = (value) => {
    if (!value) return '';
    const digits = value.replace(/\D/g, '');
    // If starts with 91 and has >10 digits, strip 91
    if (digits.startsWith('91') && digits.length > 10) {
        return digits.substring(2, 12);
    }
    // If starts with 0, strip 0
    if (digits.startsWith('0') && digits.length > 10) {
        return digits.substring(1, 11);
    }
    return digits.slice(0, 10);
};

// Common dummy / test emails to block
const BLOCKED_EMAILS = new Set([
    'test@test.com',
    'asdf@asdf.com',
    'abc@abc.com',
    'admin@admin.com',
    'xyz@xyz.com',
    'fake@fake.com',
    'example@example.com',
    'temp@temp.com',
    'mail@mail.com',
    'user@user.com'
]);

/**
 * Validate standard email address
 */
export const validateEmail = (email) => {
    if (!email) {
        return { isValid: false, message: 'Email address is required.' };
    }

    const trimmed = email.trim().toLowerCase();

    // RFC 5322 standard regex for email
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

    if (!emailRegex.test(trimmed)) {
        return { isValid: false, message: 'Please enter a valid email address (e.g. name@gmail.com).' };
    }

    if (BLOCKED_EMAILS.has(trimmed)) {
        return { isValid: false, message: 'Please provide your actual email address.' };
    }

    // Ensure valid TLD length
    const parts = trimmed.split('.');
    const tld = parts[parts.length - 1];
    if (tld.length < 2 || tld.length > 12) {
        return { isValid: false, message: 'Please enter an email with a valid domain extension.' };
    }

    return { isValid: true, cleaned: trimmed, message: '' };
};

/**
 * Validate Indian PAN Card Number (10 alphanumeric chars: 5 letters, 4 digits, 1 letter)
 * Example: ABCDE1234F
 */
export const validatePAN = (pan) => {
    if (!pan) {
        return { isValid: false, message: 'PAN number is required for credit bureau check.' };
    }

    const cleaned = pan.trim().toUpperCase();
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

    if (!panRegex.test(cleaned)) {
        return { isValid: false, message: 'Invalid PAN format. Must be 10 characters (e.g. ABCDE1234F).' };
    }

    // Check 4th character (entity type: P = Individual, C = Company, H = HUF, F = Firm, etc.)
    const entityType = cleaned.charAt(3);
    if (!['P', 'C', 'H', 'F', 'A', 'T', 'B', 'L', 'J', 'G'].includes(entityType)) {
        return { isValid: false, message: 'PAN 4th character must match a valid taxpayer category (e.g. P for Person).' };
    }

    return { isValid: true, cleaned, message: '' };
};

/**
 * Validate Indian Pincode (6 digits, cannot start with 0)
 */
export const validatePincode = (pincode) => {
    if (!pincode) {
        return { isValid: false, message: 'Pincode is required.' };
    }

    const cleaned = pincode.toString().replace(/\D/g, '');
    if (cleaned.length !== 6 || cleaned.startsWith('0')) {
        return { isValid: false, message: 'Please enter a valid 6-digit Indian PIN code.' };
    }

    return { isValid: true, cleaned, message: '' };
};

/**
 * Validate Applicant Age (18 to 80 years)
 */
export const validateAge = (age) => {
    if (!age) {
        return { isValid: false, message: 'Age is required.' };
    }

    const num = parseInt(age, 10);
    if (isNaN(num) || num < 18 || num > 85) {
        return { isValid: false, message: 'Applicant age must be between 18 and 85 years.' };
    }

    return { isValid: true, age: num, message: '' };
};
