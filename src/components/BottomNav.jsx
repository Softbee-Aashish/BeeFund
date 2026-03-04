import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faMoneyBillWave, faCalculator, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import './BottomNav.css';

const BottomNav = () => {
    const navItems = [
        { path: '/', label: 'Home', icon: faHome },
        { path: '/loans', label: 'Loans', icon: faMoneyBillWave },
        { path: '/tools', label: 'Tools', icon: faCalculator },
        { path: '/contact', label: 'Contact', icon: faEnvelope }
    ];

    return (
        <nav className="bottom-nav">
            <ul className="bottom-nav-list">
                {navItems.map((item) => (
                    <li key={item.path} className="bottom-nav-item">
                        <NavLink
                            to={item.path}
                            className={({ isActive }) => `bottom-nav-link ${isActive ? 'active' : ''}`}
                        >
                            <FontAwesomeIcon icon={item.icon} className="bottom-nav-icon" />
                            <span className="bottom-nav-label">{item.label}</span>
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default BottomNav;
