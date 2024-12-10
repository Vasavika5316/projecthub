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
                                <strong>Name:</strong> {profileData.name}
                            </p>
                            <p>
                                <strong>Regd. No:</strong> {profileData.regdno}
                            </p>
                            <p>
                                <strong>Branch:</strong> {profileData.branch}
                            </p>
                            <p>
                                <strong>Section:</strong> {profileData.section}
                            </p>
                            <p>
                                <strong>Email:</strong> {profileData.email}
                            </p>
                            <p>
                                <strong>Phone No:</strong> {profileData.phoneNo}
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
        height: '100vh',
    },
    sidebar: {
        width: '250px',
        position: 'fixed',
        top: '40',
        bottom: '0',
        overflowY: 'auto',
        padding: '20px',
        backgroundColor: '#fff',
        boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
        height: '100vh', 
    },
    body: {
        flexGrow: 1,
        marginLeft: '250px', 
        display: 'flex',
        justifyContent: 'center', 
        alignItems: 'center',
        height: '100vh', 
        padding: '20px',
        backgroundColor: '#f9f9f9',
        overflow: 'hidden', 
    },
    profileContainer: {
        background: '#fff',
        color: '#333',
        padding: '20px 30px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        width: '100%',
        maxWidth: '600px',
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
