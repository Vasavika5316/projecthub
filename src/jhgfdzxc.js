import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./header";
import Dashboard from "./dashboard";
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ff7300", "#ffc658", "#d0ed57", "#a4de6c"];

const DataVisualization = () => {
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
        setProjects(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) return <h3 style={{ textAlign: "center", color: "#888" }}>⏳ Loading project data...</h3>;

  // Unique values for filtering
  const uniqueBatches = [...new Set(projects.map((p) => p.batch))].filter(Boolean);
  const uniqueBranches = [...new Set(projects.map((p) => p.branch))].filter(Boolean);
  const uniqueDomains = [...new Set(projects.flatMap((p) => p.domain || []))].filter(Boolean);
  const uniqueTechnologies = [...new Set(projects.flatMap((p) => p.technologies || []))].filter(Boolean);

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

  const domainData = Object.keys(domainCounts).map((domain, index) => ({
    name: domain,
    value: domainCounts[domain],
    color: COLORS[index % COLORS.length],
  }));

  return (
    <div>
      <Header />
      <div style={{ display: "flex" }}>
        {/* Sidebar */}
        <div style={{ width: "200px", position: "fixed", height: "100vh", overflowY: "auto", backgroundColor: "#fff", left: 0, top: "60px" }}>
          <Dashboard />
        </div>

        {/* Main Content */}
        <div style={{ marginLeft: "260px", flexGrow: 1, height: "84vh", padding: "20px", background: "#F8FAFC" }}>
          <h2>📊 Data Visualization</h2>

          {/* Filters */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px", alignItems: "center" }}>
            <label>Batch:</label>
            <select value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)}>
              <option value="">All</option>
              {uniqueBatches.map((batch) => (
                <option key={batch} value={batch}>{batch}</option>
              ))}
            </select>

            <label>Branch:</label>
            <select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}>
              <option value="">All</option>
              {uniqueBranches.map((branch) => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>

            <label>Domain:</label>
            <select value={selectedDomain} onChange={(e) => setSelectedDomain(e.target.value)}>
              <option value="All">All</option>
              {uniqueDomains.map((domain) => (
                <option key={domain} value={domain}>{domain}</option>
              ))}
            </select>

            <label>Technology:</label>
            <select value={selectedTechnology} onChange={(e) => setSelectedTechnology(e.target.value)}>
              <option value="All">All</option>
              {uniqueTechnologies.map((tech) => (
                <option key={tech} value={tech}>{tech}</option>
              ))}
            </select>

            <button 
              onClick={() => { 
                setSelectedBatch(""); 
                setSelectedBranch(""); 
                setSelectedDomain("All"); 
                setSelectedTechnology("All"); 
              }}
              style={{
                padding: "5px 10px",
                backgroundColor: "#f04e30",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                borderRadius: "5px"
              }}
            >
              Reset Filters
            </button>
          </div>

          {/* Pie Chart - Projects per Domain */}
          {domainData.length > 0 ? (
            <ResponsiveContainer width={600} height={400}>
              <PieChart>
                <Pie data={domainData} dataKey="value" cx="50%" cy="50%" outerRadius={120}>
                  {domainData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ textAlign: "center", color: "#888" }}>No data available for selected filters.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataVisualization;
