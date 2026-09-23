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

// Static products catalog with enriched attributes
const PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Blossoms in Pink',
    price: 1099,
    oldPrice: 1399,
    discountPercent: 21,
    category: 'bouquets',
    occasion: 'Anniversary',
    flowerType: 'roses',
    color: 'pink',
    image: 'images/featured1.png',
    images: ['images/featured1.png', 'images/fea.png', 'images/flower-vase1.png'],
    stock: 18,
    inStock: true,
    rating: 4.8,
    reviewsCount: 34,
    tags: ['featured', 'popular', 'anniversary', 'roses'],
    isFeatured: true,
    isBestseller: false,
    isNew: false,
    isSpecial: false,
    badge: 'Popular',
    description: 'A delicate arrangement of fresh pink roses and fragrant carnations, designed to express grace, elegance and fond admiration. Hand-tied with silk ribbons.',
    flowerCare: [
      'Trim 1-2 inches off the stems diagonally under running water upon arrival.',
      'Place in a clean vase filled with cold water and the included flower food.',
      'Change vase water every 48 hours to maintain peak petal freshness.',
      'Keep away from direct harsh sunlight, heating vents, and ripening fruit.'
    ],
    deliveryInfo: 'Delivered in climate-controlled temperature vans with hydro-gel stem wraps to guarantee garden freshness upon unboxing.',
    returnPolicy: '100% Bloom Delight Guarantee. If your flowers are wilted or damaged within 24 hours of delivery, we provide an immediate free replacement.',
    reviews: [
      { author: 'Ananya S.', rating: 5, date: '2026-08-14', comment: 'The pink roses were absolutely breathtaking and lasted over 8 days!' },
      { author: 'Vikram R.', rating: 4.6, date: '2026-07-28', comment: 'Delivered on time for our wedding anniversary. My wife loved the sweet fragrance.' }
    ]
  },
  {
    id: 'prod-2',
    name: 'Bunch of Colours',
    price: 899,
    oldPrice: 1199,
    discountPercent: 25,
    category: 'bouquets',
    occasion: 'Birthday',
    flowerType: 'mixed',
    color: 'mixed',
    image: 'images/fea.png',
    images: ['images/fea.png', 'images/fea4.png', 'images/featured1.png'],
    stock: 24,
    inStock: true,
    rating: 4.9,
    reviewsCount: 52,
    tags: ['bestseller', 'birthday', 'colourful', 'mixed'],
    isFeatured: true,
    isBestseller: true,
    isNew: false,
    isSpecial: false,
    badge: 'Best Seller',
    description: 'A vibrant symphony of mixed seasonal blossoms bringing bright cheer, joy and festive energy to any celebration. Packed with gerberas, spray roses and greens.',
    flowerCare: [
      'Snip stem bottoms at a 45-degree angle before arranging.',
      'Remove any foliage that sits beneath the water line.',
      'Replenish water daily and mist petals lightly in the morning.'
    ],
    deliveryInfo: 'Same-day delivery available across all metro pincodes for orders placed before 5 PM.',
    returnPolicy: '24-hour freshness replacement warranty backed by our master florists.',
    reviews: [
      { author: 'Pooja M.', rating: 5, date: '2026-08-20', comment: 'So lively and colorful! Made my sister\'s birthday truly memorable.' },
      { author: 'David K.', rating: 4.8, date: '2026-08-02', comment: 'Great quality blossoms, vibrant colors and very cheerful packaging.' }
    ]
  },
  {
    id: 'prod-3',
    name: 'Forever Yellow',
    price: 799,
    oldPrice: 999,
    discountPercent: 20,
    category: 'bouquets',
    occasion: 'Congratulations',
    flowerType: 'sunflowers',
    color: 'yellow',
    image: 'images/download.jpeg',
    images: ['images/download.jpeg', 'images/fea.png', 'images/fea4.png'],
    stock: 12,
    inStock: true,
    rating: 4.7,
    reviewsCount: 28,
    tags: ['trending', 'sunflowers', 'friendship', 'congratulations'],
    isFeatured: false,
    isBestseller: false,
    isNew: true,
    isSpecial: false,
    badge: 'Trending',
    description: 'Radiant golden sunflowers and yellow chrysanthemums that symbolize friendship, warmth, and everlasting positivity. Wrapped in rustic craft paper.',
    flowerCare: [
      'Sunflowers love fresh, deep water. Fill your vase at least 2/3 full.',
      'Recut stems every 2 days to maximize water absorption.',
      'Keep in a bright, ambient room avoiding direct draft.'
    ],
    deliveryInfo: 'Hand-delivered with complimentary personalized gift tag and care guide.',
    returnPolicy: '100% Satisfaction or prompt re-delivery guarantee within 24 hours.',
    reviews: [
      { author: 'Siddharth T.', rating: 5, date: '2026-08-11', comment: 'The sunflowers bloomed so big! Brought immediate smiles.' }
    ]
  },
  {
    id: 'prod-4',
    name: 'Colourful Spring',
    price: 1250,
    oldPrice: 1550,
    discountPercent: 19,
    category: 'specials',
    occasion: 'Birthday',
    flowerType: 'mixed',
    color: 'mixed',
    image: 'images/fea4.png',
    images: ['images/fea4.png', 'images/fea5.png', 'images/featured1.png'],
    stock: 9,
    inStock: true,
    rating: 5.0,
    reviewsCount: 68,
    tags: ['special', 'spring', 'bestseller', 'handcrafted'],
    isFeatured: true,
    isBestseller: true,
    isNew: false,
    isSpecial: true,
    badge: "Today's Special",
    description: 'Fresh seasonal spring flowers handpicked for an uplifting, fragrant centerpiece that transforms any room. Features tulips, spray carnations and baby\'s breath.',
    flowerCare: [
      'Use clean room-temperature water.',
      'Trim stems 1 inch every other day.',
      'Place in an airy room out of direct afternoon heat.'
    ],
    deliveryInfo: 'Express delivery within 2 hours available in select cities.',
    returnPolicy: 'Fresh bloom replacement guaranteed if reported within 24 hours.',
    reviews: [
      { author: 'Meera N.', rating: 5, date: '2026-08-25', comment: 'Unbelievable freshness! Smelled divine the second the courier arrived.' }
    ]
  },
  {
    id: 'prod-5',
    name: 'Bouquet of Love',
    price: 1899,
    oldPrice: 2299,
    discountPercent: 17,
    category: 'roses',
    occasion: 'Valentine\'s',
    flowerType: 'roses',
    color: 'red',
    image: 'images/fea2.jpg',
    images: ['images/fea2.jpg', 'images/featured3.png', 'images/main-image-rose.jpg'],
    stock: 15,
    inStock: true,
    rating: 4.9,
    reviewsCount: 89,
    tags: ['romantic', 'valentine', 'roses', 'love', 'featured'],
    isFeatured: true,
    isBestseller: true,
    isNew: false,
    isSpecial: true,
    badge: 'Romantic',
    description: 'Classic crimson red roses wrapped in luxury satin ribbons and tissue, expressing timeless romance, deep love and passion.',
    flowerCare: [
      'Cut stems diagonally underwater to prevent air bubbles from blocking hydration.',
      'Ensure no leaves touch the water inside the vase.',
      'Add floral preservative packet provided with the bouquet.'
    ],
    deliveryInfo: 'Discreet gift packaging with optional anonymous sender card available.',
    returnPolicy: 'Guaranteed 5-day vase life when following care instructions.',
    reviews: [
      { author: 'Rahul C.', rating: 5, date: '2026-08-19', comment: 'Stunning deep red roses. High-end packaging made it feel super premium.' }
    ]
  },
  {
    id: 'prod-6',
    name: 'First Impressions',
    price: 1499,
    oldPrice: 1799,
    discountPercent: 17,
    category: 'lilies',
    occasion: 'Congratulations',
    flowerType: 'lilies',
    color: 'white',
    image: 'images/fae3.jpg',
    images: ['images/fae3.jpg', 'images/main-image-white.jpg', 'images/featured1.png'],
    stock: 8,
    inStock: true,
    rating: 4.8,
    reviewsCount: 41,
    tags: ['luxury', 'lilies', 'white', 'elegant'],
    isFeatured: false,
    isBestseller: false,
    isNew: true,
    isSpecial: true,
    badge: 'Luxury',
    description: 'Majestic white Asiatic lilies combined with soft pink buds creating an unforgettable, luxurious floral gesture. Heavenly fragrance.',
    flowerCare: [
      'Gently pluck pollen anthers with a tissue as lilies open to prevent staining.',
      'Keep water clean and cold.',
      'Lilies will continue opening over 5-7 days for an evolving display.'
    ],
    deliveryInfo: 'Shipped in protective florist sleeves with insulated water reservoir.',
    returnPolicy: '100% Freshness and satisfaction guaranteed.',
    reviews: [
      { author: 'Kavita B.', rating: 5, date: '2026-08-05', comment: 'The fragrance filled our whole living room! Pure elegance.' }
    ]
  },
  {
    id: 'prod-7',
    name: 'Summer Splendor',
    price: 1650,
    oldPrice: 1999,
    discountPercent: 18,
    category: 'specials',
    occasion: 'Anniversary',
    flowerType: 'mixed',
    color: 'yellow',
    image: 'images/fea5.png',
    images: ['images/fea5.png', 'images/fea.png', 'images/fea4.png'],
    stock: 14,
    inStock: true,
    rating: 4.9,
    reviewsCount: 37,
    tags: ['special', 'summer', 'anniversary', 'discount'],
    isFeatured: false,
    isBestseller: false,
    isNew: false,
    isSpecial: true,
    badge: 'Special Offer',
    description: 'Warm summer hues featuring hand-selected seasonal blossoms wrapped in artisanal eco-friendly packaging. Includes orange gerberas and yellow chrysanthemums.',
    flowerCare: [
      'Keep away from draughts and air conditioning units.',
      'Cut stems 1 cm every other day.'
    ],
    deliveryInfo: 'Scheduled morning and evening time slots available.',
    returnPolicy: 'Fresh bloom replacement guaranteed.',
    reviews: [
      { author: 'Tanvi M.', rating: 4.9, date: '2026-07-22', comment: 'Such warm and inviting colors. Exactly like the photograph.' }
    ]
  },
  {
    id: 'prod-8',
    name: 'Royal Velvet Red Roses',
    price: 2199,
    oldPrice: 2699,
    discountPercent: 19,
    category: 'roses',
    occasion: 'Anniversary',
    flowerType: 'roses',
    color: 'red',
    image: 'images/featured3.png',
    images: ['images/featured3.png', 'images/fea2.jpg', 'images/main-image-rose.jpg'],
    stock: 6,
    inStock: true,
    rating: 5.0,
    reviewsCount: 112,
    tags: ['premium', 'roses', 'anniversary', 'bestseller'],
    isFeatured: true,
    isBestseller: true,
    isNew: false,
    isSpecial: false,
    badge: 'Premium',
    description: 'Premium long-stemmed Dutch red roses in a luxury presentation box, perfect for grand romantic gestures and monumental milestones.',
    flowerCare: [
      'Keep in clean cold water with preservative.',
      'Re-cut stems every 48 hours.',
      'Keep away from fruits and sunny windows.'
    ],
    deliveryInfo: 'Special Midnight Surprise Delivery (11:30 PM - 12:00 AM) available for this bouquet.',
    returnPolicy: 'Luxury grade guarantee with 7-day vase life assurance.',
    reviews: [
      { author: 'Arjun P.', rating: 5, date: '2026-08-30', comment: 'Best roses in town. The velvet texture and petals were pristine.' }
    ]
  },
  {
    id: 'prod-9',
    name: 'Imperial Purple Orchid Bloom',
    price: 1599,
    oldPrice: 1999,
    discountPercent: 20,
    category: 'plants',
    occasion: 'Wedding',
    flowerType: 'orchids',
    color: 'purple',
    image: 'images/main-image3.jpg',
    images: ['images/main-image3.jpg', 'images/flower-vase1.png', 'images/fae3.jpg'],
    stock: 10,
    inStock: true,
    rating: 4.9,
    reviewsCount: 46,
    tags: ['orchids', 'plants', 'wedding', 'indoor', 'purple'],
    isFeatured: true,
    isBestseller: false,
    isNew: true,
    isSpecial: false,
    badge: 'New Arrival',
    description: 'Exotic purple dendrobium orchids paired with lush tropical greenery. Long-lasting, regal blooms that exude sophisticated charm.',
    flowerCare: [
      'Orchids thrive with indirect bright light.',
      'Keep water clean; orchids drink slowly and can last up to 3 weeks with proper trimming.',
      'Avoid placing near air conditioning or drafts.'
    ],
    deliveryInfo: 'Delivered in a protective florist presentation crate.',
    returnPolicy: 'Guaranteed 14-day freshness with replacement support.',
    reviews: [
      { author: 'Lavanya G.', rating: 5, date: '2026-08-18', comment: 'Incredible longevity! Lasted almost 3 weeks on our dining table.' }
    ]
  },
  {
    id: 'prod-10',
    name: 'Valentine Serenade',
    price: 2499,
    oldPrice: 3199,
    discountPercent: 22,
    category: 'roses',
    occasion: 'Valentine\'s',
    flowerType: 'roses',
    color: 'red',
    image: 'images/main-image-rose.jpg',
    images: ['images/main-image-rose.jpg', 'images/fea2.jpg', 'images/featured3.png'],
    stock: 7,
    inStock: true,
    rating: 5.0,
    reviewsCount: 74,
    tags: ['valentine', 'roses', 'romantic', 'luxury'],
    isFeatured: true,
    isBestseller: true,
    isNew: false,
    isSpecial: true,
    badge: 'Valentine Pick',
    description: 'An opulent cascade of 30 velvety scarlet roses nestled amongst gypsophila and eucalyptus leaves, wrapped in designer matte paper.',
    flowerCare: [
      'Trim 1-2 cm at an angle every 2 days.',
      'Keep away from heat radiators and fans.'
    ],
    deliveryInfo: 'Same-day delivery and Midnight delivery available.',
    returnPolicy: '100% Romance Delight Guarantee.',
    reviews: [
      { author: 'Rohan D.', rating: 5, date: '2026-08-27', comment: 'She cried tears of joy! The 30 roses were huge and immaculate.' }
    ]
  },
  {
    id: 'prod-11',
    name: 'Pure Serenity Lilies & Carnations',
    price: 1350,
    oldPrice: 1699,
    discountPercent: 20,
    category: 'lilies',
    occasion: 'Wedding',
    flowerType: 'carnations',
    color: 'white',
    image: 'images/main-image-white.jpg',
    images: ['images/main-image-white.jpg', 'images/fae3.jpg', 'images/featured1.png'],
    stock: 16,
    inStock: true,
    rating: 4.7,
    reviewsCount: 39,
    tags: ['wedding', 'white', 'lilies', 'carnations', 'serenity'],
    isFeatured: false,
    isBestseller: false,
    isNew: true,
    isSpecial: false,
    badge: 'Wedding Choice',
    description: 'Chaste white oriental lilies, snow carnations, and silver dollar eucalyptus symbolizing purity, devotion, and peace.',
    flowerCare: [
      'Change water every 2 days.',
      'Remove lower foliage before setting into the vase.'
    ],
    deliveryInfo: 'Includes elegant sympathy or celebratory card upon request.',
    returnPolicy: 'Freshness guaranteed upon handover.',
    reviews: [
      { author: 'Deepa V.', rating: 4.8, date: '2026-08-09', comment: 'Brought serenity and calm. Beautiful arrangement.' }
    ]
  },
  {
    id: 'prod-12',
    name: 'Deluxe Florist Gift Basket',
    price: 2799,
    oldPrice: 3499,
    discountPercent: 20,
    category: 'gifts',
    occasion: 'Birthday',
    flowerType: 'mixed',
    color: 'mixed',
    image: 'images/flower-vase1.png',
    images: ['images/flower-vase1.png', 'images/fea4.png', 'images/featured1.png'],
    stock: 5,
    inStock: true,
    rating: 4.9,
    reviewsCount: 61,
    tags: ['gifts', 'hamper', 'birthday', 'premium', 'vase'],
    isFeatured: true,
    isBestseller: false,
    isNew: true,
    isSpecial: true,
    badge: 'Gift Hamper',
    description: 'A curated luxury gift hamper featuring a bespoke ceramic flower vase, artisanal chocolate truffles, scented candle, and seasonal blossoms.',
    flowerCare: [
      'Flowers arrive arranged in water-absorbing oasis foam.',
      'Add half a cup of fresh water daily into the vase center.'
    ],
    deliveryInfo: 'Shipped in a reusable keepsake wooden gift basket with gold ribbon.',
    returnPolicy: 'Complete gift set satisfaction guarantee.',
    reviews: [
      { author: 'Geeta S.', rating: 5, date: '2026-08-16', comment: 'The vase and candle are gorgeous! Fantastic complete gift package.' }
    ]
  }
];

