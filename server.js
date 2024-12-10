const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: '123456', 
    database: 'svecw' 
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM Students WHERE regdno = ? AND password = ?';
    db.query(query, [username, password], (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            res.status(500).json({ message: 'Internal server error' });
        } else if (results.length > 0) {
            res.json({ message: 'Login successful', user: results[0] });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    });
});

app.get('/api/user', (req, res) => {
    const { regdno } = req.query; 

    const query = 'SELECT * FROM Students WHERE regdno = ?';
    db.query(query, [regdno], (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            res.status(500).json({ message: 'Internal server error' });
        } else if (results.length > 0) {
            res.json(results[0]); 
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    });
});

app.get('/api/profile/:regdno', async(req, res) => {
    const { regdno } = req.params;

    const query = 'SELECT * FROM Students WHERE regdno = ?'; 
    db.query(query, [regdno], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (result.length > 0) {
            res.json(result[0]); 
        } else {
            res.status(404).json({ error: 'Profile not found' });
        }
    });
});

app.get('/projects', (req, res) => {
    const query = 'SELECT * FROM Projects';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error querying the database:', err);
            res.status(500).json({ message: 'Database error' });
        } else {
            res.json(results);
        }
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

