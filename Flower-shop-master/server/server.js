// load environment variables early
require('dotenv').config();

const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const cors = require('cors');
const bcrypt = require('bcrypt');
const db = require('./db');
const { Registration, Contact, Order } = db.models;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve the static frontend (parent directory)
app.use('/', express.static(path.join(__dirname, '..')));

// connect to MongoDB (if available)
db.connect().catch(err => {
  console.warn('Could not connect to MongoDB, falling back to JSON files. Error:', err && err.message);
});

// helper to append to JSON array file
async function appendToJsonFile(filePath, obj) {
  try {
    let data = [];
    try {
      const txt = await fs.readFile(filePath, 'utf8');
      data = JSON.parse(txt || '[]');
    } catch (e) {
      // file may not exist or be empty
      data = [];
    }
    data.push(obj);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Failed to write', filePath, err);
    return false;
  }
}

const dataDir = path.join(__dirname, 'data');

app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });
    // hash the password if provided
    let hashed = null;
    if (password) {
      const saltRounds = 10;
      hashed = await bcrypt.hash(password, saltRounds);
    }

    // If MongoDB is connected, use it
    if (Registration && Registration.create) {
      try {
        await Registration.create({ name: name || null, email, password: hashed });
        return res.json({ success: true });
      } catch (err) {
        // duplicate key (email) -> conflict
        if (err && (err.code === 11000 || err.name === 'MongoServerError')) {
          return res.status(409).json({ success: false, message: 'Email already registered' });
        }
        throw err;
      }
    }

    // fallback to JSON file
    const entry = { name: name || null, email, password: hashed, createdAt: new Date().toISOString() };
    const ok = await appendToJsonFile(path.join(dataDir, 'registrations.json'), entry);
    if (!ok) return res.status(500).json({ success: false });
    res.json({ success: true });
  } catch (err) {
    console.error('Error in /api/register', err);
    res.status(500).json({ success: false });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body || {};
    if (!email || !message) return res.status(400).json({ success: false, message: 'Email and message required' });

    if (Contact && Contact.create) {
      await Contact.create({ name: name || null, email, message });
      return res.json({ success: true });
    }

    const entry = { name: name || null, email, message, createdAt: new Date().toISOString() };
    const ok = await appendToJsonFile(path.join(dataDir, 'contacts.json'), entry);
    if (!ok) return res.status(500).json({ success: false });
    res.json({ success: true });
  } catch (err) {
    console.error('Error in /api/contact', err);
    res.status(500).json({ success: false });
  }
});

app.post('/api/checkout', async (req, res) => {
  try {
    const { items, total, customer } = req.body || {};
    if (!items || !Array.isArray(items) || items.length === 0) return res.status(400).json({ success: false, message: 'Cart items required' });

    if (Order && Order.create) {
      const doc = await Order.create({ items, total: total || 0, customer: customer || null });
      return res.json({ success: true, orderId: doc._id.toString() });
    }

    const entry = { items, total: total || 0, customer: customer || null, createdAt: new Date().toISOString() };
    const ok = await appendToJsonFile(path.join(dataDir, 'orders.json'), entry);
    if (!ok) return res.status(500).json({ success: false });
    res.json({ success: true, orderId: Date.now().toString() });
  } catch (err) {
    console.error('Error in /api/checkout', err);
    res.status(500).json({ success: false });
  }
});

// login endpoint - verifies email/password
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password required' });

    // If MongoDB is available, check there
    if (Registration && Registration.findOne) {
      const user = await Registration.findOne({ email }).lean();
      if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
      if (!user.password) return res.status(401).json({ success: false, message: 'No password set' });
      const ok = await bcrypt.compare(password, user.password);
      if (!ok) return res.status(401).json({ success: false, message: 'Invalid credentials' });
      return res.json({ success: true });
    }

    // Fallback: check JSON file
    try {
      const txt = await fs.readFile(path.join(dataDir, 'registrations.json'), 'utf8');
      const users = JSON.parse(txt || '[]');
      const user = users.find(u => u.email === email);
      if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
      // if password stored as hash, compare; otherwise, previously we masked with '***'
      if (!user.password || user.password === '***') return res.status(401).json({ success: false, message: 'No password available for this account' });
      const ok = await bcrypt.compare(password, user.password);
      if (!ok) return res.status(401).json({ success: false, message: 'Invalid credentials' });
      return res.json({ success: true });
    } catch (err) {
      return res.status(500).json({ success: false });
    }
  } catch (err) {
    console.error('Error in /api/login', err);
    res.status(500).json({ success: false });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// start server with port fallback if needed
async function startServer(preferredPort, maxAttempts = 10) {
  let port = Number(preferredPort) || 3000;
  for (let i = 0; i < maxAttempts; i++) {
    try {
      await new Promise((resolve, reject) => {
        const srv = app.listen(port)
          .on('listening', () => {
            console.log(`Server running on http://localhost:${port}`);
            resolve(srv);
          })
          .on('error', (err) => {
            reject(err);
          });
      });
      return port;
    } catch (err) {
      if (err && err.code === 'EADDRINUSE') {
        console.warn(`Port ${port} in use, trying ${port + 1}...`);
        port = port + 1;
        continue;
      }
      console.error('Failed to start server:', err);
      throw err;
    }
  }
  throw new Error('Could not find free port to start server');
}

// global error handlers to avoid unhandled crashes
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection', reason);
});

startServer(PORT).catch((err) => {
  console.error('Server failed to start:', err && err.message);
  process.exit(1);
});
