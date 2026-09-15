import React, { useState, useEffect, useRef } from 'react';
import { useEnquiryModal } from '../context/EnquireModalContext';
import './PamphletModal.css';

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwjEOhV9L2B-ff3faIZ_WZNm-6kVNxQ6N24PVw3w8MKXO0y41TJVJ3exYFIwjjppM87gA/exec';

/* ---- Animated Bee SVG with Flapping Wings ---- */
const FlyingCarrierBee = ({ flip = false }) => (
    <div className={`pamphlet-bee ${flip ? 'bee-flipped' : ''}`}>
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="carrier-bee-svg">
            {/* Wings */}
            <path className="bee-wing wing-left" d="M12 10C12 10 10 2 6 2C2.5 2 2 6 6 8C8 9 12 10 12 10Z"
                fill="rgba(255,255,255,0.92)" stroke="#fbbf24" strokeWidth="0.8" />
            <path className="bee-wing wing-right" d="M12 10C12 10 14 2 18 2C21.5 2 22 6 18 8C16 9 12 10 12 10Z"
                fill="rgba(255,255,255,0.92)" stroke="#fbbf24" strokeWidth="0.8" />
            {/* Body */}
            <ellipse cx="12" cy="14" rx="6" ry="8" fill="#f59e0b" />
            {/* Stripes */}
            <path d="M6.5 13C6.5 13 12 15 17.5 13" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M7 16.5C7 16.5 12 18 17 16.5" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" />
            {/* Head */}
            <circle cx="12" cy="8" r="3.5" fill="#1f2937" />
            {/* Antennae */}
            <path d="M10.5 5.5L9 3" stroke="#1f2937" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M13.5 5.5L15 3" stroke="#1f2937" strokeWidth="1.5" strokeLinecap="round" />
            {/* Stinger */}
            <path d="M12 22L12 24" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" />
        </svg>
    </div>
);

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

const mapLoanType = (incoming) => {
    if (!incoming) return 'BL';
    const lower = incoming.toLowerCase();
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
    return incoming;
};

