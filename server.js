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

// Mock memory fallback data
let mockCategories = [
  { category_id: 1, name: 'Appetizers', description: 'อาหารทานเล่นเรียกน้ำย่อย คัดสรรวัตถุดิบชั้นเลิศ', icon_name: 'Salad' },
  { category_id: 2, name: 'Main Course', description: 'จานหลักรสเลิศจากเชฟระดับพรีเมียม', icon_name: 'Beef' },
  { category_id: 3, name: 'Desserts', description: 'ของหวานโฮมเมดและเบเกอรี่เนื้อนุ่ม', icon_name: 'Cake' },
  { category_id: 4, name: 'Beverages', description: 'เครื่องดื่ม สมูทตี้ และไวน์ชั้นดี', icon_name: 'Wine' }
];

let mockMenuItems = [
  { item_id: 1, category_id: 2, name: 'Prime Ribeye Steak with Truffle Butter', description: 'สเต๊กเนื้อริบอายเกรดพรีเมียม เสิร์ฟพร้อมเนยทรัฟเฟิลและผักย่าง', price: 1290.00, image_url: '/images/steak.jpg', is_popular: true, prep_time_mins: 25 },
  { item_id: 2, category_id: 2, name: 'Creamy Truffle Fettuccine Pasta', description: 'พาสต้าเฟตตูชินีซอสทรัฟเฟิลเข้มข้น ท็อปด้วยพาร์เมซานชีส', price: 480.00, image_url: '/images/pasta.jpg', is_popular: true, prep_time_mins: 15 },
  { item_id: 3, category_id: 1, name: 'Premium Salmon Sushi Platter', description: 'แซลมอนซูชิและซาชิมิสดส่งตรงจากนอร์เวย์ 8 ชิ้น', price: 650.00, image_url: '/images/sushi.jpg', is_popular: true, prep_time_mins: 12 },
  { item_id: 4, category_id: 3, name: 'Chocolate Lava Cake with Vanilla Ice Cream', description: 'เค้กช็อกโกแลตลาวาอุ่นๆ เสิร์ฟคู่ไอศกรีมวานิลลาและเบอร์รีสด', price: 290.00, image_url: '/images/dessert.jpg', is_popular: true, prep_time_mins: 10 },
  { item_id: 5, category_id: 1, name: 'Caesar Salad with Crispy Bacon', description: 'สลัดซีซาร์ผักคอสสดใหม่ เบคอนกรอบ และกรุบกรอบกูร์ตอง', price: 260.00, image_url: '/images/steak.jpg', is_popular: false, prep_time_mins: 10 },
  { item_id: 6, category_id: 4, name: 'Signature Berry Mocktail', description: 'ม็อกเทลเบอร์รีรวมผสมโซดา สดชื่นคลายร้อน', price: 180.00, image_url: '/images/dessert.jpg', is_popular: false, prep_time_mins: 5 }
];

let mockTables = [
  { table_id: 1, table_number: 'T-01', zone: 'Indoor Main', capacity: 2, status: 'available', pos_x: 1, pos_y: 1 },
  { table_id: 2, table_number: 'T-02', zone: 'Indoor Main', capacity: 4, status: 'reserved', pos_x: 1, pos_y: 2 },
  { table_id: 3, table_number: 'T-03', zone: 'Indoor Main', capacity: 6, status: 'available', pos_x: 1, pos_y: 3 },
  { table_id: 4, table_number: 'G-01', zone: 'Garden Terrace', capacity: 4, status: 'available', pos_x: 2, pos_y: 1 },
  { table_id: 5, table_number: 'G-02', zone: 'Garden Terrace', capacity: 2, status: 'available', pos_x: 2, pos_y: 2 },
  { table_id: 6, table_number: 'G-03', zone: 'Garden Terrace', capacity: 6, status: 'available', pos_x: 2, pos_y: 3 },
  { table_id: 7, table_number: 'V-01', zone: 'VIP Lounge', capacity: 8, status: 'available', pos_x: 3, pos_y: 1 },
  { table_id: 8, table_number: 'V-02', zone: 'VIP Lounge', capacity: 10, status: 'reserved', pos_x: 3, pos_y: 2 }
];

