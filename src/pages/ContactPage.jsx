import React, { useState } from 'react';
import HexagonBackground from '../components/HexagonBackground';
import './ContactPage.css';

// 🔥 PASTE YOUR WEB APP URL HERE 🔥
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwjEOhV9L2B-ff3faIZ_WZNm-6kVNxQ6N24PVw3w8MKXO0y41TJVJ3exYFIwjjppM87gA/exec';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        mobile: '',
        email: '',
        loanType: '',
        amount: '',
        comments: ''
    });

    const [showSuccess, setShowSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsSubmitting(true);
        setSubmitError('');

        // Map form data to the keys expected by the Google Apps Script
        const payload = {
            fullName: formData.name,
            age: formData.age,
            mobileNumber: formData.mobile,
            emailAddress: formData.email,
            interestedLoanType: formData.loanType,
            desiredLoanAmount: formData.amount,
            comments: formData.comments
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

            // Show success popup
            setShowSuccess(true);
        } catch (error) {
            console.error('Error submitting inquiry:', error);
            setSubmitError('Failed to submit inquiry. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const closeSuccess = () => {
        setShowSuccess(false);
        setFormData({
            name: '',
            age: '',
            mobile: '',
            email: '',
            loanType: '',
            comments: ''
        });
    };

    return (
        <div className="contact-page">
            <HexagonBackground opacity={0.06} />

            <div className="container contact-container">
                <div className="contact-header">
                    <h1 className="contact-title">Get In <span className="contact-hl">Touch</span></h1>
                    <p className="contact-subtitle">We are here to help you find the perfect financial solution.</p>
                </div>

                <div className="contact-grid">
                    {/* Left Panel - Info */}
                    <div className="contact-info-panel">
                        <h2>We're here to help</h2>
                        <p>Have questions about our loan products or the application process? Reach out to our expert team for guidance.</p>

                        <div className="contact-details">
                            <div className="cd-item">
                                <div className="cd-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                </div>
                                <div>
                                    <span>Call Us</span>
                                    <strong>+91 96253 51970</strong>
                                </div>
                            </div>

                            <div className="cd-item">
                                <div className="cd-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                </div>
                                <div>
                                    <span>Email Us</span>
                                    <strong>softbee@outlook.in</strong>
                                </div>
                            </div>

                            <div className="cd-item">
                                <div className="cd-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                </div>
                                <div>
                                    <span>Visit Us</span>
                                    <strong>Delhi, India</strong>
                                </div>
                            </div>
                        </div>

                        {/* Aesthetic decorative bees */}
                        <div className="contact-deco">
                            <svg className="deco-bee b1" width="32" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>
                            <svg className="deco-bee b2" width="24" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>
                        </div>
                    </div>

                    {/* Right Panel - Form */}
                    <div className="contact-form-panel">
                        <form onSubmit={handleSubmit} className="c-form">
                            <h3>Send a Message</h3>

                            <div className="form-row">
                                <div className="input-group">
                                    <label htmlFor="name">Full Name *</label>
                                    <input type="text" id="name" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
                                </div>
                                <div className="input-group">
                                    <label htmlFor="age">Age *</label>
                                    <input type="number" id="age" name="age" placeholder="25" min="18" max="100" value={formData.age} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="input-group">
                                    <label htmlFor="mobile">Mobile Number *</label>
                                    <input type="tel" id="mobile" name="mobile" placeholder="+91 XXXXX XXXXX" pattern="[0-9+\s-]+" value={formData.mobile} onChange={handleChange} required />
                                </div>
                                <div className="input-group">
                                    <label htmlFor="email">Email Address *</label>
                                    <input type="email" id="email" name="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                                    <label htmlFor="loanType">Interested Loan Type *</label>
                                    <div className="select-wrapper">
                                        <select id="loanType" name="loanType" value={formData.loanType} onChange={handleChange} required>
                                            <option value="" disabled>Select a loan type</option>
                                            <option value="BL">Business Loan (BL)</option>
                                            <option value="PL">Personal Loan (PL)</option>
                                            <option value="HL">Home Loan (HL)</option>
                                            <option value="LAP">Loan Against Property (LAP)</option>
                                            <option value="Secured">Secured Loan</option>
                                            <option value="Unsecured">Unsecured Loan</option>
                                        </select>
                                        <svg className="select-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </div>
                                </div>
                            </div>

                            <div className="input-group">
                                <label htmlFor="amount">Desired Loan Amount (₹) *</label>
                                <input type="number" id="amount" name="amount" placeholder="e.g. 5000000" min="10000" value={formData.amount} onChange={handleChange} required />
                            </div>

                            <div className="input-group">
                                <label htmlFor="comments">Comments / Requirements *</label>
                                <textarea id="comments" name="comments" rows="4" placeholder="Please describe your financial requirements..." value={formData.comments} onChange={handleChange} required></textarea>
                            </div>

                            {submitError && <div className="error-message" style={{ color: '#ef4444', textAlign: 'center', marginBottom: '1rem', padding: '10px', backgroundColor: '#fee2e2', borderRadius: '8px' }}>{submitError}</div>}

                            <button type="submit" className="btn-submit" disabled={isSubmitting} style={{ opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
                                <span>{isSubmitting ? 'Submitting...' : 'Submit Inquiry'}</span>
                                {!isSubmitting && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            {showSuccess && (
                <div className="success-modal-overlay">
                    <div className="success-modal">
                        <button className="modal-close" onClick={closeSuccess}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                        <div className="modal-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        </div>
                        <h3>Thank You!</h3>
                        <p>Your inquiry has been successfully submitted. Our financial experts will review your details and contact you within 24 hours.</p>
                        <button className="btn-modal-ok" onClick={closeSuccess}>Got it, thanks!</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContactPage;
