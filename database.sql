-- ============================================================
-- LUXE DINING - SINGLE COMPREHENSIVE DATABASE SCRIPT
-- Database Name: food_booking_db
-- PostgreSQL Version: 12+
-- Description: รวบรวม 8 ตารางหลักที่เว็บไซต์เรียกใช้งานจริง ครบทั้ง Schema และ Seed Data
-- ============================================================

-- ลบตารางเดิมตามลำดับความสัมพันธ์ (Foreign Keys)
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS reservation_items CASCADE;
DROP TABLE IF EXISTS reservations CASCADE;
DROP TABLE IF EXISTS promotions CASCADE;
DROP TABLE IF EXISTS restaurant_tables CASCADE;
DROP TABLE IF EXISTS menu_items CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================================
-- 1. ตาราง users (ผู้ใช้งานระบบ: ลูกค้า, เชฟ/พนักงาน, ผู้บริหาร Admin)
-- ============================================================
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'customer', -- 'customer', 'staff', 'admin'
    reward_points INT DEFAULT 0,
    membership_tier VARCHAR(50) DEFAULT 'Gold VIP',
    avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 2. ตาราง categories (หมวดหมู่อาหาร)
-- ============================================================
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_name VARCHAR(50) DEFAULT 'Utensils',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 3. ตาราง menu_items (รายการอาหาร 30 รายการที่แสดงบนหน้าเว็บจริง)
-- ============================================================
CREATE TABLE menu_items (
    item_id SERIAL PRIMARY KEY,
    category_id INT REFERENCES categories(category_id) ON DELETE SET NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    image_url TEXT DEFAULT '/images/steak.jpg',
    is_available BOOLEAN DEFAULT TRUE,
    is_popular BOOLEAN DEFAULT FALSE,
    dietary_tag VARCHAR(50) DEFAULT 'Halal',
    prep_time_mins INT DEFAULT 10,
    calories INT DEFAULT 150,
    allergens VARCHAR(150) DEFAULT 'None',
    wine_pairing VARCHAR(150) DEFAULT 'None',
    stock_quantity INT DEFAULT 20,
    is_halal BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 4. ตาราง restaurant_tables (ผังโต๊ะอาหาร 13 โต๊ะใน 5 โซน)
-- ============================================================
CREATE TABLE restaurant_tables (
    table_id SERIAL PRIMARY KEY,
    table_number VARCHAR(20) UNIQUE NOT NULL,
    zone VARCHAR(50) NOT NULL,
    capacity INT NOT NULL CHECK (capacity > 0),
    pos_x INT DEFAULT 0,
    pos_y INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'available', -- 'available', 'reserved', 'occupied'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 5. ตาราง promotions (คูปองโค้ดส่วนลด)
-- ============================================================
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

-- ============================================================
-- 6. ตาราง reservations (ข้อมูลการจองโต๊ะและสั่งอาหาร)
-- ============================================================
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
    special_request TEXT,
    total_amount DECIMAL(10, 2) DEFAULT 0.00,
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    earned_points INT DEFAULT 0,
    payment_status VARCHAR(20) DEFAULT 'paid',
    payment_method VARCHAR(30) DEFAULT 'PromptPay QR',
    order_stage VARCHAR(20) DEFAULT 'confirmed', -- 'confirmed', 'preparing', 'ready', 'completed'
    status VARCHAR(20) DEFAULT 'confirmed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 7. ตาราง reservation_items (รายการอาหารที่สั่งในแต่ละใบจอง)
-- ============================================================
CREATE TABLE reservation_items (
    item_detail_id SERIAL PRIMARY KEY,
    reservation_id INT REFERENCES reservations(reservation_id) ON DELETE CASCADE,
    item_id INT REFERENCES menu_items(item_id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL,
    options TEXT
);

-- ============================================================
-- 8. ตาราง reviews (รีวิวและคะแนนความประทับใจของลูกค้า)
-- ============================================================
CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE SET NULL,
    customer_name VARCHAR(100) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    dish_recommendation VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes สำหรับเพิ่มความเร็วในการค้นหา
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_menu_category ON menu_items(category_id);
CREATE INDEX idx_tables_zone ON restaurant_tables(zone);
CREATE INDEX idx_reservations_user ON reservations(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- ============================================================
-- SEED DATA (ข้อมูลเริ่มต้นจริงที่เว็บดึงไปแสดงผล 100%)
-- ============================================================

-- 1. เพิ่มข้อมูล Users (ผู้ใช้ทดสอบ)
INSERT INTO users (user_id, name, email, password, phone, role, reward_points, membership_tier, avatar_url) VALUES
(1, 'คุณสมชาย ใจดี', 'customer@email.com', 'password123', '081-234-5678', 'customer', 450, 'Gold VIP', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'),
(2, 'คุณพิมลวรรณ สุขเสริฐ', 'pimonwan@luxedining.com', 'password123', '089-987-6543', 'customer', 1850, 'Diamond VIP', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'),
(3, 'คุณกิตติศักดิ์ ช่างปรุง (เชฟ/พนักงาน)', 'staff@luxedining.com', 'admin123', '02-123-4567', 'staff', 0, 'Staff Executive', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'),
(4, 'ผู้บริหารระบบสูงสุด (Admin)', 'admin@luxedining.com', 'admin123', '02-999-9999', 'admin', 0, 'Admin Director', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'),
(5, 'คุณอานนท์ ภักดีไพศาล', 'arnon@gmail.com', 'password123', '085-111-2233', 'customer', 80, 'ลูกค้าทั่วไป (General Member)', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80'),
(6, 'คุณมณีรัตน์ วงศ์สว่าง (พนักงานแคชเชียร์)', 'manirat@luxedining.com', 'staff123', '082-333-4455', 'staff', 0, 'Staff Executive', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'),
(7, 'คุณธนกร เลิศวิจิตร', 'thanakorn@hotmail.com', 'password123', '086-777-8899', 'customer', 320, 'Silver Member', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80');

-- 2. เพิ่มข้อมูล Categories (4 หมวดหมู่หลัก)
INSERT INTO categories (category_id, name, description, icon_name) VALUES
(1, '🍲 ต้ม & แกง', 'แกงเขียวหวาน พะแนง มัสมั่น ต้มยำ ต้มข่า แกงจืด แกงส้ม แกงไตปลา', 'Soup'),
(2, '🔥 ผัด & ทอด', 'ผัดกะเพรา คั่วกลิ้ง ผัดเผ็ด ผัดผัก หมูทอดกระเทียม ไก่ผัดเม็ดมะม่วง', 'Flame'),
(3, '🥘 นึ่ง & ตุ๋น', 'ไข่พะโล้ หมูตุ๋น ปลานึ่ง เนื้อตุ๋นพะโล้ อาหารนึ่งรสนุ่มลึก', 'ChefHat'),
(4, '🌶️ เครื่องเคียง & น้ำพริก', 'น้ำพริกกะปิ น้ำพริกอ่อง ลาบ ผักสด ไข่เจียว เครื่องเคียงครบ', 'Salad');

-- 3. เพิ่มข้อมูล Menu Items (30 รายการอาหารไทยรสเด็ด ที่เว็บใช้งานจริง)
INSERT INTO menu_items (item_id, category_id, name, description, price, image_url, is_popular, prep_time_mins, is_available, dietary_tag, is_halal, calories, allergens, stock_quantity) VALUES
(1, 1, 'แกงเขียวหวานไก่', 'แกงเขียวหวานไก่เข้มข้นกะทิสด มะเขือเปราะ พริกชี้ฟ้า และใบโหระพาหอมกรุ่น', 60.00, '/images/steak.jpg', TRUE, 10, TRUE, 'Halal', TRUE, 180, 'กะปิ/กุ้ง, น้ำปลา/ปลา', 25),
(2, 1, 'พะแนงหมู', 'พะแนงหมูนุ่มเคี่ยวกะทิเข้มข้น รสชาติกลมกล่อม หอมกลิ่นถั่วลิสงคั่วและใบมะกรูด', 65.00, '/images/steak.jpg', TRUE, 10, TRUE, '❌ ไม่ฮาลาล', FALSE, 220, 'กะปิ/กุ้ง, น้ำปลา/ปลา, ถั่วลิสง', 18),
(3, 1, 'มัสมั่นเนื้อ', 'มัสมั่นเนื้อตุ๋นเนื้อนุ่มละลายในปาก หอมเครื่องเทศและถั่วลิสงคั่วสูตรโบราณ', 85.00, '/images/steak.jpg', TRUE, 15, TRUE, 'Halal', TRUE, 260, 'ถั่วลิสง, กะปิ/กุ้ง, น้ำปลา/ปลา', 12),
(4, 1, 'ต้มยำกุ้ง (น้ำข้น)', 'ต้มยำกุ้งแม่น้ำน้ำข้นรสจัดจ้าน เปรี้ยวเค็มเผ็ดครบรส สมุนไพรไทยสดใหม่', 95.00, '/images/sushi.jpg', TRUE, 12, TRUE, 'Halal', TRUE, 140, 'กุ้ง, นม, น้ำพริกเผา (กุ้ง/กะปิ), น้ำปลา', 8),
(5, 2, 'ผัดกะเพราไก่ / เนื้อ', 'ผัดกะเพราสูตรโบราณคั่วพริกแห้งและใบกะเพราป่า กลิ่นหอมฟุ้งจัดจ้าน', 60.00, '/images/steak.jpg', TRUE, 8, TRUE, 'Halal', TRUE, 150, 'ถั่วเหลือง, แป้งสาลี/กลูเตน', 30),
(6, 2, 'ผัดเผ็ดปลาดุก', 'ปลาดุกทอดกรอบผัดพริกแกงเผ็ดเข้มข้น ใบกะเพรากรอบและกระชายซอยหอมเตะจมูก', 65.00, '/images/sushi.jpg', FALSE, 10, TRUE, 'Halal', TRUE, 170, 'ปลา, กะปิ/กุ้ง, ถั่วเหลือง', 3),
(7, 1, 'แกงจืดเต้าหู้หมูสับ', 'แกงจืดเต้าหู้ไข่เนื้อนุ่มใส่หมูสับหมักและผักกาดขาว ซุปร้อนๆ รสชาติกลมกล่อม', 50.00, '/images/pasta.jpg', FALSE, 8, TRUE, '❌ ไม่ฮาลาล', FALSE, 90, 'ถั่วเหลือง, ขึ้นฉ่าย', 20),
(8, 3, 'ไข่พะโล้หมู', 'ไข่พะโล้ต้มเคี่ยวจนเข้าเนื้อ หมูสามชั้นนุ่มละมุน น้ำพะโล้หอมเครื่องเทศยาจีน', 60.00, '/images/pasta.jpg', TRUE, 10, TRUE, '❌ ไม่ฮาลาล', FALSE, 250, 'ไข่, ถั่วเหลือง, แป้งสาลี/กลูเตน, ผักชี/ขึ้นฉ่าย', 0),
(9, 1, 'แกงเทโพหมูสามชั้น', 'แกงกะทิผักบุ้งไทยใส่หมูสามชั้น รสชาติหวานอมเปรี้ยวมะกรูดสดชื่น', 65.00, '/images/steak.jpg', FALSE, 10, TRUE, '❌ ไม่ฮาลาล', FALSE, 220, 'กะปิ/กุ้ง, น้ำปลา/ปลา', 15),
(10, 1, 'แกงไตปลา', 'แกงไตปลาปักษ์ใต้แท้ รสชาติเผ็ดร้อนจัดจ้าน ใส่เนื้อปลาและเม็ดมะม่วงหิมพานต์', 70.00, '/images/sushi.jpg', TRUE, 10, TRUE, 'Halal', TRUE, 90, 'ปลา (ไตปลา), กะปิ/กุ้ง, เม็ดมะม่วงหิมพานต์', 5),
(11, 2, 'ผัดเผ็ดหมูกระด้าง/หมูชิ้น', 'หมูผัดพริกแกงใต้รสเด็ด เผ็ดร้อนถึงใจ ผัดแห้งหอมกลิ่นพริกแกงและใบมะกรูด', 65.00, '/images/steak.jpg', FALSE, 10, TRUE, '❌ ไม่ฮาลาล', FALSE, 190, 'กะปิ/กุ้ง, ถั่วเหลือง, แป้งสาลี/กลูเตน', 22),
(12, 2, 'ผัดบล็อกโคลี่กุ้ง', 'บล็อกโคลี่กรอบหวานผัดน้ำมันหอยใส่กุ้งสดตัวโต รสชาติกลมกล่อมดีต่อสุขภาพ', 75.00, '/images/sushi.jpg', FALSE, 8, TRUE, 'Halal', TRUE, 120, 'กุ้ง, ถั่วเหลือง, แป้งสาลี/กลูเตน', 10),
(13, 2, 'ผัดผักบุ้งไฟแดง', 'ผักบุ้งสดผัดไฟแดง เต้าเจี้ยว กระเทียม พริกสด กรุบกรอบหอมควันกระทะ', 50.00, '/images/pasta.jpg', FALSE, 5, TRUE, 'Halal', TRUE, 130, 'ถั่วเหลือง, แป้งสาลี/กลูเตน', 28),
(14, 2, 'คั่วกลิ้งไก่ / เนื้อ', 'คั่วกลิ้งเนื้อสับผัดคั่วแห้งๆ เผ็ดร้อนหอมพริกแกงใต้และใบมะกรูดซอยละเอียด', 70.00, '/images/steak.jpg', TRUE, 10, TRUE, 'Halal', TRUE, 140, 'กะปิ/กุ้ง, น้ำปลา/ปลา', 4),
(15, 1, 'ต้มข่าไก่', 'ต้มข่าไก่กะทินุ่มละมุน หอมกลิ่นข่าอ่อน ตะไคร้ ใบมะกรูด และเห็ดฟาง', 65.00, '/images/pasta.jpg', FALSE, 10, TRUE, 'Halal', TRUE, 160, 'น้ำปลา/ปลา', 16),
(16, 4, 'ลาบหมู', 'ลาบหมูสับรสนัวคลุกเคล้าข้าวคั่วหอมใหม่ พริกป่น มะนาวแท้ และสะระแหน่สด', 60.00, '/images/steak.jpg', TRUE, 8, TRUE, '❌ ไม่ฮาลาล', FALSE, 130, 'น้ำปลา/ปลา', 0),
(17, 2, 'ไก่ผัดเม็ดมะม่วง', 'เนื้อไก่ทอดคลุกซอสเข้มข้น ผัดกับเม็ดมะม่วงหิมพานต์กรุบกรอบ พริกแห้ง และต้นหอม', 75.00, '/images/steak.jpg', TRUE, 10, TRUE, 'Halal', TRUE, 190, 'เม็ดมะม่วงหิมพานต์, ถั่วเหลือง, แป้งสาลี/กลูเตน', 14),
(18, 2, 'หมูทอดกระเทียม', 'หมูหมักซอสกระเทียมพริกไทยทอดจนเหลืองทอง กรอบนอกนุ่มใน กระเทียมเจียวแน่นๆ', 65.00, '/images/steak.jpg', TRUE, 8, TRUE, '❌ ไม่ฮาลาล', FALSE, 230, 'ถั่วเหลือง, แป้งสาลี/กลูเตน', 2),
(19, 1, 'แกงส้มชะอมกุ้ง', 'แกงส้มรสเข้มข้นจัดจ้าน น้ำแกงข้นใส่ไข่เจียวชะอมทอดชิ้นโตและกุ้งสดเด้ง', 85.00, '/images/sushi.jpg', TRUE, 12, TRUE, 'Halal', TRUE, 140, 'กุ้ง, ไข่, กะปิ/กุ้ง, น้ำปลา/ปลา', 20),
(20, 2, 'ผัดพริกแกงถั่วยาวหมู', 'หมูผัดพริกแกงถั่วฝักยาวกรอบๆ รสเผ็ดหวานกลมกล่อม หอมกลิ่นใบมะกรูด', 60.00, '/images/steak.jpg', FALSE, 8, TRUE, '❌ ไม่ฮาลาล', FALSE, 190, 'กะปิ/กุ้ง, น้ำปลา/ปลา, ถั่วเหลือง', 18),
(21, 3, 'หมูสามชั้นตุ๋นพะโล้', 'หมูสามชั้นตุ๋นเคี่ยวซีอิ๊วดำเครื่องเทศจีนจนเข้าเนื้อ นุ่มละลายในปาก หอมสมุนไพรยาจีน', 75.00, '/images/steak.jpg', TRUE, 12, TRUE, '❌ ไม่ฮาลาล', FALSE, 280, 'ถั่วเหลือง, ไข่', 6),
(22, 3, 'ปลากะพงนึ่งมะนาว', 'ปลากะพงขาวนึ่งร้อนๆ รดซอสมะนาวพริกกระเทียมรสจัดจ้าน หอมกลิ่นสมุนไพรสดชื่น', 120.00, '/images/sushi.jpg', TRUE, 15, TRUE, 'Halal', TRUE, 150, 'ปลา, น้ำปลา/ปลา', 7),
(23, 4, 'น้ำพริกกะปิ + ผักสด', 'น้ำพริกกะปิสูตรโบราณหอมกะปิ รสเผ็ดเค็มสมดุล เสิร์ฟพร้อมผักสดนานาชนิดและผักลวก', 45.00, '/images/pasta.jpg', TRUE, 5, TRUE, 'Halal', TRUE, 60, 'กะปิ/กุ้ง, น้ำปลา/ปลา', 15),
(24, 4, 'ไข่เจียวหมูสับ', 'ไข่เจียวหมูสับฟูนุ่ม ทอดน้ำมันร้อนๆ กลิ่นหอมน้ำปลา เสิร์ฟร้อนๆ กินกับข้าวสุดอร่อย', 40.00, '/images/steak.jpg', FALSE, 5, TRUE, '❌ ไม่ฮาลาล', FALSE, 160, 'ไข่, น้ำปลา/ปลา', 25),
(25, 1, 'ต้มแซ่บกระดูกหมูอ่อน', 'กระดูกหมูอ่อนเคี่ยวนุ่มกรุบ รสแซ่บจี๊ดจ๊าดด้วยพริกขี้หนูสวนสด น้ำมะนาวแท้ และข้าวคั่วหอม', 70.00, '/images/steak.jpg', TRUE, 10, TRUE, '❌ ไม่ฮาลาล', FALSE, 180, 'น้ำปลา/ปลา', 16),
(26, 2, 'ผัดฉ่าทะเลรวมมิตร', 'กุ้งสด ปลาหมึก และหอยแมลงภู่ ผัดฉ่าสมุนไพรสด พริกไทยอ่อน กระชาย พริกชี้ฟ้า หอมฉุยเผ็ดร้อน', 85.00, '/images/sushi.jpg', TRUE, 10, TRUE, 'Halal', TRUE, 160, 'กุ้ง, หอย, หมึก, น้ำปลา/ปลา, ถั่วเหลือง', 8),
(27, 1, 'แกงคั่วหอยขมใบชะพลู', 'แกงคั่วกะทิเข้มข้นถึงเครื่องแกงใต้ ใส่เนื้อหอยขมแกะสดและใบชะพลูหอมละมุนสูตรโบราณ', 75.00, '/images/pasta.jpg', TRUE, 12, TRUE, 'Halal', TRUE, 210, 'หอย, กะปิ/กุ้ง, น้ำปลา/ปลา', 10),
(28, 2, 'ปีกไก่ทอดน้ำปลาโบราณ', 'ปีกไก่หมักน้ำปลาแท้สูตรคุณยาย ทอดจนหนังกรอบสีทอง เนื้อในชุ่มฉ่ำ ทานคู่กับข้าวสวยร้อนๆ', 65.00, '/images/steak.jpg', TRUE, 8, TRUE, 'Halal', TRUE, 240, 'น้ำปลา/ปลา, ถั่วเหลือง, แป้งสาลี/กลูเตน', 20),
(29, 3, 'เต้าหู้ทรงเครื่องเห็ดหอม (มังสวิรัติ)', 'เต้าหู้ไข่นุ่มทอดพอตึง นึ่งราดซอสเห็ดหอม แครอท ข้าวโพดอ่อน รสชาติกลมกล่อมดีต่อสุขภาพ', 55.00, '/images/pasta.jpg', FALSE, 8, TRUE, 'Vegetarian', TRUE, 120, 'ถั่วเหลือง, เห็ด', 14),
(30, 4, 'น้ำพริกอ่องหมูสับ + ผักสด', 'น้ำพริกอ่องสูตรเมืองเหนือ มะเขือเทศฉ่ำผัดหมูสับและพริกแกง รสชาติหวานเปรี้ยวกลมกล่อม', 50.00, '/images/steak.jpg', FALSE, 6, TRUE, '❌ ไม่ฮาลาล', FALSE, 140, 'ถั่วเหลือง, กะปิ/กุ้ง', 12);

-- 4. เพิ่มข้อมูล Tables (ผังโต๊ะ 13 โต๊ะ 5 โซน)
INSERT INTO restaurant_tables (table_id, table_number, zone, capacity, pos_x, pos_y, status) VALUES
(1, 'T-01', 'Indoor Main Dining', 2, 1, 1, 'available'),
(2, 'T-02', 'Indoor Main Dining', 4, 1, 2, 'reserved'),
(3, 'T-03', 'Indoor Main Dining', 6, 1, 3, 'available'),
(4, 'T-04', 'Indoor Main Dining', 4, 1, 4, 'available'),
(5, 'G-01', 'Garden Glasshouse Terrace', 4, 2, 1, 'available'),
(6, 'G-02', 'Garden Glasshouse Terrace', 2, 2, 2, 'available'),
(7, 'G-03', 'Garden Glasshouse Terrace', 6, 2, 3, 'reserved'),
(8, 'C-01', 'Chef Counter Live Kitchen', 2, 3, 1, 'available'),
(9, 'C-02', 'Chef Counter Live Kitchen', 2, 3, 2, 'available'),
(10, 'V-01', 'VIP Presidential Suite', 8, 4, 1, 'available'),
(11, 'V-02', 'VIP Presidential Suite', 10, 4, 2, 'reserved'),
(12, 'R-01', 'Rooftop Sky Bar', 2, 5, 1, 'available'),
(13, 'R-02', 'Rooftop Sky Bar', 4, 5, 2, 'available');

-- 5. เพิ่มข้อมูล Promotions (คูปองส่วนลด 3 รายการ)
INSERT INTO promotions (promo_id, code, title, discount_percent, min_spend, description, badge_color) VALUES
(1, 'LUXE2026', 'ส่วนลดต้อนรับ 10%', 10, 500.00, 'รับส่วนลด 10% สำหรับมื้ออาหารและโต๊ะจองทุกประเภท', '#e5a853'),
(2, 'VIPGOLD', 'ส่วนลดสมาชิก VIP Gold 15%', 15, 1200.00, 'สิทธิพิเศษเฉพาะสมาชิก Gold ขึ้นไป รับส่วนลด 15%', '#3b82f6'),
(3, 'MICHELIN500', 'ส่วนลด Michelin Set ฿500', 20, 2500.00, 'รับส่วนลด ฿500 เมื่อจองคอร์ส Michelin Tasting Menu', '#10b981');

-- 6. เพิ่มข้อมูล Reservations ตัวอย่าง 1 ใบจองจริง
INSERT INTO reservations (reservation_id, booking_code, user_id, customer_name, customer_email, customer_phone, reservation_date, reservation_time, guest_count, table_id, special_request, total_amount, earned_points, payment_status, payment_method, order_stage, status) VALUES
(1, 'LX-84920', 1, 'คุณสมชาย ใจดี (ลูกค้า)', 'customer@email.com', '081-234-5678', CURRENT_DATE + INTERVAL '1 day', '12:00:00', 1, NULL, 'แยกน้ำแกงใส่ถุง ขอพริกน้ำปลาเพิ่ม', 185.00, 18, 'paid', 'PromptPay QR', 'ready', 'confirmed');

-- 7. เพิ่มข้อมูล Reservation Items ในใบจอง
INSERT INTO reservation_items (item_detail_id, reservation_id, item_id, quantity, unit_price, options) VALUES
(1, 1, 1, 1, 60.00, 'แกงเขียวหวานไก่'),
(2, 1, 2, 1, 65.00, 'พะแนงหมู'),
(3, 1, 18, 1, 60.00, 'หมูทอดกระเทียม');

-- 8. เพิ่มข้อมูล Reviews ความประทับใจลูกค้า (4 รายการ)
INSERT INTO reviews (review_id, customer_name, rating, comment, dish_recommendation) VALUES
(1, 'คุณภาณุวัฒน์ ก.', 5, 'แกงเขียวหวานไก่และพะแนงหมูรสชาติถึงเครื่องแกงไทยแท้ๆ บรรยากาศร้านสะอาด บริการดีมากครับ', 'แกงเขียวหวานไก่'),
(2, 'คุณพิมลวรรณ สุขเสริฐ', 5, 'จองโต๊ะและสั่งอาหารล่วงหน้าสะดวกมาก ได้รับ E-Voucher บัตรคิวทันที มีการแสดงสถานะการปรุงอาหารแบบเรียลไทม์เหมือน GrabFood เลยค่ะ', 'ต้มยำกุ้ง (น้ำข้น)'),
(3, 'Mr. David Miller (Food Critic)', 5, 'Authentic Thai taste! The green curry and tom yum soup were phenomenal, quick service and great staff.', 'มัสมั่นเนื้อ'),
(4, 'คุณณิชาภา ม.', 5, 'ชอบระบบเลือกผังโต๊ะอาหารมากค่ะ ได้มุม Garden Glasshouse บรรยากาศดี เหมาะกับการมาทานข้าวกับครอบครัวมากค่ะ', 'ปลากะพงนึ่งมะนาว');

-- ปรับค่า Sequence ของ SERIAL ให้ตรงกับข้อมูลที่เพิ่ง INSERT
SELECT setval('users_user_id_seq', (SELECT MAX(user_id) FROM users));
SELECT setval('categories_category_id_seq', (SELECT MAX(category_id) FROM categories));
SELECT setval('menu_items_item_id_seq', (SELECT MAX(item_id) FROM menu_items));
SELECT setval('restaurant_tables_table_id_seq', (SELECT MAX(table_id) FROM restaurant_tables));
SELECT setval('promotions_promo_id_seq', (SELECT MAX(promo_id) FROM promotions));
SELECT setval('reservations_reservation_id_seq', (SELECT MAX(reservation_id) FROM reservations));
SELECT setval('reservation_items_item_detail_id_seq', (SELECT MAX(item_detail_id) FROM reservation_items));
SELECT setval('reviews_review_id_seq', (SELECT MAX(review_id) FROM reviews));
