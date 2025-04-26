import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AProfile from "./aprofile";

const AddStudent = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        regdNo: "",
        branch: "",
        section: "",
        email: "",
        phone: "",
    });

    // Handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Student Data:", formData);
        alert("Student added successfully!");
        navigate("/"); // Redirect back to dashboard
    };

    return (
        <div>
            <AProfile />
            <div style={containerStyle}>
                <h2 style={headingStyle}>Student Details</h2>
                <form onSubmit={handleSubmit} style={formStyle}>
                    <label style={labelStyle}>Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required style={inputStyle} />

                    <label style={labelStyle}>Regd No</label>
                    <input type="text" name="regdNo" value={formData.regdNo} onChange={handleChange} required style={inputStyle} />

                    <label style={labelStyle}>Branch</label>
                    <input type="text" name="branch" value={formData.branch} onChange={handleChange} required style={inputStyle} />

                    <label style={labelStyle}>Section</label>
                    <input type="text" name="section" value={formData.section} onChange={handleChange} required style={inputStyle} />

                    <label style={labelStyle}>Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required style={inputStyle} />

                    <label style={labelStyle}>Phone No</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required style={inputStyle} />

                    <button type="submit" style={buttonStyle}>Submit</button>
                </form>
            </div>
        </div>
    );
};

// Styling
const containerStyle = {
    maxWidth: "500px",
    margin: "40px auto",
    padding: "20px",
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    textAlign: "left",
};

const headingStyle = {
    textAlign: "center",
    fontSize: "22px",
    fontWeight: "bold",
    color: "#1E3A8A",
};

const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
};

const labelStyle = {
    fontWeight: "bold",
    color: "#333",
};

const inputStyle = {
    padding: "8px",
    fontSize: "14px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    width: "100%",
};

const buttonStyle = {
    marginTop: "15px",
    padding: "10px",
    fontSize: "16px",
    backgroundColor: "#4F46E5",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "0.3s",
};

export default AddStudent;