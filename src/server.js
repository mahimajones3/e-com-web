const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database setup
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Error connecting to SQLite database:', err.message);
    } else {
        console.log('Connected to SQLite database');
    }
});

// Create products table if it doesn't exist
db.run(`
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        price REAL NOT NULL,
        imageUrl TEXT NOT NULL,
        category TEXT NOT NULL
    )
`);

// API to add a product
app.post('/api/products', (req, res) => {
    const { name, description, price, imageUrl, category } = req.body;

    const sql = `INSERT INTO products (name, description, price, imageUrl, category) VALUES (?, ?, ?, ?, ?)`;
    const params = [name, description, price, imageUrl, category];

    db.run(sql, params, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID });
    });
});

// API to fetch all products
app.get('/api/products', (req, res) => {
    const sql = `SELECT * FROM products`;

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Error fetching products:', err.message);
            return res.status(500).json({ error: 'Failed to fetch products' });
        }
        res.json(rows);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});