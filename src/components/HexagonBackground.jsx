import React from 'react';

const HexagonBackground = ({ opacity = 0.07, className = '' }) => (
    <svg
        className={`hexagon-bg ${className}`}
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '700px',
            height: '700px',
            pointerEvents: 'none',
            zIndex: 0,
        }}
    >
        {/* Row 1 */}
        <polygon points="100,20 140,43 140,89 100,112 60,89 60,43" fill="none" stroke={`rgba(245,158,11,${opacity})`} strokeWidth="1.2" />
        <polygon points="200,20 240,43 240,89 200,112 160,89 160,43" fill="none" stroke={`rgba(245,158,11,${opacity * 0.8})`} strokeWidth="1.2" />
        <polygon points="300,20 340,43 340,89 300,112 260,89 260,43" fill="none" stroke={`rgba(245,158,11,${opacity * 0.6})`} strokeWidth="1.2" />
        {/* Row 2 offset */}
        <polygon points="50,100 90,123 90,169 50,192 10,169 10,123" fill="none" stroke={`rgba(251,191,36,${opacity * 0.7})`} strokeWidth="1.2" />
        <polygon points="150,100 190,123 190,169 150,192 110,169 110,123" fill="none" stroke={`rgba(245,158,11,${opacity})`} strokeWidth="1.2" />
        <polygon points="250,100 290,123 290,169 250,192 210,169 210,123" fill="none" stroke={`rgba(245,158,11,${opacity * 0.8})`} strokeWidth="1.2" />
        <polygon points="350,100 390,123 390,169 350,192 310,169 310,123" fill="none" stroke={`rgba(251,191,36,${opacity * 0.5})`} strokeWidth="1.2" />
        {/* Row 3 */}
        <polygon points="100,180 140,203 140,249 100,272 60,249 60,203" fill="none" stroke={`rgba(245,158,11,${opacity * 0.6})`} strokeWidth="1.2" />
        <polygon points="200,180 240,203 240,249 200,272 160,249 160,203" fill="none" stroke={`rgba(251,191,36,${opacity})`} strokeWidth="1.2" />
        <polygon points="300,180 340,203 340,249 300,272 260,249 260,203" fill="none" stroke={`rgba(245,158,11,${opacity * 0.7})`} strokeWidth="1.2" />
        {/* Row 4 offset */}
        <polygon points="50,260 90,283 90,329 50,352 10,329 10,283" fill="none" stroke={`rgba(245,158,11,${opacity * 0.5})`} strokeWidth="1.2" />
        <polygon points="150,260 190,283 190,329 150,352 110,329 110,283" fill="none" stroke={`rgba(251,191,36,${opacity * 0.8})`} strokeWidth="1.2" />
        <polygon points="250,260 290,283 290,329 250,352 210,329 210,283" fill="none" stroke={`rgba(245,158,11,${opacity})`} strokeWidth="1.2" />
        <polygon points="350,260 390,283 390,329 350,352 310,329 310,283" fill="none" stroke={`rgba(251,191,36,${opacity * 0.6})`} strokeWidth="1.2" />
        {/* Row 5 */}
        <polygon points="100,340 140,363 140,399 100,399 60,399 60,363" fill="none" stroke={`rgba(245,158,11,${opacity * 0.4})`} strokeWidth="1.2" />
        <polygon points="200,340 240,363 240,399 200,399 160,399 160,363" fill="none" stroke={`rgba(251,191,36,${opacity * 0.5})`} strokeWidth="1.2" />
        <polygon points="300,340 340,363 340,399 300,399 260,399 260,363" fill="none" stroke={`rgba(245,158,11,${opacity * 0.3})`} strokeWidth="1.2" />
    </svg>
);

export default HexagonBackground;
