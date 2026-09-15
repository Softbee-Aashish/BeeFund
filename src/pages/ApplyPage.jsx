import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import HexagonBackground from '../components/HexagonBackground';
import './ApplyPage.css';

// Google Apps Script Web App URL
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwjEOhV9L2B-ff3faIZ_WZNm-6kVNxQ6N24PVw3w8MKXO0y41TJVJ3exYFIwjjppM87gA/exec';

const LOAN_OPTIONS = [
    { value: 'Working Capital', label: 'Working Capital Loan' },
    { value: 'BL', label: 'Business Loan (BL)' },
    { value: 'HL', label: 'Home Loan (HL)' },
    { value: 'LAP', label: 'Loan Against Property (LAP)' },
    { value: 'Machinery', label: 'Machinery & Equipment Finance' },
    { value: 'Mudra', label: 'Mudra Loan (PMMY)' },
    { value: 'Professional', label: 'Professional Loan (Doctors, CAs)' },
    { value: 'Vehicle', label: 'Vehicle & Auto Loan' },
    { value: 'PL', label: 'Personal Loan (PL)' },
    { value: 'Education', label: 'Education Loan' },
    { value: 'Startup', label: 'Startup India Loan' },
    { value: 'Secured', label: 'Other Secured Loan' },
    { value: 'Unsecured', label: 'Other Unsecured Loan' }
];

const mapParamToLoan = (param) => {
    if (!param) return 'BL';
    const lower = param.toLowerCase();
    if (lower.includes('work') || lower.includes('capital')) return 'Working Capital';
    if (lower.includes('lap') || lower.includes('property')) return 'LAP';
    if (lower.includes('home')) return 'HL';
    if (lower.includes('machin')) return 'Machinery';
    if (lower.includes('mudra')) return 'Mudra';
    if (lower.includes('prof')) return 'Professional';
    if (lower.includes('vehic') || lower.includes('auto') || lower.includes('car')) return 'Vehicle';
    if (lower.includes('pers')) return 'PL';
    if (lower.includes('edu')) return 'Education';
    if (lower.includes('start')) return 'Startup';
    if (lower.includes('unsec')) return 'Unsecured';
    if (lower.includes('sec')) return 'Secured';
    if (lower.includes('business')) return 'BL';
    return param;
};

const ApplyPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState({
        name: '',
        age: '',
        mobile: '',
        email: '',
        loanType: 'BL',
        amount: '',
        comments: ''
    });

    const [showSuccess, setShowSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const product = params.get('product') || params.get('loanType');
        if (product) {
            setFormData(prev => ({
                ...prev,
                loanType: mapParamToLoan(product)
            }));
        }
    }, [location.search]);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError('');

        const payload = {
            fullName: formData.name,
            age: formData.age,
            mobileNumber: formData.mobile,
            emailAddress: formData.email,
            interestedLoanType: formData.loanType,
            desiredLoanAmount: formData.amount,
            comments: formData.comments,
            source: 'Apply / Enquiry Page'
        };

        try {
            await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            setShowSuccess(true);
        } catch (error) {
            console.error('Error submitting enquiry:', error);
            setSubmitError('Failed to submit your enquiry. Please check your connection and try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const closeSuccess = () => {
        setShowSuccess(false);
        navigate('/thank-you');
    };

    return (
        <div className="apply-page">
            <HexagonBackground opacity={0.06} />

            <div className="container apply-container">
                <div className="apply-header">
                    <div className="apply-badge">
                        <span>🐝 25+ Banks & NBFCs • Zero Upfront Fees</span>
                    </div>
                    <h1 className="apply-title">
                        Loan <span className="apply-hl">Enquiry & Application</span>
                    </h1>
                    <p className="apply-subtitle">
                        Share your requirement below to compare best loan rates from 25+ top lenders. Our finance team will contact you within 24 hours.
                    </p>
                </div>

                <div className="apply-card">
                    <form onSubmit={handleSubmit} className="apply-form">
                        <div className="apply-row">
                            <div className="apply-input-group">
                                <label htmlFor="name">Full Name *</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="e.g. John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="apply-input-group">
                                <label htmlFor="age">Age *</label>
                                <input
                                    type="number"
                                    id="age"
                                    name="age"
                                    placeholder="25"
                                    min="18"
                                    max="100"
                                    value={formData.age}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="apply-row">
                            <div className="apply-input-group">
                                <label htmlFor="mobile">Mobile Number *</label>
                                <div className="apply-phone-wrap">
                                    <span className="apply-phone-prefix">+91</span>
                                    <input
                                        type="tel"
                                        id="mobile"
                                        name="mobile"
                                        placeholder="98765 43210"
                                        pattern="[0-9]{10}"
                                        title="Please enter a valid 10-digit mobile number"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="apply-input-group">
                                <label htmlFor="email">Email Address *</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="apply-row">
                            <div className="apply-input-group">
                                <label htmlFor="loanType">Interested Loan Type *</label>
                                <div className="apply-select-wrap">
                                    <select
                                        id="loanType"
                                        name="loanType"
                                        value={formData.loanType}
                                        onChange={handleChange}
                                        required
                                    >
                                        {LOAN_OPTIONS.map(opt => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                    <svg className="apply-select-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </div>
                            </div>
                            <div className="apply-input-group">
                                <label htmlFor="amount">Desired Loan Amount (₹) *</label>
                                <input
                                    type="number"
                                    id="amount"
                                    name="amount"
                                    placeholder="e.g. 5000000"
                                    min="10000"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="apply-input-group">
                            <label htmlFor="comments">Comments / Requirements</label>
                            <textarea
                                id="comments"
                                name="comments"
                                rows="3"
                                placeholder="Please describe your financial requirements or business details..."
                                value={formData.comments}
                                onChange={handleChange}
                            />
                        </div>

                        {submitError && (
                            <div className="apply-error-message">
                                {submitError}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="apply-submit-btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="apply-spinner" />
                                    <span>Submitting Enquiry...</span>
                                </>
                            ) : (
                                <>
                                    <span>Submit Enquiry</span>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="22" y1="2" x2="11" y2="13"></line>
                                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="apply-trust-badges">
                        <div className="apply-trust-item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>
                            <span>Bank-Grade Encryption</span>
                        </div>
                        <div className="apply-trust-item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                            <span>24-Hour Express Review</span>
                        </div>
                        <div className="apply-trust-item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                            <span>100% Free DSA Assistance</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            {showSuccess && (
                <div className="apply-success-overlay">
                    <div className="apply-success-card">
                        <div className="apply-success-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                        </div>
                        <h3>Enquiry Submitted Successfully!</h3>
                        <p>
                            Thank you, {formData.name || 'valued client'}. Our dedicated loan advisors will review your application for {formData.loanType} and contact you promptly.
                        </p>
                        <button className="apply-continue-btn" onClick={closeSuccess}>
                            Continue to BeeFund
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApplyPage;
