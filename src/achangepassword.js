import React, { useState, useEffect } from 'react';
import Header from './header'; // Assuming you have a Header component
import ADashboard from './adashboard'; // Assuming you have an Admin Dashboard component

const AddStudent = () => {
    const [studentId, setStudentId] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [branch, setBranch] = useState('');
    const [section, setSection] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation: check for valid phone and email
        const phonePattern = /^[0-9]{10}$/;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!phonePattern.test(phone)) {
            setError('Phone number must be 10 digits');
            return;
        }

        if (!emailPattern.test(email)) {
            setError('Invalid email format');
            return;
        }

        // If all validations pass, clear the error
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/add-student', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    studentId,
                    name,
                    phone,
                    email,
                    branch,
                    section,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage('Student added successfully!');
                // Reset fields after successful submission
                setStudentId('');
                setName('');
                setPhone('');
                setEmail('');
                setBranch('');
                setSection('');
            } else {
                setError(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred while adding the student.');
        }
    };

    // Reset success message after 1 second
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
                    <ADashboard />
                </div>
                <div style={styles.addStudentContainer}>
                    <h2 style={styles.title}>Add Student</h2>
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.inputGroup}>
                            <label htmlFor="student-id" style={styles.label}>
                                Student ID
                            </label>
                            <input
                                type="text"
                                id="student-id"
                                placeholder="Enter student ID"
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value)}
                                style={styles.input}
                                required
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <label htmlFor="name" style={styles.label}>
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                placeholder="Enter name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                style={styles.input}
                                required
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <label htmlFor="phone" style={styles.label}>
                                Phone Number
                            </label>
                            <input
                                type="text"
                                id="phone"
                                placeholder="Enter phone number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                style={styles.input}
                                required
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <label htmlFor="email" style={styles.label}>
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={styles.input}
                                required
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <label htmlFor="branch" style={styles.label}>
                                Branch
                            </label>
                            <input
                                type="text"
                                id="branch"
                                placeholder="Enter branch"
                                value={branch}
                                onChange={(e) => setBranch(e.target.value)}
                                style={styles.input}
                                required
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <label htmlFor="section" style={styles.label}>
                                Section
                            </label>
                            <input
                                type="text"
                                id="section"
                                placeholder="Enter section"
                                value={section}
                                onChange={(e) => setSection(e.target.value)}
                                style={styles.input}
                                required
                            />
                        </div>
                        {error && <div style={styles.error}>{error}</div>}
                        {successMessage && <div style={styles.success}>{successMessage}</div>}
                        <button type="submit" style={styles.submitBtn}>
                            Add Student
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
        marginTop: '50px',
        boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
    },
    addStudentContainer: {
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

export default AddStudent;
