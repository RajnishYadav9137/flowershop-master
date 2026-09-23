/**
 * Happy Petals Flower Shop - Core E-Commerce & User Account System
 * Handles persistent Cart, Sliding Drawer, Auth Session, Wishlist,
 * Quick View, Live Search, Product Details page, Catalog Filters & Sorting.
 */

(function(window) {
  'use strict';

  // Comprehensive Product Catalog Fallback
  const DEFAULT_PRODUCTS = [
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

  const FlowerShop = {
    products: DEFAULT_PRODUCTS,

    // ==========================================
    // INITIALIZATION
    // ==========================================
    init: function() {
      this.initStickyHeader();
      this.initCartUI();
      this.updateCartBadge();
      this.updateWishlistBadge();
      this.updateNavAuth();
      this.initSearch();
      this.initQuickViewModal();
      this.bindProductButtons();
      this.syncWishlistIcons();
      this.loadCatalogFromApi().then(() => {
        // Page-specific initializations
        const path = window.location.pathname;
        if (path.includes('product.html')) {
          this.initProductDetailPage();
        } else if (path.includes('special.html')) {
          this.initCatalogPage();
        } else if (path.includes('account.html')) {
          this.initAccountWishlist();
        }
      });
    },

    loadCatalogFromApi: async function() {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          if (data && data.products && data.products.length > 0) {
            this.products = data.products;
          }
        }
      } catch (e) {
        // Fallback to DEFAULT_PRODUCTS
      }
    },

    // ==========================================
    // STICKY HEADER
    // ==========================================
    initStickyHeader: function() {
      const headerWrap = document.querySelector('.site-header-wrapper') || document.querySelector('#mainNav');
      if (!headerWrap) return;

      const handleScroll = () => {
        if (window.scrollY > 40) {
          headerWrap.classList.add('is-sticky');
        } else {
          headerWrap.classList.remove('is-sticky');
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
    },

    // ==========================================
    // CART METHODS & STOCK CONTROLS
    // ==========================================
    getCart: function() {
      try {
        const raw = localStorage.getItem('hp_cart');
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        return [];
      }
    },

    saveCart: function(cart) {
      try {
        localStorage.setItem('hp_cart', JSON.stringify(cart));
      } catch (e) {
        console.error('Error saving cart', e);
      }
      this.updateCartBadge();
      this.renderCartDrawer();
      window.dispatchEvent(new CustomEvent('hp_cart_updated', { detail: { cart } }));
    },

    addToCart: function(item, qty = 1, openDrawer = true) {
      if (!item) return;
      const cart = this.getCart();
      const existing = cart.find(c => c.id === item.id || c.name === item.name);

      const product = this.findProduct(item.id) || item;
      const maxStock = (product && typeof product.stock === 'number') ? product.stock : 25;
      const currentQty = existing ? Number(existing.qty) : 0;
      const newQty = currentQty + Number(qty);

      if (newQty > maxStock) {
        this.showToast(`Sorry! Only ${maxStock} bouquets available in stock.`, 'info');
        return;
      }

      if (existing) {
        existing.qty = newQty;
      } else {
        cart.push({
          id: item.id || 'item_' + Date.now(),
          name: item.name,
          price: Number(item.price) || 0,
          image: item.image || (product ? product.image : 'images/featured1.png'),
          qty: Number(qty) || 1,
          stock: maxStock
        });
      }

      this.saveCart(cart);
      this.showToast(`Added "${item.name}" to cart! 🌸`, 'success');
      if (openDrawer) {
        this.openCartDrawer();
      }
    },

    buyNow: function(item, qty = 1) {
      this.addToCart(item, qty, false);
      window.location.href = 'checkout.html';
    },

    updateCartQty: function(id, qty) {
      let cart = this.getCart();
      qty = Number(qty);
      const product = this.findProduct(id);
      const maxStock = (product && typeof product.stock === 'number') ? product.stock : 25;

      if (qty <= 0) {
        cart = cart.filter(c => c.id !== id);
      } else {
        if (qty > maxStock) {
          this.showToast(`Maximum ${maxStock} in stock for this bouquet.`, 'info');
          qty = maxStock;
        }
        const found = cart.find(c => c.id === id);
        if (found) found.qty = qty;
      }
      this.saveCart(cart);
    },

    removeFromCart: function(id) {
      let cart = this.getCart();
      const item = cart.find(c => c.id === id);
      cart = cart.filter(c => c.id !== id);
      this.saveCart(cart);
      if (item) {
        this.showToast(`Removed "${item.name}" from cart.`, 'info');
      }
    },

    clearCart: function() {
      localStorage.removeItem('hp_cart');
      this.updateCartBadge();
      this.renderCartDrawer();
      window.dispatchEvent(new CustomEvent('hp_cart_updated', { detail: { cart: [] } }));
    },

    getCartCount: function() {
      const cart = this.getCart();
      return cart.reduce((sum, it) => sum + (Number(it.qty) || 0), 0);
    },

    getCartTotal: function() {
      const cart = this.getCart();
      return cart.reduce((sum, it) => sum + ((Number(it.price) || 0) * (Number(it.qty) || 0)), 0);
    },

    updateCartBadge: function() {
      const count = this.getCartCount();
      const badges = document.querySelectorAll('.cart-badge, .nav-badge-count.cart-count');
      badges.forEach(badge => {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'inline-block' : 'none';
      });

      if (window.$ && $.fn && $.fn.popover) {
        $('[data-toggle="popover"]').attr('data-content', count > 0 ? `${count} item(s) in cart (Rs ${this.getCartTotal().toLocaleString()})` : 'Cart is empty');
      }
    },

    // ==========================================
    // CART DRAWER UI
    // ==========================================
    initCartUI: function() {
      if (!document.getElementById('hpCartDrawer')) {
        const drawerHtml = `
          <div id="hpCartBackdrop" class="cart-drawer-backdrop"></div>
          <div id="hpCartDrawer" class="cart-drawer">
            <div class="cart-drawer-header">
              <h3 style="margin:0;font-size:20px;font-family:'Arvo',serif;"><i class="fa fa-shopping-bag" style="color:#F08080"></i> Your Shopping Bag</h3>
              <button id="hpCartClose" class="cart-drawer-close">&times;</button>
            </div>
            <div id="hpCartBody" class="cart-drawer-body"></div>
            <div id="hpCartFooter" class="cart-drawer-footer">
              <div class="free-shipping-bar">
                <div id="freeShipText">Add more for FREE Delivery!</div>
                <div class="progress-tiny">
                  <div id="freeShipProgress" class="progress-bar-petal" style="width: 0%;"></div>
                </div>
              </div>
              <div class="cart-drawer-subtotal">
                <span>Subtotal:</span>
                <span id="hpCartSubtotal">Rs 0</span>
              </div>
              <div style="font-size:12px;color:#777;margin-bottom:12px;">Standard tax & delivery calculated at checkout.</div>
              <a href="checkout.html" class="btn-drawer-checkout"><i class="fa fa-lock"></i> Proceed to Checkout</a>
              <button id="hpContinueShop" class="btn-drawer-continue">Continue Shopping</button>
            </div>
          </div>
          <div id="hpToastContainer" class="toast-container"></div>
        `;
        document.body.insertAdjacentHTML('beforeend', drawerHtml);

        document.getElementById('hpCartClose').addEventListener('click', () => this.closeCartDrawer());
        document.getElementById('hpCartBackdrop').addEventListener('click', () => this.closeCartDrawer());
        document.getElementById('hpContinueShop').addEventListener('click', () => this.closeCartDrawer());
      }

      document.addEventListener('click', (e) => {
        const target = e.target.closest('.cart-trigger-btn') || e.target.closest('[data-open-cart]');
        if (target) {
          e.preventDefault();
          this.openCartDrawer();
        }
      });
    },

    openCartDrawer: function() {
      this.renderCartDrawer();
      const drawer = document.getElementById('hpCartDrawer');
      const backdrop = document.getElementById('hpCartBackdrop');
      if (drawer) drawer.classList.add('active');
      if (backdrop) backdrop.classList.add('active');
    },

    closeCartDrawer: function() {
      const drawer = document.getElementById('hpCartDrawer');
      const backdrop = document.getElementById('hpCartBackdrop');
      if (drawer) drawer.classList.remove('active');
      if (backdrop) backdrop.classList.remove('active');
    },

    renderCartDrawer: function() {
      const body = document.getElementById('hpCartBody');
      const subtotalEl = document.getElementById('hpCartSubtotal');
      const footer = document.getElementById('hpCartFooter');
      if (!body) return;

      const cart = this.getCart();
      const total = this.getCartTotal();

      if (cart.length === 0) {
        body.innerHTML = `
          <div class="cart-drawer-empty">
            <i class="fa fa-shopping-basket"></i>
            <p><strong>Your shopping bag is empty!</strong></p>
            <p class="text-muted" style="font-size:13px">Explore our handcrafted flower bouquets and find the perfect bloom today.</p>
            <a href="special.html" class="btn btn-sm btn-primary" style="background:#F08080;border:none;margin-top:10px;">Explore Flower Catalog</a>
          </div>
        `;
        if (footer) footer.style.display = 'none';
        return;
      }

      if (footer) footer.style.display = 'block';
      if (subtotalEl) subtotalEl.textContent = 'Rs ' + total.toLocaleString();

      // Free shipping threshold Rs 1,500
      const threshold = 1500;
      const progressEl = document.getElementById('freeShipProgress');
      const textEl = document.getElementById('freeShipText');
      if (progressEl && textEl) {
        if (total >= threshold) {
          progressEl.style.width = '100%';
          textEl.innerHTML = '<span style="color:#2a9d8f">🎉 You unlocked <strong>FREE Delivery!</strong></span>';
        } else {
          const diff = threshold - total;
          const pct = Math.min(100, Math.round((total / threshold) * 100));
          progressEl.style.width = pct + '%';
          textEl.textContent = `Add Rs ${diff.toLocaleString()} more to unlock FREE Delivery!`;
        }
      }

      let html = '';
      cart.forEach(item => {
        html += `
          <div class="cart-drawer-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}" onerror="this.src='images/featured1.png'" />
            <div class="cart-item-details">
              <h4 class="cart-item-name"><a href="product.html?id=${item.id}" style="color:inherit;text-decoration:none;">${item.name}</a></h4>
              <div class="cart-item-price">Rs ${(item.price).toLocaleString()}</div>
              <div class="cart-qty-control">
                <button class="cart-qty-btn" onclick="FlowerShop.updateCartQty('${item.id}', ${item.qty - 1})">-</button>
                <span class="cart-qty-num">${item.qty}</span>
                <button class="cart-qty-btn" onclick="FlowerShop.updateCartQty('${item.id}', ${item.qty + 1})">+</button>
              </div>
            </div>
            <button class="cart-item-remove" onclick="FlowerShop.removeFromCart('${item.id}')" title="Remove item">&times;</button>
          </div>
        `;
      });

      body.innerHTML = html;
    },

    // ==========================================
    // TOAST ALERTS
    // ==========================================
    showToast: function(msg, type = 'success') {
      const container = document.getElementById('hpToastContainer') || document.body;
      const toast = document.createElement('div');
      toast.className = `toast-msg ${type}`;
      const icon = type === 'success' ? 'fa-check-circle text-success' : 'fa-info-circle text-info';
      toast.innerHTML = `<i class="fa ${icon}"></i> <span>${msg}</span>`;
      container.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
      }, 3200);
    },

    // ==========================================
    // AUTHENTICATION & USER SESSION
    // ==========================================
    getUser: function() {
      try {
        const raw = localStorage.getItem('hp_user');
        return raw ? JSON.parse(raw) : null;
      } catch (e) {
        return null;
      }
    },

    setUser: function(user) {
      if (!user) {
        localStorage.removeItem('hp_user');
      } else {
        localStorage.setItem('hp_user', JSON.stringify(user));
      }
      this.updateNavAuth();
      window.dispatchEvent(new CustomEvent('hp_auth_changed', { detail: { user } }));
    },

    logout: function() {
      localStorage.removeItem('hp_user');
      this.showToast('You have been logged out safely.', 'info');
      this.updateNavAuth();
      setTimeout(() => {
        if (window.location.pathname.includes('account.html')) {
          window.location.href = 'login.html';
        } else {
          window.location.reload();
        }
      }, 600);
    },

    updateNavAuth: function() {
      const user = this.getUser();
      const userNavEl = document.getElementById('navUserAuth');
      if (!userNavEl) return;

      if (user) {
        const displayName = user.name ? user.name.split(' ')[0] : 'Member';
        userNavEl.innerHTML = `
          <div class="dropdown" style="display:inline-block;">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown" style="display:flex;align-items:center;gap:6px;color:#333;text-decoration:none;">
              <i class="fa fa-user-circle" style="color:#F08080;font-size:18px;"></i>
              <span style="font-weight:600;font-size:13px;">Hi, ${displayName}</span>
              <span class="caret"></span>
            </a>
            <ul class="dropdown-menu dropdown-menu-right" style="border-radius:8px;padding:8px 0;box-shadow:0 8px 25px rgba(0,0,0,0.1);">
              <li><a href="account.html"><i class="fa fa-dashboard text-muted"></i> Account Dashboard</a></li>
              <li><a href="account.html?tab=orders"><i class="fa fa-shopping-bag text-muted"></i> My Orders</a></li>
              <li><a href="account.html?tab=wishlist"><i class="fa fa-heart text-danger"></i> My Wishlist</a></li>
              <li role="separator" class="divider"></li>
              <li><a href="javascript:void(0)" onclick="FlowerShop.logout()"><i class="fa fa-sign-out text-muted"></i> Log Out</a></li>
            </ul>
          </div>
        `;
      } else {
        userNavEl.innerHTML = `
          <a href="login.html" class="nav-action-btn" title="Sign In">
            <i class="fa fa-user"></i>
            <span style="font-size:13px;font-family:'Arvo',serif;">Sign In</span>
          </a>
        `;
      }
    },

    // ==========================================
    // SEARCH AUTOCOMPLETE & LIVE SUGGESTIONS
    // ==========================================
    initSearch: function() {
      const searchInputs = document.querySelectorAll('.header-search-input, #exampleInputsearch');
      const dropdowns = document.querySelectorAll('.search-dropdown, #searchDropdown');

      searchInputs.forEach(input => {
        const parent = input.closest('.search-container') || input.parentElement;
        let dropdown = parent.querySelector('.search-dropdown');
        if (!dropdown) {
          dropdown = document.createElement('div');
          dropdown.className = 'search-dropdown';
          parent.appendChild(dropdown);
        }

        input.addEventListener('input', () => {
          const q = input.value.trim().toLowerCase();
          if (q.length < 2) {
            dropdown.classList.remove('active');
            dropdown.innerHTML = '';
            return;
          }

          const matches = this.products.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            (p.occasion && p.occasion.toLowerCase().includes(q)) ||
            (p.flowerType && p.flowerType.toLowerCase().includes(q))
          );

          if (matches.length === 0) {
            dropdown.innerHTML = '<div style="padding:14px;color:#888;font-size:13px;text-align:center;">No matching bouquets found</div>';
          } else {
            dropdown.innerHTML = matches.slice(0, 5).map(p => `
              <div class="search-item" onclick="window.location.href='product.html?id=${p.id}'">
                <img src="${p.image}" alt="${p.name}" onerror="this.src='images/featured1.png'" />
                <div class="search-item-info">
                  <h5 class="search-item-title">${p.name}</h5>
                  <p class="search-item-price">Rs ${p.price.toLocaleString()}</p>
                </div>
                <button class="btn btn-xs btn-default" onclick="event.stopPropagation(); FlowerShop.addToCart(FlowerShop.findProduct('${p.id}'));" title="Quick Add to Cart">
                  <i class="fa fa-cart-plus"></i>
                </button>
              </div>
            `).join('');
          }
          dropdown.classList.add('active');
        });
      });

      document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container') && !e.target.closest('.header-search-bar')) {
          document.querySelectorAll('.search-dropdown').forEach(d => d.classList.remove('active'));
        }
      });
    },

    performSearch: function(inputEl) {
      const searchInput = inputEl || document.querySelector('.header-search-input') || document.getElementById('exampleInputsearch');
      if (!searchInput) return;
      const q = searchInput.value.trim();
      if (q) {
        window.location.href = `special.html?search=${encodeURIComponent(q)}`;
      }
    },

    findProduct: function(id) {
      return this.products.find(p => p.id === id) || null;
    },

    // ==========================================
    // WISHLIST MANAGEMENT
    // ==========================================
    getWishlist: function() {
      try {
        const raw = localStorage.getItem('hp_wishlist');
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        return [];
      }
    },

    isWishlisted: function(id) {
      const list = this.getWishlist();
      return list.includes(id);
    },

    toggleWishlist: function(id) {
      let list = this.getWishlist();
      const product = this.findProduct(id);
      const name = product ? product.name : 'Bouquet';

      if (list.includes(id)) {
        list = list.filter(i => i !== id);
        this.showToast(`Removed "${name}" from Wishlist.`, 'info');
      } else {
        list.push(id);
        this.showToast(`Saved "${name}" to your Wishlist! ❤️`, 'success');
      }

      localStorage.setItem('hp_wishlist', JSON.stringify(list));
      this.syncWishlistIcons();
      this.updateWishlistBadge();
      window.dispatchEvent(new CustomEvent('hp_wishlist_updated', { detail: { list } }));
    },

    updateWishlistBadge: function() {
      const count = this.getWishlist().length;
      document.querySelectorAll('.wishlist-badge, #wishlistCountBadge, .nav-badge-count.wishlist-count').forEach(badge => {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'inline-block' : 'none';
      });
    },

    syncWishlistIcons: function() {
      const list = this.getWishlist();
      document.querySelectorAll('.product-wishlist-btn, .btn-detail-wishlist').forEach(btn => {
        const id = btn.getAttribute('data-id');
        if (id && list.includes(id)) {
          btn.classList.add('active');
          btn.innerHTML = '<i class="fa fa-heart" style="color:#e63946;"></i>';
        } else {
          btn.classList.remove('active');
          btn.innerHTML = '<i class="fa fa-heart-o"></i>';
        }
      });
    },

    moveToCart: function(id) {
      const product = this.findProduct(id);
      if (product) {
        this.addToCart(product, 1);
        this.toggleWishlist(id);
        this.showToast(`Moved "${product.name}" to cart! 🌸`, 'success');
      }
    },

    // isInWishlist alias for backward compat
    isInWishlist: function(id) { return this.isWishlisted(id); },

    // ==========================================
    // CATALOG FILTER & SORTING (special.html)
    // ==========================================
    initCatalogPage: function() {
      const urlParams = new URLSearchParams(window.location.search);
      const catParam = urlParams.get('cat');
      // Normalize occasion param — URL uses lowercase (e.g., 'anniversary'), products use title case
      const occParam = urlParams.get('occ');
      const searchParam = urlParams.get('search');

      this.catalogFilters = {
        category: catParam || 'all',
        occasion: occParam || 'all',  // stored lowercase; compared lowercase in applyCatalogFilters
        flowerType: 'all',
        color: 'all',
        minPrice: 0,
        maxPrice: 5000,
        minRating: 0,
        inStockOnly: false,
        minDiscount: 0,
        search: searchParam || '',
        sort: 'featured'
      };

      // Update page title to reflect active filter
      const titleEl = document.getElementById('catalogPageTitle');
      if (titleEl) {
        if (catParam) {
          const catLabels = { roses: 'Roses & Romance', bouquets: 'Flower Bouquets', lilies: 'Lilies & Luxury', plants: 'Indoor Plants', gifts: 'Gift Hampers', specials: 'Today\'s Specials' };
          titleEl.textContent = catLabels[catParam] || 'Flower Catalog';
        } else if (occParam) {
          titleEl.textContent = occParam.charAt(0).toUpperCase() + occParam.slice(1) + ' Flowers';
        } else if (searchParam) {
          titleEl.textContent = `Search Results: "${searchParam}"`;
        }
      }

      // Sync active state of category pills if URL param present
      if (catParam) {
        document.querySelectorAll('#categoryPills .filter-pill').forEach(b => {
          b.classList.toggle('active', b.getAttribute('data-filter') === catParam);
        });
      }

      // Sync active state of occasion chips if URL param present
      if (occParam) {
        document.querySelectorAll('[data-filter-occ]').forEach(b => {
          b.classList.toggle('active', b.getAttribute('data-filter-occ').toLowerCase() === occParam.toLowerCase());
        });
        const allOccPill = document.querySelector('[data-filter-occ="all"]');
        if (allOccPill) allOccPill.classList.remove('active');
      }

      this.bindCatalogFilterControls();
      this.applyCatalogFilters();
    },

    bindCatalogFilterControls: function() {
      // Category pills
      document.querySelectorAll('#categoryPills .filter-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('#categoryPills .filter-pill').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.catalogFilters.category = btn.getAttribute('data-filter') || 'all';
          this.applyCatalogFilters();
        });
      });

      // Flower type chips
      document.querySelectorAll('[data-filter-type]').forEach(btn => {
        btn.addEventListener('click', () => {
          const type = btn.getAttribute('data-filter-type');
          document.querySelectorAll('[data-filter-type]').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.catalogFilters.flowerType = type;
          this.applyCatalogFilters();
        });
      });

      // Occasion chips
      document.querySelectorAll('[data-filter-occ]').forEach(btn => {
        btn.addEventListener('click', () => {
          const occ = btn.getAttribute('data-filter-occ');
          document.querySelectorAll('[data-filter-occ]').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.catalogFilters.occasion = occ;
          this.applyCatalogFilters();
        });
      });

      // Color swatches
      document.querySelectorAll('.color-swatch-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const col = btn.getAttribute('data-color');
          document.querySelectorAll('.color-swatch-btn').forEach(b => b.classList.remove('active'));
          if (this.catalogFilters.color === col) {
            this.catalogFilters.color = 'all';
          } else {
            btn.classList.add('active');
            this.catalogFilters.color = col;
          }
          this.applyCatalogFilters();
        });
      });

      // Price slider / inputs
      const minPriceInput = document.getElementById('filterMinPrice');
      const maxPriceInput = document.getElementById('filterMaxPrice');
      if (minPriceInput) {
        minPriceInput.addEventListener('change', () => {
          this.catalogFilters.minPrice = Number(minPriceInput.value) || 0;
          this.applyCatalogFilters();
        });
      }
      if (maxPriceInput) {
        maxPriceInput.addEventListener('change', () => {
          this.catalogFilters.maxPrice = Number(maxPriceInput.value) || 5000;
          this.applyCatalogFilters();
        });
      }

      // In-stock checkbox
      const stockCheck = document.getElementById('filterInStock');
      if (stockCheck) {
        stockCheck.addEventListener('change', () => {
          this.catalogFilters.inStockOnly = stockCheck.checked;
          this.applyCatalogFilters();
        });
      }

      // Rating filter
      const ratingSelect = document.getElementById('filterRatingSelect');
      if (ratingSelect) {
        ratingSelect.addEventListener('change', () => {
          this.catalogFilters.minRating = Number(ratingSelect.value) || 0;
          this.applyCatalogFilters();
        });
      }

      // Sort dropdown
      const sortSelect = document.getElementById('catalogSortSelect');
      if (sortSelect) {
        sortSelect.addEventListener('change', () => {
          this.catalogFilters.sort = sortSelect.value;
          this.applyCatalogFilters();
        });
      }
    },

    applyCatalogFilters: function() {
      const f = this.catalogFilters;
      let list = [...this.products];

      // Category
      if (f.category && f.category !== 'all') {
        const cat = f.category.toLowerCase();
        if (cat === 'specials') {
          list = list.filter(p => p.isSpecial || p.category === 'specials');
        } else {
          list = list.filter(p => p.category.toLowerCase() === cat);
        }
      }

      // Occasion (case-insensitive — URL params may be lowercase)
      if (f.occasion && f.occasion !== 'all') {
        const occ = f.occasion.toLowerCase();
        list = list.filter(p => p.occasion && p.occasion.toLowerCase() === occ);
      }

      // Flower Type
      if (f.flowerType && f.flowerType !== 'all') {
        list = list.filter(p => p.flowerType && p.flowerType.toLowerCase() === f.flowerType.toLowerCase());
      }

      // Color
      if (f.color && f.color !== 'all') {
        list = list.filter(p => p.color && p.color.toLowerCase() === f.color.toLowerCase());
      }

      // Price range
      list = list.filter(p => p.price >= f.minPrice && p.price <= f.maxPrice);

      // Min rating
      if (f.minRating > 0) {
        list = list.filter(p => (p.rating || 0) >= f.minRating);
      }

      // In Stock
      if (f.inStockOnly) {
        list = list.filter(p => p.inStock && p.stock > 0);
      }

      // Search keyword
      if (f.search) {
        const q = f.search.toLowerCase();
        list = list.filter(p =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.occasion && p.occasion.toLowerCase().includes(q))
        );
      }

      // Sorting
      switch (f.sort) {
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

      this.renderCatalogGrid(list);
    },

    renderCatalogGrid: function(items) {
      const grid = document.getElementById('catalogProductsGrid');
      const countEl = document.getElementById('catalogResultsCount');
      if (!grid) return;

      if (countEl) countEl.textContent = `${items.length} bouquet(s) found`;

      if (items.length === 0) {
        grid.innerHTML = `
          <div class="col-xs-12" style="text-align:center;padding:50px 20px;">
            <i class="fa fa-search" style="font-size:42px;color:#ddd;margin-bottom:12px;"></i>
            <h3>No Bouquets Matched Your Filters</h3>
            <p class="text-muted">Try clearing some filter criteria or searching for different seasonal blooms.</p>
            <button class="btn btn-primary" onclick="FlowerShop.resetCatalogFilters()" style="background:#F08080;border:none;margin-top:10px;">
              Reset All Filters
            </button>
          </div>
        `;
        return;
      }

      grid.innerHTML = items.map(p => `
        <div class="col-md-6 col-sm-6 catalog-item">
          <div class="featured-detail" data-id="${p.id}" style="margin-bottom:25px;">
            <span class="product-badge">${p.badge || p.category}</span>
            <button class="product-wishlist-btn" data-id="${p.id}" title="Save to Wishlist"><i class="fa fa-heart-o"></i></button>
            <a href="product.html?id=${p.id}">
              <img src="${p.image}" alt="${p.name}" class="img-responsive" onerror="this.src='images/featured1.png'" />
            </a>
            <h3 style="margin-top:10px;"><a href="product.html?id=${p.id}">${p.name}</a></h3>
            <div class="product-rating">
              <i class="fa fa-star text-warning"></i> <span>${p.rating || 4.8} (${p.reviewsCount || 30} reviews)</span>
            </div>
            <p style="font-size:14px;color:#666;height:40px;overflow:hidden;">${p.description}</p>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
              <span class="price-tag" style="font-size:22px;color:#F08080;font-weight:bold;">Rs ${p.price.toLocaleString()}</span>
              ${p.oldPrice ? `<span style="text-decoration:line-through;color:#999;font-size:15px;">Rs ${p.oldPrice.toLocaleString()}</span>` : ''}
              ${p.discountPercent ? `<span class="product-discount-pill">${p.discountPercent}% OFF</span>` : ''}
            </div>
            <div class="product-actions-bar">
              <button class="btn btn-add-cart" onclick="FlowerShop.addToCart(FlowerShop.findProduct('${p.id}'))"><i class="fa fa-cart-plus"></i> Add to Cart</button>
              <button class="btn btn-quick-view" onclick="FlowerShop.openQuickView('${p.id}')"><i class="fa fa-eye"></i> Quick View</button>
            </div>
          </div>
        </div>
      `).join('');

      this.syncWishlistIcons();
    },

    resetCatalogFilters: function() {
      this.catalogFilters = {
        category: 'all',
        occasion: 'all',
        flowerType: 'all',
        color: 'all',
        minPrice: 0,
        maxPrice: 5000,
        minRating: 0,
        inStockOnly: false,
        minDiscount: 0,
        search: '',
        sort: 'featured'
      };

      document.querySelectorAll('.filter-pill, .filter-chip-btn, .color-swatch-btn').forEach(b => b.classList.remove('active'));
      const allPill = document.querySelector('#categoryPills .filter-pill[data-filter="all"]');
      if (allPill) allPill.classList.add('active');
      const allTypePill = document.querySelector('[data-filter-type="all"]');
      if (allTypePill) allTypePill.classList.add('active');
      const allOccPill = document.querySelector('[data-filter-occ="all"]');
      if (allOccPill) allOccPill.classList.add('active');

      const minPriceInput = document.getElementById('filterMinPrice');
      if (minPriceInput) minPriceInput.value = 0;
      const maxPriceInput = document.getElementById('filterMaxPrice');
      if (maxPriceInput) maxPriceInput.value = 5000;

      const stockCheck = document.getElementById('filterInStock');
      if (stockCheck) stockCheck.checked = false;

      const ratingSelect = document.getElementById('filterRatingSelect');
      if (ratingSelect) ratingSelect.value = '0';

      const sortSelect = document.getElementById('catalogSortSelect');
      if (sortSelect) sortSelect.value = 'featured';

      this.applyCatalogFilters();
    },

    // ==========================================
    // WISHLIST VIEW IN ACCOUNT
    // ==========================================
    initAccountWishlist: function() {
      const container = document.getElementById('accountWishlistGrid');
      if (!container) return;

      const ids = this.getWishlist();
      if (ids.length === 0) {
        container.innerHTML = `
          <div style="text-align:center;padding:40px 20px;">
            <i class="fa fa-heart-o" style="font-size:48px;color:#ccc;margin-bottom:12px;"></i>
            <h3>Your Wishlist is Empty</h3>
            <p class="text-muted">Save your favorite seasonal flowers and bouquets here for easy gifting later.</p>
            <a href="special.html" class="btn btn-primary" style="background:#F08080;border:none;margin-top:10px;">Browse Flowers</a>
          </div>
        `;
        return;
      }

      const items = ids.map(id => this.findProduct(id)).filter(Boolean);
      container.innerHTML = items.map(p => `
        <div class="col-md-4 col-sm-6" id="wishRow_${p.id}">
          <div class="featured-detail" style="margin-bottom:20px;">
            <img src="${p.image}" alt="${p.name}" class="img-responsive" onerror="this.src='images/featured1.png'" />
            <h3 style="margin-top:10px;"><a href="product.html?id=${p.id}">${p.name}</a></h3>
            <div class="price-tag" style="font-size:18px;color:#F08080;font-weight:bold;margin:8px 0;">Rs ${p.price.toLocaleString()}</div>
            <div style="display:flex;gap:8px;">
              <button class="btn btn-sm btn-primary" style="background:#F08080;border:none;flex:1;" onclick="FlowerShop.moveToCart('${p.id}'); document.getElementById('wishRow_${p.id}')?.remove();">
                <i class="fa fa-cart-plus"></i> Move to Cart
              </button>
              <button class="btn btn-sm btn-default" onclick="FlowerShop.toggleWishlist('${p.id}'); document.getElementById('wishRow_${p.id}')?.remove();" title="Remove from wishlist">
                <i class="fa fa-trash text-danger"></i>
              </button>
            </div>
          </div>
        </div>
      `).join('');
    },

    // ==========================================
    // QUICK VIEW MODAL
    // ==========================================
    initQuickViewModal: function() {
      if (!document.getElementById('hpQuickViewModal')) {
        const modalHtml = `
          <div id="hpQuickViewModal" class="custom-modal-backdrop">
            <div class="custom-modal-content">
              <button class="custom-modal-close" onclick="FlowerShop.closeQuickView()">&times;</button>
              <div class="row">
                <div class="col-md-6">
                  <img id="qvImage" src="" alt="Flower" class="img-responsive" style="border-radius:8px;max-height:350px;width:100%;object-fit:cover;" />
                </div>
                <div class="col-md-6">
                  <span id="qvBadge" class="badge" style="background:#F08080;margin-bottom:8px;">Special</span>
                  <h3 id="qvTitle" style="margin-top:5px;font-family:'Arvo',serif;">Flower Title</h3>
                  <div class="product-rating" id="qvRating">
                    <i class="fa fa-star text-warning"></i> 5.0 (45 reviews)
                  </div>
                  <h4 id="qvPrice" style="color:#F08080;font-weight:bold;font-size:24px;">Rs 1,099</h4>
                  <p id="qvDesc" style="color:#666;font-size:14px;margin:15px 0;">Description goes here...</p>
                  <hr/>
                  <div class="form-group" style="display:flex;align-items:center;gap:12px;">
                    <label style="margin:0;">Quantity:</label>
                    <input type="number" id="qvQty" value="1" min="1" max="25" class="form-control" style="width:70px;" />
                  </div>
                  <div style="display:flex;gap:10px;margin-top:15px;">
                    <button id="qvAddToCartBtn" class="btn btn-primary btn-lg" style="background:#F08080;border:none;flex:1;">
                      <i class="fa fa-shopping-cart"></i> Add to Cart
                    </button>
                    <a id="qvFullDetailsBtn" href="product.html" class="btn btn-default btn-lg" title="View Full Details">
                      <i class="fa fa-external-link"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        document.getElementById('hpQuickViewModal').addEventListener('click', (e) => {
          if (e.target.id === 'hpQuickViewModal') this.closeQuickView();
        });
      }
    },

    openQuickView: function(id) {
      const product = this.findProduct(id);
      if (!product) return;

      const modal = document.getElementById('hpQuickViewModal');
      document.getElementById('qvTitle').textContent = product.name;
      document.getElementById('qvImage').src = product.image;
      document.getElementById('qvImage').onerror = function() { this.src = 'images/featured1.png'; };
      document.getElementById('qvPrice').textContent = `Rs ${product.price.toLocaleString()}`;
      document.getElementById('qvDesc').textContent = product.description;
      document.getElementById('qvBadge').textContent = product.badge || product.category;
      document.getElementById('qvRating').innerHTML = `
        <i class="fa fa-star text-warning"></i> ${product.rating || 4.8} (${product.reviewsCount || 25} reviews)
      `;
      document.getElementById('qvQty').value = 1;

      const addBtn = document.getElementById('qvAddToCartBtn');
      addBtn.onclick = () => {
        const qty = Number(document.getElementById('qvQty').value) || 1;
        this.addToCart(product, qty);
        this.closeQuickView();
      };

      const fullBtn = document.getElementById('qvFullDetailsBtn');
      if (fullBtn) fullBtn.href = `product.html?id=${product.id}`;

      modal.classList.add('active');
    },

    closeQuickView: function() {
      const modal = document.getElementById('hpQuickViewModal');
      if (modal) modal.classList.remove('active');
    },

    // ==========================================
    // PRODUCT BUTTONS BINDING
    // ==========================================
    bindProductButtons: function() {
      document.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-add-cart') || e.target.closest('.btn-local');
        if (btn) {
          e.preventDefault();
          const card = btn.closest('.products-detail') || btn.closest('.featured-detail');
          if (card) {
            const id = card.getAttribute('data-id');
            const product = id ? this.findProduct(id) : null;
            if (product) {
              this.addToCart(product, 1);
            }
          }
        }

        const qvBtn = e.target.closest('.btn-quick-view');
        if (qvBtn) {
          e.preventDefault();
          const card = qvBtn.closest('.products-detail') || qvBtn.closest('.featured-detail');
          if (card) {
            const id = card.getAttribute('data-id') || 'prod-1';
            this.openQuickView(id);
          }
        }

        const wishBtn = e.target.closest('.product-wishlist-btn');
        if (wishBtn) {
          e.preventDefault();
          const id = wishBtn.getAttribute('data-id');
          if (id) {
            this.toggleWishlist(id);
          }
        }
      });
    },

    // ==========================================
    // PRODUCT DETAIL PAGE (product.html)
    // ==========================================
    activeDetailProduct: null,

    initProductDetailPage: async function() {
      const params = new URLSearchParams(window.location.search);
      const prodId = params.get('id') || 'prod-1';

      let product = null;
      let related = [];

      try {
        const res = await fetch(`/api/products/${encodeURIComponent(prodId)}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.product) {
            product = data.product;
            related = data.related || [];
          }
        }
      } catch (e) {
        // Fallback below
      }

      if (!product) {
        product = this.findProduct(prodId) || this.products[0];
        related = this.products.filter(p => p.id !== product.id && (p.category === product.category || p.occasion === product.occasion)).slice(0, 4);
      }

      this.activeDetailProduct = product;
      this.renderProductDetailPage(product, related);
    },

    renderProductDetailPage: function(p, related) {
      if (!p) return;

      // Title & Breadcrumbs
      const titleEl = document.getElementById('detailTitle');
      if (titleEl) titleEl.textContent = p.name;
      const crumbEl = document.getElementById('detailBreadcrumbName');
      if (crumbEl) crumbEl.textContent = p.name;

      // Badge
      const badgeEl = document.getElementById('detailBadge');
      if (badgeEl) {
        badgeEl.textContent = p.badge || (p.category ? p.category.toUpperCase() : 'Featured Flower');
      }

      // Rating
      const ratingWrap = document.getElementById('detailRatingWrap');
      if (ratingWrap) {
        const starsCount = Math.round(p.rating || 5);
        let starsHtml = '';
        for (let i = 1; i <= 5; i++) {
          starsHtml += i <= starsCount ? '<i class="fa fa-star text-warning"></i> ' : '<i class="fa fa-star-o text-muted"></i> ';
        }
        ratingWrap.innerHTML = `
          ${starsHtml}
          <strong>${p.rating || 4.9}</strong>
          <a href="#reviewsTab" onclick="FlowerShop.switchTab('reviews')">(${p.reviewsCount || (p.reviews ? p.reviews.length : 12)} customer reviews)</a>
        `;
      }

      // Price & Discount
      const priceEl = document.getElementById('detailPrice');
      if (priceEl) priceEl.textContent = `Rs ${Number(p.price).toLocaleString()}`;

      const oldPriceEl = document.getElementById('detailOldPrice');
      if (oldPriceEl) {
        if (p.oldPrice && p.oldPrice > p.price) {
          oldPriceEl.textContent = `Rs ${Number(p.oldPrice).toLocaleString()}`;
          oldPriceEl.style.display = 'inline';
        } else {
          oldPriceEl.style.display = 'none';
        }
      }

      const discEl = document.getElementById('detailDiscountPill');
      if (discEl) {
        const disc = p.discountPercent || (p.oldPrice ? Math.round((p.oldPrice - p.price) / p.oldPrice * 100) : 0);
        if (disc > 0) {
          discEl.textContent = `${disc}% OFF`;
          discEl.style.display = 'inline-block';
        } else {
          discEl.style.display = 'none';
        }
      }

      // Stock
      const stockEl = document.getElementById('detailStock');
      if (stockEl) {
        const stockCount = typeof p.stock === 'number' ? p.stock : 15;
        if (stockCount <= 0) {
          stockEl.className = 'stock-status-indicator out-of-stock';
          stockEl.innerHTML = '<span class="stock-dot" style="background:#e74c3c;"></span><span>Out of Stock</span>';
        } else if (stockCount <= 5) {
          stockEl.className = 'stock-status-indicator low-stock';
          stockEl.innerHTML = `<span class="stock-dot" style="background:#f39c12;"></span><span>Low Stock (Only ${stockCount} left!)</span>`;
        } else {
          stockEl.className = 'stock-status-indicator in-stock';
          stockEl.innerHTML = `<span class="stock-dot" style="background:#27ae60;"></span><span>In Stock (${stockCount} available)</span>`;
        }
      }

      // Short Description
      const descEl = document.getElementById('detailDesc');
      if (descEl) descEl.textContent = p.description || 'Artisanal hand-tied floral arrangement created with freshly harvested stems.';

      // Multi-image Gallery
      const mainImg = document.getElementById('detailMainImage');
      const thumbBar = document.getElementById('detailThumbnailBar');
      const images = (Array.isArray(p.images) && p.images.length > 0) ? p.images : [p.image || 'images/featured1.png'];

      if (mainImg) {
        mainImg.src = images[0];
        mainImg.alt = p.name;
        mainImg.onerror = function() { this.src = 'images/featured1.png'; };
      }

      if (thumbBar) {
        thumbBar.innerHTML = images.map((imgSrc, idx) => `
          <div class="product-thumb-item ${idx === 0 ? 'active' : ''}" onclick="FlowerShop.switchGalleryImage('${imgSrc}', this)">
            <img src="${imgSrc}" alt="${p.name}" onerror="this.src='images/featured1.png'" />
          </div>
        `).join('');
      }

      // Care Guide List
      const careEl = document.getElementById('detailCareList');
      if (careEl) {
        const careTips = (Array.isArray(p.flowerCare) && p.flowerCare.length > 0) ? p.flowerCare : [
          'Trim stems at a 45-degree angle under running water upon arrival.',
          'Place flowers in a clean vase filled with cold water and flower nutrient food.',
          'Change water completely every 48 hours to preserve freshness.',
          'Keep arrangement away from direct sunlight, heating radiators, and ripening fruit.'
        ];
        careEl.innerHTML = careTips.map(tip => `<li><i class="fa fa-leaf text-success" style="margin-right:8px;"></i>${tip}</li>`).join('');
      }

      // Delivery & Return info
      const delEl = document.getElementById('detailDeliveryDesc');
      if (delEl && p.deliveryInfo) delEl.textContent = p.deliveryInfo;

      const retEl = document.getElementById('detailReturnDesc');
      if (retEl && p.returnPolicy) retEl.textContent = p.returnPolicy;

      // Reviews list
      this.renderProductReviews(p.reviews || []);

      // Quantity input limit
      const qtyInput = document.getElementById('detailQtyInput');
      if (qtyInput) {
        qtyInput.value = 1;
        qtyInput.max = p.stock || 25;
      }

      // Add to Cart Button
      const addBtn = document.getElementById('detailAddCartBtn');
      if (addBtn) {
        addBtn.onclick = () => {
          const qty = Number(document.getElementById('detailQtyInput')?.value) || 1;
          this.addToCart(p, qty);
        };
      }

      // Buy Now Button
      const buyBtn = document.getElementById('detailBuyNowBtn');
      if (buyBtn) {
        buyBtn.onclick = () => {
          const qty = Number(document.getElementById('detailQtyInput')?.value) || 1;
          this.buyNow(p, qty);
        };
      }

      // Wishlist Button
      const wishBtn = document.getElementById('detailWishlistBtn');
      if (wishBtn) {
        const isInWish = this.isInWishlist(p.id);
        wishBtn.innerHTML = isInWish ? '<i class="fa fa-heart text-danger"></i>' : '<i class="fa fa-heart-o"></i>';
        wishBtn.onclick = () => {
          this.toggleWishlist(p.id);
          const nowInWish = this.isInWishlist(p.id);
          wishBtn.innerHTML = nowInWish ? '<i class="fa fa-heart text-danger"></i>' : '<i class="fa fa-heart-o"></i>';
        };
      }

      // Related Products Grid
      const relatedGrid = document.getElementById('detailRelatedGrid');
      if (relatedGrid) {
        if (related.length === 0) {
          relatedGrid.innerHTML = '<div class="col-md-12 text-center text-muted" style="padding:20px;">No additional related flowers found.</div>';
        } else {
          relatedGrid.innerHTML = related.map(rel => `
            <div class="col-md-3 col-sm-6" style="margin-bottom:20px;">
              <div class="products-detail" data-id="${rel.id}" style="border:1px solid #eee;border-radius:8px;padding:15px;background:#fff;text-align:center;box-shadow:0 3px 10px rgba(0,0,0,0.03);">
                <a href="product.html?id=${rel.id}">
                  <img src="${rel.image}" alt="${rel.name}" style="height:160px;object-fit:cover;border-radius:6px;width:100%;margin-bottom:10px;" onerror="this.src='images/featured1.png'" />
                </a>
                <h4 style="font-size:15px;margin:5px 0;font-weight:600;"><a href="product.html?id=${rel.id}" style="color:#333;">${rel.name}</a></h4>
                <div style="color:#e67e22;font-size:12px;margin-bottom:6px;">
                  <i class="fa fa-star"></i> ${rel.rating || 4.8}
                </div>
                <div class="price-tag" style="font-size:16px;color:#F08080;font-weight:bold;margin-bottom:12px;">Rs ${Number(rel.price).toLocaleString()}</div>
                <button class="btn btn-sm btn-primary btn-block" style="background:#F08080;border:none;" onclick="FlowerShop.addToCart(FlowerShop.findProduct('${rel.id}') || { id:'${rel.id}', name:'${rel.name}', price:${rel.price}, image:'${rel.image}' })">
                  <i class="fa fa-shopping-cart"></i> Add to Cart
                </button>
              </div>
            </div>
          `).join('');
        }
      }
    },

    switchGalleryImage: function(src, thumbEl) {
      const mainImg = document.getElementById('detailMainImage');
      if (mainImg) mainImg.src = src;
      document.querySelectorAll('.product-thumb-item').forEach(t => t.classList.remove('active'));
      if (thumbEl) thumbEl.classList.add('active');
    },

    changeDetailQty: function(delta) {
      const input = document.getElementById('detailQtyInput');
      if (!input) return;
      let val = Number(input.value) || 1;
      val += delta;
      const max = Number(input.max) || 25;
      if (val < 1) val = 1;
      if (val > max) {
        val = max;
        this.showToast(`Maximum quantity available is ${max}.`, 'info');
      }
      input.value = val;
    },

    switchTab: function(tabKey) {
      document.querySelectorAll('.product-tab-btn').forEach(b => {
        if (b.getAttribute('data-tab-target') === tabKey) {
          b.classList.add('active');
        } else {
          b.classList.remove('active');
        }
      });

      document.querySelectorAll('.product-tab-pane').forEach(p => {
        p.style.display = 'none';
      });

      const targetPane = document.getElementById(`tabPane_${tabKey}`);
      if (targetPane) targetPane.style.display = 'block';
    },

    renderProductReviews: function(reviews) {
      const listEl = document.getElementById('detailReviewsList');
      if (!listEl) return;

      if (!reviews || reviews.length === 0) {
        listEl.innerHTML = `
          <div style="background:#fafafa;border:1px dashed #ddd;border-radius:6px;padding:20px;text-align:center;color:#888;">
            <i class="fa fa-comment-o" style="font-size:28px;color:#ccc;margin-bottom:8px;"></i>
            <p style="margin:0;">Be the first to review this handcrafted floral bouquet!</p>
          </div>
        `;
        return;
      }

      listEl.innerHTML = reviews.map(r => {
        const stars = Math.round(r.rating || 5);
        let starIcons = '';
        for (let i = 1; i <= 5; i++) {
          starIcons += i <= stars ? '<i class="fa fa-star text-warning"></i> ' : '<i class="fa fa-star-o text-muted"></i> ';
        }
        return `
          <div style="border-bottom:1px solid #f0f0f0;padding:14px 0;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
              <strong style="font-size:15px;color:#333;">${r.author || r.userName || 'Anonymous Flower Lover'}</strong>
              <span style="font-size:12px;color:#888;">${r.date || 'Recent'}</span>
            </div>
            <div style="font-size:13px;margin-bottom:6px;">${starIcons}</div>
            <p style="margin:0;color:#555;font-size:14px;line-height:1.6;">${r.comment}</p>
          </div>
        `;
      }).join('');
    },

    submitReview: async function(event) {
      if (event && event.preventDefault) event.preventDefault();
      const p = this.activeDetailProduct;
      if (!p || !p.id) {
        this.showToast('Please wait for product details to load.', 'info');
        return;
      }

      const authorInput = document.getElementById('reviewAuthor');
      const ratingInput = document.getElementById('reviewRating');
      const commentInput = document.getElementById('reviewComment');

      const author = authorInput?.value.trim();
      const rating = Number(ratingInput?.value) || 5;
      const comment = commentInput?.value.trim();

      if (!author || !comment) {
        this.showToast('Please fill in your name and review comment.', 'info');
        return;
      }

      try {
        const res = await fetch(`/api/products/${encodeURIComponent(p.id)}/review`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ author, rating, comment })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          this.showToast('Thank you for your floral review! 🌸', 'success');
          if (authorInput) authorInput.value = '';
          if (commentInput) commentInput.value = '';
          if (data.product) {
            this.activeDetailProduct = data.product;
            this.renderProductDetailPage(data.product, []);
            this.switchTab('reviews');
          }
        } else {
          this.showToast(data.message || 'Failed to submit review', 'info');
        }
      } catch (err) {
        this.showToast('Error submitting review. Please try again.', 'info');
      }
    }
  };

  // Expose globally
  window.FlowerShop = FlowerShop;

  // Auto-init on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => FlowerShop.init());
  } else {
    FlowerShop.init();
  }

})(window);
