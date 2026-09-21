import React from 'react';
import { Link } from 'react-router-dom';
import HexagonBackground from '../components/HexagonBackground';

const NotFoundPage = () => {
    return (
        <div className="page-wrapper container section" style={{ minHeight: '65vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', position: 'relative' }}>
            <HexagonBackground opacity={0.04} />
            <div style={{ maxWidth: '600px', margin: '0 auto', zIndex: 2 }}>
                <span style={{ fontSize: '4.5rem', display: 'block', marginBottom: '1rem' }}>🔍</span>
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
