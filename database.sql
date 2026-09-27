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
('🍲 ต้ม & แกง', 'แกงเขียวหวาน พะแนง มัสมั่น ต้มยำ ต้มข่า แกงจืด แกงส้ม แกงไตปลา', 'Soup'),
('🔥 ผัด & ทอด', 'ผัดกะเพรา คั่วกลิ้ง ผัดเผ็ด ผัดผัก หมูทอดกระเทียม ไก่ผัดเม็ดมะม่วง', 'Flame'),
('🥘 นึ่ง & ตุ๋น', 'ไข่พะโล้ หมูตุ๋น ปลานึ่ง เนื้อตุ๋นพะโล้ อาหารนึ่งรสนุ่มลึก', 'ChefHat'),
('🌶️ เครื่องเคียง & น้ำพริก', 'น้ำพริกกะปิ น้ำพริกอ่อง ลาบ ผักสด ไข่เจียว เครื่องเคียงครบ', 'Salad');

INSERT INTO menu_items (category_id, name, description, price, image_url, is_popular, prep_time_mins) VALUES
(1, 'แกงเขียวหวานไก่', 'แกงเขียวหวานไก่เข้มข้นกะทิสด มะเขือเปราะ พริกชี้ฟ้า และใบโหระพาหอมกรุ่น', 60.00, '/images/steak.jpg', TRUE, 10),
(1, 'พะแนงหมู', 'พะแนงหมูนุ่มเคี่ยวกะทิเข้มข้น รสชาติกลมกล่อม หอมกลิ่นถั่วลิสงคั่วและใบมะกรูด', 65.00, '/images/steak.jpg', TRUE, 10),
(1, 'มัสมั่นเนื้อ', 'มัสมั่นเนื้อตุ๋นเนื้อนุ่มละลายในปาก หอมเครื่องเทศและถั่วลิสงคั่วสูตรโบราณ', 85.00, '/images/steak.jpg', TRUE, 15),
(1, 'ต้มยำกุ้ง (น้ำข้น)', 'ต้มยำกุ้งแม่น้ำน้ำข้นรสจัดจ้าน เปรี้ยวเค็มเผ็ดครบรส สมุนไพรไทยสดใหม่', 95.00, '/images/sushi.jpg', TRUE, 12),
(2, 'ผัดกะเพราไก่ / เนื้อ', 'ผัดกะเพราสูตรโบราณคั่วพริกแห้งและใบกะเพราป่า กลิ่นหอมฟุ้งจัดจ้าน', 60.00, '/images/steak.jpg', TRUE, 8),
(2, 'ผัดเผ็ดปลาดุก', 'ปลาดุกทอดกรอบผัดพริกแกงเผ็ดเข้มข้น ใบกะเพรากรอบและกระชายซอยหอมเตะจมูก', 65.00, '/images/sushi.jpg', FALSE, 10),
(1, 'แกงจืดเต้าหู้หมูสับ', 'แกงจืดเต้าหู้ไข่เนื้อนุ่มใส่หมูสับหมักและผักกาดขาว ซุปร้อนๆ รสชาติกลมกล่อม', 50.00, '/images/pasta.jpg', FALSE, 8),
(3, 'ไข่พะโล้หมู', 'ไข่พะโล้ต้มเคี่ยวจนเข้าเนื้อ หมูสามชั้นนุ่มละมุน น้ำพะโล้หอมเครื่องเทศยาจีน', 60.00, '/images/pasta.jpg', TRUE, 10),
(1, 'แกงเทโพหมูสามชั้น', 'แกงกะทิผักบุ้งไทยใส่หมูสามชั้น รสชาติหวานอมเปรี้ยวมะกรูดสดชื่น', 65.00, '/images/steak.jpg', FALSE, 10),
(1, 'แกงไตปลา', 'แกงไตปลาปักษ์ใต้แท้ รสชาติเผ็ดร้อนจัดจ้าน ใส่เนื้อปลาและเม็ดมะม่วงหิมพานต์', 70.00, '/images/sushi.jpg', TRUE, 10),
(2, 'ผัดเผ็ดหมูกระด้าง/หมูชิ้น', 'หมูผัดพริกแกงใต้รสเด็ด เผ็ดร้อนถึงใจ ผัดแห้งหอมกลิ่นพริกแกงและใบมะกรูด', 65.00, '/images/steak.jpg', FALSE, 10),
(2, 'ผัดบล็อกโคลี่กุ้ง', 'บล็อกโคลี่กรอบหวานผัดน้ำมันหอยใส่กุ้งสดตัวโต รสชาติกลมกล่อมดีต่อสุขภาพ', 75.00, '/images/sushi.jpg', FALSE, 8),
(2, 'ผัดผักบุ้งไฟแดง', 'ผักบุ้งสดผัดไฟแดง เต้าเจี้ยว กระเทียม พริกสด กรุบกรอบหอมควันกระทะ', 50.00, '/images/pasta.jpg', FALSE, 5),
(2, 'คั่วกลิ้งไก่ / เนื้อ', 'คั่วกลิ้งเนื้อสับผัดคั่วแห้งๆ เผ็ดร้อนหอมพริกแกงใต้และใบมะกรูดซอยละเอียด', 70.00, '/images/steak.jpg', TRUE, 10),
(1, 'ต้มข่าไก่', 'ต้มข่าไก่กะทินุ่มละมุน หอมกลิ่นข่าอ่อน ตะไคร้ ใบมะกรูด และเห็ดฟาง', 65.00, '/images/pasta.jpg', FALSE, 10),
(4, 'ลาบหมู', 'ลาบหมูสับรสนัวคลุกเคล้าข้าวคั่วหอมใหม่ พริกป่น มะนาวแท้ และสะระแหน่สด', 60.00, '/images/steak.jpg', TRUE, 8),
(2, 'ไก่ผัดเม็ดมะม่วง', 'เนื้อไก่ทอดคลุกซอสเข้มข้น ผัดกับเม็ดมะม่วงหิมพานต์กรุบกรอบ พริกแห้ง และต้นหอม', 75.00, '/images/steak.jpg', TRUE, 10),
(2, 'หมูทอดกระเทียม', 'หมูหมักซอสกระเทียมพริกไทยทอดจนเหลืองทอง กรอบนอกนุ่มใน กระเทียมเจียวแน่นๆ', 65.00, '/images/steak.jpg', TRUE, 8),
(1, 'แกงส้มชะอมกุ้ง', 'แกงส้มรสเข้มข้นจัดจ้าน น้ำแกงข้นใส่ไข่เจียวชะอมทอดชิ้นโตและกุ้งสดเด้ง', 85.00, '/images/sushi.jpg', TRUE, 12),
(2, 'ผัดพริกแกงถั่วยาวหมู', 'หมูผัดพริกแกงถั่วฝักยาวกรอบๆ รสเผ็ดหวานกลมกล่อม หอมกลิ่นใบมะกรูด', 60.00, '/images/steak.jpg', FALSE, 8),
(3, 'หมูสามชั้นตุ๋นพะโล้', 'หมูสามชั้นตุ๋นเคี่ยวซีอิ๊วดำเครื่องเทศจีนจนเข้าเนื้อ นุ่มละลายในปาก หอมสมุนไพรยาจีน', 75.00, '/images/steak.jpg', TRUE, 12),
(3, 'ปลากะพงนึ่งมะนาว', 'ปลากะพงขาวนึ่งร้อนๆ รดซอสมะนาวพริกกระเทียมรสจัดจ้าน หอมกลิ่นสมุนไพรสดชื่น', 120.00, '/images/sushi.jpg', TRUE, 15),
(4, 'น้ำพริกกะปิ + ผักสด', 'น้ำพริกกะปิสูตรโบราณหอมกะปิ รสเผ็ดเค็มสมดุล เสิร์ฟพร้อมผักสดนานาชนิดและผักลวก', 45.00, '/images/pasta.jpg', TRUE, 5),
(4, 'ไข่เจียวหมูสับ', 'ไข่เจียวหมูสับฟูนุ่ม ทอดน้ำมันร้อนๆ กลิ่นหอมน้ำปลา เสิร์ฟร้อนๆ กินกับข้าวสุดอร่อย', 40.00, '/images/steak.jpg', FALSE, 5),
(1, 'ต้มแซ่บกระดูกหมูอ่อน', 'กระดูกหมูอ่อนเคี่ยวนุ่มกรุบ รสแซ่บจี๊ดจ๊าดด้วยพริกขี้หนูสวนสด น้ำมะนาวแท้ และข้าวคั่วหอม', 70.00, '/images/steak.jpg', TRUE, 10),
(2, 'ผัดฉ่าทะเลรวมมิตร', 'กุ้งสด ปลาหมึก และหอยแมลงภู่ ผัดฉ่าสมุนไพรสด พริกไทยอ่อน กระชาย พริกชี้ฟ้า หอมฉุยเผ็ดร้อน', 85.00, '/images/sushi.jpg', TRUE, 10),
(1, 'แกงคั่วหอยขมใบชะพลู', 'แกงคั่วกะทิเข้มข้นถึงเครื่องแกงใต้ ใส่เนื้อหอยขมแกะสดและใบชะพลูหอมละมุนสูตรโบราณ', 75.00, '/images/pasta.jpg', TRUE, 12),
(2, 'ปีกไก่ทอดน้ำปลาโบราณ', 'ปีกไก่หมักน้ำปลาแท้สูตรคุณยาย ทอดจนหนังกรอบสีทอง เนื้อในชุ่มฉ่ำ ทานคู่กับข้าวสวยร้อนๆ', 65.00, '/images/steak.jpg', TRUE, 8),
(3, 'เต้าหู้ทรงเครื่องเห็ดหอม', 'เต้าหู้ไข่นุ่มทอดพอตึง นึ่งราดซอสเห็ดหอม แครอท ข้าวโพดอ่อน รสชาติกลมกล่อมดีต่อสุขภาพ', 55.00, '/images/pasta.jpg', FALSE, 8),
(4, 'น้ำพริกอ่องหมูสับ + ผักสด', 'น้ำพริกอ่องสูตรเมืองเหนือ มะเขือเทศฉ่ำผัดหมูสับและพริกแกง รสชาติหวานเปรี้ยวกลมกล่อม', 50.00, '/images/steak.jpg', FALSE, 6);

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
