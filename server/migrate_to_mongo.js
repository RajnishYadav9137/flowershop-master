// Migration script to import existing JSON data into MongoDB collections.
// Usage: set MONGODB_URI if needed, then run: node migrate_to_mongo.js

const fs = require('fs').promises;
const path = require('path');
const db = require('./db');
const { Registration, Contact, Order } = db.models;

const dataDir = path.join(__dirname, 'data');

async function loadJson(file){
  try{
    const txt = await fs.readFile(path.join(dataDir, file), 'utf8');
    return JSON.parse(txt || '[]');
  } catch (err) {
    console.warn('Could not read', file, err && err.message);
    return [];
  }
}

async function run(){
  await db.connect();
  const regs = await loadJson('registrations.json');
  const contacts = await loadJson('contacts.json');
  const orders = await loadJson('orders.json');

  if (regs.length) {
    console.log('Importing', regs.length, 'registrations...');
    await Registration.insertMany(regs.map(r => ({ name: r.name, email: r.email, password: r.password, createdAt: r.createdAt })));
  }
  if (contacts.length) {
    console.log('Importing', contacts.length, 'contacts...');
    await Contact.insertMany(contacts.map(c => ({ name: c.name, email: c.email, message: c.message, createdAt: c.createdAt })));
  }
  if (orders.length) {
    console.log('Importing', orders.length, 'orders...');
    await Order.insertMany(orders.map(o => ({ items: o.items, total: o.total, customer: o.customer, createdAt: o.createdAt })));
  }

  console.log('Migration complete.');
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
