const express = require('express');
const mysql = require('mysql2/promise'); // Use mysql2/promise for promise-based queries
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Create a connection pool to MySQL using mysql2/promise
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'svecw',
    waitForConnections: true,  // Ensure connection pooling
    connectionLimit: 10,  // Limit the number of concurrent connections
    queueLimit: 0  // No limit on the connection queue
});

// Test the database connection once the pool is created
db.getConnection()
    .then(connection => {
        console.log('Connected to MySQL database');
        connection.release(); // Release the connection after testing
    })
    .catch(err => {
        console.error('Error connecting to MySQL:', err);
    });

// Login API
app.post('/api/login', async (req, res) => {
    const { username, password, role } = req.body;
    let query;
    let params;

    if (role === 'student') {
        query = 'SELECT * FROM Students WHERE regdNo = ? AND password = ?';
        params = [username, password];  // username is regdNo (VARCHAR)
    } else if (role === 'faculty') {
        query = 'SELECT * FROM faculty WHERE id = ? AND password = ?';
        params = [parseInt(username), password];  // id is INT
    } else if (role === 'admin') {
        query = 'SELECT * FROM admin WHERE id = ? AND password = ?';
        params = [parseInt(username), password];  // id is INT
    } else {
        return res.status(400).json({ message: 'Invalid role' });
    }
    
    try {
        const [results] = await db.query(query, params);
        if (results.length > 0) {
            res.json({ message: 'Login successful', user: results[0] });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (err) {
        console.error('Error querying database:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/api/domains', async (req, res) => {
    try {
        // This assumes you have a domains table or can extract from projects
        const domains = await db.query('SELECT DISTINCT domain FROM projects');
        // Or if domains are stored as JSON arrays:
        // const projects = await db.query('SELECT domain FROM projects');
        // const allDomains = projects.flatMap(p => JSON.parse(p.domain));
        // const uniqueDomains = [...new Set(allDomains)];
        res.json(domains);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/technologies', async (req, res) => {
    try {
        // Similar approach as domains
        const technologies = await db.query('SELECT DISTINCT technologies FROM projects');
        res.json(technologies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API to insert student data
app.post('/add-student', (req, res) => {
    const { regdNo, name, phone, email, branch, sec, batch, password } = req.body;
    console.log(req.body);
    const sql = `INSERT INTO Students (regdNo, name, phone_no, email, branch, sec, batch, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [regdNo, name, phone, email, branch, sec, batch, password], (err, result) => {
        if (err) {
            console.error('Error inserting student:', err);
            return res.status(500).json({ message: 'Error adding student' });
        }
        res.status(200).json({ message: 'Student added successfully' });
    });
});

app.post("/add-faculty", (req, res) => {
    const { name, id, department, email, phone, password } = req.body;
    
    if (!name || !id || !department || !email || !phone || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const sql = "INSERT INTO faculty (id, name, department, email, phno, password) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sql, [id, name, department, email, phone, password], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        console.log("Faculty added successfully!", result);
        return res.status(200).json({ message: "Faculty added successfully!" });
    });
    
});

// Fetch user data by regdno
app.get('/api/user', async (req, res) => {
    const { regdno } = req.query;

    const query = 'SELECT * FROM Students WHERE regdno = ?';
    try {
        const [results] = await db.query(query, [regdno]);
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        console.error('Error querying database:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Fetch profile by regdno
app.get('/api/profile/:regdno', async (req, res) => {
    const { regdno } = req.params;

    const query = 'SELECT * FROM Students WHERE regdno = ?';
    try {
        const [result] = await db.query(query, [regdno]);
        if (result.length > 0) {
            res.json(result[0]);
        } else {
            res.status(404).json({ error: 'Profile not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.get('/api/fprofile/:id', async (req, res) => {
    const { id } = req.params;
    console.log([id])
    const query = 'SELECT * FROM faculty WHERE id = ?';
    try {
        const [result] = await db.query(query, [id]);
        console.log(result)
        if (result.length > 0) {
            res.json(result[0]);
        } else {
            res.status(404).json({ error: 'Profile not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});


// Fetch all projects
app.get('/projects', async (req, res) => {
    const query = 'SELECT * FROM Projects';
    try {
        const [results] = await db.query(query);
        res.json(results);
    } catch (err) {
        console.error('Error querying the database:', err);
        res.status(500).json({ message: 'Database error' });
    }
});

app.put('/api/verify-project', async (req, res) => {
    const { projectId, mentorId } = req.body;
    console.log(projectId, mentorId);
    try {
      // Fetch the project to check if it exists and if the mentor is the correct one
      const projectQuery = 'SELECT * FROM Projects WHERE id = ?';
      const [projectResults] = await db.query(projectQuery, [projectId]);
  
      if (projectResults.length > 0) {
        const project = projectResults[0];
        if (project.mentor_id.toString() !== mentorId) {
          return res.status(403).json({ message: 'You are not authorized to verify this project' });
        }
  
        // Update the project verification status to 'verified' (set verified to 1)
        const updateQuery = 'UPDATE Projects SET verified = ? WHERE id = ?';
        await db.query(updateQuery, [1, projectId]);
  
        res.json({ message: 'Project verified successfully' });
      } else {
        res.status(404).json({ message: 'Project not found' });
      }
    } catch (err) {
      console.error('Error querying database:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  

// Update password endpoint
app.put('/api/change-password', async (req, res) => {
  const { regdno, oldPassword, newPassword } = req.body;

  try {
      // Check if the old password matches
      const query = 'SELECT * FROM Students WHERE regdno = ? AND password = ?';
      const [results] = await db.query(query, [regdno, oldPassword]);

      if (results.length > 0) {
          // Update the password
          const updateQuery = 'UPDATE Students SET password = ? WHERE regdno = ?';
          await db.query(updateQuery, [newPassword, regdno]);
          res.json({ message: 'Password updated successfully' });
      } else {
          res.status(401).json({ message: 'Incorrect old password' });
      }
  } catch (err) {
      console.error('Error querying database:', err);
      res.status(500).json({ message: 'Internal server error' });
  }
});

app.put('/api/fchange-password', async (req, res) => {
    const { id, oldPassword, newPassword } = req.body;
  
    try {
        // Check if the old password matches
        const query = 'SELECT * FROM faculty WHERE id = ? AND password = ?';
        const [results] = await db.query(query, [id, oldPassword]);
  
        if (results.length > 0) {
            // Update the password
            const updateQuery = 'UPDATE faculty SET password = ? WHERE id = ?';
            await db.query(updateQuery, [newPassword, id]);
            res.json({ message: 'Password updated successfully' });
        } else {
            res.status(401).json({ message: 'Incorrect old password' });
        }
    } catch (err) {
        console.error('Error querying database:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.put('/api/achange-password', async (req, res) => {
    const { id, oldPassword, newPassword } = req.body;
  
    try {
        // Check if the old password matches
        const query = 'SELECT * FROM admin WHERE id = ? AND password = ?';
        const [results] = await db.query(query, [id, oldPassword]);
  
        if (results.length > 0) {
            // Update the password
            const updateQuery = 'UPDATE admin SET password = ? WHERE id = ?';
            await db.query(updateQuery, [newPassword, id]);
            res.json({ message: 'Password updated successfully' });
        } else {
            res.status(401).json({ message: 'Incorrect old password' });
        }
    } catch (err) {
        console.error('Error querying database:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
  });

// File upload configuration using multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, "uploads");
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueName = `${Date.now()}-${file.originalname}`; // Correct template literal
        cb(null, uniqueName);
    },
});

// File filter to allow only PDFs and images
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDFs are allowed.'));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});
app.post('/api/projects', upload.single('file'), async (req, res) => {
    try {
        const {
            batch, branch, section, projectName, teamLeadName, teamLeadPhone, teamLeadRegNo,
            teamLeadEmail, teamMembers, technologies, keywords, domain, summary, projectType, mentorId
        } = req.body;

        // Convert arrays to JSON strings
        const teamMembersJson = JSON.stringify(teamMembers ? JSON.parse(teamMembers) : []);
        const technologiesJson = JSON.stringify(technologies ? JSON.parse(technologies) : []);
        const keywordsJson = JSON.stringify(keywords ? JSON.parse(keywords) : []);
        const domainsJson = JSON.stringify(domain ? JSON.parse(domain) : []);

        // File Path
        const file = req.file ? `/uploads/${req.file.filename}` : null;

        // Validate Team Lead Reg No
        const [student] = await db.query('SELECT * FROM Students WHERE regdno = ?', [teamLeadRegNo]);
        if (student.length === 0) {
            return res.status(400).json({ message: 'Invalid team lead registration number' });
        }

        // Insert Query
        const query = `
            INSERT INTO Projects 
            (batch, branch, section, project_name, team_lead_name, team_lead_ph_no, team_lead_regd_no, team_lead_email, 
            team_members, technologies, keywords, domain, summary, project_type, mentor_id, pdf) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            batch, branch, section, projectName, teamLeadName, teamLeadPhone, teamLeadRegNo, teamLeadEmail,
            teamMembersJson, technologiesJson, keywordsJson, domainsJson, summary, projectType, mentorId, file
        ];

        console.log("Inserting values:", values);

        const [result] = await db.query(query, values);
        res.status(201).json({ message: "Project added successfully!", data: result });

    } catch (error) {
        console.error("Error during insertion:", error);
        res.status(500).json({ error: "Server error during database insertion" });
    }
});

// *** PUT: Update Existing Project ***
app.put('/api/projects/:id', upload.single('file'), async (req, res) => {
    try {
        const { id } = req.params;

        const query = `
            UPDATE Projects 
            SET batch = ?, branch = ?, section = ?, project_name = ?, team_lead_name = ?, 
                team_lead_ph_no = ?, team_lead_regd_no = ?, team_lead_email = ?, 
                team_members = ?, technologies = ?, keywords = ?, domain = ?, 
                summary = ?, project_type = ?, mentor_id = ?, pdf = COALESCE(?, pdf) 
            WHERE id = ?
        `;

        const values = [
            req.body.batch, req.body.branch, req.body.section, req.body.projectName, req.body.teamLeadName,
            req.body.teamLeadPhone, req.body.teamLeadRegNo, req.body.teamLeadEmail,
            JSON.stringify(req.body.teamMembers ? JSON.parse(req.body.teamMembers) : []),
            JSON.stringify(req.body.technologies ? JSON.parse(req.body.technologies) : []),
            JSON.stringify(req.body.keywords ? JSON.parse(req.body.keywords) : []),
            JSON.stringify(req.body.domain ? JSON.parse(req.body.domain) : []),
            req.body.summary, req.body.projectType, req.body.mentorId,
            req.file ? `/uploads/${req.file.filename}` : null, id
        ];

        console.log("Updating values:", values);

        const [result] = await db.query(query, values);
        res.json({ message: "Project updated successfully!", result });

    } catch (error) {
        console.error("Error updating project:", error);
        res.status(500).json({ error: "Server error while updating project" });
    }
});

// *** DELETE: Remove Project ***
app.delete('/api/projects/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the project exists
        const [project] = await db.query('SELECT * FROM Projects WHERE id = ?', [id]);
        if (project.length === 0) {
            return res.status(404).json({ message: "Project not found!" });
        }

        // Delete the project file if it exists
        if (project[0].pdf) {
            const filePath = path.join(__dirname, project[0].pdf);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        // Delete project from database
        await db.query('DELETE FROM Projects WHERE id = ?', [id]);

        res.status(200).json({ message: "Project deleted successfully!" });

    } catch (error) {
        console.error("Error deleting project:", error);
        res.status(500).json({ error: "Server error while deleting project" });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