let mockReservations = [
  {
    reservation_id: 1,
    booking_code: 'LX-84920',
    customer_name: 'คุณสมชาย ใจดี',
    customer_email: 'somchai@email.com',
    customer_phone: '081-234-5678',
    reservation_date: '2026-09-26',
    reservation_time: '19:00',
    guest_count: 2,
    table_id: 1,
    table_number: 'T-01',
    zone: 'Indoor Main',
    special_request: 'ขอโต๊ะติดริมกระจก ฉลองวันเกิด',
    total_amount: 1770.00,
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

// Test Database Connection
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

// Admin Analytics Endpoint
app.get('/api/admin/stats', async (req, res) => {
  let totalRevenue = 0;
  let totalBookings = 0;
  let reservedCount = 0;

  if (isDbConnected) {
    try {
      const revRes = await pool.query("SELECT SUM(total_amount) as revenue, COUNT(*) as count FROM reservations WHERE status != 'cancelled'");
      const tblRes = await pool.query("SELECT COUNT(*) as total, SUM(CASE WHEN status = 'reserved' THEN 1 ELSE 0 END) as reserved FROM restaurant_tables");
      
      totalRevenue = parseFloat(revRes.rows[0].revenue || 0);
      totalBookings = parseInt(revRes.rows[0].count || 0);
      reservedCount = parseInt(tblRes.rows[0].reserved || 0);
      const totalTables = parseInt(tblRes.rows[0].total || 1);

      return res.json({
        totalRevenue,
        totalBookings,
        tableOccupancyRate: Math.round((reservedCount / totalTables) * 100),
        popularDish: 'Prime Ribeye Steak'
      });
    } catch (err) {
      console.error(err);
    }
  }

  totalRevenue = mockReservations.reduce((sum, r) => sum + (r.status !== 'cancelled' ? r.total_amount : 0), 0);
  totalBookings = mockReservations.length;
  reservedCount = mockTables.filter(t => t.status === 'reserved').length;

  res.json({
    totalRevenue,
    totalBookings,
    tableOccupancyRate: Math.round((reservedCount / mockTables.length) * 100),
    popularDish: 'Prime Ribeye Steak'
  });
});

// 1. Get Categories
app.get('/api/categories', async (req, res) => {
  if (isDbConnected) {
    try {
      const result = await pool.query('SELECT * FROM categories ORDER BY category_id');
      return res.json(result.rows);
    } catch (err) {
      console.error(err);
    }
  }
  res.json(mockCategories);
});

// 2. Get Menu Items
app.get('/api/menu', async (req, res) => {
  const categoryId = req.query.category_id;
  if (isDbConnected) {
    try {
      let query = 'SELECT m.*, c.name as category_name FROM menu_items m LEFT JOIN categories c ON m.category_id = c.category_id WHERE m.is_available = true';
      let params = [];
      if (categoryId) {
        query += ' AND m.category_id = $1';
        params.push(categoryId);
      }
      query += ' ORDER BY m.item_id';
      const result = await pool.query(query, params);
      return res.json(result.rows);
    } catch (err) {
      console.error(err);
    }
  }
  
  let items = mockMenuItems;
  if (categoryId) {
    items = items.filter(item => item.category_id === parseInt(categoryId));
  }
  res.json(items);
});

// 3. Get Tables for Floor Map
app.get('/api/tables', async (req, res) => {
  if (isDbConnected) {
    try {
      const result = await pool.query('SELECT * FROM restaurant_tables ORDER BY zone, table_number');
      return res.json(result.rows);
    } catch (err) {
      console.error(err);
    }
  }
  res.json(mockTables);
});

// 4. Get All Reservations (Admin)
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
    } catch (err) {
      console.error(err);
    }
  }
  res.json(mockReservations);
});

// 5. Create New Reservation & PromptPay Payment
app.post('/api/reservations', async (req, res) => {
  const { customer_name, customer_email, customer_phone, reservation_date, reservation_time, guest_count, table_id, special_request, items, discount_amount } = req.body;
  
  let total_amount = 0;
  if (items && Array.isArray(items)) {
    total_amount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }
  if (discount_amount) {
    total_amount = Math.max(0, total_amount - discount_amount);
  }

  const booking_code = 'LX-' + Math.floor(10000 + Math.random() * 90000);

  if (isDbConnected) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const resResult = await client.query(
        `INSERT INTO reservations 
        (booking_code, customer_name, customer_email, customer_phone, reservation_date, reservation_time, guest_count, table_id, special_request, total_amount, payment_status, status) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'paid', 'confirmed') 
        RETURNING *`,
        [booking_code, customer_name, customer_email, customer_phone, reservation_date, reservation_time, guest_count, table_id || null, special_request || '', total_amount]
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

      // Mark table as reserved
      if (table_id) {
        await client.query("UPDATE restaurant_tables SET status = 'reserved' WHERE table_id = $1", [table_id]);
      }

      await client.query('COMMIT');
      client.release();
      return res.status(201).json({ success: true, reservation: newRes });
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

  const newReservation = {
    reservation_id: mockReservations.length + 1,
    booking_code,
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
    payment_status: 'paid',
    payment_method: 'PromptPay QR',
    status: 'confirmed',
    created_at: new Date().toISOString(),
    items: items || []
  };

  mockReservations.unshift(newReservation);
  res.status(201).json({ success: true, reservation: newReservation });
});

// 6. Update Reservation Status
app.patch('/api/reservations/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (isDbConnected) {
    try {
      const result = await pool.query('UPDATE reservations SET status = $1 WHERE reservation_id = $2 RETURNING *', [status, id]);
      return res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
    }
  }

  const resIndex = mockReservations.findIndex(r => r.reservation_id === parseInt(id));
  if (resIndex !== -1) {
    mockReservations[resIndex].status = status;
    return res.json(mockReservations[resIndex]);
  }
  res.status(404).json({ error: 'Reservation not found' });
});

// SPA Fallback middleware
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 LUXE DINING Ultra Pro Production Server running on http://0.0.0.0:${PORT}`);
});
