import Header from "./header";
import ADashboard from "./adashboard";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AddFaculty = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        id: "",
        department: "",
        email: "",
        phone: "",
        password: ""
    });


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting form with data:", formData);
    
        try {
            const response = await fetch("http://localhost:5000/add-faculty", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
    
            console.log("Response object:", response);
            console.log("Response status:", response.status);
    
            let data;
            try {
                data = await response.json();
                console.log("Parsed JSON response:", data);
            } catch (jsonError) {
                console.error("Failed to parse JSON:", jsonError);
                console.log("Raw response text:", await response.text());
                return;
            }
            setFormData({
                name: "",
                id: "",
                department: "",
                email: "",
                phone: "",
                password: "",
            });

            if (response.ok) {
                console.log("hi"); 
                setFormData({
                    name: "",
                    id: "",
                    department: "",
                    email: "",
                    phone: "",
                    password: "",
                });
                console.log("Form data after reset:", formData);
            } else {
                console.log("Error received from backend:", data);
                alert(data.error);
            }
        } catch (error) {
            console.error("Fetch error:", error);
            alert("Failed to add faculty.");
        }
    };
    
    
    

    return (
        <div>
            <Header />
            <div style={styles.container}>
                <div style={styles.sidebar}>
                    <ADashboard />
                </div>
                <div style={styles.formContainer}>
                    <h2 style={styles.headingStyle}>Faculty Details</h2>
                    <form onSubmit={handleSubmit} style={styles.formStyle}>
                        {["name", "id", "department", "email", "phone", "password"].map((field, index) => (
                            <div key={index}>
                                <label style={styles.labelStyle}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                                <input
                                    type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                                    name={field}
                                    value={formData[field]}
                                    onChange={handleChange}
                                    required
                                    placeholder={`Enter ${field}`}
                                    style={styles.inputStyle}
                                />
                            </div>
                        ))}
                        <button type="submit" style={styles.buttonStyle}>Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        height: "96vh",
        overflow: "hidden",
        backgroundColor: "#F8FAFC",
        marginTop:"-10",
    },
    sidebar: {
        width: "250px",
        backgroundColor: "#f4f4f4",
        boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
        padding: "20px 0",
        marginTop: "40px", // Move dashboard lower
    },
    formContainer: {
        width: "400px", // Reduce width to decrease form size
        padding: "20px",
        height:"460px",
        backgroundColor: "white",
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
        alignItems: "center", // Center items vertically
        justifyContent: "center",
        marginTop:"150",
        marginLeft:"400", 
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
        marginTop: "10px",
        padding: "8px",
        fontSize: "14px",
        backgroundColor: "#4F46E5",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        transition: "0.3s",
    },
};

export default AddFaculty;
