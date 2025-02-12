import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './header';
import Dashboard from './dashboard';

const Profile = () => {
    const [profileData, setProfileData] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const regdNo = localStorage.getItem('regdNo');
        if (!regdNo) {
            navigate('/login'); 
            return;
        }

        const fetchProfileData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/profile/${regdNo}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setProfileData(data);
                } else {
                    setError('Failed to fetch profile data.');
                }
            } catch (err) {
                console.error('Error fetching profile data:', err);
                setError('Something went wrong. Please try again later.');
            }
        };

        fetchProfileData();
    }, [navigate]);

    if (error) {
        return (
            <div>
                <Header />
                <p style={{ textAlign: 'center', marginTop: '20px', color: 'red' }}>{error}</p>
            </div>
        );
    }

    if (!profileData) {
        return (
            <div>
                <Header />
                <p style={{ textAlign: 'center', marginTop: '20px' }}>Loading...</p>
            </div>
        );
    }

    return (
        <div>
            <Header />
            <div style={styles.container}>
                <div style={styles.sidebar}>
                    <Dashboard />
                </div>
                <div style={styles.body}>
                    <div style={styles.profileContainer}>
                        <h1 style={styles.header}>Profile Details</h1>
                        <div style={styles.profileDetails}>
                            <p>
                                <strong style={{ marginRight: "40px" }}>Name</strong> {profileData.name}
                            </p>
                            <p>
                                <strong style={{ marginRight: "20px" }}>Regd No</strong> {profileData.regdNo}
                            </p>
                            <p>
                                <strong style={{ marginRight: "34px" }}>Branch</strong> {profileData.branch}
                            </p>
                            <p>
                                <strong style={{ marginRight: "30px" }}>Section</strong> {profileData.sec}
                            </p>
                            <p>
                                <strong style={{ marginRight: "42px" }}>Email</strong> {profileData.email}
                            </p>
                            <p>
                                <strong style={{ marginRight: "9px" }}>Phone No</strong> {profileData.phone_no}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        height: '80vh', // Full viewport height
    },
    sidebar: {
        width: '250px',
        position: 'fixed',
        top: '60',
        bottom: '0',
        overflowY: 'auto',
        backgroundColor: '#fff',
        boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
        height: '80vh',
    },
    body: {
        flexGrow: 1,
        marginLeft: '250px', // Space for sidebar
        display: 'flex',
        justifyContent: 'center',
        // alignItems: 'flex-center', // Align to the top
        padding: '10px',
        backgroundColor: '#f9f9f9',
        overflow: 'auto', // Allows scrolling if content overflows
        height: '98vh',
        // width: '280px', // Take up full height of viewport
        boxSizing: 'border-box', // To include padding in the height calculation
    },
    profileContainer: {
        background: '#fff',
        color: '#333',
        padding: '20px 30px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        width: '100%',
        height: '45vh',
        maxWidth: '600px',
        marginTop:'120',
        // overflow: 'hidden', // Prevents overflow within the profile container
    },
    header: {
        fontSize: '24px',
        marginBottom: '20px',
        color: '#232870',
        textAlign: 'center',
    },
    profileDetails: {
        fontSize: '16px',
        lineHeight: '1.8',
        color: '#333',
    },
};


export default Profile;