// Read JSON file helper
async function readJsonFile(filePath, defaultVal = []) {
  try {
    const txt = await fs.readFile(filePath, 'utf8');
    return JSON.parse(txt || '[]');
  } catch (e) {
    return defaultVal;
  }
}

// Write JSON file helper
async function writeJsonFile(filePath, data) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Failed to write JSON file:', filePath, err);
    return false;
  }
}

// ---------------- PRODUCTS API ----------------
app.get('/api/products', (req, res) => {
  const {
    category,
    occasion,
    flowerType,
    color,
    minPrice,
    maxPrice,
    minRating,
    inStockOnly,
    minDiscount,
    search,
    sort
  } = req.query;

  let list = [...PRODUCTS];

  // Category filter
  if (category && category !== 'all') {
    const cat = category.toLowerCase().trim();
    if (cat === 'specials') {
      list = list.filter(p => p.isSpecial || p.category.toLowerCase() === 'specials');
    } else {
      list = list.filter(p => p.category.toLowerCase() === cat);
    }
  }

  // Occasion filter
  if (occasion && occasion !== 'all') {
    const occ = occasion.toLowerCase().trim();
    list = list.filter(p => p.occasion && p.occasion.toLowerCase() === occ);
  }

  // Flower Type filter
  if (flowerType && flowerType !== 'all') {
    const ft = flowerType.toLowerCase().trim();
    list = list.filter(p => p.flowerType && p.flowerType.toLowerCase() === ft);
  }

  // Color filter
  if (color && color !== 'all') {
    const col = color.toLowerCase().trim();
    list = list.filter(p => p.color && p.color.toLowerCase() === col);
  }

  // Min / Max Price
  if (minPrice) {
    const min = Number(minPrice);
    if (!isNaN(min)) list = list.filter(p => p.price >= min);
  }
  if (maxPrice) {
    const max = Number(maxPrice);
    if (!isNaN(max)) list = list.filter(p => p.price <= max);
  }

  // Rating filter
  if (minRating) {
    const mr = Number(minRating);
    if (!isNaN(mr)) list = list.filter(p => (p.rating || 0) >= mr);
  }

  // In Stock filter
  if (inStockOnly === 'true' || inStockOnly === '1') {
    list = list.filter(p => p.inStock && p.stock > 0);
  }

  // Min discount filter
  if (minDiscount) {
    const md = Number(minDiscount);
    if (!isNaN(md)) list = list.filter(p => (p.discountPercent || 0) >= md);
  }

  // Text search
  if (search) {
    const q = search.toLowerCase().trim();
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.occasion && p.occasion.toLowerCase().includes(q)) ||
      (p.flowerType && p.flowerType.toLowerCase().includes(q)) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
    );
  }

  // Sorting
  if (sort) {
    switch (sort) {
      case 'price_asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating_desc':
        list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'popularity':
        list.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
        break;
      case 'discount_desc':
        list.sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));
        break;
      case 'newest':
        list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'featured':
      default:
        list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }
  }

  res.json({
    success: true,
    total: list.length,
    products: list
  });
});

