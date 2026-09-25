-- ============================================================
-- LUXE DINING DATABASE SCHEMA
-- PostgreSQL Version 12+
-- ============================================================

DROP TABLE IF EXISTS reservation_items CASCADE;
DROP TABLE IF EXISTS reservations CASCADE;
DROP TABLE IF EXISTS restaurant_tables CASCADE;
DROP TABLE IF EXISTS menu_items CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- 1. Categories Table (หมวดหมู่อาหาร)
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_name VARCHAR(50) DEFAULT 'Utensils',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Menu Items Table (รายการอาหาร)
CREATE TABLE menu_items (
    item_id SERIAL PRIMARY KEY,
    category_id INT REFERENCES categories(category_id) ON DELETE SET NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    image_url TEXT,
    is_available BOOLEAN DEFAULT TRUE,
    is_popular BOOLEAN DEFAULT FALSE,
    prep_time_mins INT DEFAULT 15,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Restaurant Tables (ผังโต๊ะอาหาร)
CREATE TABLE restaurant_tables (
    table_id SERIAL PRIMARY KEY,
    table_number VARCHAR(20) UNIQUE NOT NULL,
    zone VARCHAR(50) NOT NULL, -- 'Indoor Main', 'Garden Terrace', 'VIP Lounge'
    capacity INT NOT NULL CHECK (capacity > 0),
    pos_x INT DEFAULT 0,
    pos_y INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'available', -- 'available', 'reserved', 'occupied'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Reservations Table (การจองโต๊ะ)
CREATE TABLE reservations (
    reservation_id SERIAL PRIMARY KEY,
    booking_code VARCHAR(20) UNIQUE DEFAULT ('LX-' || LPAD(CAST(FLOOR(RANDOM() * 100000) AS VARCHAR), 5, '0')),
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    guest_count INT NOT NULL CHECK (guest_count > 0),
    table_id INT REFERENCES restaurant_tables(table_id) ON DELETE SET NULL,
    special_request TEXT,
    total_amount DECIMAL(10, 2) DEFAULT 0.00,
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    payment_status VARCHAR(20) DEFAULT 'paid', -- 'pending', 'paid', 'refunded'
    payment_method VARCHAR(30) DEFAULT 'PromptPay QR',
    status VARCHAR(20) DEFAULT 'confirmed', -- 'pending', 'confirmed', 'cancelled'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Reservation Items Table (รายการอาหารสั่งล่วงหน้า)
CREATE TABLE reservation_items (
    item_detail_id SERIAL PRIMARY KEY,
    reservation_id INT REFERENCES reservations(reservation_id) ON DELETE CASCADE,
    item_id INT REFERENCES menu_items(item_id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL
);

-- Indexes
CREATE INDEX idx_reservations_date ON reservations(reservation_date);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_menu_category ON menu_items(category_id);
