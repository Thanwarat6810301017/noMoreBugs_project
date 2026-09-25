import express from 'express';
import cors from 'cors';
import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve Production Frontend Static Build
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// PostgreSQL Pool Connection Configuration
const dbConfig = {
  user: process.env.PGUSER || 'postgres',
  host: process.env.PGHOST || 'localhost',
  database: process.env.PGDATABASE || 'food_booking_db',
  password: process.env.PGPASSWORD || 'postgres',
  port: process.env.PGPORT || 5432,
  connectionTimeoutMillis: 2000,
};

const pool = new Pool(dbConfig);

let isDbConnected = false;

// Mock Memory Users & Data v2.0
let mockUsers = [
  { user_id: 1, name: 'คุณสมชาย ใจดี (ลูกค้า VIP)', email: 'customer@email.com', password: 'password123', phone: '081-234-5678', role: 'customer', reward_points: 450, membership_tier: 'Gold Membership', avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
  { user_id: 2, name: 'คุณพิมลวรรณ สุขเสริฐ (Diamond VIP)', email: 'pimonwan@luxedining.com', password: 'password123', phone: '089-987-6543', role: 'customer', reward_points: 1850, membership_tier: 'Diamond VIP', avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80' },
  { user_id: 3, name: 'พนักงานแก้ไขข้อมูล (Staff Editor)', email: 'staff@luxedining.com', password: 'admin123', phone: '02-123-4567', role: 'staff', reward_points: 0, membership_tier: 'Staff Executive', avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
  { user_id: 4, name: 'ผู้บริหารระบบ (Admin)', email: 'admin@luxedining.com', password: 'admin123', phone: '02-999-9999', role: 'admin', reward_points: 0, membership_tier: 'Admin Director', avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' }
];

let mockCategories = [
  { category_id: 1, name: 'Appetizers & Starters', description: 'อาหารทานเล่นเรียกน้ำย่อย คัดสรรวัตถุดิบนำเข้าชั้นเลิศ', icon_name: 'Salad' },
  { category_id: 2, name: 'Soups & Fresh Salads', description: 'ซุปอุ่นกรุ่นกลิ่นทรัฟเฟิลและสลัดผักออร์แกนิก', icon_name: 'Soup' },
  { category_id: 3, name: 'Prime Steaks & Grills', description: 'สเต๊กเนื้อวากิวและริบอายเกรดพรีเมียมบ่มแบบ Dry-Aged', icon_name: 'Beef' },
  { category_id: 4, name: 'Seafood & Raw Bar', description: 'ซูชิ ซาชิมิ แซลมอนนอร์เวย์ และหอยนางรมสดจากฝรั่งเศส', icon_name: 'Fish' },
  { category_id: 5, name: 'Artisanal Pasta & Risotto', description: 'พาสต้าเส้นสดและรีซอตโต้สูตรต้นตำรับอิตาลี', icon_name: 'Utensils' },
  { category_id: 6, name: 'Michelin Tasting Sets', description: 'เซ็ตมื้ออาหารพิเศษ 7-Course โดยเชฟมิชลินสตาร์', icon_name: 'Sparkles' },
  { category_id: 7, name: 'Luxury Desserts & Bakery', description: 'ของหวานฝรั่งเศส ไอศกรีมโฮมเมด และเบเกอรี่สดใหม่', icon_name: 'Cake' },
  { category_id: 8, name: 'Sommelier Wines & Drinks', description: 'ไวน์นำเข้า ม็อกเทลพรีเมียม และกาแฟคั่วบดพิเศษ', icon_name: 'Wine' }
];

let mockMenuItems = [
  // Steaks (Cat 3)
  { item_id: 1, category_id: 3, name: 'Prime Ribeye Steak with Truffle Butter', description: 'สเต๊กเนื้อริบอายวากิว A5 บ่ม 45 วัน เสิร์ฟพร้อมเนยทรัฟเฟิลสีทองและเกลือหิมาลายัน', price: 1290.00, image_url: '/images/steak.jpg', is_popular: true, prep_time_mins: 25, is_available: true, dietary_tag: 'Chef Signature', calories: 780, allergens: 'Dairy', wine_pairing: '2019 Bordeaux Cabernet Sauvignon' },
  { item_id: 2, category_id: 3, name: 'A5 Wagyu Striploin Melt-in-Mouth', description: 'เนื้อวากิว A5 นำเข้าจากคาโกชิมะ ย่างเตาถ่านไม้ชาโคล ลายไขมันแทรกละเอียด', price: 1890.00, image_url: '/images/steak.jpg', is_popular: true, prep_time_mins: 20, is_available: true, dietary_tag: 'Chef Signature', calories: 850, allergens: 'None', wine_pairing: '2018 Shiraz Barossa Valley' },
  { item_id: 3, category_id: 3, name: 'Grilled Australian Lamb Chops', description: 'ซี่โครงแกะออสเตรเลียย่างสมุนไพรโรสแมรี่ เสิร์ฟคู่ซอสมิ้นท์การ์เดน', price: 1150.00, image_url: '/images/steak.jpg', is_popular: false, prep_time_mins: 22, is_available: true, dietary_tag: 'Gluten-Free', calories: 690, allergens: 'None', wine_pairing: '2020 Pinot Noir Oregon' },

  // Seafood (Cat 4)
  { item_id: 4, category_id: 4, name: 'Premium Salmon Sushi Platter', description: 'แซลมอนซูชิและซาชิมิเกรดพรีเมียมส่งตรงจากนอร์เวย์ 8 ชิ้น พร้อมไข่ปลาแซลมอน', price: 650.00, image_url: '/images/sushi.jpg', is_popular: true, prep_time_mins: 12, is_available: true, dietary_tag: 'Gluten-Free', calories: 420, allergens: 'Fish, Soy', wine_pairing: 'Chardonnay Reserve 2021' },
  { item_id: 5, category_id: 4, name: 'French Fine de Claire Oysters (6 pcs)', description: 'หอยนางรมสดฟินเดอแคลร์ นำเข้าจากฝรั่งเศส เสิร์ฟพร้อมซอสเรดไวน์มิโญเนตต์', price: 890.00, image_url: '/images/sushi.jpg', is_popular: true, prep_time_mins: 10, is_available: true, dietary_tag: 'Chef Signature', calories: 180, allergens: 'Shellfish', wine_pairing: 'Champagne Dom Pérignon Vintage' },
  { item_id: 6, category_id: 4, name: 'Pan-Seared Snow Fish Seabass', description: 'ปลาหิมะย่างกระทะหนังกรอบ เสิร์ฟพร้อมซอสบัตเตอร์เลมอนและหน่อไม้ฝรั่ง', price: 980.00, image_url: '/images/steak.jpg', is_popular: false, prep_time_mins: 18, is_available: true, dietary_tag: 'Gluten-Free', calories: 510, allergens: 'Dairy, Fish', wine_pairing: 'Sauvignon Blanc Marlborough' },

  // Pasta (Cat 5)
  { item_id: 7, category_id: 5, name: 'Creamy Truffle Fettuccine Pasta', description: 'พาสต้าเฟตตูชินีเส้นสดซอสเห็ดทรัฟเฟิลเข้มข้น ท็อปด้วยพาร์เมซานชีสและทรัฟเฟิลสไลซ์', price: 480.00, image_url: '/images/pasta.jpg', is_popular: true, prep_time_mins: 15, is_available: true, dietary_tag: 'Vegetarian', calories: 620, allergens: 'Dairy, Gluten', wine_pairing: 'Pinot Grigio D.O.C.' },
  { item_id: 8, category_id: 5, name: 'Lobster Tail Black Ink Spaghetti', description: 'สปาเกตตีหมึกดำผัดซอสมะเขือเทศเชอร์รีสไตล์อิตาเลียน เสิร์ฟพร้อมกุ้งมังกรลอบสเตอร์', price: 950.00, image_url: '/images/pasta.jpg', is_popular: true, prep_time_mins: 20, is_available: true, dietary_tag: 'Chef Signature', calories: 580, allergens: 'Shellfish, Gluten', wine_pairing: 'Chablis Premier Cru' },

  // Appetizers (Cat 1)
  { item_id: 9, category_id: 1, name: 'Caesar Salad with Crispy Bacon', description: 'สลัดซีซาร์ผักคอสสดใหม่ เบคอนกรอบ ไข่ต้มยางมะตูม และกรุบกรอบกูร์ตอง', price: 260.00, image_url: '/images/steak.jpg', is_popular: false, prep_time_mins: 10, is_available: true, dietary_tag: 'Vegetarian', calories: 310, allergens: 'Dairy, Eggs', wine_pairing: 'Prosecco Superiore' },
  { item_id: 10, category_id: 1, name: 'Seared Hokkaido Scallops', description: 'หอยเชลล์ฮอกไกโดตัวโตย่างเนย เสิร์ฟบนพูเรถั่วลันเตาหวาน', price: 520.00, image_url: '/images/sushi.jpg', is_popular: true, prep_time_mins: 12, is_available: true, dietary_tag: 'Gluten-Free', calories: 290, allergens: 'Shellfish, Dairy', wine_pairing: 'Sauvignon Blanc' },

  // Michelin Tasting Set (Cat 6)
  { item_id: 11, category_id: 6, name: '7-Course Michelin Signature Grand Tasting Menu', description: 'คอร์สอาหารสุดพิเศษ 7 จาน รังสรรค์โดยเชฟมิชลินสตาร์ รวมซิกเนเจอร์สเต๊ก ลอบสเตอร์ และทรัฟเฟิล', price: 3500.00, image_url: '/images/steak.jpg', is_popular: true, prep_time_mins: 90, is_available: true, dietary_tag: 'Chef Signature', calories: 1450, allergens: 'Dairy, Shellfish, Gluten', wine_pairing: 'Sommelier Premium Wine Pairing (+1200฿)' },
  
  // Desserts (Cat 7)
  { item_id: 12, category_id: 7, name: 'Chocolate Lava Cake with Vanilla Ice Cream', description: 'เค้กช็อกโกแลตลาวาอุ่นๆ อะเวียร์เข้มข้น 70% เสิร์ฟคู่ไอศกรีมวานิลลาแท้และเบอร์รีสด', price: 290.00, image_url: '/images/dessert.jpg', is_popular: true, prep_time_mins: 10, is_available: true, dietary_tag: 'Gluten-Free', calories: 480, allergens: 'Dairy, Eggs', wine_pairing: 'Moscato d’Asti' },

  // Drinks (Cat 8)
  { item_id: 13, category_id: 8, name: 'Signature Berry Mocktail', description: 'ม็อกเทลเบอร์รีรวมมิกซ์สปาร์กลิงโซดา น้ำมะนาวสด และใบมิ้นท์คลายร้อน', price: 180.00, image_url: '/images/dessert.jpg', is_popular: false, prep_time_mins: 5, is_available: true, dietary_tag: 'Halal', calories: 120, allergens: 'None', wine_pairing: 'Non-Alcoholic Refresher' },
  { item_id: 14, category_id: 8, name: 'Bordeaux Grand Cru Red Wine (Glass)', description: 'ไวน์แดงคลาสสิกระดับโบร์โด รสสัมผัสเข้มข้น หอมกลิ่นผลไม้และถังไม้โอ๊ค', price: 450.00, image_url: '/images/dessert.jpg', is_popular: true, prep_time_mins: 3, is_available: true, dietary_tag: 'Chef Signature', calories: 140, allergens: 'Sulfites', wine_pairing: 'Perfect with Prime Steaks' }
];

let mockReviews = [
  { review_id: 1, customer_name: 'คุณภาณุวัฒน์ ก.', rating: 5, comment: 'สเต๊กเนื้อริบอายซอสทรัฟเฟิลและวากิว A5 อร่อยระดับมิชลินจริงๆ ครับ บรรยากาศโซน VIP หรูหราและเป็นส่วนตัวมาก ประทับใจมากครับ', dish_recommendation: 'Prime Ribeye Steak with Truffle Butter' },
  { review_id: 2, customer_name: 'คุณพิมลวรรณ สุขเสริฐ', rating: 5, comment: 'จองโต๊ะผ่านระบบ LUXE DINING สะดวกมาก ได้รับ E-Voucher บัตรคิวทันที มีการแสดงสถานะการปรุงอาหารแบบเรียลไทม์เหมือน GrabFood เลยค่ะ', dish_recommendation: '7-Course Michelin Signature Grand Tasting Menu' },
  { review_id: 3, customer_name: 'Mr. David Miller (Food Critic)', rating: 5, comment: 'Exquisite fine dining experience in Bangkok! The truffle fettuccine was divine, scallops perfectly seared, and service was impeccable.', dish_recommendation: 'Creamy Truffle Fettuccine Pasta' },
  { review_id: 4, customer_name: 'คุณณิชาภา ม.', rating: 5, comment: 'ชอบระบบเลือกโซนผังโต๊ะอาหารมากค่ะ ได้มุม Garden Glasshouse บรรยากาศโรแมนติก เหมาะกับการฉลองวันเกิดมากค่ะ', dish_recommendation: 'French Fine de Claire Oysters' }
];

let mockPromotions = [
  { promo_id: 1, code: 'LUXE2026', title: 'ส่วนลดต้อนรับ 10%', discount_percent: 10, min_spend: 500, description: 'รับส่วนลด 10% สำหรับมื้ออาหารและโต๊ะจองทุกประเภท', badge_color: '#e5a853' },
  { promo_id: 2, code: 'VIPGOLD', title: 'ส่วนลดสมาชิก VIP Gold 15%', discount_percent: 15, min_spend: 1200, description: 'สิทธิพิเศษเฉพาะสมาชิก Gold ขึ้นไป รับส่วนลด 15%', badge_color: '#3b82f6' },
  { promo_id: 3, code: 'MICHELIN500', title: 'ส่วนลด Michelin Set ฿500', discount_percent: 20, min_spend: 2500, description: 'รับส่วนลด ฿500 เมื่อจองคอร์ส Michelin Tasting Menu', badge_color: '#10b981' }
];

let mockTables = [
  // Zone 1: Indoor Main Dining
  { table_id: 1, table_number: 'T-01', zone: 'Indoor Main Dining', capacity: 2, status: 'available', pos_x: 1, pos_y: 1 },
  { table_id: 2, table_number: 'T-02', zone: 'Indoor Main Dining', capacity: 4, status: 'reserved', pos_x: 1, pos_y: 2 },
  { table_id: 3, table_number: 'T-03', zone: 'Indoor Main Dining', capacity: 6, status: 'available', pos_x: 1, pos_y: 3 },
  { table_id: 4, table_number: 'T-04', zone: 'Indoor Main Dining', capacity: 4, status: 'available', pos_x: 1, pos_y: 4 },

  // Zone 2: Garden Glasshouse Terrace
  { table_id: 5, table_number: 'G-01', zone: 'Garden Glasshouse Terrace', capacity: 4, status: 'available', pos_x: 2, pos_y: 1 },
  { table_id: 6, table_number: 'G-02', zone: 'Garden Glasshouse Terrace', capacity: 2, status: 'available', pos_x: 2, pos_y: 2 },
  { table_id: 7, table_number: 'G-03', zone: 'Garden Glasshouse Terrace', capacity: 6, status: 'reserved', pos_x: 2, pos_y: 3 },

  // Zone 3: Chef Counter Live Kitchen
  { table_id: 8, table_number: 'C-01', zone: 'Chef Counter Live Kitchen', capacity: 2, status: 'available', pos_x: 3, pos_y: 1 },
  { table_id: 9, table_number: 'C-02', zone: 'Chef Counter Live Kitchen', capacity: 2, status: 'available', pos_x: 3, pos_y: 2 },

  // Zone 4: VIP Presidential Suite
  { table_id: 10, table_number: 'V-01', zone: 'VIP Presidential Suite', capacity: 8, status: 'available', pos_x: 4, pos_y: 1 },
  { table_id: 11, table_number: 'V-02', zone: 'VIP Presidential Suite', capacity: 10, status: 'reserved', pos_x: 4, pos_y: 2 },

  // Zone 5: Rooftop Sky Bar
  { table_id: 12, table_number: 'R-01', zone: 'Rooftop Sky Bar', capacity: 2, status: 'available', pos_x: 5, pos_y: 1 },
  { table_id: 13, table_number: 'R-02', zone: 'Rooftop Sky Bar', capacity: 4, status: 'available', pos_x: 5, pos_y: 2 }
];

let mockReservations = [
  {
    reservation_id: 1,
    booking_code: 'LX-84920',
    user_id: 1,
    customer_name: 'คุณสมชาย ใจดี (ลูกค้า)',
    customer_email: 'customer@email.com',
    customer_phone: '081-234-5678',
    reservation_date: '2026-09-26',
    reservation_time: '19:00',
    guest_count: 2,
    table_id: 1,
    table_number: 'T-01',
    zone: 'Indoor Main',
    special_request: 'ขอโต๊ะติดริมกระจก ฉลองวันเกิด',
    total_amount: 1770.00,
    earned_points: 177,
    payment_status: 'paid',
    payment_method: 'PromptPay QR',
    status: 'confirmed',
    created_at: new Date().toISOString(),
    items: [
      { name: 'Prime Ribeye Steak with Truffle Butter', quantity: 1, unit_price: 1290.00 },
      { name: 'Creamy Truffle Fettuccine Pasta', quantity: 1, unit_price: 480.00 }
    ]
  }
];

// Test DB Connection
async function checkDbConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ PostgreSQL Database connected successfully!');
    isDbConnected = true;
    client.release();
  } catch (err) {
    console.log('⚠️ PostgreSQL DB connection unavailable, running with In-Memory Database Fallback mode.');
    isDbConnected = false;
  }
}

checkDbConnection();

// Status Endpoint
app.get('/api/db-status', async (req, res) => {
  res.json({
    connected: isDbConnected,
    database: dbConfig.database,
    host: dbConfig.host,
    port: dbConfig.port,
    message: isDbConnected ? 'Connected to PostgreSQL' : 'Running on Fallback Mode (Memory)'
  });
});

// AUTHENTICATION ENDPOINTS
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (isDbConnected) {
    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);
      if (result.rows.length > 0) {
        return res.json({ success: true, user: result.rows[0] });
      }
      return res.status(401).json({ success: false, error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    } catch (err) { console.error(err); }
  }

  const user = mockUsers.find(u => u.email === email && u.password === password);
  if (user) {
    return res.json({ success: true, user });
  }
  res.status(401).json({ success: false, error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
});

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (isDbConnected) {
    try {
      const result = await pool.query(
        'INSERT INTO users (name, email, password, phone, role, reward_points) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [name, email, password, phone || '', 'customer', 50] // Bonus 50 points on signup
      );
      return res.json({ success: true, user: result.rows[0] });
    } catch (err) {
      return res.status(400).json({ success: false, error: 'อีเมลนี้มีอยู่ในระบบแล้ว' });
    }
  }

  const existing = mockUsers.find(u => u.email === email);
  if (existing) {
    return res.status(400).json({ success: false, error: 'อีเมลนี้มีอยู่ในระบบแล้ว' });
  }

  const newUser = {
    user_id: mockUsers.length + 1,
    name,
    email,
    password,
    phone: phone || '',
    role: 'customer',
    reward_points: 50
  };
  mockUsers.push(newUser);
  res.json({ success: true, user: newUser });
});

