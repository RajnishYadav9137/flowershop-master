const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/flowershop';

async function connect() {
  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log('Connected to MongoDB:', MONGODB_URI);
}

// Schemas
const RegistrationSchema = new mongoose.Schema({
  name: { type: String, default: null },
  email: { type: String, required: true, index: true, unique: true },
  password: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
});

const ContactSchema = new mongoose.Schema({
  name: { type: String, default: null },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const OrderSchema = new mongoose.Schema({
  items: { type: Array, default: [] },
  total: { type: Number, default: 0 },
  customer: { type: Object, default: null },
  createdAt: { type: Date, default: Date.now }
});

const Registration = mongoose.model('Registration', RegistrationSchema);
const Contact = mongoose.model('Contact', ContactSchema);
const Order = mongoose.model('Order', OrderSchema);

module.exports = {
  connect,
  models: {
    Registration,
    Contact,
    Order
  }
};
