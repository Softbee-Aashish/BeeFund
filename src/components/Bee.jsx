import React from 'react';

const Bee = ({ x, y, rotation, opacity, scale = 1, state }) => {
    // state can be 'FLYING', 'LANDING', 'LANDED'
    const isLanded = state === 'LANDED';

    return (
        <div
            style={{
                position: 'fixed',
                left: 0,
                top: 0,
                width: '32px',
                height: '32px',
                pointerEvents: 'none',
                zIndex: 9999,
                // Remove transform transition for physics-based sub-pixel rendering.
                transition: 'opacity 0.5s ease',
                transform: `translate(${x}px, ${y}px) rotate(${rotation}deg) scale(${scale})`,
                opacity: opacity,
                willChange: 'transform, opacity'
            }}
        >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Wings (flop when flying to simulate motion) */}
                <path d="M12 10C12 10 10 2 6 2C2.5 2 2 6 6 8C8 9 12 10 12 10Z" fill="rgba(255, 255, 255, 0.8)" stroke="#cbd5e1" strokeWidth="1" transform={isLanded ? '' : 'rotate(-10 12 10)'} />
                <path d="M12 10C12 10 14 2 18 2C21.5 2 22 6 18 8C16 9 12 10 12 10Z" fill="rgba(255, 255, 255, 0.8)" stroke="#cbd5e1" strokeWidth="1" transform={isLanded ? '' : 'rotate(10 12 10)'} />
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
};

export default React.memo(Bee);
