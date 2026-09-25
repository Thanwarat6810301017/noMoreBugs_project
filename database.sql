-- ============================================================
-- LUXE DINING ULTRA PRO - DATABASE SETUP SCRIPT FOR PGADMIN
-- Database Name: food_booking_db
-- PostgreSQL Version: 12+
-- ============================================================

DROP VIEW IF EXISTS view_daily_sales CASCADE;
DROP VIEW IF EXISTS view_table_occupancy CASCADE;
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

-- 3. Restaurant Tables (โซนและโต๊ะอาหารแบบ Interactive Map)
CREATE TABLE restaurant_tables (
    table_id SERIAL PRIMARY KEY,
    table_number VARCHAR(20) UNIQUE NOT NULL,
    zone VARCHAR(50) NOT NULL, -- 'Indoor Main', 'Garden Terrace', 'VIP Lounge'
    capacity INT NOT NULL CHECK (capacity > 0),
    pos_x INT DEFAULT 0, -- X-position for floor map
    pos_y INT DEFAULT 0, -- Y-position for floor map
    status VARCHAR(20) DEFAULT 'available', -- 'available', 'reserved', 'occupied'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Reservations Table (การจองโต๊ะและสั่งอาหารล่วงหน้า)
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
    status VARCHAR(20) DEFAULT 'confirmed', -- 'pending', 'confirmed', 'cancelled', 'completed'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Reservation Pre-ordered Items Table
CREATE TABLE reservation_items (
    item_detail_id SERIAL PRIMARY KEY,
    reservation_id INT REFERENCES reservations(reservation_id) ON DELETE CASCADE,
    item_id INT REFERENCES menu_items(item_id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL
);

-- Indexes for high-performance querying
CREATE INDEX idx_reservations_date ON reservations(reservation_date);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_menu_category ON menu_items(category_id);

-- ============================================================
-- SQL VIEWS FOR ANALYTICS (มุมมองสถิติระบบ)
-- ============================================================

-- Daily Sales Summary View
CREATE VIEW view_daily_sales AS
SELECT 
    reservation_date,
    COUNT(reservation_id) AS total_bookings,
    SUM(total_amount) AS total_revenue,
    AVG(total_amount) AS avg_booking_value
FROM reservations
WHERE status != 'cancelled'
GROUP BY reservation_date
ORDER BY reservation_date DESC;

-- Table Occupancy View
CREATE VIEW view_table_occupancy AS
SELECT 
    t.zone,
    COUNT(t.table_id) AS total_tables,
    SUM(CASE WHEN t.status = 'reserved' THEN 1 ELSE 0 END) AS reserved_tables,
    ROUND((SUM(CASE WHEN t.status = 'reserved' THEN 1 ELSE 0 END)::NUMERIC / COUNT(t.table_id)::NUMERIC) * 100, 2) AS occupancy_percentage
FROM restaurant_tables t
GROUP BY t.zone;

-- ============================================================
-- SEED DATA (ข้อมูลเริ่มต้นระบบ)
-- ============================================================

INSERT INTO categories (name, description, icon_name) VALUES
('Appetizers', 'อาหารทานเล่นเรียกน้ำย่อย คัดสรรวัตถุดิบชั้นเลิศ', 'Salad'),
('Main Course', 'จานหลักรสเลิศจากเชฟระดับพรีเมียม', 'Beef'),
('Desserts', 'ของหวานโฮมเมดและเบเกอรี่เนื้อนุ่ม', 'Cake'),
('Beverages', 'เครื่องดื่ม สมูทตี้ และไวน์ชั้นดี', 'Wine');

INSERT INTO menu_items (category_id, name, description, price, image_url, is_popular, prep_time_mins) VALUES
(2, 'Prime Ribeye Steak with Truffle Butter', 'สเต๊กเนื้อริบอายเกรดพรีเมียม เสิร์ฟพร้อมเนยทรัฟเฟิลและผักย่าง', 1290.00, '/images/steak.jpg', TRUE, 25),
(2, 'Creamy Truffle Fettuccine Pasta', 'พาสต้าเฟตตูชินีซอสทรัฟเฟิลเข้มข้น ท็อปด้วยพาร์เมซานชีส', 480.00, '/images/pasta.jpg', TRUE, 15),
(1, 'Premium Salmon Sushi Platter', 'แซลมอนซูชิและซาชิมิสดส่งตรงจากนอร์เวย์ 8 ชิ้น', 650.00, '/images/sushi.jpg', TRUE, 12),
(3, 'Chocolate Lava Cake with Vanilla Ice Cream', 'เค้กช็อกโกแลตลาวาอุ่นๆ เสิร์ฟคู่ไอศกรีมวานิลลาและเบอร์รีสด', 290.00, '/images/dessert.jpg', TRUE, 10),
(1, 'Caesar Salad with Crispy Bacon', 'สลัดซีซาร์ผักคอสสดใหม่ เบคอนกรอบ และกรุบกรอบกูร์ตอง', 260.00, '/images/steak.jpg', FALSE, 10),
(4, 'Signature Berry Mocktail', 'ม็อกเทลเบอร์รีรวมผสมโซดา สดชื่นคลายร้อน', 180.00, '/images/dessert.jpg', FALSE, 5);

INSERT INTO restaurant_tables (table_number, zone, capacity, pos_x, pos_y, status) VALUES
('T-01', 'Indoor Main', 2, 1, 1, 'available'),
('T-02', 'Indoor Main', 4, 1, 2, 'reserved'),
('T-03', 'Indoor Main', 6, 1, 3, 'available'),
('G-01', 'Garden Terrace', 4, 2, 1, 'available'),
('G-02', 'Garden Terrace', 2, 2, 2, 'available'),
('G-03', 'Garden Terrace', 6, 2, 3, 'available'),
('V-01', 'VIP Lounge', 8, 3, 1, 'available'),
('V-02', 'VIP Lounge', 10, 3, 2, 'reserved');

INSERT INTO reservations (customer_name, customer_email, customer_phone, reservation_date, reservation_time, guest_count, table_id, special_request, total_amount, payment_status, status) VALUES
('คุณสมชาย ใจดี', 'somchai@email.com', '081-234-5678', CURRENT_DATE + INTERVAL '1 day', '19:00:00', 2, 1, 'ขอโต๊ะติดริมกระจก ฉลองวันเกิด', 1770.00, 'paid', 'confirmed');

INSERT INTO reservation_items (reservation_id, item_id, quantity, unit_price) VALUES
(1, 1, 1, 1290.00),
(1, 2, 1, 480.00);

-- Query verification test
SELECT * FROM view_daily_sales;
