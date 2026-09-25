-- ============================================================
-- LUXE DINING ULTIMATE ENTERPRISE DATABASE SCHEMA v2.0
-- PostgreSQL Version 12+
-- ============================================================

DROP TABLE IF EXISTS promotions CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS reservation_items CASCADE;
DROP TABLE IF EXISTS reservations CASCADE;
DROP TABLE IF EXISTS restaurant_tables CASCADE;
DROP TABLE IF EXISTS menu_items CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. Users Table (With Loyalty Tiers & Avatars)
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'customer', -- 'customer', 'staff', 'admin'
    reward_points INT DEFAULT 0,
    membership_tier VARCHAR(30) DEFAULT 'Gold Membership', -- 'Silver', 'Gold Membership', 'Platinum', 'Diamond VIP'
    avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Categories Table
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_name VARCHAR(50) DEFAULT 'Utensils',
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Menu Items Table (With Michelin Tags, Allergens, Calories & Sommelier Wine Pairing)
CREATE TABLE menu_items (
    item_id SERIAL PRIMARY KEY,
    category_id INT REFERENCES categories(category_id) ON DELETE SET NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    image_url TEXT,
    is_available BOOLEAN DEFAULT TRUE,
    is_popular BOOLEAN DEFAULT FALSE,
    dietary_tag VARCHAR(50) DEFAULT 'Chef Signature', -- 'Vegetarian', 'Gluten-Free', 'Halal', 'Chef Signature', 'Sommelier Select'
    prep_time_mins INT DEFAULT 15,
    calories INT DEFAULT 450,
    allergens VARCHAR(150) DEFAULT 'None',
    wine_pairing VARCHAR(150) DEFAULT 'Sommelier Selection',
    spicy_level INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Restaurant Tables (Multi-Zone Grid Map)
CREATE TABLE restaurant_tables (
    table_id SERIAL PRIMARY KEY,
    table_number VARCHAR(20) UNIQUE NOT NULL,
    zone VARCHAR(50) NOT NULL, -- 'Indoor Main Dining', 'Garden Glasshouse', 'Chef Counter Live', 'VIP Presidential Suite', 'Rooftop Sky Bar'
    capacity INT NOT NULL CHECK (capacity > 0),
    pos_x INT DEFAULT 0,
    pos_y INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'available', -- 'available', 'reserved', 'occupied'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Promotions & Discount Vouchers Table
CREATE TABLE promotions (
    promo_id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(150) NOT NULL,
    discount_percent INT DEFAULT 10,
    min_spend DECIMAL(10, 2) DEFAULT 0.00,
    description TEXT,
    badge_color VARCHAR(30) DEFAULT '#e5a853',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Reservations Table (SevenRooms & OpenTable Features)
CREATE TABLE reservations (
    reservation_id SERIAL PRIMARY KEY,
    booking_code VARCHAR(20) UNIQUE DEFAULT ('LX-' || LPAD(CAST(FLOOR(RANDOM() * 100000) AS VARCHAR), 5, '0')),
    user_id INT REFERENCES users(user_id) ON DELETE SET NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    guest_count INT NOT NULL CHECK (guest_count > 0),
    table_id INT REFERENCES restaurant_tables(table_id) ON DELETE SET NULL,
    occasion VARCHAR(50) DEFAULT 'General Dining', -- 'Birthday Celebration', 'Anniversary', 'Business Dinner', 'Date Night', 'Family Gathering'
    special_request TEXT,
    total_amount DECIMAL(10, 2) DEFAULT 0.00,
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    earned_points INT DEFAULT 0,
    payment_status VARCHAR(20) DEFAULT 'paid',
    order_stage VARCHAR(20) DEFAULT 'confirmed',
    status VARCHAR(20) DEFAULT 'confirmed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Reservation Items Table
CREATE TABLE reservation_items (
    item_detail_id SERIAL PRIMARY KEY,
    reservation_id INT REFERENCES reservations(reservation_id) ON DELETE CASCADE,
    item_id INT REFERENCES menu_items(item_id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL,
    options TEXT
);

-- 8. 5-Star Customer Reviews Table
CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE SET NULL,
    customer_name VARCHAR(100) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    dish_recommendation VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Performance Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_menu_category ON menu_items(category_id);
CREATE INDEX idx_menu_dietary ON menu_items(dietary_tag);
CREATE INDEX idx_tables_zone ON restaurant_tables(zone);
CREATE INDEX idx_reservations_user ON reservations(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
