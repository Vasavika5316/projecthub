import React, { useState } from "react";
import Header from "./header";
import FDashboard from "./fdashboard";

const FContact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const [status, setStatus] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) {
            setStatus("Please fill all fields.");
            return;
        }
    
        try {
            console.log("Sending message...", formData);
    
            setTimeout(() => {
                setStatus("Message sent successfully!"); // Show success message
                
    
                setTimeout(() => {
                    setFormData({ name: "", email: "", message: "" }); // Reset form
                    setStatus(""); // Clear message
                    // window.history.back(); // Go back to the previous page
                }, 2000); // Delay before navigating back
            }, 1000); // Simulate API call delay
        } catch (error) {
            setStatus("Something went wrong. Please try again.");
        }
    };
    

    return (
        <div>
            <Header />
            <div style={styles.container}>
                <div style={styles.sidebar}>
                    <FDashboard />
                </div>
                <div style={styles.content}>
                    <h1 style={styles.heading}>Contact Us</h1>
                    <p style={styles.description}>
                        Have any questions? Reach out to us and we'll get back to you soon!
                    </p>

                    <div style={styles.formContainer}>
                        <form onSubmit={handleSubmit} style={styles.form}>
                            <label style={styles.label}>Your Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                style={styles.input}
                                required
                            />

                            <label style={styles.label}>Your Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                style={styles.input}
                                required
                            />

                            <label style={styles.label}>Your Message</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                style={styles.textarea}
                                required
                            ></textarea>

                            <button type="submit" style={styles.submitButton}>
                                Send Message
                            </button>

                            {status && <p style={styles.status}>{status}</p>}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        height: "96vh",
        // backgroundColor: "#F8FAFC",
        overflow: 'hidden',
    },
    sidebar: {
        width: '250px',
        backgroundColor: '#f4f4f4', 
        marginTop:'50',
        boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
    },
    content: {
        marginLeft: "370px",
        padding: "40px",
        width: "calc(100% - 270px)",
    },
    heading: {
        fontSize: "32px",
        color: "#232870",
        marginBottom: "10px",
    },
    description: {
        fontSize: "18px",
        color: "#555",
        marginBottom: "30px",
    },
    formContainer: {
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        width: "50%",
    },
    form: {
        display: "flex",
        flexDirection: "column",
    },
    label: {
        marginBottom: "5px",
        fontSize: "16px",
        color: "#333",
    },
    input: {
        padding: "10px",
        fontSize: "16px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        marginBottom: "15px",
    },
    textarea: {
        padding: "10px",
        fontSize: "16px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        minHeight: "100px",
        marginBottom: "15px",
    },
    submitButton: {
        padding: "12px",
        backgroundColor: "#232870",
        color: "white",
        fontSize: "16px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
    status: {
        marginTop: "10px",
        fontSize: "16px",
        color: "green",
    },
    contactDetails: {
        marginTop: "40px",
        padding: "20px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    },
};

export default FContact;