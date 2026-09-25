-- ============================================================
-- LUXE DINING ULTIMATE SEED DATA v2.0
-- ============================================================

-- 1. Users
INSERT INTO users (name, email, password, phone, role, reward_points, membership_tier, avatar_url) VALUES
('คุณสมชาย ใจดี (ลูกค้า VIP)', 'customer@email.com', 'password123', '081-234-5678', 'customer', 450, 'Gold Membership', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'),
('คุณพิมลวรรณ สุขเสริฐ (Diamond VIP)', 'pimonwan@luxedining.com', 'password123', '089-987-6543', 'customer', 1850, 'Diamond VIP', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'),
('พนักงานแก้ไขข้อมูล (Staff Editor)', 'staff@luxedining.com', 'admin123', '02-123-4567', 'staff', 0, 'Staff Executive', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'),
('ผู้บริหารระบบ (Admin)', 'admin@luxedining.com', 'admin123', '02-999-9999', 'admin', 0, 'Admin Director', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80');

-- 2. Categories
INSERT INTO categories (category_id, name, description, icon_name, display_order) VALUES
(1, 'Appetizers & Starters', 'อาหารทานเล่นเรียกน้ำย่อย คัดสรรวัตถุดิบนำเข้าชั้นเลิศ', 'Salad', 1),
(2, 'Soups & Fresh Salads', 'ซุปอุ่นกรุ่นกลิ่นทรัฟเฟิลและสลัดผักออร์แกนิก', 'Soup', 2),
(3, 'Prime Steaks & Grills', 'สเต๊กเนื้อวากิวและริบอายเกรดพรีเมียมบ่มแบบ Dry-Aged', 'Beef', 3),
(4, 'Seafood & Raw Bar', 'ซูชิ ซาชิมิ แซลมอนนอร์เวย์ และหอยนางรมสดจากฝรั่งเศส', 'Fish', 4),
(5, 'Artisanal Pasta & Risotto', 'พาสต้าเส้นสดและรีซอตโต้สูตรต้นตำรับอิตาลี', 'Utensils', 5),
(6, 'Michelin Tasting Sets', 'เซ็ตมื้ออาหารพิเศษ 7-Course โดยเชฟมิชลินสตาร์', 'Sparkles', 6),
(7, 'Luxury Desserts & Bakery', 'ของหวานฝรั่งเศส ไอศกรีมโฮมเมด และเบเกอรี่สดใหม่', 'Cake', 7),
(8, 'Sommelier Wines & Drinks', 'ไวน์นำเข้า ม็อกเทลพรีเมียม และกาแฟคั่วบดพิเศษ', 'Wine', 8);

-- 3. Menu Items (20+ Gourmet Items with Allergens & Wine Pairings)
INSERT INTO menu_items (category_id, name, description, price, image_url, is_popular, dietary_tag, prep_time_mins, calories, allergens, wine_pairing) VALUES
-- Steaks & Grills (Cat 3)
(3, 'Prime Ribeye Steak with Truffle Butter', 'สเต๊กเนื้อริบอายวากิว A5 บ่ม 45 วัน เสิร์ฟพร้อมเนยทรัฟเฟิลสีทองและเกลือหิมาลายัน', 1290.00, '/images/steak.jpg', TRUE, 'Chef Signature', 25, 780, 'Dairy', '2019 Bordeaux Cabernet Sauvignon'),
(3, 'A5 Wagyu Striploin Melt-in-Mouth', 'เนื้อวากิว A5 นำเข้าจากคาโกชิมะ ย่างเตาถ่านไม้ชาโคล ลายไขมันแทรกละเอียด', 1890.00, '/images/steak.jpg', TRUE, 'Chef Signature', 20, 850, 'None', '2018 Shiraz Barossa Valley'),
(3, 'Grilled Australian Lamb Chops', 'ซี่โครงแกะออสเตรเลียย่างสมุนไพรโรสแมรี่ เสิร์ฟคู่ซอสมิ้นท์การ์เดน', 1150.00, '/images/steak.jpg', FALSE, 'Gluten-Free', 22, 690, 'None', '2020 Pinot Noir Oregon'),

-- Seafood & Raw Bar (Cat 4)
(4, 'Premium Salmon Sushi Platter', 'แซลมอนซูชิและซาชิมิเกรดพรีเมียมส่งตรงจากนอร์เวย์ 8 ชิ้น พร้อมไข่ปลาแซลมอน', 650.00, '/images/sushi.jpg', TRUE, 'Gluten-Free', 12, 420, 'Fish, Soy', 'Chardonnay Reserve 2021'),
(4, 'French Fine de Claire Oysters (6 pcs)', 'หอยนางรมสดฟินเดอแคลร์ นำเข้าจากฝรั่งเศส เสิร์ฟพร้อมซอสเรดไวน์มิโญเนตต์', 890.00, '/images/sushi.jpg', TRUE, 'Chef Signature', 10, 180, 'Shellfish', 'Champagne Dom Pérignon Vintage'),
(4, 'Pan-Seared Snow Fish Seabass', 'ปลาหิมะย่างกระทะหนังกรอบ เสิร์ฟพร้อมซอสบัตเตอร์เลมอนและหน่อไม้ฝรั่ง', 980.00, '/images/steak.jpg', FALSE, 'Gluten-Free', 18, 510, 'Dairy, Fish', 'Sauvignon Blanc Marlborough'),

-- Pasta & Risotto (Cat 5)
(5, 'Creamy Truffle Fettuccine Pasta', 'พาสต้าเฟตตูชินีเส้นสดซอสเห็ดทรัฟเฟิลเข้มข้น ท็อปด้วยพาร์เมซานชีสและทรัฟเฟิลสไลซ์', 480.00, '/images/pasta.jpg', TRUE, 'Vegetarian', 15, 620, 'Dairy, Gluten', 'Pinot Grigio D.O.C.'),
(5, 'Lobster Tail Black Ink Spaghetti', 'สปาเกตตีหมึกดำผัดซอสมะเขือเทศเชอร์รีสไตล์อิตาเลียน เสิร์ฟพร้อมกุ้งมังกรลอบสเตอร์', 950.00, '/images/pasta.jpg', TRUE, 'Chef Signature', 20, 580, 'Shellfish, Gluten', 'Chablis Premier Cru'),
(5, 'Wild Mushroom Risotto with Truffle Oil', 'ข้าวรีซอตโต้ทรัฟเฟิลเคี่ยวซุปผักและชีสเพโคริโน สไตล์เวนิส', 420.00, '/images/pasta.jpg', FALSE, 'Vegetarian', 18, 530, 'Dairy', 'Chianti Classico Riserva'),

-- Appetizers & Starters (Cat 1)
(1, 'Caesar Salad with Crispy Bacon', 'สลัดซีซาร์ผักคอสสดใหม่ เบคอนกรอบ ไข่ต้มยางมะตูม และกรุบกรอบกูร์ตอง', 260.00, '/images/steak.jpg', FALSE, 'Vegetarian', 10, 310, 'Dairy, Eggs', 'Prosecco Superiore'),
(1, 'Seared Hokkaido Scallops', 'หอยเชลล์ฮอกไกโดตัวโตย่างเนย เสิร์ฟบนพูเรถั่วลันเตาหวาน', 520.00, '/images/sushi.jpg', TRUE, 'Gluten-Free', 12, 290, 'Shellfish, Dairy', 'Sauvignon Blanc'),
(1, 'Crispy Calamari with Truffle Mayo', 'ปลาหมึกชุบแป้งทอดกรอบสไตล์เมดิเตอร์เรเนียน เสิร์ฟคู่ดิปปิ้งมายองเนสทรัฟเฟิล', 320.00, '/images/sushi.jpg', FALSE, 'Halal', 10, 440, 'Mollusks, Eggs', 'Sparkling Rose'),

-- Soups & Salads (Cat 2)
(2, 'Classic French Onion Soup', 'ซุปหัวหอมสไตล์ฝรั่งเศสเคี่ยวนาน 8 ชั่วโมง อบพร้อมกรูแยร์ชีสเยิ้มกรอบ', 290.00, '/images/pasta.jpg', FALSE, 'Vegetarian', 12, 380, 'Dairy, Gluten', 'Syrah Rhone Valley'),
(2, 'Creamy Wild Mushroom Truffle Soup', 'ซุปเห็ดรวมทรัฟเฟิลเนื้อเนียนนุ่ม หอมกลิ่นเนยและน้ำมันทรัฟเฟิลแท้', 340.00, '/images/pasta.jpg', TRUE, 'Vegetarian', 10, 320, 'Dairy', 'Chardonnay Napa Valley'),

-- Michelin Tasting Sets (Cat 6)
(6, '7-Course Michelin Signature Grand Tasting Menu', 'คอร์สอาหารสุดพิเศษ 7 จาน รังสรรค์โดยเชฟมิชลินสตาร์ รวมซิกเนเจอร์สเต๊ก ลอบสเตอร์ และทรัฟเฟิล', 3500.00, '/images/steak.jpg', TRUE, 'Chef Signature', 90, 1450, 'Dairy, Shellfish, Gluten', 'Sommelier Premium Wine Pairing (+1200฿)'),
(6, '5-Course Romantic Candlelight Couple Set', 'เซ็ตมื้อค่ำสุดโรแมนติกสำหรับ 2 ท่าน พร้อมสปาร์กลิงไวน์ 2 แก้ว และเค้กฉลองโอกาสพิเศษ', 2800.00, '/images/steak.jpg', TRUE, 'Chef Signature', 60, 1200, 'Dairy, Gluten', 'Prosecco Sparkling Wine'),

-- Luxury Desserts & Bakery (Cat 7)
(7, 'Chocolate Lava Cake with Vanilla Ice Cream', 'เค้กช็อกโกแลตลาวาอุ่นๆ อะเวียร์เข้มข้น 70% เสิร์ฟคู่ไอศกรีมวานิลลาแท้และเบอร์รีสด', 290.00, '/images/dessert.jpg', TRUE, 'Gluten-Free', 10, 480, 'Dairy, Eggs', 'Moscato d’Asti'),
(7, 'Classic French Vanilla Crème Brûlée', 'เครมบรูเล่เนื้อเนียนนุ่ม หอมกลิ่นฝักวานิลลาแท้จากมาดากัสการ์ หน้าตรึงน้ำตาลไหม้กรอบ', 240.00, '/images/dessert.jpg', FALSE, 'Gluten-Free', 8, 350, 'Dairy, Eggs', 'Dessert Wine Sauternes'),
(7, 'Artisan Matcha Green Tea Tiramisu', 'ทิรามิสุชาเขียวมัทฉะอุจิแท้จากเกียวโต สลับชั้นมาสคาร์โปเนชีสนุ่มฟู', 270.00, '/images/dessert.jpg', FALSE, 'Vegetarian', 8, 390, 'Dairy, Gluten', 'Japanese Green Tea Latte'),

-- Sommelier Wines & Drinks (Cat 8)
(8, 'Signature Berry Mocktail', 'ม็อกเทลเบอร์รีรวมมิกซ์สปาร์กลิงโซดา น้ำมะนาวสด และใบมิ้นท์คลายร้อน', 180.00, '/images/dessert.jpg', FALSE, 'Halal', 5, 120, 'None', 'Non-Alcoholic Refresher'),
(8, 'Bordeaux Grand Cru Red Wine (Glass)', 'ไวน์แดงคลาสสิกระดับโบร์โด รสสัมผัสเข้มข้น หอมกลิ่นผลไม้และถังไม้โอ๊ค', 450.00, '/images/dessert.jpg', TRUE, 'Chef Signature', 3, 140, 'Sulfites', 'Perfect with Prime Steaks'),
(8, 'Moët & Chandon Imperial Champagne (Bottle)', 'แชมเปญฝรั่งเศสระดับพรีเมียม สดชื่น เหมาะกับการฉลองมื้อพิเศษ', 420.00, '/images/dessert.jpg', FALSE, 'Chef Signature', 3, 490, 'Sulfites', 'Pairs with Seafood & Oysters');

-- 4. Restaurant Tables (16 Tables in 5 Zones)
INSERT INTO restaurant_tables (table_number, zone, capacity, pos_x, pos_y, status) VALUES
-- Zone 1: Indoor Main Dining
('T-01', 'Indoor Main Dining', 2, 1, 1, 'available'),
('T-02', 'Indoor Main Dining', 4, 1, 2, 'reserved'),
('T-03', 'Indoor Main Dining', 6, 1, 3, 'available'),
('T-04', 'Indoor Main Dining', 4, 1, 4, 'available'),

-- Zone 2: Garden Glasshouse Terrace
('G-01', 'Garden Glasshouse Terrace', 4, 2, 1, 'available'),
('G-02', 'Garden Glasshouse Terrace', 2, 2, 2, 'available'),
('G-03', 'Garden Glasshouse Terrace', 6, 2, 3, 'reserved'),

-- Zone 3: Chef Counter Live Kitchen
('C-01', 'Chef Counter Live Kitchen', 2, 3, 1, 'available'),
('C-02', 'Chef Counter Live Kitchen', 2, 3, 2, 'available'),
('C-03', 'Chef Counter Live Kitchen', 4, 3, 3, 'available'),

-- Zone 4: VIP Presidential Suite
('V-01', 'VIP Presidential Suite', 8, 4, 1, 'available'),
('V-02', 'VIP Presidential Suite', 10, 4, 2, 'reserved'),

-- Zone 5: Rooftop Sky Bar
('R-01', 'Rooftop Sky Bar', 2, 5, 1, 'available'),
('R-02', 'Rooftop Sky Bar', 4, 5, 2, 'available'),
('R-03', 'Rooftop Sky Bar', 4, 5, 3, 'available'),
('R-04', 'Rooftop Sky Bar', 6, 5, 4, 'available');

-- 5. Promotions
INSERT INTO promotions (code, title, discount_percent, min_spend, description, badge_color) VALUES
('LUXE2026', 'ส่วนลดพิเศษต้อนรับลูกค้าใหม่ 10%', 10, 500.00, 'รับส่วนลด 10% สำหรับมื้ออาหารและโต๊ะจองทุกประเภท', '#e5a853'),
('VIPGOLD', 'ส่วนลดบัตรสมาชิก VIP Gold 15%', 15, 1200.00, 'สิทธิพิเศษเฉพาะสมาชิก Gold ขึ้นไป รับส่วนลดมื้ออาหาร 15%', '#3b82f6'),
('MICHELIN500', 'ส่วนลดคอร์สพิเศษ Michelin Set ฿500', 20, 2500.00, 'รับส่วนลด ฿500 เมื่อจองคอร์ส Michelin Tasting Menu', '#10b981');

-- 6. Reservations
INSERT INTO reservations (booking_code, user_id, customer_name, customer_email, customer_phone, reservation_date, reservation_time, guest_count, table_id, occasion, special_request, total_amount, earned_points, payment_status, order_stage, status) VALUES
('LX-84920', 1, 'คุณสมชาย ใจดี (ลูกค้า VIP)', 'customer@email.com', '081-234-5678', CURRENT_DATE + INTERVAL '1 day', '19:00:00', 2, 1, 'Birthday Celebration 🎉', 'ขอโต๊ะติดริมกระจก ฉลองวันเกิด เตรียมเทียนวันเกิดให้ด้วยครับ', 1770.00, 177, 'paid', 'preparing', 'confirmed'),
('LX-91204', 2, 'คุณพิมลวรรณ สุขเสริฐ (Diamond VIP)', 'pimonwan@luxedining.com', '089-987-6543', CURRENT_DATE + INTERVAL '2 days', '20:00:00', 4, 11, 'Anniversary ❤️', 'ขอมุมโรแมนติก พร้อมเสิร์ฟแชมเปญแช่เย็นฉลองครบรอบ 5 ปี', 3500.00, 350, 'paid', 'confirmed', 'confirmed');

-- 7. Reservation Items
INSERT INTO reservation_items (reservation_id, item_id, quantity, unit_price, options) VALUES
(1, 1, 1, 1290.00, 'ความสุก: Medium, ท็อปปิ้ง: เพิ่มเนยทรัฟเฟิล (+80฿)'),
(1, 7, 1, 480.00, 'ระดับความเผ็ด: เผ็ดน้อย'),
(2, 15, 1, 3500.00, 'คอร์สพิเศษ 7-Course Michelin Tasting Menu สำหรับ 2 ท่าน');

-- 8. Customer Reviews (5-Star Verified Reviews)
INSERT INTO reviews (user_id, customer_name, rating, comment, dish_recommendation) VALUES
(1, 'คุณภาณุวัฒน์ ก.', 5, 'สเต๊กเนื้อริบอายซอสทรัฟเฟิลและวากิว A5 อร่อยระดับมิชลินจริงๆ ครับ บรรยากาศโซน VIP หรูหราและเป็นส่วนตัวมาก ประทับใจมากครับ', 'Prime Ribeye Steak with Truffle Butter'),
(2, 'คุณพิมลวรรณ สุขเสริฐ', 5, 'จองโต๊ะผ่านระบบ LUXE DINING สะดวกมาก ได้รับ E-Voucher บัตรคิวทันที มีการแสดงสถานะการปรุงอาหารแบบเรียลไทม์เหมือน GrabFood เลยค่ะ', '7-Course Michelin Signature Grand Tasting Menu'),
(NULL, 'Mr. David Miller (Food Critic)', 5, 'Exquisite fine dining experience in Bangkok! The truffle fettuccine was divine, scallops perfectly seared, and service was impeccable.', 'Creamy Truffle Fettuccine Pasta'),
(NULL, 'คุณณิชาภา ม.', 5, 'ชอบระบบเลือกโซนผังโต๊ะอาหารมากค่ะ ได้มุม Garden Glasshouse บรรยากาศโรแมนติก เหมาะกับการฉลองวันเกิดมากค่ะ', 'French Fine de Claire Oysters'),
(NULL, 'คุณกิตติศักดิ์ พ.', 5, 'พาสต้าเส้นสดอร่อยมาก ช็อกโกแลตลาวาเข้มข้น บรรยากาศดี ดนตรีคลาสสิกไพเราะ พนักงานดูแลใส่ใจระดับ 5 ดาว', 'Chocolate Lava Cake with Vanilla Ice Cream');