// GET single product by ID
app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Bouquet not found' });
  }

  // Related products from same category or occasion
  const related = PRODUCTS.filter(p => p.id !== id && (p.category === product.category || p.occasion === product.occasion)).slice(0, 4);

  res.json({
    success: true,
    product,
    related
  });
});

// POST review for a product
app.post('/api/products/:id/review', (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body || {};
  const author = (req.body && (req.body.author || req.body.userName || req.body.name)) ? (req.body.author || req.body.userName || req.body.name).trim() : '';

  if (!author || !rating || !comment) {
    return res.status(400).json({ success: false, message: 'Author name, star rating, and review text are required' });
  }

  const product = PRODUCTS.find(p => p.id === id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Bouquet not found' });
  }

  const newReview = {
    author: author.trim(),
    rating: Number(rating),
    date: new Date().toISOString().split('T')[0],
    comment: comment.trim()
  };

  if (!product.reviews) product.reviews = [];
  product.reviews.unshift(newReview);
  product.reviewsCount = (product.reviewsCount || 0) + 1;

  // Recalculate average rating
  const avg = product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length;
  product.rating = Number(avg.toFixed(1));

  res.json({
    success: true,
    message: 'Thank you! Your floral review has been submitted.',
    product
  });
});

// ---------------- USER REGISTRATION ----------------
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body || {};
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });
    if (!password) return res.status(400).json({ success: false, message: 'Password is required' });

    const normalizedEmail = email.toLowerCase().trim();

    // Hash password
    const saltRounds = 10;
    const hashed = await bcrypt.hash(password, saltRounds);

    // If MongoDB is connected
    if (db.isConnected() && Registration && Registration.create) {
      try {
        const doc = await Registration.create({
          name: name ? name.trim() : null,
          email: normalizedEmail,
          phone: phone ? phone.trim() : null,
          password: hashed,
          addresses: []
        });
        const userPayload = {
          id: doc._id.toString(),
          name: doc.name || 'Valued Customer',
          email: doc.email,
          phone: doc.phone || '',
          addresses: doc.addresses || []
        };
        return res.json({ success: true, message: 'Account created successfully', user: userPayload });
      } catch (err) {
        if (err && (err.code === 11000 || err.name === 'MongoServerError')) {
          return res.status(409).json({ success: false, message: 'Email already registered. Please sign in.' });
        }
        throw err;
      }
    }

    // JSON fallback
    const regFile = path.join(dataDir, 'registrations.json');
    const users = await readJsonFile(regFile);
    if (users.some(u => u.email && u.email.toLowerCase() === normalizedEmail)) {
      return res.status(409).json({ success: false, message: 'Email already registered. Please sign in.' });
    }

    const newUser = {
      id: 'usr_' + Date.now(),
      name: name ? name.trim() : 'Valued Customer',
      email: normalizedEmail,
      phone: phone ? phone.trim() : '',
      password: hashed,
      addresses: [],
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    await writeJsonFile(regFile, users);

    const userPayload = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      addresses: newUser.addresses
    };
    res.json({ success: true, message: 'Account created successfully', user: userPayload });
  } catch (err) {
    console.error('Error in /api/register', err);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
});

