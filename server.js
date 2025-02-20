const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const app = express();
const port = 5000;
const JWT_SECRET = 'dc626c73e47d9ab4025d06dafe528932721d601c67c852bac51b1e33e9f7cf5b';

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', 
    methods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ error: 'Invalid token' });
    }
};

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

         // Generate JWT token
         const token = jwt.sign({ id: userId, username }, JWT_SECRET, { expiresIn: '24h' });

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

// API to handle user login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    // Check if the user exists in the database
    const sql = `SELECT * FROM users WHERE username = ?`;
    db.get(sql, [username], async (err, row) => {
        if (err) {
            console.error('Error finding user:', err.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // If user not found
        if (!row) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, row.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        const token = jwt.sign({ id: row.id, username: row.username }, JWT_SECRET, { expiresIn: '24h' });

        // Exclude password from the user data
        const { password: _, ...userData } = row;

        // Return success response with token and user data
        res.json({
            message: 'Login successful',
            token: token,
            user: userData
        });
    });
});


// Protected route example - Home page data
app.get('/api/home', authenticateToken, (req, res) => {
    res.json({
        message: 'Welcome to the home page',
        user: req.user
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

// Protected route - Add product
app.post('/api/products', authenticateToken, (req, res) => {
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

// Protected route - Get products
app.get('/api/products', authenticateToken, (req, res) => {
    const sql = `SELECT * FROM products`;

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Error fetching products:', err.message);
            return res.status(500).json({ error: 'Failed to fetch products' });
        }
        res.json(rows);
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});


// cart items table
db.run(`
    CREATE TABLE IF NOT EXISTS cart_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (product_id) REFERENCES products (id)
    )
`);

// Update your existing cart POST endpoint
app.post('/api/cart', authenticateToken, (req, res) => {
    const { product_id, quantity } = req.body;
    const user_id = req.user.id;

    if (!product_id || !quantity || quantity < 1) {
        return res.status(400).json({ error: 'Invalid product or quantity' });
    }

    // First check if the item already exists in cart
    db.get(
        'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?',
        [user_id, product_id],
        (err, existingItem) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (existingItem) {
                // Update quantity if item exists
                const newQuantity = existingItem.quantity + quantity;
                db.run(
                    'UPDATE cart_items SET quantity = ? WHERE id = ?',
                    [newQuantity, existingItem.id],
                    (err) => {
                        if (err) {
                            return res.status(500).json({ error: err.message });
                        }
                        res.json({
                            message: 'Cart updated successfully',
                            cartItem: {
                                id: existingItem.id,
                                product_id,
                                quantity: newQuantity
                            }
                        });
                    }
                );
            } else {
                // Insert new item if it doesn't exist
                db.run(
                    'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
                    [user_id, product_id, quantity],
                    function(err) {
                        if (err) {
                            return res.status(500).json({ error: err.message });
                        }
                        res.json({
                            message: 'Item added to cart',
                            cartItem: {
                                id: this.lastID,
                                product_id,
                                quantity
                            }
                        });
                    }
                );
            }
        }
    );
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});