// MENU MANAGEMENT ENDPOINTS (STAFF / MANAGER EDITING)
app.post('/api/menu', async (req, res) => {
  const { category_id, name, description, price, image_url, is_popular } = req.body;
  if (isDbConnected) {
    try {
      const result = await pool.query(
        'INSERT INTO menu_items (category_id, name, description, price, image_url, is_popular) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [category_id || 1, name, description, price, image_url || '/images/steak.jpg', is_popular || false]
      );
      return res.status(201).json(result.rows[0]);
    } catch (err) { console.error(err); }
  }

  const newItem = {
    item_id: mockMenuItems.length + 1,
    category_id: parseInt(category_id || 1),
    name,
    description,
    price: parseFloat(price),
    image_url: image_url || '/images/steak.jpg',
    is_popular: !!is_popular,
    is_available: true
  };
  mockMenuItems.push(newItem);
  res.status(201).json(newItem);
});

app.put('/api/menu/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, price, image_url, is_popular, is_available } = req.body;

  if (isDbConnected) {
    try {
      const result = await pool.query(
        'UPDATE menu_items SET name = $1, description = $2, price = $3, image_url = $4, is_popular = $5, is_available = $6 WHERE item_id = $7 RETURNING *',
        [name, description, price, image_url, is_popular, is_available, id]
      );
      return res.json(result.rows[0]);
    } catch (err) { console.error(err); }
  }

  const itemIndex = mockMenuItems.findIndex(i => i.item_id === parseInt(id));
  if (itemIndex !== -1) {
    mockMenuItems[itemIndex] = { ...mockMenuItems[itemIndex], name, description, price: parseFloat(price), image_url, is_popular, is_available };
    return res.json(mockMenuItems[itemIndex]);
  }
  res.status(404).json({ error: 'Item not found' });
});

