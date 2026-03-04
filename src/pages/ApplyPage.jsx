import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 🔥 PASTE YOUR WEB APP URL HERE 🔥
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwjEOhV9L2B-ff3faIZ_WZNm-6kVNxQ6N24PVw3w8MKXO0y41TJVJ3exYFIwjjppM87gA/exec';

const ApplyPage = () => {
    const navigate = useNavigate();
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
        setFormData({ ...formData, [e.target.name]: e.target.value });
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

            setShowSuccess(true);
            setTimeout(() => {
                navigate('/thank-you');
            }, 3000);
        } catch (error) {
            console.error('Error submitting application:', error);
            setSubmitError('Failed to submit application. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const closeSuccess = () => {
        setShowSuccess(false);
        navigate('/thank-you');
    };

    return (
        <div className="contact-page">
            {/* HERO SECTION */}
            <section className="contact-hero">
                <div className="container text-center text-white" style={{ position: 'relative', zIndex: 2 }}>
                    <h1 className="mb-2">Loan Application</h1>
                    <p style={{ opacity: 0.9, maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
                        Fill out the form below to initiate your official loan application. Our expert team will process your request within 24 hours.
                    </p>
                </div>
            </section>

            {/* MAIN CONTENT */}
            <div className="container section contact-main">
                <div className="contact-grid" style={{ gridTemplateColumns: 'minmax(0, 800px)', justifyContent: 'center' }}>
                    {/* The Form Panel - Centered */}
                    <div className="contact-form-panel">
                        <form onSubmit={handleSubmit} className="c-form">
                            <h3 style={{ textAlign: 'center', marginBottom: '2rem' }}>Application Details</h3>

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
                                <span>{isSubmitting ? 'Submitting...' : 'Submit Application'}</span>
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
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                        <div className="success-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        </div>
                        <h3>Application Submitted Successfully!</h3>
                        <p>Thank you, {formData.name || 'User'}. Our team will review your application and get back to you shortly.</p>
                        <button className="btn btn-primary" onClick={closeSuccess}>Continue</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApplyPage;
