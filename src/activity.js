import React, { useState, useEffect, useMemo } from 'react';
import Header from './header';
import Dashboard from './dashboard';
import axios from 'axios';

const Activity = () => {
  const regdNo = localStorage.getItem("regdNo");
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Form Data for Add/Edit
  const [formData, setFormData] = useState({
    id: null,
    batch: '',
    branch: '',
    section: '',
    projectName: '',
    teamLeadName: '',
    teamLeadPhone: '',
    teamLeadRegNo: '',
    teamLeadEmail: '',
    teamMembers: [],
    technologies: [],
    keywords: [],
    domain: '',
    summary: '',
    projectType: '',
    mentorId: '',
    pdfFile: null,
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/projects`);
  
        const userProjects = response.data.filter((project) => {
          // Check if the user is the team lead
          const isTeamLead = project.team_lead_regd_no === regdNo;
  
          // Check if the user is in the team members list
          const teamMembers = Array.isArray(project.team_members) 
            ? project.team_members  // If already an array
            : JSON.parse(project.team_members || "[]"); // If stored as JSON string
  
          const isTeamMember = teamMembers.includes(regdNo);
  
          return isTeamLead || isTeamMember;
        });
  
        setProjects(userProjects || []); // Ensure projects is always an array
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
  
    fetchProjects();
  }, [regdNo]);
  
  

  // **Search Filtering**
  const filteredProjects = useMemo(() => {
    return projects.filter((project) =>
      project.project_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.technologies?.some((tech) => tech.toLowerCase().includes(searchQuery.toLowerCase())) ||
      project.keywords?.some((tech) => tech.toLowerCase().includes(searchQuery.toLowerCase())) ||
      project.domain?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, projects]);

  // **Handle Input Change**
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // **Handle Array Inputs**
  const handleArrayInputChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value.split(',').map((item) => item.trim()) });
  };

  // **Handle File Upload**
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf' && file.size <= 5 * 1024 * 1024) {
      setFormData(prev => ({ ...prev, pdfFile: file }));
    } else {
      alert('Please upload a valid PDF file (max 5MB).');
    }
  };

  // **Handle Edit**
  const handleEdit = (project) => {
    setFormData({
      id: project.id,
      batch: project.batch || '',
      branch: project.branch || '',
      section: project.section || '',
      projectName: project.project_name || '',
      teamLeadName: project.team_lead_name || '',
      teamLeadPhone: project.team_lead_ph_no || '',
      teamLeadRegNo: project.team_lead_regd_no || '',
      teamLeadEmail: project.team_lead_email || '',
      teamMembers: project.team_members
          ? (Array.isArray(project.team_members) ? project.team_members : JSON.parse(project.team_members))
          : [],
      technologies: project.technologies
          ? (Array.isArray(project.technologies) ? project.technologies : JSON.parse(project.technologies))
          : [],
      keywords: project.keywords
          ? (Array.isArray(project.keywords) ? project.keywords : JSON.parse(project.keywords))
          : [],
      domain: project.domain || '',
      summary: project.summary || '',
      projectType: project.project_type || '',
      mentorId: project.mentor_id || '',
      pdfFile: project.pdf ? `http://localhost:5000${project.pdf}` : null,
    });

    setIsModalOpen(true);
  };

  // **Handle Delete**
  const handleDelete = async (projectId) => {
    try {
      await axios.delete(`http://localhost:5000/api/projects/${projectId}`);
      setProjects(projects.filter((project) => project.id !== projectId));
      alert("Project deleted successfully!");
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Failed to delete project!");
    }
  };

  // **Handle Add or Update Project**
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formDataToSend = new FormData();
  
      Object.keys(formData).forEach((key) => {
        if (["teamMembers", "technologies", "keywords"].includes(key)) {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else if (key === "pdfFile" && formData.pdfFile instanceof File) {
          formDataToSend.append("file", formData.pdfFile);
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });
  
      let response;
      if (formData.id) {
        response = await axios.put(`http://localhost:5000/api/projects/${formData.id}`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        response = await axios.post("http://localhost:5000/api/projects", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
  
      setStatusMessage(response.data.message || "Data saved successfully!");
      setIsModalOpen(false);
  
      // 🛠️ Fetch the updated project list after adding a project
      const updatedResponse = await axios.get(`http://localhost:5000/projects`);
      const userProjects = updatedResponse.data.filter(
        (project) => project.team_lead_regd_no === regdNo
      );
      setProjects(userProjects);
  
    } catch (error) {
      console.error("Error submitting project:", error);
      alert('Error: ' + (error.response ? error.response.data.message : error.message));
    } finally {
      setLoading(false);
    }
  };
  
  
  return (
    <div>
      <Header />
      <div style={styles.mainContainer}>
        <div style={styles.sidebar}>
          <Dashboard />
        </div>
        <main style={styles.content}>
          <div style={styles.contentBox}>
            <header style={styles.header}>
              <h1 style={styles.title}>Projects</h1>
              <button style={styles.newProjectButton} onClick={() => setIsModalOpen(true)}>
                New Project
              </button>
            </header>
            <div style={styles.searchContainer}>
              <input
                type="text"
                placeholder="Search or filter results..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchInput}
              />
            </div>
            <div style={styles.projectList}>
              {loading ? <p>Loading...</p> : filteredProjects.length === 0 ? <p>No projects found.</p> :
              filteredProjects.map((project) => (
                <div key={project.id}>
                  <h3>{project.project_name}</h3>
                  <button onClick={() => handleEdit(project)}>Edit</button>
                  <button onClick={() => handleDelete(project.id)}>Delete</button>
                </div>
              ))
            }
          </div>
          </div>
        </main>
      </div>

      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
          <h2 style={styles.modalTitle}>
              {formData.id ? "Edit Project" : "Create New Project"}
          </h2>
            <div style={styles.formContainerStyle}>
              <label style={styles.label}>Batch</label>
              <input
                type="text"
                name="batch"
                value={formData.batch}
                onChange={handleInputChange}
                style={styles.inputField}
              />

              <label style={styles.label}>Branch</label>
              <input
                type="text"
                name="branch"
                value={formData.branch}
                onChange={handleInputChange}
                style={styles.inputField}
              />

              <label style={styles.label}>Section</label>
                <input
                  type="text"
                  name="section"
                  value={formData.section}
                  onChange={handleInputChange}
                  style={styles.inputField}
                />

              <label style={styles.label}>Project Name</label>
              <input
                type="text"
                name="projectName"
                value={formData.projectName}
                onChange={handleInputChange}
                style={styles.inputField}
              />

              <label style={styles.label}>Team Lead Name</label>
              <input
                type="text"
                name="teamLeadName"
                value={formData.teamLeadName}
                onChange={handleInputChange}
                style={styles.inputField}
              />

              <label style={styles.label}>Team Lead Phone</label>
              <input
                type="text"
                name="teamLeadPhone"
                value={formData.teamLeadPhone}
                onChange={handleInputChange}
                style={styles.inputField}
              />

              <label style={styles.label}>Team Lead Registration No</label>
              <input
                type="text"
                name="teamLeadRegNo"
                value={formData.teamLeadRegNo}
                onChange={handleInputChange}
                style={styles.inputField}
              />

              <label style={styles.label}>Team Lead Email</label>
              <input
                type="email"
                name="teamLeadEmail"
                value={formData.teamLeadEmail}
                onChange={handleInputChange}
                style={styles.inputField}
              />

              <label style={styles.label}>Team Members</label>
              <input
                type="text"
                placeholder="Enter team member names, separated by commas"
                value={formData.teamMembers.join(', ')}
                onChange={(e) => handleArrayInputChange(e, 'teamMembers')}
                style={styles.inputField}
              />

              <label style={styles.label}>Technologies</label>
              <input
                type="text"
                placeholder="Enter technologies, separated by commas"
                value={formData.technologies.join(', ')}
                onChange={(e) => handleArrayInputChange(e, 'technologies')}
                style={styles.inputField}
              />

              <label style={styles.label}>Keywords</label>
              <input
                type="text"
                placeholder="Enter keywords, separated by commas"
                value={formData.keywords.join(', ')}
                onChange={(e) => handleArrayInputChange(e, 'keywords')}
                style={styles.inputField}
              />

              <label style={styles.label}>Domain</label>
              <input
                type="text"
                name="Domain"
                value={formData.domain}
                onChange={(e) => handleArrayInputChange(e, 'domain')}
                style={styles.inputField}
              />

              <label style={styles.label}>Project Summary</label>
              <textarea
                name="summary"
                value={formData.summary}
                onChange={handleInputChange}
                style={styles.textAreaField}
              ></textarea>

              <label style={styles.label}>Project Type</label>
              <input
                type="text"
                name="projectType"
                value={formData.projectType}
                onChange={handleInputChange}
                style={styles.inputField}
              />

              <label style={styles.label}>Mentor Id</label>
              <input
                type="text"
                name="mentorId"
                value={formData.mentorId}
                onChange={handleInputChange}
                style={styles.inputField}
              />

              <label style={styles.label}>PDF File</label>
              <input
                type="file"
                name="file" 
                onChange={handleFileUpload}
                style={styles.inputField}
              />
              {formData.id && formData.pdfFile && (
                <div>
                  <p>Current PDF:</p>
                  <a href={formData.pdfFile} target="_blank" rel="noopener noreferrer">
                    View PDF
                  </a>
                </div>
              )}
            </div>

            <div style={styles.modalActions}>
              <button style={styles.modalCancelButton} onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button style={styles.modalSaveButton} onClick={handleSubmit}>
                Save Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  mainContainer: {
    display: 'flex',
    height: '80vh',
  },
  sidebar: {
    width: '200px',
    position: 'fixed',
    top: '60',
    bottom: '0',
    overflow: 'hidden',
    backgroundColor: '#fff',
    boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
    height: '80vh', 
},
  content: {
    marginTop:'75px',
    width: '80%',
    marginLeft: '250px',
    padding: '20px',
  },
  contentBox: {
    maxWidth: '900px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  title: {
    fontSize: '30px',
  },
  newProjectButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
  },
  searchContainer: {
    marginBottom: '20px',
  },
  searchInput: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  projectList: {
    marginTop: '20px',
  },
  projectCard: {
    border: '1px solid #ddd',
    padding: '20px',
    marginBottom: '10px',
    borderRadius: '5px',
  },
  projectName: {
    fontSize: '18px',
    fontWeight: 'bold',
  },
  projectInfo: {
    margin: '5px 0',
  },
  ownerBadge: {
    padding: '5px 10px',
    backgroundColor: '#007bff',
    color: 'white',
    borderRadius: '5px',
    fontSize: '12px',
  },
  noProjects: {
    fontSize: '18px',
    color: '#999',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '5px',
    width: '80%',
    maxWidth: '800px',
    overflowY: 'auto', 
    maxHeight: '80vh',
  },
  modalTitle: {
    fontSize: '20px',
    marginBottom: '20px',
  },
  formContainerStyle: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputField:{
    marginBottom: '15px',
  },
};

export default Activity;