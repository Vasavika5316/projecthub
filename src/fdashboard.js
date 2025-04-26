import React, { useState } from 'react';
import { NavLink } from 'react-router-dom'; 

const FDashboard = () => {
    const [activeLink, setActiveLink] = useState('home');

    const handleLogout = () => {
        localStorage.removeItem("regdNo"); 
        window.location.href = "/"; 
    };

    const sidebarStyle = {
        background: 'linear-gradient(to bottom, #1E293B, #232870)', 
        color: '#F8FAFC',
        width: '260px',
        height: '100vh', 
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        position: 'fixed',
        left: '0',
        boxSizing: 'border-box', 
    };

    const headingStyle = {
        textAlign: 'center',
        width: '100%',
        marginBottom: '20px',
        fontSize: '22px',
        borderBottom: '1px solid #F8FAFC',
        paddingBottom: '10px',
    };

    const linkStyle = {
        textDecoration: 'none',
        color: '#F8FAFC',
        padding: '10px',
        margin: '5px 0',
        width: '100%',
        borderRadius: '4px',
        fontSize: '16px',
        transition: 'background 0.3s',
    };

    const activeLinkStyle = {
        ...linkStyle,
        backgroundColor: '#232870', 
        fontWeight: 'bold',
    };

    return (
        <div style={sidebarStyle}>
            <h2 style={headingStyle}>Dashboard</h2>
            <NavLink
                to="/fhome"
                style={({ isActive }) => isActive ? activeLinkStyle : linkStyle} 
            >
                Home
            </NavLink>
            <NavLink
                to="/fprofile"
                style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}
            >
                Profile
            </NavLink>
            <NavLink
                to="/fmyactivity"
                style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}
            >
                My Activity
            </NavLink>
            <NavLink
                to="/fchangepassword"
                style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}
            >
                Change Password
            </NavLink>
            <NavLink
                to="/fdatavisualization"
                style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}
            >
                Data Visualization
            </NavLink>
            <NavLink
                to="/"
                style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}
                onClick={handleLogout}
            >
                Logout
            </NavLink>
            <NavLink
                to="/fcontact"
                style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}
            >
                Contact Us
            </NavLink>
        </div>
    );
};

export default FDashboard;