app.delete('/api/menu/:id', async (req, res) => {
  const { id } = req.params;
  if (isDbConnected) {
    try {
      await pool.query('DELETE FROM menu_items WHERE item_id = $1', [id]);
      return res.json({ success: true });
    } catch (err) { console.error(err); }
  }

  mockMenuItems = mockMenuItems.filter(i => i.item_id !== parseInt(id));
  res.json({ success: true });
});

// GET DATA ENDPOINTS
app.get('/api/categories', async (req, res) => {
  if (isDbConnected) {
    try {
      const result = await pool.query('SELECT * FROM categories ORDER BY category_id');
      return res.json(result.rows);
    } catch (err) { console.error(err); }
  }
  res.json(mockCategories);
});

app.get('/api/menu', async (req, res) => {
  const categoryId = req.query.category_id;
  const dietaryTag = req.query.dietary_tag;
  if (isDbConnected) {
    try {
      let query = 'SELECT m.*, c.name as category_name FROM menu_items m LEFT JOIN categories c ON m.category_id = c.category_id';
      let params = [];
      let conditions = [];
      if (categoryId) {
        params.push(categoryId);
        conditions.push(`m.category_id = $${params.length}`);
      }
      if (dietaryTag) {
        params.push(dietaryTag);
        conditions.push(`m.dietary_tag = $${params.length}`);
      }
      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }
      query += ' ORDER BY m.item_id';
      const result = await pool.query(query, params);
      return res.json(result.rows);
    } catch (err) { console.error(err); }
  }
  
  let items = mockMenuItems;
  if (categoryId) {
    items = items.filter(item => item.category_id === parseInt(categoryId));
  }
  if (dietaryTag) {
    items = items.filter(item => item.dietary_tag === dietaryTag);
  }
  res.json(items);
});

