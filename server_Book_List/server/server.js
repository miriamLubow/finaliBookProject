
// server/index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// Connect to MySQL Database
const mysql = require('mysql2');
const connection = mysql.createConnection({
  password:'312283427',
  host: 'localhost',
  user: 'root',
  database: 'book_list'
});

connection.connect(err => {
  if (err) throw err;
  console.log('Connected to database');
});

// API Routes
app.get('/api/books', (req, res) => {
  connection.query('SELECT * FROM books', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.get('/api/books/:id', (req, res) => {
  const { id } = req.params;
  connection.query('SELECT * FROM books WHERE id = ?', [id], (err, results) => {
    if (err) throw err;
    res.json(results[0]);
  });
});

app.post('/api/books', (req, res) => {
  const { title, author, description } = req.body;
  connection.query('INSERT INTO books (title, author, description) VALUES (?, ?, ?)', [title, author, description], (err, results) => {
    if (err) throw err;
    res.status(201).json({ id: results.insertId, title, author, description });
  });
});

app.put('/api/books/:id', (req, res) => {
  const { id } = req.params;
  const { title, author, description } = req.body;
  connection.query('UPDATE books SET title = ?, author = ?, description = ? WHERE id = ?', [title, author, description, id], (err) => {
    if (err) throw err;
    res.status(200).json({ id, title, author, description });
  });
});

app.delete('/api/books/:id', (req, res) => {
  const { id } = req.params;
  connection.query('DELETE FROM books WHERE id = ?', [id], (err) => {
    if (err) throw err;
    res.status(204).end();
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


