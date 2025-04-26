import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './header';
import ADashboard from './adashboard';
import axios from 'axios';

const AHome = () => {
    const [activeSection, setActiveSection] = useState('home');
    const [projects, setProjects] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false); // For modal visibility
    const [selectedProject, setSelectedProject] = useState(null); // To store selected project details
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [selectedProjectType, setSelectedProjectType] = useState('');
    const [selectedDomain, setSelectedDomain] = useState('');
    const [selectedTechnology, setSelectedTechnology] = useState('');
    const [dropdownOptions, setDropdownOptions] = useState({
            batches: [],
            branches: [],
            sections: [],
            projectTypes: [],
            domains: [],
            technologies: []
    });
    const navigate = useNavigate();

    useEffect(() => {
            const regdNo = localStorage.getItem('regdNo');
            if (!regdNo) {
                navigate('/');
            }
    
            const fetchData = async () => {
                try {
                    const response = await fetch('http://localhost:5000/projects');
                    if (response.ok) {
                        const data = await response.json();
                        setProjects(data);
                        extractDropdownOptions(data);
                    } else {
                        console.error('Failed to fetch projects.');
                    }
                } catch (err) {
                    console.error('Error fetching project data:', err);
                }
            };
    
            fetchData();
        }, [navigate]);

    const extractDropdownOptions = (data) => {
        const batches = [...new Set(data.map(project => project.batch))];
        const branches = [...new Set(data.map(project => project.branch))];
        const sections = [...new Set(data.map(project => project.section))];
        const projectTypes = [...new Set(data.map(project => project.project_type))];
        const domains = [...new Set(data.map(project => project.domain))];
        const technologies = [
            ...new Set(data.flatMap(project => 
                typeof project.technologies === 'string' 
                    ? JSON.parse(project.technologies) 
                    : project.technologies || []
            ))
        ];

        setDropdownOptions({ batches, branches, sections, projectTypes, domains, technologies });
    };

    const openModal = (project) => {
        setSelectedProject(project);
        setIsModalOpen(true);
      };
    
      const closeModal = () => {
        setIsModalOpen(false);
      };

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

    useEffect(() => {
        const searchText = searchQuery.toLowerCase();

        const filtered = projects.filter((project) => {
            const matchesTitle = project.project_name?.toLowerCase().includes(searchText);

            const technologiesArray = Array.isArray(project.technologies)
                ? project.technologies
                : project.technologies
                ? JSON.parse(project.technologies)
                : [];

            const matchesTechnologies = technologiesArray.some((tech) => 
                tech.toLowerCase().includes(searchText)
            );            
            return (
                (matchesTitle || matchesTechnologies) &&
                (!selectedBatch || project.batch === selectedBatch) &&
                (!selectedBranch || project.branch === selectedBranch) &&
                (!selectedSection || project.section === selectedSection) &&
                (!selectedProjectType || project.project_type === selectedProjectType) &&
                (!selectedDomain || project.domain === selectedDomain) &&
                (!selectedTechnology || technologiesArray.includes(selectedTechnology))
            );
        });

        setFilteredProjects(filtered);
    }, [searchQuery, selectedBatch, selectedBranch, selectedSection, selectedProjectType, selectedDomain, selectedTechnology, projects]);

    return (
        <div>
            <Header />
            <div style={{ display: 'flex', marginTop: '60px' }}>
                <div
                    style={{
                        width: '250px',
                        position: 'fixed',
                        top: '40px',
                        bottom: '0',
                        height: 'calc(100vh - 40px)',
                        overflowY: 'auto',
                        padding: '20px',
                    }}
                >
                    <ADashboard />
                </div>
                <div
                    className="main-content"
                    style={{
                        marginLeft: '250px',
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '20px',
                        overflowY: 'auto',
                        height: '80vh',
                        background: '#F8FAFC',
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                        <table style={{ width: '60%', border: '1px solid #ddd', borderRadius: '8px', padding: '15px' }}>
                            <tbody>
                                <tr>
                                    <td style={{ padding: '8px', fontWeight: 'bold' }}>Role</td>
                                    <td style={{ padding: '8px' }}>Admin</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {activeSection === 'home' && (
                        <>
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                                <select value={selectedBatch} style={{ width: '150px', height: '30px', fontSize: '14px' }} onChange={(e) => setSelectedBatch(e.target.value)}>
                                    <option value="">Select Batch</option>
                                    {dropdownOptions.batches.map((batch, idx) => (
                                        <option key={idx} value={batch}>{batch}</option>
                                    ))}
                                </select>

                                <select value={selectedBranch} style={{ width: '150px', height: '30px', fontSize: '14px' }} onChange={(e) => setSelectedBranch(e.target.value)}>
                                    <option value="">Select Branch</option>
                                    {dropdownOptions.branches.map((branch, idx) => (
                                        <option key={idx} value={branch}>{branch}</option>
                                    ))}
                                </select>

                                <select value={selectedSection}style={{ width: '150px', height: '30px', fontSize: '14px' }} onChange={(e) => setSelectedSection(e.target.value)}>
                                    <option value="">Select Section</option>
                                    {dropdownOptions.sections.map((section, idx) => (
                                        <option key={idx} value={section}>{section}</option>
                                    ))}
                                </select>

                                <select value={selectedProjectType} style={{ width: '150px', height: '30px', fontSize: '14px' }} onChange={(e) => setSelectedProjectType(e.target.value)}>
                                    <option value="">Select Project Type</option>
                                    {dropdownOptions.projectTypes.map((type, idx) => (
                                        <option key={idx} value={type}>{type}</option>
                                    ))}
                                </select>

                                <select value={selectedDomain} style={{ width: '150px', height: '30px', fontSize: '14px' }} onChange={(e) => setSelectedDomain(e.target.value)}>
                                    <option value="">Select Domain</option>
                                    {dropdownOptions.domains.map((domain, idx) => (
                                        <option key={idx} value={domain}>{domain}</option>
                                    ))}
                                </select>

                                <select value={selectedTechnology} style={{ width: '150px', height: '30px', fontSize: '14px' }} onChange={(e) => setSelectedTechnology(e.target.value)}>
                                    <option value="">Select Technology</option>
                                    {dropdownOptions.technologies.map((tech, idx) => (
                                        <option key={idx} value={tech}>{tech}</option>
                                    ))}
                                </select>

                                <input
                                type="text"
                                placeholder="Search projects"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ width: '150px', padding: '10px', fontSize: '16px', border: '1px solid black', marginBottom: '20px', borderRadius: '4px', height: '30px' }}
                            />
                            </div>

                            <div
                                style={{
                                    maxHeight: '500px', 
                                    overflowY: 'auto', 
                                }}
                            >
                                <table
                                    style={{
                                        width: '100%',
                                        borderCollapse: 'collapse',
                                        border: '1px solid #ddd',
                                    }}
                                >
                                    <thead style={{ top : -1, position: 'sticky', background: '#fff'}}>
                                        <tr>
                                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Verified</th>
                                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Title</th>
                                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Details</th>
                                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Pdf</th>
                                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProjects.map((project, index) => (
                                            <tr key={index}>
                                                <td style={{ padding: '10px', textAlign: 'center', border: '1px solid #ddd' }}>
                                                    {project.verified ? (
                                                        <span style={{ color: 'green', fontSize: '20px' }}>🟢</span> // Green dot for verified
                                                    ) : (
                                                        <span style={{ color: 'red', fontSize: '20px' }}>🔴</span> // Red dot for not verified
                                                    )}
                                                </td>
                                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                                    {project.project_name}
                                                </td>
                                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                                    <button style={styles.viewButton} onClick={() => openModal(project)}>View</button>
                                                </td>
                                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                                    {project.pdf ? (
                                                        <a 
                                                        href={`http://localhost:5000${project.pdf}`} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer" 
                                                            style={{ color: 'blue', textDecoration: 'underline' }}
                                                        >
                                                            View PDF
                                                        </a>
                                                    ) : 'No PDF Available'}
                                                </td>
                                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                                <button style={styles.deleteButton} onClick={() => handleDelete(project.id)}>Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </div>
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

export default AHome;