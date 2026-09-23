const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/flowershop';

async function connect() {
  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 2000
  });
  console.log('Connected to MongoDB:', MONGODB_URI);
}

function isConnected() {
  return mongoose.connection && mongoose.connection.readyState === 1;
}

// Schemas
const RegistrationSchema = new mongoose.Schema({
  name: { type: String, default: null },
  email: { type: String, required: true, index: true, unique: true },
  phone: { type: String, default: null },
  password: { type: String, default: null },
  addresses: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
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
  subtotal: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  shipping: { type: Number, default: 0 },
  customer: { type: Object, default: null },
  shippingAddress: { type: Object, default: null },
  deliveryDate: { type: String, default: null },
  deliveryTimeSlot: { type: String, default: null },
  giftMessage: { type: String, default: null },
  paymentMethod: { type: String, default: 'cod' },
  status: { type: String, default: 'Confirmed' },
  createdAt: { type: Date, default: Date.now }
});

const Registration = mongoose.model('Registration', RegistrationSchema);
const Contact = mongoose.model('Contact', ContactSchema);
const Order = mongoose.model('Order', OrderSchema);

module.exports = {
  connect,
  isConnected,
  models: {
    Registration,
    Contact,
    Order
  }
};
