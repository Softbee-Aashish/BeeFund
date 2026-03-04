import React from 'react';
import { Link } from 'react-router-dom';

const ThankYouPage = () => {
    return (
        <div className="page-wrapper container section text-center" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <div className="card" style={{ maxWidth: '500px', width: '100%' }}>
                <h1 className="mb-3" style={{ color: 'var(--primary-dark)' }}>Thank You!</h1>
                <p className="mb-5">We have received your submission. Our team will get back to you shortly.</p>
                <Link to="/" className="btn btn-outline">Return to Home</Link>
            </div>
        </div>
    );
};

export default ThankYouPage;
