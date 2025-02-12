import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './header';
import Dashboard from './dashboard';

const Home = () => {
    const [activeSection, setActiveSection] = useState('home');
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const [projects, setProjects] = useState([]); 
    const [searchQuery, setSearchQuery] = useState(''); 
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [selectedProjectType, setSelectedProjectType] = useState('');
    const [selectedDomain, setSelectedDomain] = useState('');
    const [selectedTechnology, setSelectedTechnology] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const regdNo = localStorage.getItem('regdNo');
        if (!regdNo) {
            navigate('/');
        }

        const fetchUserDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/profile/${regdNo}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                } else {
                    setError('Error fetching profile data.');
                }
            } catch (err) {
                console.error('Error fetching profile data:', err);
                setError('Something went wrong. Please try again later.');
            }
        };

        fetchUserDetails();

        const fetchProjects = async () => {
            try {
                const response = await fetch('http://localhost:5000/projects');
                if (response.ok) {
                    const data = await response.json();
                    setProjects(data);
                } else {
                    console.error('Failed to fetch projects.');
                }
            } 
            catch (err) {
                console.error('Error fetching project data:', err);
            }
        };

        fetchProjects();
    }, [navigate]);

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

            const keywordsArray = Array.isArray(project.keywords)
                ? project.keywords
                : project.keywords
                ? JSON.parse(project.keywords)
                : [];

            const matchesKeywords = keywordsArray.some((keyword) => 
                keyword.toLowerCase().includes(searchText)
            );

            const matchesDomain = typeof project.domain === "string"
                ? project.domain.toLowerCase().includes(searchText)
                : false;

            // ✅ **Filters for Dropdowns**
            const matchesBatch = selectedBatch ? project.batch === selectedBatch : true;
            const matchesBranch = selectedBranch ? project.branch === selectedBranch : true;
            const matchesSection = selectedSection ? project.section === selectedSection : true;
            const matchesProjectType = selectedProjectType ? project.project_type === selectedProjectType : true;
            const matchesDomainFilter = selectedDomain ? project.domain.toLowerCase() === selectedDomain.toLowerCase() : true;
            const matchesTechnology = selectedTechnology 
                ? technologiesArray.some((tech) => tech.toLowerCase() === selectedTechnology.toLowerCase()) 
                : true;

            return (
                (matchesTitle || matchesTechnologies || matchesKeywords || matchesDomain) &&
                matchesBatch &&
                matchesBranch &&
                matchesSection &&
                matchesProjectType &&
                matchesDomainFilter &&
                matchesTechnology
            );
        });

        setFilteredProjects(filtered);
    }, [searchQuery, selectedBatch, selectedBranch, selectedSection, selectedProjectType, selectedDomain, selectedTechnology, projects]);

    if (error) {
        return <div>{error}</div>;
    }
    if (!user) {
        return <div>Loading...</div>;
    }


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
                    <Dashboard />
                </div>
                <div
                    className="main-content"
                    style={{
                        marginLeft: '250px',
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '20px',
                        // position:'fixed',
                        overflowY: 'auto',
                        height: '80vh',
                        background: '#F8FAFC',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: '20px',
                        }}
                    >
                        <table
                            style={{
                                width: '60%',
                                borderCollapse: 'collapse',
                                textAlign: 'left',
                                backgroundColor: '#fff',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                padding: '15px',
                            }}
                        >
                            <tbody>
                                <tr>
                                    <td style={{ padding: '8px', fontWeight: 'bold', color: '#374151' }}>Roll No</td>
                                    <td style={{ padding: '8px', color: '#374151' }}>{user.regdNo}</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '8px', fontWeight: 'bold', color: '#374151' }}>Name</td>
                                    <td style={{ padding: '8px', color: '#374151' }}>{user.name}</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '8px', fontWeight: 'bold', color: '#374151' }}>Branch</td>
                                    <td style={{ padding: '8px', color: '#374151' }}>{user.branch}</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '8px', fontWeight: 'bold', color: '#374151' }}>Section</td>
                                    <td style={{ padding: '8px', color: '#374151' }}>{user.sec}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {activeSection === 'home' && (
                        <>
                            <div
                                id="filters"
                                className="filters"
                                style={{
                                    marginBottom: '20px',
                                    display: 'flex',
                                    gap: '15px',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                }}
                            >
                                <select style={{ border: '0.1px solid black',padding: '10px', fontSize: '16px' }} value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)}>
                                    <option value="">Batch</option>
                                    <option value="2025">2025</option>
                                    <option value="2026">2026</option>
                                    <option value="2027">2027</option>
                                    <option value="2027">2028</option>
                                </select>
                                <select style={{ border: '0.1px solid black',padding: '10px', fontSize: '16px' }} value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}>
                                    <option value="">Branch</option>
                                    <option value="CSE">CSE</option>
                                    <option value="IT">IT</option>
                                    <option value="AIDS">AIDS</option>
                                    <option value="AIML">AIML</option>
                                    <option value="CS">CS</option>
                                    <option value="ECE">ECE</option>
                                    <option value="EEE">EEE</option>
                                    <option value="EEE">MECH</option>
                                    <option value="EEE">CIVIL</option>                                    
                                </select>
                                <select style={{ border: '0.1px solid black',padding: '10px', fontSize: '16px' }}>
                                    <option value="">Section</option>
                                    <option value="A">A</option>
                                    <option value="B">B</option>
                                    <option value="C">C</option>
                                </select>
                                <select style={{ border: '0.1px solid black',padding: '10px', fontSize: '16px' }} value={selectedProjectType} onChange={(e) => setSelectedProjectType(e.target.value)}>
                                    <option value="">Project Type</option>
                                    <option value="mini">Mini Project</option>
                                    <option value="major">Major Project</option>
                                    <option value="hackathon">Other</option>
                                </select>
                                <select style={{border: '0.1px solid black', padding: '10px', fontSize: '16px' }} value={selectedDomain} onChange={(e) => setSelectedDomain(e.target.value)}>
                                    <option value="">Domain</option>
                                    <option value="ml">Machine Learning</option>
                                    <option value="fullstack">Full Stack</option>
                                    <option value="cyber">Cyber Security</option>
                                </select>
                                <select style={{ border: '0.1px solid black',padding: '10px', fontSize: '16px' }} value={selectedTechnology} onChange={(e) => setSelectedTechnology(e.target.value)}>
                                    <option value="">Technology</option>
                                    <option value="javascript">JavaScript</option>
                                    <option value="php">PHP</option>
                                    <option value="python">Python</option>
                                </select>
                                <input
                            type="text"
                            placeholder="Search projects"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '30%',
                                height:'6.1vh',
                                padding: '10px',
                                fontSize: '16px',
                                border: '0.1px solid black',
                                borderRadius: '4px',
                                marginBottom: '20px',
                                marginTop: '20px',
                            }}
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
                                    <thead>
                                        <tr>
                                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Title</th>
                                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Technologies</th>
                                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Keywords</th>
                                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Domain</th>
                                            {/* <th style={{ padding: '10px', border: '1px solid #ddd' }}>Published</th> */}
                                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Pdf</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProjects.map((project, index) => (
                                            <tr key={index}>
                                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                                    {project.project_name}
                                                </td>
                                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                                    {Array.isArray(project.technologies)
                                                        ? project.technologies.join(', ')
                                                        : project.technologies
                                                        ? JSON.parse(project.technologies).join(', ')
                                                        : ''}
                                                </td>
                                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                                    {Array.isArray(project.keywords)
                                                        ? project.keywords.join(', ')
                                                        : project.keywords
                                                        ? JSON.parse(project.keywords).join(', ')
                                                        : ''}
                                                </td>
                                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                                    {project.domain}
                                                </td>
                                                {/* <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                                    {project.is_published?"YES":"NO"}
                                                </td> */}
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
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
