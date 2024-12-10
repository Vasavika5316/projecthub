import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './header';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const validateLogin = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Login successful:', data);
                localStorage.setItem('regdNo', username);
                navigate('/home'); 
            } else {
                setError('Incorrect username or password. Please try again.');
            }
        } catch (err) {
            console.error('Error during login:', err);
            setError('Something went wrong. Please try again later.');
        }
    };

    return (
        <div>
            <Header />
            <div style={styles.body}>
                <div style={styles.loginContainer}>
                    <h1 style={styles.header}>Login</h1>
                    {error && <div style={styles.error}>{error}</div>}
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={styles.input}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                        required
                    />
                    <button onClick={validateLogin} style={styles.button}>
                        Log In
                    </button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    body: {
        fontFamily: "'Roboto', sans-serif",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        color: '#fff',
    },
    loginContainer: {
        background: '#fff',
        color: '#333',
        padding: '20px 30px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        textAlign: 'center',
        width: '100%',
        maxWidth: '400px',
    },
    header: {
        fontSize: '24px',
        marginBottom: '20px',
        color: '#232870',
    },
    input: {
        width: 'calc(100% - 20px)',
        padding: '10px',
        margin: '10px 0',
        border: '1px solid #ccc',
        borderRadius: '4px',
    },
    button: {
        width: '100%',
        padding: '10px',
        marginTop: '15px',
        background: '#232870',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        cursor: 'pointer',
    },
    error: {
        color: 'red',
        fontSize: '14px',
        marginBottom: '10px',
    },
};

export default Login;