const PamphletModal = () => {
    const { isOpen, modalData, closeEnquiryModal } = useEnquiryModal();
    const modalContentRef = useRef(null);

    const [formData, setFormData] = useState({
        name: '',
        age: '',
        mobile: '',
        email: '',
        loanType: 'BL',
        amount: '',
        comments: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    // Sync loanType when modalData changes
    useEffect(() => {
        if (isOpen) {
            setFormData(prev => ({
                ...prev,
                loanType: mapLoanType(modalData.loanType),
                amount: modalData.amount || prev.amount
            }));
            setShowSuccess(false);
            setSubmitError('');
        }
    }, [isOpen, modalData]);

    // Handle ESC key to close
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                closeEnquiryModal();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, closeEnquiryModal]);

    // Prevent body scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

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
            source: modalData.source || 'Enquiry Pamphlet'
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
        } catch (err) {
            console.error('Enquiry submission error:', err);
            setSubmitError('Unable to send enquiry. Please check your network or try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="pamphlet-overlay" onClick={closeEnquiryModal}>
            <div
                className="pamphlet-container"
                onClick={(e) => e.stopPropagation()}
                ref={modalContentRef}
            >
                {/* Carrier Bees & Suspension Ropes */}
                <div className="pamphlet-carrier-rig">
                    <div className="bee-rope-anchor bee-anchor-left">
                        <FlyingCarrierBee />
                        <div className="pamphlet-rope" />
                        <div className="pamphlet-grommet" />
                    </div>
                    <div className="bee-rope-anchor bee-anchor-right">
                        <FlyingCarrierBee flip={true} />
                        <div className="pamphlet-rope" />
                        <div className="pamphlet-grommet" />
                    </div>
                </div>

                {/* The Flying Wind-Wave Pamphlet Scroll */}
                <div className="pamphlet-body">
                    {/* Top Golden Accent Trim */}
                    <div className="pamphlet-trim" />

                    {/* Close Button */}
                    <button
                        className="pamphlet-close-btn"
                        onClick={closeEnquiryModal}
                        aria-label="Close enquiry modal"
                    >
                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>

                    {!showSuccess ? (
                        <>
                            {/* Header / Intro */}
                            <div className="pamphlet-header">
                                <div className="pamphlet-badge">
                                    <span className="badge-dot" />
                                    <span>Instant Loan Enquiry</span>
                                </div>
                                <h2 className="pamphlet-title">
                                    Enquire with <span className="pamphlet-brand">BeeFund</span>
                                </h2>
                                <p className="pamphlet-subtitle">
                                    Get the best tailored interest rates from 25+ banks. Our loan experts will contact you within 24 hours.
                                </p>
                            </div>

                            {/* Enquiry Form */}
                            <form onSubmit={handleSubmit} className="pamphlet-form">
                                <div className="form-grid-2">
                                    <div className="p-input-group">
                                        <label htmlFor="p-name">Full Name *</label>
                                        <input
                                            type="text"
                                            id="p-name"
                                            name="name"
                                            placeholder="e.g. Rahul Sharma"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="p-input-group">
                                        <label htmlFor="p-age">Age *</label>
                                        <input
                                            type="number"
                                            id="p-age"
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

                                <div className="form-grid-2">
                                    <div className="p-input-group">
                                        <label htmlFor="p-mobile">Mobile Number *</label>
                                        <div className="phone-input-wrap">
                                            <span className="phone-prefix">+91</span>
                                            <input
                                                type="tel"
                                                id="p-mobile"
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
                                    <div className="p-input-group">
                                        <label htmlFor="p-email">Email Address *</label>
                                        <input
                                            type="email"
                                            id="p-email"
                                            name="email"
                                            placeholder="rahul@example.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-grid-2">
                                    <div className="p-input-group">
                                        <label htmlFor="p-loanType">Interested Loan Type *</label>
                                        <div className="p-select-wrap">
                                            <select
                                                id="p-loanType"
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
                                            <svg className="p-select-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="6 9 12 15 18 9"></polyline>
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="p-input-group">
                                        <label htmlFor="p-amount">Desired Loan Amount (₹) *</label>
                                        <input
                                            type="number"
                                            id="p-amount"
                                            name="amount"
                                            placeholder="e.g. 2500000"
                                            min="10000"
                                            step="5000"
                                            value={formData.amount}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="p-input-group full-width">
                                    <label htmlFor="p-comments">Requirements / Comments</label>
                                    <textarea
                                        id="p-comments"
                                        name="comments"
                                        rows="3"
                                        placeholder="Briefly describe your loan requirement, business profile, or preferred bank..."
                                        value={formData.comments}
                                        onChange={handleChange}
                                    />
                                </div>

                                {submitError && (
                                    <div className="p-error-banner">
                                        {submitError}
                                    </div>
                                )}

                                <div className="pamphlet-footer">
                                    <button
                                        type="submit"
                                        className="pamphlet-submit-btn"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="p-spinner" />
                                                <span>Submitting Enquiry...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Submit Enquiry</span>
                                                <svg className="p-btn-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <line x1="22" y1="2" x2="11" y2="13"></line>
                                                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                                </svg>
                                            </>
                                        )}
                                    </button>
                                    <span className="p-privacy-note">
                                        🔒 100% confidential • Zero spam guarantee
                                    </span>
                                </div>
                            </form>
                        </>
                    ) : (
                        /* Success View */
                        <div className="pamphlet-success-view">
                            <div className="p-success-badge">
                                <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                            </div>
                            <h3>Enquiry Received Successfully!</h3>
                            <p>
                                Thank you, <strong>{formData.name || 'valued customer'}</strong>. Our loan advisory team has received your details for <strong>{formData.loanType}</strong> and will contact you within 24 hours.
                            </p>
                            <div className="p-success-meta">
                                <span>Reference: BF-{Math.floor(100000 + Math.random() * 900000)}</span>
                                <span>Direct Helpline: +91 96253 51970</span>
                            </div>
                            <button
                                type="button"
                                className="pamphlet-ok-btn"
                                onClick={closeEnquiryModal}
                            >
                                Got it, Thank you!
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PamphletModal;
