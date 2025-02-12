import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from './header';
import Dashboard from './dashboard';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ff7300", "#ffc658", "#d0ed57", "#a4de6c"];

const DataVisualization = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch projects from backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("http://localhost:5000/projects");
        console.log("Fetched projects:", response.data); // 🛠️ Log to check fetched data
        setProjects(response.data || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProjects();
  }, []);
  

  // 📊 1️⃣ Projects per Domain (Pie Chart)
  const domainCounts = projects.reduce((acc, project) => {
    if (project.domain) {
      acc[project.domain] = (acc[project.domain] || 0) + 1;
    }
    return acc;
  }, {});

  const domainData = Object.keys(domainCounts).map((domain, index) => ({
    name: domain,
    value: domainCounts[domain],
    color: COLORS[index % COLORS.length],
  }));

  // 💻 2️⃣ Projects per Technology (Pie Chart)
  const technologyCounts = projects.reduce((acc, project) => {
    let techList = [];

    if (project.technologies) {
      if (Array.isArray(project.technologies)) {
        techList = project.technologies;
      } else {
        try {
          techList = JSON.parse(project.technologies);
        } catch (e) {
          console.error("Error parsing technologies:", e);
        }
      }
    }

    techList.forEach((tech) => {
      acc[tech] = (acc[tech] || 0) + 1;
    });

    return acc;
  }, {});

  const technologyData = Object.keys(technologyCounts).map((tech, index) => ({
    name: tech,
    value: technologyCounts[tech],
    color: COLORS[index % COLORS.length],
  }));

  if (loading) return <p>Loading data...</p>;

  return (
    <div>
      <Header />
      <div style={{ display: "flex" }}>
        <div style={{ width: "200px", position: "fixed", height: "100vh", backgroundColor: "#fff" }}>
          <Dashboard />
        </div>
        <div style={{ marginLeft: "220px", width: "80%", padding: "20px", background: "#F8FAFC" }}>
          <h2>📊 Data Visualization</h2>

          {/* Pie Chart - Projects per Domain */}
          <h3>Projects per Domain</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={domainData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {domainData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>

          {/* Pie Chart - Projects per Technology */}
          <h3>Projects per Technology</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={technologyData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {technologyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DataVisualization;