// ---------------- USER LOGIN ----------------
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password required' });

    const normalizedEmail = email.toLowerCase().trim();

    // MongoDB check
    if (db.isConnected() && Registration && Registration.findOne) {
      const user = await Registration.findOne({ email: normalizedEmail }).lean();
      if (!user) return res.status(401).json({ success: false, message: 'Invalid email or password' });
      if (!user.password) return res.status(401).json({ success: false, message: 'No password set for this account' });
      const ok = await bcrypt.compare(password, user.password);
      if (!ok) return res.status(401).json({ success: false, message: 'Invalid email or password' });

      return res.json({
        success: true,
        message: 'Signed in successfully',
        user: {
          id: user._id.toString(),
          name: user.name || 'Valued Customer',
          email: user.email,
          phone: user.phone || '',
          addresses: user.addresses || []
        }
      });
    }

    // JSON file fallback
    const users = await readJsonFile(path.join(dataDir, 'registrations.json'));
    const user = users.find(u => u.email && u.email.toLowerCase() === normalizedEmail);
    if (!user) return res.status(401).json({ success: false, message: 'Invalid email or password' });
    if (!user.password || user.password === '***') return res.status(401).json({ success: false, message: 'No password set for this account' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ success: false, message: 'Invalid email or password' });

    res.json({
      success: true,
      message: 'Signed in successfully',
      user: {
        id: user.id || user._id,
        name: user.name || 'Valued Customer',
        email: user.email,
        phone: user.phone || '',
        addresses: user.addresses || []
      }
    });
  } catch (err) {
    console.error('Error in /api/login', err);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

// ---------------- FORGOT & RESET PASSWORD ----------------
app.post('/api/forgot-password', async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ success: false, message: 'Email address is required' });

    const normalizedEmail = email.toLowerCase().trim();
    const token = 'RESET-' + Math.random().toString(36).substring(2, 10).toUpperCase();

    if (db.isConnected() && Registration && Registration.findOne) {
      const user = await Registration.findOne({ email: normalizedEmail });
      if (!user) return res.status(404).json({ success: false, message: 'No registered user found with that email' });

      user.resetToken = token;
      user.resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour
      await user.save();

      return res.json({
        success: true,
        message: 'Password reset token generated.',
        resetToken: token
      });
    }

    // JSON file fallback
    const regFile = path.join(dataDir, 'registrations.json');
    const users = await readJsonFile(regFile);
    const idx = users.findIndex(u => u.email && u.email.toLowerCase() === normalizedEmail);
    if (idx === -1) return res.status(404).json({ success: false, message: 'No registered user found with that email' });

    users[idx].resetToken = token;
    users[idx].resetTokenExpiry = new Date(Date.now() + 3600000).toISOString();
    await writeJsonFile(regFile, users);

    res.json({
      success: true,
      message: 'Password reset token generated.',
      resetToken: token
    });
  } catch (err) {
    console.error('Error in /api/forgot-password', err);
    res.status(500).json({ success: false, message: 'Server error requesting password reset' });
  }
});

