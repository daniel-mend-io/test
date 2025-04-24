const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files - no path validation
app.use('/static', express.static('public'));

// Vulnerable file serving endpoint - direct path traversal vulnerability
app.get('/download', (req, res) => {
    const filePath = req.query.file;

    // VULNERABLE: No path validation or sanitization
    fs.readFile(filePath, (err, data) => {
        if (err) {
            return res.status(404).send('File not found');
        }
        res.send(data);
    });
});

// Another vulnerable endpoint - path traversal through directory listing
app.get('/files', (req, res) => {
    const directoryPath = req.query.dir || './public';

    // VULNERABLE: No path validation or sanitization
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            return res.status(500).send('Error reading directory');
        }
        res.json(files);
    });
});