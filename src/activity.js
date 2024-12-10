import React, { useState } from 'react';
import Header from './header';
import Dashboard from './dashboard';

const Activity = () => {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    batch: '',
    dept: '',
    projectName: '',
    teamLeadName: '',
    teamLeadPhone: '',
    teamLeadRegNo: '',
    teamLeadEmail: '',
    teamMembers: [], 
    technologies: [], 
    keywords: [], 
    domain: [], 
    summary: '',
    published: false,
    title: '',
    mentorDept: '',
    mentorName: '',
    pdfFile: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleArrayInputChange = (e, field) => {
    const values = e.target.value.split(',').map((item) => item.trim());
    setFormData((prev) => ({
      ...prev,
      [field]: values,
    }));
  };

  const handleAddTeamMember = () => {
    setFormData((prev) => ({
      ...prev,
      teamMembers: [...prev.teamMembers, { name: '', regNo: '' }],
    }));
  };

  const handleTeamMemberChange = (index, field, value) => {
    const updatedMembers = [...formData.teamMembers];
    updatedMembers[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      teamMembers: updatedMembers,
    }));
  };

  const handleFileUpload = (e) => {
    setFormData((prev) => ({
      ...prev,
      pdfFile: e.target.files[0],
    }));
  };

  const handleAddProject = async () => {
    if (
      formData.batch &&
      formData.dept &&
      formData.projectName &&
      formData.teamLeadName &&
      formData.technologies &&
      formData.keywords &&
      formData.domain &&
      formData.summary
    ) {
      const formDataToSend = new FormData();
      formDataToSend.append('batch', formData.batch);
      formDataToSend.append('dept', formData.dept);
      formDataToSend.append('projectName', formData.projectName);
      formDataToSend.append('teamLeadName', formData.teamLeadName);
      formDataToSend.append('teamLeadPhone', formData.teamLeadPhone);
      formDataToSend.append('teamLeadRegNo', formData.teamLeadRegNo);
      formDataToSend.append('teamLeadEmail', formData.teamLeadEmail);
      formDataToSend.append('teamMembers', JSON.stringify(formData.teamMembers));
      formDataToSend.append('technologies', JSON.stringify(formData.technologies));
      formDataToSend.append('keywords', JSON.stringify(formData.keywords));
      formDataToSend.append('domain', JSON.stringify(formData.domain));
      formDataToSend.append('summary', formData.summary);
      formDataToSend.append('published', formData.published);
      formDataToSend.append('mentorDept', formData.mentorDept);
      formDataToSend.append('mentorName', formData.mentorName);
      if (formData.pdfFile) {
        formDataToSend.append('pdfFile', formData.pdfFile);
      }

      try {
        const response = await fetch('http://localhost:5000/api/projects', {
          method: 'POST',
          body: formDataToSend,
        });

        if (response.ok) {
          const newProject = await response.json();
          setProjects([...projects, newProject]);
          setFormData({
            batch: '',
            dept: '',
            projectName: '',
            teamLeadName: '',
            teamLeadPhone: '',
            teamLeadRegNo: '',
            teamLeadEmail: '',
            teamMembers: [],
            technologies: [],
            keywords: [],
            domain: [],
            summary: '',
            published: false,
            title: '',
            mentorDept: '',
            mentorName: '',
            pdfFile: null,
          });
          setIsModalOpen(false);
        } else {
          alert('Error adding project');
        }
      } catch (error) {
        alert('Error: ' + error.message);
      }
    } else {
      alert('Please fill in all required fields!');
    }
  };

  const filteredProjects = projects.filter((project) =>
    project.projectName.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <div key={project.id} style={styles.projectCard}>
                    <div>
                      <h3 style={styles.projectName}>{project.projectName}</h3>
                      <p style={styles.projectInfo}>Owner: {project.teamLeadName}</p>
                      <p style={styles.projectInfo}>Last updated: {project.lastUpdated}</p>
                      <p style={styles.projectInfo}>Description: {project.summary}</p>
                      <p style={styles.projectInfo}>
                        Duration: {project.startDate} to {project.endDate}
                      </p>
                    </div>
                    <span style={styles.ownerBadge}>Owner</span>
                  </div>
                ))
              ) : (
                <p style={styles.noProjects}>No projects found.</p>
              )}
            </div>
          </div>
        </main>
        
      </div>

      {isModalOpen && (
  <div style={styles.modalOverlay}>
    <div style={styles.modalContent}>
      <h2 style={styles.modalTitle}>Create New Project</h2>
      <div style={styles.formContainerStyle}>
        <label style={styles.label}>Batch</label>
        <input
          type="text"
          name="batch"
          value={formData.batch}
          onChange={handleInputChange}
          style={styles.inputField}
        />

        <label style={styles.label}>Department</label>
        <input
          type="text"
          name="dept"
          value={formData.dept}
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
          placeholder="Enter domain, separated by commas"
          value={formData.domain.join(', ')}
          onChange={(e) => handleArrayInputChange(e, 'domain')}
          style={styles.inputField}
        />

        <label style={styles.label}>Project Summary</label>
        <textarea
          name="summary"
          value={formData.summary}
          onChange={handleInputChange}
          style={styles.textareaField}
        />

        <label style={styles.label}>Published</label>
        <input
          type="checkbox"
          name="published"
          checked={formData.published}
          onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
          style={styles.checkboxField}
        />

        <label style={styles.label}>Mentor Department</label>
        <input
          type="text"
          name="mentorDept"
          value={formData.mentorDept}
          onChange={handleInputChange}
          style={styles.inputField}
        />

        <label style={styles.label}>Mentor Name</label>
        <input
          type="text"
          name="mentorName"
          value={formData.mentorName}
          onChange={handleInputChange}
          style={styles.inputField}
        />

        <label style={styles.label}>Upload PDF</label>
        <input
          type="file"
          name="pdfFile"
          accept=".pdf"
          onChange={handleFileUpload}
          style={styles.inputField}
        />

        <div style={styles.modalButtons}>
          <button onClick={handleAddProject} style={styles.submitButton}>
            Add Project
          </button>
          <button onClick={() => setIsModalOpen(false)} style={styles.cancelButton}>
            Cancel
          </button>
        </div>
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
    top: 10,
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