app.post('/api/reset-password', async (req, res) => {
  try {
    const { email, token, newPassword } = req.body || {};
    if (!email || !token || !newPassword) {
      return res.status(400).json({ success: false, message: 'Email, token, and new password are required' });
    }
    if (newPassword.length < 4) {
      return res.status(400).json({ success: false, message: 'Password must be at least 4 characters long' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const passwordHash = await bcrypt.hash(newPassword, 10);

    if (db.isConnected() && Registration && Registration.findOne) {
      const user = await Registration.findOne({ email: normalizedEmail, resetToken: token });
      if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });

      user.password = passwordHash;
      user.resetToken = null;
      user.resetTokenExpiry = null;
      await user.save();

      return res.json({ success: true, message: 'Password updated successfully' });
    }

    // JSON file fallback
    const regFile = path.join(dataDir, 'registrations.json');
    const users = await readJsonFile(regFile);
    const idx = users.findIndex(u => u.email && u.email.toLowerCase() === normalizedEmail && u.resetToken === token);
    if (idx === -1) return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });

    users[idx].password = passwordHash;
    delete users[idx].resetToken;
    delete users[idx].resetTokenExpiry;
    users[idx].updatedAt = new Date().toISOString();
    await writeJsonFile(regFile, users);

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    console.error('Error in /api/reset-password', err);
    res.status(500).json({ success: false, message: 'Server error resetting password' });
  }
});

