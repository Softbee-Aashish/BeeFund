import React from "react";
import "./BeeLoader.css";

const BeeLoader = ({ message = "Loading BeeFund Experience...", fullScreen = true }) => {
  return (
    <div className={`bee-loader-overlay ${fullScreen ? "fullscreen" : "inline"}`} role="status" aria-live="polite">
      {/* Ambient background blur and hexagon rings */}
      <div className="bee-loader-backdrop">
        <div className="ambient-glow glow-1"></div>
        <div className="ambient-glow glow-2"></div>
      </div>

      <div className="bee-loader-scene">
        {/* SVG Animation Canvas */}
        <svg className="bee-flight-svg" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="1" />
              <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0.2" />
            </linearGradient>
            <filter id="honeyGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Golden Honeycomb Flight Trail */}
          <path
            className="bee-trail-path"
            d="M 40 260 C 90 230, 110 120, 180 140 C 240 160, 270 90, 200 60 C 130 40, 110 180, 200 200 C 270 210, 310 130, 200 130"
            stroke="url(#goldGlowGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="600"
            strokeDashoffset="600"
            filter="url(#honeyGlow)"
          />

          {/* Magic Hexagon that weaves into place */}
          <polygon
            className="trail-hexagon"
            points="200,85 240,108 240,154 200,177 160,154 160,108"
            stroke="#f59e0b"
            strokeWidth="2.5"
            strokeDasharray="300"
            strokeDashoffset="300"
            fill="rgba(245, 158, 11, 0.08)"
            filter="url(#honeyGlow)"
          />

          {/* Inner Hexagon Core */}
          <polygon
            className="trail-hexagon-inner"
            points="200,100 226,115 226,145 200,160 174,145 174,115"
            stroke="#fbbf24"
            strokeWidth="1.5"
            strokeDasharray="200"
            strokeDashoffset="200"
            fill="rgba(251, 191, 36, 0.06)"
          />

          {/* The Flying Bee */}
          <g className="flying-bee-group">
            {/* Wing Left */}
            <ellipse className="bee-wing wing-left" cx="192" cy="118" rx="7" ry="14" fill="rgba(255, 255, 255, 0.85)" stroke="#fbbf24" strokeWidth="1" />
            {/* Wing Right */}
            <ellipse className="bee-wing wing-right" cx="208" cy="118" rx="7" ry="14" fill="rgba(255, 255, 255, 0.85)" stroke="#fbbf24" strokeWidth="1" />
            
            {/* Bee Body */}
            <ellipse cx="200" cy="130" rx="14" ry="18" fill="#f59e0b" />
            {/* Black Stripes */}
            <path d="M 188 124 Q 200 127 212 124" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
            <path d="M 186 131 Q 200 134 214 131" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
            <path d="M 188 138 Q 200 141 212 138" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
            
            {/* Bee Head */}
            <circle cx="200" cy="115" r="8" fill="#1e293b" />
            {/* Cute Eyes */}
            <circle cx="197" cy="114" r="1.5" fill="#ffffff" />
            <circle cx="203" cy="114" r="1.5" fill="#ffffff" />
            
            {/* Antennas */}
            <path d="M 197 109 Q 194 103 192 105" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 203 109 Q 206 103 208 105" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
            {/* Antenna Tips */}
            <circle cx="192" cy="105" r="1" fill="#f59e0b" />
            <circle cx="208" cy="105" r="1" fill="#f59e0b" />
            
            {/* Stinger */}
            <polygon points="200,150 197,146 203,146" fill="#1e293b" />
          </g>
        </svg>

        {/* Brand Reveal Details */}
        <div className="bee-loader-brand">
          <div className="bee-brand-title">
            <span className="brand-bee">BEE</span>
            <span className="brand-fund">FUND</span>
          </div>
          <div className="bee-tagline">
            <span className="tagline-dot"></span>
            <span>Apka Loan Partner</span>
            <span className="tagline-dot"></span>
          </div>
          <p className="bee-status-message">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default BeeLoader;
