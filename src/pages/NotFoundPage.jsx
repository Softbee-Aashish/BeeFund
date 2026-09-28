import React from 'react';
import { Link } from 'react-router-dom';
import HexagonBackground from '../components/HexagonBackground';

const NotFoundPage = () => {
    return (
        <div className="page-wrapper container section" style={{ minHeight: '65vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', position: 'relative' }}>
            <HexagonBackground opacity={0.04} />
            <div style={{ maxWidth: '600px', margin: '0 auto', zIndex: 2 }}>
                <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem', color: '#0f172a' }}>Page Not Found</h1>
                <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: '1.6' }}>
                    The page you are looking for might have been moved, removed, or is temporarily unavailable. Explore our official financial tools and services below.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link to="/" className="btn btn-primary">
                        Return to Homepage
                    </Link>
                    <Link to="/tools" className="btn btn-secondary">
                        Explore Financial Tools
                    </Link>
                    <Link to="/credit-report" className="btn btn-primary" style={{ background: '#059669', borderColor: '#059669' }}>
                        Free CIBIL Score Check
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
