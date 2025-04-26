import React, { useState, useEffect } from 'react';
import FDashboard from './fdashboard';
import Header from './header';

const FChangePassword = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [rewritePassword, setRewritePassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const id = localStorage.getItem('regdNo');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== rewritePassword) {
            setError('New password and rewrite password do not match');
        } else {
            setError('');
            try {
                const response = await fetch('http://localhost:5000/api/fchange-password', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: id,
                        oldPassword: oldPassword,
                        newPassword: newPassword,
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    setSuccessMessage(data.message);
                    setOldPassword('');
                    setNewPassword('');
                    setRewritePassword('');
                } else {
                    setError(data.message);
                }
            } catch (error) {
                console.error('Error:', error);
                setError('An error occurred while changing the password.');
            }
        }
    };

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    return (
        <div>
            <Header />
            <div style={styles.mainContainer}>
                <div style={styles.dashboard}>
                    <FDashboard />  
                </div>
                <div style={styles.changePasswordContainer}>
                    <h2 style={styles.title}>Change Password</h2>
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.inputGroup}>
                            <label htmlFor="old-password" style={styles.label}>
                                Old Password
                            </label>
                            <input
                                type="password"
                                id="old-password"
                                placeholder="Enter old password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                style={styles.input}
                                required
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <label htmlFor="new-password" style={styles.label}>
                                New Password
                            </label>
                            <input
                                type="password"
                                id="new-password"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                style={styles.input}
                                required
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <label htmlFor="rewrite-password" style={styles.label}>
                                Rewrite New Password
                            </label>
                            <input
                                type="password"
                                id="rewrite-password"
                                placeholder="Rewrite new password"
                                value={rewritePassword}
                                onChange={(e) => setRewritePassword(e.target.value)}
                                style={styles.input}
                                required
                            />
                        </div>
                        {error && <div style={styles.error}>{error}</div>}
                        {successMessage && <div style={styles.success}>{successMessage}</div>}
                        <button type="submit" style={styles.submitBtn}>
                            Change Password
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

const styles = {
    mainContainer: {
        display: 'flex', 
        height: '80vh', 
        overflow: 'hidden',
    },
    dashboard: {
        width: '250px',
        backgroundColor: '#f4f4f4', 
        marginTop:'50',
        boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
    },
    changePasswordContainer: {
        flex: 1, 
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: '#fff',
        borderLeft: '1px solid #ddd',
    },
    title: {
        textAlign: 'center',
        marginBottom: '20px',
        fontSize: '24px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        width: '100%',
        maxWidth: '400px', 
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        fontSize: '14px',
        marginBottom: '5px',
    },
    input: {
        padding: '10px',
        fontSize: '16px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        width: '100%',
    },
    error: {
        color: 'red',
        fontSize: '14px',
        marginBottom: '10px',
    },
    success: {
        color: 'green',
        fontSize: '14px',
        marginBottom: '10px',
    },
    submitBtn: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#232870',
        color: 'white',
        fontSize: '16px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
};

export default FChangePassword;