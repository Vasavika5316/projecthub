import React, { useState } from 'react';
import Dashboard from './dashboard';
import Header from './header';

const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [rewritePassword, setRewritePassword] = useState('');
    const [error, setError] = useState('');
    const regdNo = localStorage.getItem('regdNo');
    const handleSubmit = (e) => {
        e.preventDefault();

        if (newPassword !== rewritePassword) {
            setError('New password and rewrite password do not match');
        } else {
            setError('');
            alert('Password changed successfully!');
        }
    };

    return (
        <div>
            <Header />
            <div style={styles.mainContainer}>
                <div style={styles.dashboard}>
                    <Dashboard />
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
        height: '100vh', 
        overflow: 'hidden',
    },
    dashboard: {
        width: '250px',
        backgroundColor: '#f4f4f4', 
        padding: '20px',
        marginTop:'40',
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

export default ChangePassword;