// ---------------- USER PROFILE (GET / PUT) ----------------
app.get('/api/user/profile', async (req, res) => {
  try {
    const email = req.query.email ? req.query.email.toLowerCase().trim() : null;
    if (!email) return res.status(400).json({ success: false, message: 'Email required' });

    if (db.isConnected() && Registration && Registration.findOne) {
      const user = await Registration.findOne({ email }).lean();
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      return res.json({
        success: true,
        user: {
          id: user._id.toString(),
          name: user.name || '',
          email: user.email,
          phone: user.phone || '',
          addresses: user.addresses || []
        }
      });
    }

    const users = await readJsonFile(path.join(dataDir, 'registrations.json'));
    const user = users.find(u => u.email && u.email.toLowerCase() === email);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({
      success: true,
      user: {
        id: user.id || user._id,
        name: user.name || '',
        email: user.email,
        phone: user.phone || '',
        addresses: user.addresses || []
      }
    });
  } catch (err) {
    console.error('Error fetching profile', err);
    res.status(500).json({ success: false, message: 'Server error fetching profile' });
  }
});

app.put('/api/user/profile', async (req, res) => {
  try {
    const { email, name, phone, addresses, password } = req.body || {};
    if (!email) return res.status(400).json({ success: false, message: 'Email required' });

    const normalizedEmail = email.toLowerCase().trim();

    let passwordHash = undefined;
    if (password !== undefined && password !== '') {
      if (password.length < 4) {
        return res.status(400).json({ success: false, message: 'Password must be at least 4 characters long' });
      }
      passwordHash = await bcrypt.hash(password, 10);
    }

    if (db.isConnected() && Registration && Registration.findOneAndUpdate) {
      const updateData = { updatedAt: new Date() };
      if (name !== undefined) updateData.name = name;
      if (phone !== undefined) updateData.phone = phone;
      if (addresses !== undefined) updateData.addresses = addresses;
      if (passwordHash) updateData.password = passwordHash;

      const updated = await Registration.findOneAndUpdate(
        { email: normalizedEmail },
        { $set: updateData },
        { new: true }
      ).lean();

      if (!updated) return res.status(404).json({ success: false, message: 'User not found' });
      return res.json({
        success: true,
        message: 'Profile updated successfully',
        user: {
          id: updated._id.toString(),
          name: updated.name || '',
          email: updated.email,
          phone: updated.phone || '',
          addresses: updated.addresses || []
        }
      });
    }

    // JSON file fallback
    const regFile = path.join(dataDir, 'registrations.json');
    const users = await readJsonFile(regFile);
    const idx = users.findIndex(u => u.email && u.email.toLowerCase() === normalizedEmail);
    if (idx === -1) return res.status(404).json({ success: false, message: 'User not found' });

    if (name !== undefined) users[idx].name = name;
    if (phone !== undefined) users[idx].phone = phone;
    if (addresses !== undefined) users[idx].addresses = addresses;
    if (passwordHash) users[idx].password = passwordHash;
    users[idx].updatedAt = new Date().toISOString();

    await writeJsonFile(regFile, users);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: users[idx].id || users[idx]._id,
        name: users[idx].name || '',
        email: users[idx].email,
        phone: users[idx].phone || '',
        addresses: users[idx].addresses || []
      }
    });
  } catch (err) {
    console.error('Error updating profile', err);
    res.status(500).json({ success: false, message: 'Server error updating profile' });
  }
});

