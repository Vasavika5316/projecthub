import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from './header';
import Dashboard from './dashboard';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ff7300", "#ffc658", "#d0ed57", "#a4de6c"];

const DataVisualization = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Projects per Domain
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

  // Projects per Technology
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
        <div style={{
          width: "200px",
          position: "fixed",
          height: "100vh",
          backgroundColor: "#fff",
          left: 0,
          top: "60px"
        }}>
          <Dashboard />
        </div>

        <div style={{
          marginLeft: "260px",
          flexGrow: 1,
          padding: "20px",
          background: "#F8FAFC"
        }}>
          <h2>📊 Data Visualization</h2>

          {/* Side-by-side container */}
          <div style={{ display: "flex", justifyContent: "space-around", gap: "30px" }}>
            {/* Pie Chart - Projects per Domain */}
            <div>
              <h3>Projects per Domain</h3>
              <ResponsiveContainer width={350} height={300}>
                <PieChart>
                  <Pie
                    data={domainData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                  >
                    {domainData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart - Projects per Technology */}
            <div>
              <h3>Projects per Technology</h3>
              <ResponsiveContainer width={350} height={300}>
                <PieChart>
                  <Pie
                    data={technologyData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                  >
                    {technologyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataVisualization;
