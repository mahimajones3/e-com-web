const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const app = express();
const port = 5000;
const JWT_SECRET = 'your_jwt_secret_key_here';

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // Your React app's URL
    methods: ['POST', 'GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());

// Database setup
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
    } else {
        console.log('Connected to SQLite database');
    }
});

// users table 
db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

// Validation functions
const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
};

const isValidPassword = (password) => {
    return password.length >= 6;
};

// Signup endpoint
app.post('/api/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Input validation
        if (!username || !email || !password) {
            return res.status(400).json({
                error: 'All fields are required'
            });
        }

        // Email format validation
        if (!isValidEmail(email)) {
            return res.status(400).json({
                error: 'Invalid email format'
            });
        }

        // Password length validation
        if (!isValidPassword(password)) {
            return res.status(400).json({
                error: 'Password must be at least 6 characters long'
            });
        }

        // Check if username or email already exists
        const checkExisting = new Promise((resolve, reject) => {
            db.get(
                'SELECT username, email FROM users WHERE username = ? OR email = ?',
                [username, email],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                }
            );
        });

        const existingUser = await checkExisting;
        
        if (existingUser) {
            if (existingUser.username === username) {
                return res.status(400).json({
                    error: 'Username already exists'
                });
            }
            if (existingUser.email === email) {
                return res.status(400).json({
                    error: 'Email already exists'
                });
            }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        const insertUser = new Promise((resolve, reject) => {
            db.run(
                'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                [username, email, hashedPassword],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });

        const userId = await insertUser;

        // Return success response
        res.status(201).json({
            message: 'User registered successfully',
            userId: userId,
            username: username,
            email: email
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            error: 'An error occurred during registration'
        });
    }
});

// Create a test user function
const createTestUser = async () => {
    try {
        // Check if test user exists first
        db.get('SELECT * FROM users WHERE username = ?', ['testuser'], async (err, row) => {
            if (err) {
                console.error('Error checking test user:', err);
                return;
            }

            if (!row) {
                // Hash password and insert test user
                const hashedPassword = await bcrypt.hash('testpassword', 10);
                db.run(
                    'INSERT INTO users (username, password) VALUES (?, ?)', 
                    ['testuser', hashedPassword], 
                    (insertErr) => {
                        if (insertErr) {
                            console.error('Test user creation error:', insertErr);
                        } else {
                            console.log('Test user created successfully');
                        }
                    }
                );
            }
        });
    } catch (error) {
        console.error('Error in createTestUser:', error);
    }
};

// Login endpoint
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Login attempt:', username);

        // Validate input
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                error: 'Username and password are required'
            });
        }

        // Find user
        const user = await new Promise((resolve, reject) => {
            db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });

        // Check if user exists
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                error: 'Invalid password'
            });
        }

        // Generate token
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            error: 'An unexpected error occurred',
            details: error.message
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// products table
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