import Header from "./header";
import ADashboard from "./adashboard";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const initialState = {
    name: "",
    regdNo: "",
    branch: "",
    sec: "",
    email: "",
    phone: "",
    batch: "",
    password: ""
};

const AddStudent = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState(initialState);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        const uppercaseFields = ['branch', 'sec', 'regdNo'];
        
        setFormData({
            ...formData,
            [name]: uppercaseFields.includes(name) ? value.toUpperCase() : value
        });
    };

    const validateForm = () => {
        if (!/^[A-Za-z.\s]+$/.test(formData.name)) {
            setError("Name should contain only letters and spaces");
            return false;
        }

        if (!/^[6-9]\d{9}$/.test(formData.phone)) {
            setError("Please enter a valid Indian phone number");
            return false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError("Invalid email format.");
            return false;
        }

        const currentYear = new Date().getFullYear();
        if (!/^\d{4}$/.test(formData.batch) || 
            parseInt(formData.batch) < 2000 || 
            parseInt(formData.batch) > 2030) {
            setError(`Batch must be a 4-digit year between 2000 and 2030`);
            return false;
        }

        if (!/^\d{2}[A-Z]\d{2}[A-Z]\d{2}[A-Z0-9]\d{1}$/.test(formData.regdNo)) {
            setError("Registration number must be in format like 21B01A42A9");
            return false;
        }

        if (!/^[a-z]+\d+$/.test(formData.password)) {
            setError("Password must start with lowercase letters followed by numbers (e.g., svecw2026)");
            return false;
        }

        setError('');
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        setSuccessMessage('');

        if (!validateForm()) {
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/add-student", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
        
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || "Failed to add student");
            }

            setSuccessMessage("Student added successfully!");
            setFormData(initialState); // Reset form fields
            
        } catch (error) {
            setError(error.message || "Failed to add student. Please try again.");
            console.error("Error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    return (
        <div>
            <Header />
            <div style={styles.container}>
                <div style={styles.sidebar}>
                    <ADashboard />
                </div>
                <div style={styles.formContainer}>
                    <h2 style={styles.headingStyle}>Student Details</h2>
                    <form onSubmit={handleSubmit} style={styles.formStyle}>
                        {[
                            {field: "batch", label: "Batch (YYYY)", type: "text", pattern: "[0-9]{4}"},
                            {field: "name", label: "Name", type: "text"},
                            {field: "regdNo", label: "Registration No (e.g. 21B01A42A9)", type: "text"},
                            {field: "branch", label: "Branch", type: "text"},
                            {field: "sec", label: "Section", type: "text"},
                            {field: "email", label: "Email", type: "email"},
                            {field: "phone", label: "Phone", type: "tel", pattern: "[0-9]{10}"},
                            {field: "password", label: "Password (min 8 chars)", type: "password"}
                        ].map((item, index) => (
                            <div key={index}>
                                <label style={styles.labelStyle}>
                                    {item.label}
                                </label>
                                <input
                                    type={item.type}
                                    name={item.field}
                                    value={formData[item.field]}
                                    onChange={handleChange}
                                    required
                                    pattern={item.pattern}
                                    style={styles.inputStyle}
                                    disabled={isSubmitting}
                                    aria-label={item.label}
                                />
                            </div>
                        ))}
                        {error && <div style={styles.error} aria-live="assertive">{error}</div>}
                        {successMessage && <div style={styles.success} aria-live="assertive">{successMessage}</div>}
                        <button 
                            type="submit" 
                            style={isSubmitting ? {...styles.buttonStyle, ...styles.disabledButton} : styles.buttonStyle}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Submitting..." : "Submit"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        height: "99vh",
        overflow: "hidden",
        backgroundColor: "#F8FAFC",
        marginTop: "-10px",
    },
    sidebar: {
        width: "250px",
        backgroundColor: "#f4f4f4",
        boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
        padding: "20px 0",
        marginTop: "40px",
    },
    formContainer: {
        margin: "auto",
        width: "600px",
        padding: "20px",
        height: "580px",
        backgroundColor: "white",
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
        marginTop: "70px",
        marginLeft: "400px",
    },
    headingStyle: {
        fontSize: "20px",
        fontWeight: "bold",
        color: "#1E3A8A",
    },
    formStyle: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    },
    labelStyle: {
        fontWeight: "bold",
        color: "#333",
        textAlign: "left",
        display: "block",
        marginBottom: "5px",
    },
    inputStyle: {
        padding: "6px",
        fontSize: "14px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        width: "100%",
    },
    buttonStyle: {
        padding: "8px",
        fontSize: "14px",
        backgroundColor: "#4F46E5",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        transition: "0.3s",
        width: "100%",
        marginTop: "10px",
    },
    disabledButton: {
        backgroundColor: "#cccccc",
        cursor: "not-allowed",
    },
    error: {
        color: "red",
        margin: "10px 0",
        textAlign: "center",
    },
    success: {
        color: "green",
        margin: "10px 0",
        textAlign: "center",
    },
};

export default AddStudent;