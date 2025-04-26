import React, { useState, useEffect, useMemo } from 'react';
import Header from './header';
import FDashboard from './fdashboard';
import axios from 'axios';

const FActivity = () => {
  const regdNo = localStorage.getItem("regdNo");
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // For modal visibility
  const [selectedProject, setSelectedProject] = useState(null); // To store selected project details
  const fetchProjects = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/projects`);
      const userProjects = response.data.filter((project) => {
        // Check if the user is the team lead
        const ismentor = project.mentor_id.toString() === regdNo;
        return ismentor;
      });
      setProjects(userProjects || []); // Ensure projects is always an array
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [regdNo]); // Re-fetch on regdNo change

  // ✅ Handle Delete Request
  const handleDelete = async (projectId) => {
      try {
        await axios.delete(`http://localhost:5000/api/projects/${projectId}`);
        setProjects((prevProjects) => prevProjects.filter((project) => project.id !== projectId));
        // alert("Project deleted successfully!");
      } catch (error) {
        console.error("Error deleting project:", error);
        alert("Failed to delete project!");
      }
    };

  // ✅ Handle Verification Request (Update `verified` field)
  const verifyProject = async (projectId) => {
    const mentorId = localStorage.getItem("regdNo"); // Assuming the mentor's regdNo is stored in localStorage
  
    try {
      const response = await axios.put('http://localhost:5000/api/verify-project', {
        projectId,
        mentorId
      });
  
      if (response.status === 200) {
        // alert('Project verified successfully');
        fetchProjects();
      }
    } catch (error) {
      console.error('Error verifying project:', error);
      alert('Failed to verify project');
    }
  };
  
  const openModal = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  return (
    <div>
      <Header />
      <div style={styles.mainContainer}>
        <div style={styles.sidebar}>
          <FDashboard />
        </div>
        <main style={styles.content}>
          <div style={styles.contentBox}>
            <header style={styles.header}>
              <h1 style={styles.title}>Projects</h1>
            </header>
            <div style={styles.projectList}>
              {projects.length === 0 ? (
                <p style={styles.noProjects}>No projects found.</p>
              ) : (
                projects.map((project) => (
                  <div key={project.id} style={styles.projectCard}>
                    <h3 style={styles.projectName}>{project.project_name}</h3>
                    <p style={styles.projectInfo}>
                      Verified: {project.verified ? "✅ Yes" : "❌ No"}
                    </p>
                    <div style={styles.buttonContainer}>
                      <button style={styles.viewButton} onClick={() => openModal(project)}>View</button>
                      <button style={styles.deleteButton} onClick={() => handleDelete(project.id)}>Delete</button>
                      {/* Add Verify button if the project is not verified */}
                      {!project.verified && (
                        <button onClick={() => verifyProject(project.id)} style={styles.verifyButton}>
                          Verify
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
      {/* Modal for project details */}
      {isModalOpen && selectedProject && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2>Project Details</h2>
            <div style={styles.details}>
              <p><strong>ID:</strong> {selectedProject.id}</p>
              <p><strong>Batch:</strong> {selectedProject.batch}</p>
              <p><strong>Branch:</strong> {selectedProject.branch}</p>
              <p><strong>Section:</strong> {selectedProject.section}</p>
              <p><strong>Project Name:</strong> {selectedProject.project_name}</p>
              <p><strong>Team Lead Name:</strong> {selectedProject.team_lead_name}</p>
              <p><strong>Team Lead Phone No:</strong> {selectedProject.team_lead_ph_no}</p>
              <p><strong>Team Lead Regd No:</strong> {selectedProject.team_lead_regd_no}</p>
              <p><strong>Team Lead Email:</strong> {selectedProject.team_lead_email}</p>
              <p><strong>Team Members:</strong> {JSON.stringify(selectedProject.team_members)}</p>
              <p><strong>Technologies:</strong> {JSON.stringify(selectedProject.technologies)}</p>
              <p><strong>Keywords:</strong> {JSON.stringify(selectedProject.keywords)}</p>
              <p><strong>Domain:</strong> {JSON.stringify(selectedProject.domain)}</p>
              <p><strong>Summary:</strong> {selectedProject.summary}</p>
              <p><strong>Project Type:</strong> {selectedProject.project_type}</p>
              <p><strong>Mentor ID:</strong> {selectedProject.mentor_id}</p>
              <p><strong>PDF:</strong> <a href={`http://localhost:5000${selectedProject.pdf}`}  target="_blank" rel="noopener noreferrer">View PDF</a></p>
              <p><strong>Verified:</strong> {selectedProject.verified ? '✅ Yes' : '❌ No'}</p>
            </div>
            <button style={styles.closeButton} onClick={closeModal}>Close</button>
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

export default FActivity;