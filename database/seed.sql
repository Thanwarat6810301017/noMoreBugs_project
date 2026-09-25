-- ============================================================
-- LUXE DINING ULTIMATE SEED DATA
-- ============================================================

INSERT INTO users (name, email, password, phone, role, reward_points) VALUES
('คุณสมชาย ใจดี (ลูกค้า)', 'customer@email.com', 'password123', '081-234-5678', 'customer', 250),
('พนักงานแก้ไขข้อมูล (Staff Editor)', 'staff@luxedining.com', 'admin123', '02-123-4567', 'staff', 0),
('ผู้บริหารระบบ (Admin)', 'admin@luxedining.com', 'admin123', '02-999-9999', 'admin', 0);

INSERT INTO categories (name, description, icon_name) VALUES
('Appetizers', 'อาหารทานเล่นเรียกน้ำย่อย คัดสรรวัตถุดิบชั้นเลิศ', 'Salad'),
('Main Course', 'จานหลักรสเลิศจากเชฟระดับพรีเมียม', 'Beef'),
('Desserts', 'ของหวานโฮมเมดและเบเกอรี่เนื้อนุ่ม', 'Cake'),
('Beverages', 'เครื่องดื่ม สมูทตี้ และไวน์ชั้นดี', 'Wine');

INSERT INTO menu_items (category_id, name, description, price, image_url, is_popular, dietary_tag, prep_time_mins) VALUES
(2, 'Prime Ribeye Steak with Truffle Butter', 'สเต๊กเนื้อริบอายเกรดพรีเมียม เสิร์ฟพร้อมเนยทรัฟเฟิลและผักย่าง', 1290.00, '/images/steak.jpg', TRUE, 'Chef Signature', 25),
(2, 'Creamy Truffle Fettuccine Pasta', 'พาสต้าเฟตตูชินีซอสทรัฟเฟิลเข้มข้น ท็อปด้วยพาร์เมซานชีส', 480.00, '/images/pasta.jpg', TRUE, 'Vegetarian', 15),
(1, 'Premium Salmon Sushi Platter', 'แซลมอนซูชิและซาชิมิสดส่งตรงจากนอร์เวย์ 8 ชิ้น', 650.00, '/images/sushi.jpg', TRUE, 'Halal', 12),
(3, 'Chocolate Lava Cake with Vanilla Ice Cream', 'เค้กช็อกโกแลตลาวาอุ่นๆ เสิร์ฟคู่ไอศกรีมวานิลลาและเบอร์รีสด', 290.00, '/images/dessert.jpg', TRUE, 'Gluten-Free', 10),
(1, 'Caesar Salad with Crispy Bacon', 'สลัดซีซาร์ผักคอสสดใหม่ เบคอนกรอบ และกรุบกรอบกูร์ตอง', 260.00, '/images/steak.jpg', FALSE, 'Vegetarian', 10),
(4, 'Signature Berry Mocktail', 'ม็อกเทลเบอร์รีรวมผสมโซดา สดชื่นคลายร้อน', 180.00, '/images/dessert.jpg', FALSE, 'Halal', 5);

INSERT INTO restaurant_tables (table_number, zone, capacity, pos_x, pos_y, status) VALUES
('T-01', 'Indoor Main', 2, 1, 1, 'available'),
('T-02', 'Indoor Main', 4, 1, 2, 'reserved'),
('T-03', 'Indoor Main', 6, 1, 3, 'available'),
('G-01', 'Garden Terrace', 4, 2, 1, 'available'),
('G-02', 'Garden Terrace', 2, 2, 2, 'available'),
('G-03', 'Garden Terrace', 6, 2, 3, 'available'),
('V-01', 'VIP Lounge', 8, 3, 1, 'available'),
('V-02', 'VIP Lounge', 10, 3, 2, 'reserved');

INSERT INTO reservations (booking_code, user_id, customer_name, customer_email, customer_phone, reservation_date, reservation_time, guest_count, table_id, occasion, special_request, total_amount, earned_points, payment_status, order_stage, status) VALUES
('LX-84920', 1, 'คุณสมชาย ใจดี (ลูกค้า)', 'customer@email.com', '081-234-5678', CURRENT_DATE + INTERVAL '1 day', '19:00:00', 2, 1, 'Birthday Celebration 🎉', 'ขอโต๊ะติดริมกระจก ฉลองวันเกิด', 1770.00, 177, 'paid', 'preparing', 'confirmed');

INSERT INTO reservation_items (reservation_id, item_id, quantity, unit_price, options) VALUES
(1, 1, 1, 1290.00, 'ความสุก: Medium, ท็อปปิ้ง: เพิ่มเนยทรัฟเฟิล (+80฿)'),
(1, 2, 1, 480.00, 'ระดับความเผ็ด: เผ็ดน้อย');

-- 5-Star Customer Reviews
INSERT INTO reviews (customer_name, rating, comment) VALUES
('คุณภาณุวัฒน์ ก.', 5, 'สเต๊กเนื้อริบอายซอสทรัฟเฟิลอร่อยระดับมิชลินจริงๆ ครับ บรรยากาศโซน VIP หรูหราและเป็นส่วนตัวมาก ประทับใจมากครับ'),
('คุณณิชชา ว.', 5, 'จองโต๊ะผ่านระบบสะดวกมาก ได้รับ E-Voucher บัตรคิวทันที มีการแสดงสถานะการปรุงอาหารแบบเรียลไทม์เหมือน GrabFood เลยค่ะ'),
('คุณเดวิด เอส.', 5, 'Exquisite fine dining experience! The truffle fettuccine was divine. Highly recommend for romantic anniversary date night.');