// ---------------- USER ORDERS (GET) ----------------
app.get('/api/user/orders', async (req, res) => {
  try {
    const email = req.query.email ? req.query.email.toLowerCase().trim() : null;

    if (db.isConnected() && Order && Order.find) {
      const query = email ? { 'customer.email': email } : {};
      const orders = await Order.find(query).sort({ createdAt: -1 }).lean();
      return res.json({ success: true, orders });
    }

    const orders = await readJsonFile(path.join(dataDir, 'orders.json'));
    let filtered = orders;
    if (email) {
      filtered = orders.filter(o => o.customer && o.customer.email && o.customer.email.toLowerCase() === email);
    }
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ success: true, orders: filtered });
  } catch (err) {
    console.error('Error fetching orders', err);
    res.status(500).json({ success: false, message: 'Server error fetching orders' });
  }
});

// ---------------- CONTACT FORM ----------------
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body || {};
    if (!email || !message) return res.status(400).json({ success: false, message: 'Email and message required' });

    if (db.isConnected() && Contact && Contact.create) {
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

// ---------------- CHECKOUT & ORDER PLACEMENT ----------------
const handleCheckout = async (req, res) => {
  try {
    const {
      items,
      subtotal,
      discount,
      shipping,
      total,
      customer,
      shippingAddress,
      deliveryDate,
      deliveryTimeSlot,
      giftMessage,
      paymentMethod
    } = req.body || {};

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart items are required' });
    }

    const orderNumber = 'HP-' + Math.floor(100000 + Math.random() * 900000);
    const orderData = {
      orderNumber,
      items,
      subtotal: Number(subtotal) || 0,
      discount: Number(discount) || 0,
      shipping: Number(shipping) || 0,
      total: Number(total) || 0,
      customer: customer || {},
      shippingAddress: shippingAddress || {},
      deliveryDate: deliveryDate || new Date().toISOString().split('T')[0],
      deliveryTimeSlot: deliveryTimeSlot || 'Standard Delivery (9 AM - 6 PM)',
      giftMessage: giftMessage || '',
      paymentMethod: paymentMethod || 'cod',
      status: 'Confirmed',
      createdAt: new Date().toISOString()
    };

    if (db.isConnected() && Order && Order.create) {
      const doc = await Order.create(orderData);
      return res.json({
        success: true,
        orderId: doc._id.toString(),
        orderNumber,
        order: doc
      });
    }

    const ordersFile = path.join(dataDir, 'orders.json');
    const orders = await readJsonFile(ordersFile);
    orderData._id = 'ord_' + Date.now();
    orders.push(orderData);
    await writeJsonFile(ordersFile, orders);

    res.json({
      success: true,
      orderId: orderData._id,
      orderNumber,
      order: orderData
    });
  } catch (err) {
    console.error('Error in /api/checkout', err);
    res.status(500).json({ success: false, message: 'Server error placing order' });
  }
};

app.post('/api/checkout', handleCheckout);
app.post('/api/order', handleCheckout);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
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
