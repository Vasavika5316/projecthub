import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from './header';
import ADashboard from "./adashboard";
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ff7300", "#ffc658", "#d0ed57", "#a4de6c"];

const ADataVisualization = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("All");
  const [selectedTechnology, setSelectedTechnology] = useState("All");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("http://localhost:5000/projects");
        setProjects(response.data || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) return <p>Loading data...</p>;

  const totalProjects = projects.length;

  // Extract unique values for dropdowns
  const uniqueBatches = [...new Set(projects.map(p => p.batch))];
  const uniqueBranches = [...new Set(projects.map(p => p.branch))];
  const uniqueDomains = [...new Set(projects.flatMap(p => p.domain || []))];
  const uniqueTechnologies = [...new Set(projects.flatMap(p => p.technologies || []))];

  // Apply filters
  const filteredProjects = projects.filter((project) => {
    return (
      (selectedBatch === "" || project.batch === selectedBatch) &&
      (selectedBranch === "" || project.branch === selectedBranch) &&
      (selectedDomain === "All" || (project.domain || []).includes(selectedDomain)) &&
      (selectedTechnology === "All" || (project.technologies || []).includes(selectedTechnology))
    );
  });

  // Projects per Domain
  const domainCounts = filteredProjects.reduce((acc, project) => {
    let domainList = Array.isArray(project.domain) ? project.domain : [];
    domainList.forEach((dom) => {
      acc[dom] = (acc[dom] || 0) + 1;
    });
    return acc;
  }, {});

  const pieChartData = Object.keys(domainCounts).map((domain, index) => ({
    name: domain,
    value: domainCounts[domain],
    color: COLORS[index % COLORS.length]
  }));

  return (
    <div>
      <Header />
      <div style={{ display: "flex" }}>
        {/* Sidebar */}
        <div style={{
          width: "200px",
          position: "fixed",
          height: "100vh",
          backgroundColor: "#fff",
          left: 0,
          top: "60px"
        }}>
          <ADashboard />
        </div>

        {/* Main Content */}
        <div style={{ marginLeft: "260px", flexGrow: 1, height: "84vh", padding: "20px", background: "#F8FAFC" }}>
          <h2>📊 Data Visualization</h2>

          <div style={{ display: "flex", gap: "40px" }}>
            {/* Filters Section */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              width: "200px",
              background: "#fff",
              padding: "15px",
              borderRadius: "8px",
              boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)"
            }}>
              <label><b>Batch:</b></label>
              <select onChange={(e) => setSelectedBatch(e.target.value)}>
                <option value="">All</option>
                {uniqueBatches.map(batch => <option key={batch} value={batch}>{batch}</option>)}
              </select>

              <label><b>Branch:</b></label>
              <select onChange={(e) => setSelectedBranch(e.target.value)}>
                <option value="">All</option>
                {uniqueBranches.map(branch => <option key={branch} value={branch}>{branch}</option>)}
              </select>

              <label><b>Technology:</b></label>
              <select onChange={(e) => setSelectedTechnology(e.target.value)}>
                <option value="All">All</option>
                {uniqueTechnologies.map(tech => <option key={tech} value={tech}>{tech}</option>)}
              </select>

              <label><b>Domain:</b></label>
              <select onChange={(e) => setSelectedDomain(e.target.value)}>
                <option value="All">All</option>
                {uniqueDomains.map(domain => <option key={domain} value={domain}>{domain}</option>)}
              </select>
            </div>

            {/* Pie Chart Section */}
            <div style={{
              flexGrow: 1,
              background: "#fff",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)"
            }}>
              <h2 style={{marginLeft:'300px'}}>No Of Projects Per Domain</h2>
              {pieChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie data={pieChartData} dataKey="value" cx="50%" cy="50%" outerRadius={120} >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p>No data available for selected filters.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ADataVisualization;
