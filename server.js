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
  { user_id: 1, name: 'คุณสมชาย ใจดี', email: 'customer@email.com', password: 'password123', phone: '081-234-5678', role: 'customer', reward_points: 450, membership_tier: 'Gold VIP', avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
  { user_id: 2, name: 'คุณพิมลวรรณ สุขเสริฐ', email: 'pimonwan@luxedining.com', password: 'password123', phone: '089-987-6543', role: 'customer', reward_points: 1850, membership_tier: 'Diamond VIP', avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80' },
  { user_id: 3, name: 'คุณกิตติศักดิ์ ช่างปรุง (เชฟ/พนักงาน)', email: 'staff@luxedining.com', password: 'admin123', phone: '02-123-4567', role: 'staff', reward_points: 0, membership_tier: 'Staff Executive', avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
  { user_id: 4, name: 'ผู้บริหารระบบสูงสุด (Admin)', email: 'admin@luxedining.com', password: 'admin123', phone: '02-999-9999', role: 'admin', reward_points: 0, membership_tier: 'Admin Director', avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
  { user_id: 5, name: 'คุณอานนท์ ภักดีไพศาล', email: 'arnon@gmail.com', password: 'password123', phone: '085-111-2233', role: 'customer', reward_points: 80, membership_tier: 'ลูกค้าทั่วไป (General Member)', avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80' },
  { user_id: 6, name: 'คุณมณีรัตน์ วงศ์สว่าง (พนักงานแคชเชียร์)', email: 'manirat@luxedining.com', password: 'staff123', phone: '082-333-4455', role: 'staff', reward_points: 0, membership_tier: 'Staff Executive', avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80' },
  { user_id: 7, name: 'คุณธนกร เลิศวิจิตร', email: 'thanakorn@hotmail.com', password: 'password123', phone: '086-777-8899', role: 'customer', reward_points: 320, membership_tier: 'Silver Member', avatar_url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80' }
];

let mockCategories = [
  { category_id: 1, name: '🍲 ต้ม & แกง', description: 'แกงเขียวหวาน พะแนง มัสมั่น ต้มยำ ต้มข่า แกงจืด แกงส้ม แกงไตปลา', icon_name: 'Soup' },
  { category_id: 2, name: '🔥 ผัด & ทอด', description: 'ผัดกะเพรา คั่วกลิ้ง ผัดเผ็ด ผัดผัก หมูทอดกระเทียม ไก่ผัดเม็ดมะม่วง', icon_name: 'Flame' },
  { category_id: 3, name: '🥘 นึ่ง & ตุ๋น', description: 'ไข่พะโล้ หมูตุ๋น ปลานึ่ง เนื้อตุ๋นพะโล้ อาหารนึ่งรสนุ่มลึก', icon_name: 'ChefHat' },
  { category_id: 4, name: '🌶️ เครื่องเคียง & น้ำพริก', description: 'น้ำพริกกะปิ น้ำพริกอ่อง ลาบ ผักสด ไข่เจียว เครื่องเคียงครบ', icon_name: 'Salad' }
];

let mockMenuItems = [
  {
    item_id: 1,
    category_id: 1,
    name: 'แกงเขียวหวานไก่',
    description: 'แกงเขียวหวานไก่เข้มข้นกะทิสด มะเขือเปราะ พริกชี้ฟ้า และใบโหระพาหอมกรุ่น',
    price: 60.00,
    image_url: '/images/steak.jpg',
    is_popular: true,
    prep_time_mins: 10,
    is_available: true,
    dietary_tag: 'Halal',
    is_halal: true,
    calories: 180,
    allergens: 'กะปิ/กุ้ง, น้ำปลา/ปลา',
    wine_pairing: 'None',
    stock_quantity: 25
  },
  {
    item_id: 2,
    category_id: 1,
    name: 'พะแนงหมู',
    description: 'พะแนงหมูนุ่มเคี่ยวกะทิเข้มข้น รสชาติกลมกล่อม หอมกลิ่นถั่วลิสงคั่วและใบมะกรูด',
    price: 65.00,
    image_url: '/images/steak.jpg',
    is_popular: true,
    prep_time_mins: 10,
    is_available: true,
    dietary_tag: '❌ ไม่ฮาลาล',
    is_halal: false,
    calories: 220,
    allergens: 'กะปิ/กุ้ง, น้ำปลา/ปลา, ถั่วลิสง',
    wine_pairing: 'None',
    stock_quantity: 18
  },
  {
    item_id: 3,
    category_id: 1,
    name: 'มัสมั่นเนื้อ',
    description: 'มัสมั่นเนื้อตุ๋นเนื้อนุ่มละลายในปาก หอมเครื่องเทศและถั่วลิสงคั่วสูตรโบราณ',
    price: 85.00,
    image_url: '/images/steak.jpg',
    is_popular: true,
    prep_time_mins: 15,
    is_available: true,
    dietary_tag: 'Halal',
    is_halal: true,
    calories: 260,
    allergens: 'ถั่วลิสง, กะปิ/กุ้ง, น้ำปลา/ปลา',
    wine_pairing: 'None',
    stock_quantity: 12
  },
  {
    item_id: 4,
    category_id: 1,
    name: 'ต้มยำกุ้ง (น้ำข้น)',
    description: 'ต้มยำกุ้งแม่น้ำน้ำข้นรสจัดจ้าน เปรี้ยวเค็มเผ็ดครบรส สมุนไพรไทยสดใหม่',
    price: 95.00,
    image_url: '/images/sushi.jpg',
    is_popular: true,
    prep_time_mins: 12,
    is_available: true,
    dietary_tag: 'Halal',
    is_halal: true,
    calories: 140,
    allergens: 'กุ้ง, นม, น้ำพริกเผา (กุ้ง/กะปิ), น้ำปลา',
    wine_pairing: 'None',
    stock_quantity: 8
  },
  {
    item_id: 5,
    category_id: 2,
    name: 'ผัดกะเพราไก่ / เนื้อ',
    description: 'ผัดกะเพราสูตรโบราณคั่วพริกแห้งและใบกะเพราป่า กลิ่นหอมฟุ้งจัดจ้าน',
    price: 60.00,
    image_url: '/images/steak.jpg',
    is_popular: true,
    prep_time_mins: 8,
    is_available: true,
    dietary_tag: 'Halal',
    is_halal: true,
    calories: 150,
    allergens: 'ถั่วเหลือง, แป้งสาลี/กลูเตน',
    wine_pairing: 'None',
    stock_quantity: 30
  },
  {
    item_id: 6,
    category_id: 2,
    name: 'ผัดเผ็ดปลาดุก',
    description: 'ปลาดุกทอดกรอบผัดพริกแกงเผ็ดเข้มข้น ใบกะเพรากรอบและกระชายซอยหอมเตะจมูก',
    price: 65.00,
    image_url: '/images/sushi.jpg',
    is_popular: false,
    prep_time_mins: 10,
    is_available: true,
    dietary_tag: 'Halal',
    is_halal: true,
    calories: 170,
    allergens: 'ปลา, กะปิ/กุ้ง, ถั่วเหลือง',
    wine_pairing: 'None',
    stock_quantity: 3
  },
  {
    item_id: 7,
    category_id: 1,
    name: 'แกงจืดเต้าหู้หมูสับ',
    description: 'แกงจืดเต้าหู้ไข่เนื้อนุ่มใส่หมูสับหมักและผักกาดขาว ซุปร้อนๆ รสชาติกลมกล่อม',
    price: 50.00,
    image_url: '/images/pasta.jpg',
    is_popular: false,
    prep_time_mins: 8,
    is_available: true,
    dietary_tag: '❌ ไม่ฮาลาล',
    is_halal: false,
    calories: 90,
    allergens: 'ถั่วเหลือง, ขึ้นฉ่าย',
    wine_pairing: 'None',
    stock_quantity: 20
  },
  {
    item_id: 8,
    category_id: 3,
    name: 'ไข่พะโล้หมู',
    description: 'ไข่พะโล้ต้มเคี่ยวจนเข้าเนื้อ หมูสามชั้นนุ่มละมุน น้ำพะโล้หอมเครื่องเทศยาจีน',
    price: 60.00,
    image_url: '/images/pasta.jpg',
    is_popular: true,
    prep_time_mins: 10,
    is_available: true,
    dietary_tag: '❌ ไม่ฮาลาล',
    is_halal: false,
    calories: 250,
    allergens: 'ไข่, ถั่วเหลือง, แป้งสาลี/กลูเตน, ผักชี/ขึ้นฉ่าย',
    wine_pairing: 'None',
    stock_quantity: 0
  },
  {
    item_id: 9,
    category_id: 1,
    name: 'แกงเทโพหมูสามชั้น',
    description: 'แกงกะทิผักบุ้งไทยใส่หมูสามชั้น รสชาติหวานอมเปรี้ยวมะกรูดสดชื่น',
    price: 65.00,
    image_url: '/images/steak.jpg',
    is_popular: false,
    prep_time_mins: 10,
    is_available: true,
    dietary_tag: '❌ ไม่ฮาลาล',
    is_halal: false,
    calories: 220,
    allergens: 'กะปิ/กุ้ง, น้ำปลา/ปลา',
    wine_pairing: 'None',
    stock_quantity: 15
  },
  {
    item_id: 10,
    category_id: 1,
    name: 'แกงไตปลา',
    description: 'แกงไตปลาปักษ์ใต้แท้ รสชาติเผ็ดร้อนจัดจ้าน ใส่เนื้อปลาและเม็ดมะม่วงหิมพานต์',
    price: 70.00,
    image_url: '/images/sushi.jpg',
    is_popular: true,
    prep_time_mins: 10,
    is_available: true,
    dietary_tag: 'Halal',
    is_halal: true,
    calories: 90,
    allergens: 'ปลา (ไตปลา), กะปิ/กุ้ง, เม็ดมะม่วงหิมพานต์',
    wine_pairing: 'None',
    stock_quantity: 5
  },
  {
    item_id: 11,
    category_id: 2,
    name: 'ผัดเผ็ดหมูกระด้าง/หมูชิ้น',
    description: 'หมูผัดพริกแกงใต้รสเด็ด เผ็ดร้อนถึงใจ ผัดแห้งหอมกลิ่นพริกแกงและใบมะกรูด',
    price: 65.00,
    image_url: '/images/steak.jpg',
    is_popular: false,
    prep_time_mins: 10,
    is_available: true,
    dietary_tag: '❌ ไม่ฮาลาล',
    is_halal: false,
    calories: 190,
    allergens: 'กะปิ/กุ้ง, ถั่วเหลือง, แป้งสาลี/กลูเตน',
    wine_pairing: 'None',
    stock_quantity: 22
  },
  {
    item_id: 12,
    category_id: 2,
    name: 'ผัดบล็อกโคลี่กุ้ง',
    description: 'บล็อกโคลี่กรอบหวานผัดน้ำมันหอยใส่กุ้งสดตัวโต รสชาติกลมกล่อมดีต่อสุขภาพ',
    price: 75.00,
    image_url: '/images/sushi.jpg',
    is_popular: false,
    prep_time_mins: 8,
    is_available: true,
    dietary_tag: 'Halal',
    is_halal: true,
    calories: 120,
    allergens: 'กุ้ง, ถั่วเหลือง, แป้งสาลี/กลูเตน',
    wine_pairing: 'None',
    stock_quantity: 10
  },
  {
    item_id: 13,
    category_id: 2,
    name: 'ผัดผักบุ้งไฟแดง',
    description: 'ผักบุ้งสดผัดไฟแดง เต้าเจี้ยว กระเทียม พริกสด กรุบกรอบหอมควันกระทะ',
    price: 50.00,
    image_url: '/images/pasta.jpg',
    is_popular: false,
    prep_time_mins: 5,
    is_available: true,
    dietary_tag: 'Halal',
    is_halal: true,
    calories: 130,
    allergens: 'ถั่วเหลือง, แป้งสาลี/กลูเตน',
    wine_pairing: 'None',
    stock_quantity: 28
  },
  {
    item_id: 14,
    category_id: 2,
    name: 'คั่วกลิ้งไก่ / เนื้อ',
    description: 'คั่วกลิ้งเนื้อสับผัดคั่วแห้งๆ เผ็ดร้อนหอมพริกแกงใต้และใบมะกรูดซอยละเอียด',
    price: 70.00,
    image_url: '/images/steak.jpg',
    is_popular: true,
    prep_time_mins: 10,
    is_available: true,
    dietary_tag: 'Halal',
    is_halal: true,
    calories: 140,
    allergens: 'กะปิ/กุ้ง, น้ำปลา/ปลา',
    wine_pairing: 'None',
    stock_quantity: 4
  },
  {
    item_id: 15,
    category_id: 1,
    name: 'ต้มข่าไก่',
    description: 'ต้มข่าไก่กะทินุ่มละมุน หอมกลิ่นข่าอ่อน ตะไคร้ ใบมะกรูด และเห็ดฟาง',
    price: 65.00,
    image_url: '/images/pasta.jpg',
    is_popular: false,
    prep_time_mins: 10,
    is_available: true,
    dietary_tag: 'Halal',
    is_halal: true,
    calories: 160,
    allergens: 'น้ำปลา/ปลา',
    wine_pairing: 'None',
    stock_quantity: 16
  },
  {
    item_id: 16,
    category_id: 4,
    name: 'ลาบหมู',
    description: 'ลาบหมูสับรสนัวคลุกเคล้าข้าวคั่วหอมใหม่ พริกป่น มะนาวแท้ และสะระแหน่สด',
    price: 60.00,
    image_url: '/images/steak.jpg',
    is_popular: true,
    prep_time_mins: 8,
    is_available: true,
    dietary_tag: '❌ ไม่ฮาลาล',
    is_halal: false,
    calories: 130,
    allergens: 'น้ำปลา/ปลา',
    wine_pairing: 'None',
    stock_quantity: 0
  },
  {
    item_id: 17,
    category_id: 2,
    name: 'ไก่ผัดเม็ดมะม่วง',
    description: 'เนื้อไก่ทอดคลุกซอสเข้มข้น ผัดกับเม็ดมะม่วงหิมพานต์กรุบกรอบ พริกแห้ง และต้นหอม',
    price: 75.00,
    image_url: '/images/steak.jpg',
    is_popular: true,
    prep_time_mins: 10,
    is_available: true,
    dietary_tag: 'Halal',
    is_halal: true,
    calories: 190,
    allergens: 'เม็ดมะม่วงหิมพานต์, ถั่วเหลือง, แป้งสาลี/กลูเตน',
    wine_pairing: 'None',
    stock_quantity: 14
  },
  {
    item_id: 18,
    category_id: 2,
    name: 'หมูทอดกระเทียม',
    description: 'หมูหมักซอสกระเทียมพริกไทยทอดจนเหลืองทอง กรอบนอกนุ่มใน กระเทียมเจียวแน่นๆ',
    price: 65.00,
    image_url: '/images/steak.jpg',
    is_popular: true,
    prep_time_mins: 8,
    is_available: true,
    dietary_tag: '❌ ไม่ฮาลาล',
    is_halal: false,
    calories: 230,
    allergens: 'ถั่วเหลือง, แป้งสาลี/กลูเตน',
    wine_pairing: 'None',
    stock_quantity: 2
  },
  {
    item_id: 19,
    category_id: 1,
    name: 'แกงส้มชะอมกุ้ง',
    description: 'แกงส้มรสเข้มข้นจัดจ้าน น้ำแกงข้นใส่ไข่เจียวชะอมทอดชิ้นโตและกุ้งสดเด้ง',
    price: 85.00,
    image_url: '/images/sushi.jpg',
    is_popular: true,
    prep_time_mins: 12,
    is_available: true,
    dietary_tag: 'Halal',
    is_halal: true,
    calories: 140,
    allergens: 'กุ้ง, ไข่, กะปิ/กุ้ง, น้ำปลา/ปลา',
    wine_pairing: 'None',
    stock_quantity: 20
  },
  {
    item_id: 20,
    category_id: 2,
    name: 'ผัดพริกแกงถั่วยาวหมู',
    description: 'หมูผัดพริกแกงถั่วฝักยาวกรอบๆ รสเผ็ดหวานกลมกล่อม หอมกลิ่นใบมะกรูด',
    price: 60.00,
    image_url: '/images/steak.jpg',
    is_popular: false,
    prep_time_mins: 8,
    is_available: true,
    dietary_tag: '❌ ไม่ฮาลาล',
    is_halal: false,
    calories: 190,
    allergens: 'กะปิ/กุ้ง, น้ำปลา/ปลา, ถั่วเหลือง',
    wine_pairing: 'None',
    stock_quantity: 18
  },
  {
    item_id: 21,
    category_id: 3,
    name: 'หมูสามชั้นตุ๋นพะโล้',
    description: 'หมูสามชั้นตุ๋นเคี่ยวซีอิ๊วดำเครื่องเทศจีนจนเข้าเนื้อ นุ่มละลายในปาก หอมสมุนไพรยาจีน',
    price: 75.00,
    image_url: '/images/steak.jpg',
    is_popular: true,
    prep_time_mins: 12,
    is_available: true,
    dietary_tag: '❌ ไม่ฮาลาล',
    is_halal: false,
    calories: 280,
    allergens: 'ถั่วเหลือง, ไข่',
    wine_pairing: 'None',
    stock_quantity: 6
  },
  {
    item_id: 22,
    category_id: 3,
    name: 'ปลากะพงนึ่งมะนาว',
    description: 'ปลากะพงขาวนึ่งร้อนๆ รดซอสมะนาวพริกกระเทียมรสจัดจ้าน หอมกลิ่นสมุนไพรสดชื่น',
    price: 120.00,
    image_url: '/images/sushi.jpg',
    is_popular: true,
    prep_time_mins: 15,
    is_available: true,
    dietary_tag: 'Halal',
    is_halal: true,
    calories: 150,
    allergens: 'ปลา, น้ำปลา/ปลา',
    wine_pairing: 'None',
    stock_quantity: 7
  },
  {
    item_id: 23,
    category_id: 4,
    name: 'น้ำพริกกะปิ + ผักสด',
    description: 'น้ำพริกกะปิสูตรโบราณหอมกะปิ รสเผ็ดเค็มสมดุล เสิร์ฟพร้อมผักสดนานาชนิดและผักลวก',
    price: 45.00,
    image_url: '/images/pasta.jpg',
    is_popular: true,
    prep_time_mins: 5,
    is_available: true,
    dietary_tag: 'Halal',
    is_halal: true,
    calories: 60,
    allergens: 'กะปิ/กุ้ง, น้ำปลา/ปลา',
    wine_pairing: 'None',
    stock_quantity: 15
  },
  {
    item_id: 24,
    category_id: 4,
    name: 'ไข่เจียวหมูสับ',
    description: 'ไข่เจียวหมูสับฟูนุ่ม ทอดน้ำมันร้อนๆ กลิ่นหอมน้ำปลา เสิร์ฟร้อนๆ กินกับข้าวสุดอร่อย',
    price: 40.00,
    image_url: '/images/steak.jpg',
    is_popular: false,
    prep_time_mins: 5,
    is_available: true,
    dietary_tag: '❌ ไม่ฮาลาล',
    is_halal: false,
    calories: 160,
    allergens: 'ไข่, น้ำปลา/ปลา',
    wine_pairing: 'None',
    stock_quantity: 25
  },
  {
    item_id: 25,
    category_id: 1,
    name: 'ต้มแซ่บกระดูกหมูอ่อน',
    description: 'กระดูกหมูอ่อนเคี่ยวนุ่มกรุบ รสแซ่บจี๊ดจ๊าดด้วยพริกขี้หนูสวนสด น้ำมะนาวแท้ และข้าวคั่วหอม',
    price: 70.00,
    image_url: '/images/steak.jpg',
    is_popular: true,
    prep_time_mins: 10,
    is_available: true,
    dietary_tag: '❌ ไม่ฮาลาล',
    is_halal: false,
    calories: 180,
    allergens: 'น้ำปลา/ปลา',
    wine_pairing: 'None',
    stock_quantity: 16
  },
  {
    item_id: 26,
    category_id: 2,
    name: 'ผัดฉ่าทะเลรวมมิตร',
    description: 'กุ้งสด ปลาหมึก และหอยแมลงภู่ ผัดฉ่าสมุนไพรสด พริกไทยอ่อน กระชาย พริกชี้ฟ้า หอมฉุยเผ็ดร้อน',
    price: 85.00,
    image_url: '/images/sushi.jpg',
    is_popular: true,
    prep_time_mins: 10,
    is_available: true,
    dietary_tag: 'Halal',
    is_halal: true,
    calories: 160,
    allergens: 'กุ้ง, หอย, หมึก, น้ำปลา/ปลา, ถั่วเหลือง',
    wine_pairing: 'None',
    stock_quantity: 8
  },
  {
    item_id: 27,
    category_id: 1,
    name: 'แกงคั่วหอยขมใบชะพลู',
    description: 'แกงคั่วกะทิเข้มข้นถึงเครื่องแกงใต้ ใส่เนื้อหอยขมแกะสดและใบชะพลูหอมละมุนสูตรโบราณ',
    price: 75.00,
    image_url: '/images/pasta.jpg',
    is_popular: true,
    prep_time_mins: 12,
    is_available: true,
    dietary_tag: 'Halal',
    is_halal: true,
    calories: 210,
    allergens: 'หอย, กะปิ/กุ้ง, น้ำปลา/ปลา',
    wine_pairing: 'None',
    stock_quantity: 10
  },
  {
    item_id: 28,
    category_id: 2,
    name: 'ปีกไก่ทอดน้ำปลาโบราณ',
    description: 'ปีกไก่หมักน้ำปลาแท้สูตรคุณยาย ทอดจนหนังกรอบสีทอง เนื้อในชุ่มฉ่ำ ทานคู่กับข้าวสวยร้อนๆ',
    price: 65.00,
    image_url: '/images/steak.jpg',
    is_popular: true,
    prep_time_mins: 8,
    is_available: true,
    dietary_tag: 'Halal',
    is_halal: true,
    calories: 240,
    allergens: 'น้ำปลา/ปลา, ถั่วเหลือง, แป้งสาลี/กลูเตน',
    wine_pairing: 'None',
    stock_quantity: 20
  },
  {
    item_id: 29,
    category_id: 3,
    name: 'เต้าหู้ทรงเครื่องเห็ดหอม (มังสวิรัติ)',
    description: 'เต้าหู้ไข่นุ่มทอดพอตึง นึ่งราดซอสเห็ดหอม แครอท ข้าวโพดอ่อน รสชาติกลมกล่อมดีต่อสุขภาพ',
    price: 55.00,
    image_url: '/images/pasta.jpg',
    is_popular: false,
    prep_time_mins: 8,
    is_available: true,
    dietary_tag: 'Vegetarian',
    is_halal: true,
    calories: 120,
    allergens: 'ถั่วเหลือง, เห็ด',
    wine_pairing: 'None',
    stock_quantity: 14
  },
  {
    item_id: 30,
    category_id: 4,
    name: 'น้ำพริกอ่องหมูสับ + ผักสด',
    description: 'น้ำพริกอ่องสูตรเมืองเหนือ มะเขือเทศฉ่ำผัดหมูสับและพริกแกง รสชาติหวานเปรี้ยวกลมกล่อม',
    price: 50.00,
    image_url: '/images/steak.jpg',
    is_popular: false,
    prep_time_mins: 6,
    is_available: true,
    dietary_tag: '❌ ไม่ฮาลาล',
    is_halal: false,
    calories: 140,
    allergens: 'ถั่วเหลือง, กะปิ/กุ้ง',
    wine_pairing: 'None',
    stock_quantity: 12
  }
];

let mockReviews = [
  { review_id: 1, customer_name: 'คุณภาณุวัฒน์ ก.', rating: 5, comment: 'สเต๊กเนื้อริบอายซอสทรัฟเฟิลและวากิว A5 อร่อยระดับมิชลินจริงๆ ครับ บรรยากาศโซน VIP หรูหราและเป็นส่วนตัวมาก ประทับใจมากครับ', dish_recommendation: 'Prime Ribeye Steak with Truffle Butter' },
  { review_id: 2, customer_name: 'คุณพิมลวรรณ สุขเสริฐ', rating: 5, comment: 'จองโต๊ะผ่านระบบ LUXE DINING สะดวกมาก ได้รับ E-Voucher บัตรคิวทันที มีการแสดงสถานะการปรุงอาหารแบบเรียลไทม์เหมือน GrabFood เลยค่ะ', dish_recommendation: '7-Course Michelin Signature Grand Tasting Menu' },
  { review_id: 3, customer_name: 'Mr. David Miller (Food Critic)', rating: 5, comment: 'Exquisite fine dining experience in Bangkok! The truffle fettuccine was divine, scallops perfectly seared, and service was impeccable.', dish_recommendation: 'Creamy Truffle Fettuccine Pasta' },
  { review_id: 4, customer_name: 'คุณณิชาภา ม.', rating: 5, comment: 'ชอบระบบเลือกโซนผังโต๊ะอาหารมากค่ะ ได้มุม Garden Glasshouse บรรยากาศโรแมนติก เหมาะกับการฉลองวันเกิดมากค่ะ', dish_recommendation: 'French Fine de Claire Oysters' }
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
    reservation_date: '2026-09-27',
    reservation_time: '12:00',
    guest_count: 1,
    table_id: null,
    table_number: 'หน้าร้าน',
    zone: 'เคาน์เตอร์ Express Pickup หน้าร้าน',
    special_request: 'แยกน้ำแกงใส่ถุง ขอพริกน้ำปลาเพิ่ม',
    total_amount: 185.00,
    earned_points: 18,
    payment_status: 'paid',
    payment_method: 'PromptPay QR',
    status: 'confirmed',
    order_stage: 'ready',
    created_at: new Date().toISOString(),
    items: [
      { name: 'แกงเขียวหวานไก่', quantity: 1, unit_price: 60.00 },
      { name: 'พะแนงหมู', quantity: 1, unit_price: 65.00 },
      { name: 'หมูทอดกระเทียม', quantity: 1, unit_price: 60.00 }
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

// USER & ROLE MANAGEMENT ENDPOINTS (ADMIN ONLY)
app.get('/api/users', async (req, res) => {
  if (isDbConnected) {
    try {
      const result = await pool.query('SELECT user_id, name, email, phone, role, reward_points, membership_tier, avatar_url, created_at FROM users ORDER BY user_id ASC');
      return res.json(result.rows);
    } catch (err) { console.error(err); }
  }
  // Return mock users without exposing password
  const safeUsers = mockUsers.map(({ password, ...u }) => u);
  res.json(safeUsers);
});

app.patch('/api/users/:id/role', async (req, res) => {
  const { id } = req.params;
  const { role, membership_tier, reward_points } = req.body;

  if (isDbConnected) {
    try {
      const result = await pool.query(
        'UPDATE users SET role = COALESCE($1, role), membership_tier = COALESCE($2, membership_tier), reward_points = COALESCE($3, reward_points) WHERE user_id = $4 RETURNING user_id, name, email, phone, role, reward_points, membership_tier, avatar_url',
        [role, membership_tier, reward_points !== undefined ? parseInt(reward_points) : null, id]
      );
      return res.json({ success: true, user: result.rows[0] });
    } catch (err) { console.error(err); }
  }

  const user = mockUsers.find(u => u.user_id === parseInt(id));
  if (user) {
    if (role !== undefined) user.role = role;
    if (membership_tier !== undefined) user.membership_tier = membership_tier;
    if (reward_points !== undefined) user.reward_points = parseInt(reward_points);
    const { password, ...safeUser } = user;
    return res.json({ success: true, user: safeUser });
  }
  res.status(404).json({ error: 'User not found' });
});

app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const userId = parseInt(id);
  // Protect primary admin
  if (userId === 4) {
    return res.status(400).json({ error: 'ไม่สามารถลบบัญชีแอดมินหลักของระบบได้' });
  }

  if (isDbConnected) {
    try {
      await pool.query('DELETE FROM users WHERE user_id = $1', [userId]);
      return res.json({ success: true });
    } catch (err) { console.error(err); }
  }

  mockUsers = mockUsers.filter(u => u.user_id !== userId);
  res.json({ success: true });
});

// MENU MANAGEMENT ENDPOINTS (STAFF / MANAGER EDITING)
app.post('/api/menu', async (req, res) => {
  const { category_id, name, description, price, image_url, is_popular, stock_quantity } = req.body;
  const parsedStock = parseInt(stock_quantity ?? 20);

  if (isDbConnected) {
    try {
      const result = await pool.query(
        'INSERT INTO menu_items (category_id, name, description, price, image_url, is_popular, stock_quantity) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [category_id || 1, name, description, price, image_url || '/images/steak.jpg', is_popular || false, parsedStock]
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
    is_available: true,
    stock_quantity: parsedStock
  };
  mockMenuItems.push(newItem);
  res.status(201).json(newItem);
});

app.put('/api/menu/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, price, image_url, is_popular, is_available, stock_quantity } = req.body;
  const parsedStock = stock_quantity !== undefined ? parseInt(stock_quantity) : undefined;

  if (isDbConnected) {
    try {
      const result = await pool.query(
        'UPDATE menu_items SET name = $1, description = $2, price = $3, image_url = $4, is_popular = $5, is_available = $6, stock_quantity = COALESCE($7, stock_quantity) WHERE item_id = $8 RETURNING *',
        [name, description, price, image_url, is_popular, is_available, parsedStock, id]
      );
      return res.json(result.rows[0]);
    } catch (err) { console.error(err); }
  }

  const itemIndex = mockMenuItems.findIndex(i => i.item_id === parseInt(id));
  if (itemIndex !== -1) {
    mockMenuItems[itemIndex] = { 
      ...mockMenuItems[itemIndex], 
      name, 
      description, 
      price: parseFloat(price), 
      image_url, 
      is_popular, 
      is_available,
      stock_quantity: parsedStock !== undefined ? parsedStock : mockMenuItems[itemIndex].stock_quantity
    };
    return res.json(mockMenuItems[itemIndex]);
  }
  res.status(404).json({ error: 'Item not found' });
});

// Quick Stock Adjustment Endpoint
app.patch('/api/menu/:id/stock', async (req, res) => {
  const { id } = req.params;
  const { stock_quantity } = req.body;
  const parsedStock = Math.max(0, parseInt(stock_quantity || 0));

  if (isDbConnected) {
    try {
      const result = await pool.query(
        'UPDATE menu_items SET stock_quantity = $1 WHERE item_id = $2 RETURNING *',
        [parsedStock, id]
      );
      return res.json({ success: true, item: result.rows[0] });
    } catch (err) { console.error(err); }
  }

  const item = mockMenuItems.find(i => i.item_id === parseInt(id));
  if (item) {
    item.stock_quantity = parsedStock;
    return res.json({ success: true, item });
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
    guest_count: guest_count || 1,
    table_id: table_id || null,
    table_number: foundTable ? foundTable.table_number : 'หน้าร้าน (Takeaway)',
    zone: foundTable ? foundTable.zone : 'เคาน์เตอร์ Express Pickup หน้าร้าน',
    special_request,
    total_amount,
    earned_points,
    payment_status: 'paid',
    payment_method: 'PromptPay QR',
    status: 'confirmed',
    order_stage: 'confirmed',
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
      const isStage = ['preparing', 'ready', 'completed'].includes(status);
      const query = isStage
        ? 'UPDATE reservations SET order_stage = $1 WHERE reservation_id = $2 RETURNING *'
        : 'UPDATE reservations SET status = $1 WHERE reservation_id = $2 RETURNING *';
      const result = await pool.query(query, [status, id]);
      return res.json(result.rows[0]);
    } catch (err) { console.error(err); }
  }

  const resIndex = mockReservations.findIndex(r => r.reservation_id === parseInt(id));
  if (resIndex !== -1) {
    if (['preparing', 'ready', 'completed'].includes(status)) {
      mockReservations[resIndex].order_stage = status;
    } else {
      mockReservations[resIndex].status = status;
    }
    return res.json(mockReservations[resIndex]);
  }
  res.status(404).json({ error: 'Reservation not found' });
});

app.get('/api/admin/stats', async (req, res) => {
  let totalRevenue = mockReservations.reduce((sum, r) => sum + (r.status !== 'cancelled' ? r.total_amount : 0), 0);
  let totalBookings = mockReservations.length;
  let readyCount = mockReservations.filter(r => r.order_stage === 'ready' || r.order_stage === 'completed').length;

  res.json({
    totalRevenue,
    totalBookings,
    tableOccupancyRate: totalBookings > 0 ? Math.round((readyCount / totalBookings) * 100) : 92,
    popularDish: 'แกงเขียวหวานไก่'
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