app.get('/api/reviews', async (req, res) => {
  if (isDbConnected) {
    try {
      const result = await pool.query('SELECT * FROM reviews ORDER BY created_at DESC LIMIT 10');
      return res.json(result.rows);
    } catch (err) { console.error(err); }
  }
  res.json(mockReviews);
});

app.get('/api/promotions', async (req, res) => {
  if (isDbConnected) {
    try {
      const result = await pool.query('SELECT * FROM promotions WHERE is_active = TRUE ORDER BY promo_id');
      return res.json(result.rows);
    } catch (err) { console.error(err); }
  }
  res.json(mockPromotions);
});

app.get('/api/tables', async (req, res) => {
  if (isDbConnected) {
    try {
      const result = await pool.query('SELECT * FROM restaurant_tables ORDER BY zone, table_number');
      return res.json(result.rows);
    } catch (err) { console.error(err); }
  }
  res.json(mockTables);
});

// Update Table Status (Staff Editor)
app.patch('/api/tables/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (isDbConnected) {
    try {
      const result = await pool.query('UPDATE restaurant_tables SET status = $1 WHERE table_id = $2 RETURNING *', [status, id]);
      return res.json(result.rows[0]);
    } catch (err) { console.error(err); }
  }

  const tbl = mockTables.find(t => t.table_id === parseInt(id));
  if (tbl) {
    tbl.status = status;
    return res.json(tbl);
  }
  res.status(404).json({ error: 'Table not found' });
});

app.get('/api/reservations', async (req, res) => {
  if (isDbConnected) {
    try {
      const result = await pool.query(`
        SELECT r.*, t.table_number, t.zone 
        FROM reservations r 
        LEFT JOIN restaurant_tables t ON r.table_id = t.table_id 
        ORDER BY r.created_at DESC
      `);
      return res.json(result.rows);
    } catch (err) { console.error(err); }
  }
  res.json(mockReservations);
});

// Customer History Reservations
app.get('/api/user/reservations', async (req, res) => {
  const userId = req.query.user_id;
  if (isDbConnected) {
    try {
      const result = await pool.query('SELECT r.*, t.table_number, t.zone FROM reservations r LEFT JOIN restaurant_tables t ON r.table_id = t.table_id WHERE r.user_id = $1 ORDER BY r.created_at DESC', [userId]);
      return res.json(result.rows);
    } catch (err) { console.error(err); }
  }
  const userRes = mockReservations.filter(r => r.user_id === parseInt(userId));
  res.json(userRes);
});

// CREATE RESERVATION & CALC REWARD POINTS
app.post('/api/reservations', async (req, res) => {
  const { user_id, customer_name, customer_email, customer_phone, reservation_date, reservation_time, guest_count, table_id, special_request, items, discount_amount } = req.body;
  
  let total_amount = 0;
  if (items && Array.isArray(items)) {
    total_amount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }
  if (discount_amount) {
    total_amount = Math.max(0, total_amount - discount_amount);
  }

  const earned_points = Math.floor(total_amount / 10);
  const booking_code = 'LX-' + Math.floor(10000 + Math.random() * 90000);

  if (isDbConnected) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const resResult = await client.query(
        `INSERT INTO reservations 
        (booking_code, user_id, customer_name, customer_email, customer_phone, reservation_date, reservation_time, guest_count, table_id, special_request, total_amount, earned_points, payment_status, status) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'paid', 'confirmed') 
        RETURNING *`,
        [booking_code, user_id || null, customer_name, customer_email, customer_phone, reservation_date, reservation_time, guest_count, table_id || null, special_request || '', total_amount, earned_points]
      );
      
      const newRes = resResult.rows[0];

      if (items && items.length > 0) {
        for (const item of items) {
          await client.query(
            `INSERT INTO reservation_items (reservation_id, item_id, quantity, unit_price) 
            VALUES ($1, $2, $3, $4)`,
            [newRes.reservation_id, item.item_id, item.quantity, item.price]
          );
        }
      }

      if (user_id) {
        await client.query('UPDATE users SET reward_points = reward_points + $1 WHERE user_id = $2', [earned_points, user_id]);
      }

      if (table_id) {
        await client.query("UPDATE restaurant_tables SET status = 'reserved' WHERE table_id = $1", [table_id]);
      }

      await client.query('COMMIT');
      client.release();
      return res.status(201).json({ success: true, reservation: newRes, earned_points });
    } catch (err) {
      await client.query('ROLLBACK');
      client.release();
      console.error(err);
      return res.status(500).json({ error: 'Database reservation failed' });
    }
  }

  const foundTable = mockTables.find(t => t.table_id === parseInt(table_id));
  if (foundTable) {
    foundTable.status = 'reserved';
  }

  if (user_id) {
    const usr = mockUsers.find(u => u.user_id === parseInt(user_id));
    if (usr) usr.reward_points += earned_points;
  }

  const newReservation = {
    reservation_id: mockReservations.length + 1,
    booking_code,
    user_id: user_id ? parseInt(user_id) : null,
    customer_name,
    customer_email,
    customer_phone,
    reservation_date,
    reservation_time,
    guest_count,
    table_id,
    table_number: foundTable ? foundTable.table_number : 'Unassigned',
    zone: foundTable ? foundTable.zone : 'General',
    special_request,
    total_amount,
    earned_points,
    payment_status: 'paid',
    payment_method: 'PromptPay QR',
    status: 'confirmed',
    created_at: new Date().toISOString(),
    items: items || []
  };

  mockReservations.unshift(newReservation);
  res.status(201).json({ success: true, reservation: newReservation, earned_points });
});

app.patch('/api/reservations/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (isDbConnected) {
    try {
      const result = await pool.query('UPDATE reservations SET status = $1 WHERE reservation_id = $2 RETURNING *', [status, id]);
      return res.json(result.rows[0]);
    } catch (err) { console.error(err); }
  }

  const resIndex = mockReservations.findIndex(r => r.reservation_id === parseInt(id));
  if (resIndex !== -1) {
    mockReservations[resIndex].status = status;
    return res.json(mockReservations[resIndex]);
  }
  res.status(404).json({ error: 'Reservation not found' });
});

app.get('/api/admin/stats', async (req, res) => {
  let totalRevenue = mockReservations.reduce((sum, r) => sum + (r.status !== 'cancelled' ? r.total_amount : 0), 0);
  let totalBookings = mockReservations.length;
  let reservedCount = mockTables.filter(t => t.status === 'reserved').length;

  res.json({
    totalRevenue,
    totalBookings,
    tableOccupancyRate: Math.round((reservedCount / mockTables.length) * 100),
    popularDish: 'Prime Ribeye Steak'
  });
});

// SPA Fallback
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 LUXE DINING Enterprise Server running on http://0.0.0.0:${PORT}`);
});
