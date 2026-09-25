# 🍽️ LUXE DINING - Food Booking & Table Reservation System

ระบบเว็บแอปพลิเคชันจองโต๊ะอาหารและสั่งอาหารออนไลน์ล่วงหน้า (Food Booking & Interactive Table Reservation Web App) สร้างด้วย **React + Vite + Express + PostgreSQL** ออกแบบด้วยสถาปัตยกรรม **Modular Architecture** เพื่อรองรับการทำงานร่วมกันเป็นทีม (Group Project & Open Source)

---

## 🌟 ฟีเจอร์หลักของระบบ (Features)

- 📱 **Clean Luxury UI**: ดีไซน์หรูหรา Clean Modern Dark Theme ปราศจากองค์ประกอบส่วนตัวของนักพัฒนา
- 🗺️ **Interactive Table Floor Map**: เลือกตำแหน่งโต๊ะบนผังร้านอาหารเสมือนจริง 3 โซน (Indoor Main Hall, Garden Terrace, VIP Lounge)
- 💳 **PromptPay QR Code Gateway**: ระบบจำลองชำระเงิน พร้อมโค้ดส่วนลด (`LUXE2026` ส่วนลด 10%)
- 🎫 **Printable E-Voucher**: ออกตั๋วคิวนัดหมายและใบเสร็จรับเงินอิเล็กทรอนิกส์พร้อม QR Code
- 📊 **Executive Admin Analytics**: แผงควบคุมสรุปสถิติมุมมองผู้บริหาร (ยอดขายรวม, อัตราครองโต๊ะ %, เมนูขายดี)
- 🗄️ **PostgreSQL Auto-Fallback**: เชื่อมต่อฐานข้อมูล PostgreSQL โดยตรง พร้อมระบบสำรอง In-Memory Fallback เมื่อไม่ได้เปิด DB Server

---

## 📂 โครงสร้างโปรเจกต์สำหรับงานกลุ่ม (Folder Structure)

```text
food-booking-app/
├── database/                    # 🗄️ สคริปต์ฐานข้อมูล PostgreSQL
│   ├── schema.sql               # โครงสร้างตาราง (Tables & Indexes)
│   ├── seed.sql                 # ข้อมูลเริ่มต้น (Initial Data)
│   └── views.sql                # SQL Views สำหรับรายงานสถิติ
│
├── public/                      # 🖼️ ไฟล์ Static Images
│   └── images/                  # รูปภาพอาหารความละเอียดสูง
│
├── src/                         # 💻 React Frontend Components
│   ├── components/              # คอมโพเนนต์แยกสำหรับแจกจ่ายงานในกลุ่ม
│   │   ├── Navbar.jsx           # แถบเมนูด้านบน
│   │   ├── Hero.jsx             # แบนเนอร์ค้นหาและหมวดหมู่อาหาร
│   │   ├── MenuGrid.jsx         # การ์ดรายการอาหาร
│   │   ├── TableMapModal.jsx    # ป๊อปอัปผังโต๊ะ Interactive
│   │   ├── PaymentModal.jsx     # ป๊อปอัปชำระเงิน PromptPay QR
│   │   ├── EVoucherModal.jsx    # ป๊อปอัปใบเสร็จ E-Voucher
│   │   ├── AdminDashboard.jsx   # แผงควบคุมสถิติผู้บริหาร
│   │   └── Footer.jsx           # ส่วนท้ายเว็บไซต์
│   │
│   ├── services/                # 🌐 API Service Layer
│   │   └── api.js               # Centralized Fetch Functions
│   │
│   ├── App.jsx                  # Main App Component
│   ├── index.css                # Stylesheet
│   └── main.jsx                 # Entry Point
│
├── server.js                    # 🚀 Express Production Server (Port 5000)
├── tunnel.js                    # 🔗 Public Tunnel Auto-Reconnect (24/7)
├── .env.example                 # ⚙️ ตัวอย่างไฟล์ Environment Variables
├── .gitignore                   # 🙈 ไฟล์ยกเว้นสำหรับ Git
├── package.json                 # 📦 Node Dependencies
└── README.md                    # 📘 คู่มือโปรเจกต์
```

---

## 🚀 ขั้นตอนการติดตั้งและรันโปรเจกต์ (Setup Guide)

### 1. ติดตั้ง Dependencies
```bash
npm install
```

### 2. ตั้งค่า PostgreSQL Database (ผ่าน pgAdmin 4)
1. เปิด **pgAdmin 4** และสร้าง Database ใหม่ชื่อ `food_booking_db`
2. เปิด **Query Tool** แล้วรันไฟล์สคริปต์ตามลำดับ:
   - รัน [database/schema.sql](database/schema.sql)
   - รัน [database/seed.sql](database/seed.sql)
   - รัน [database/views.sql](database/views.sql)

### 3. รันระบบในโหมดพัฒนา (Development Mode)
```bash
# รัน Backend Server (Port 5000)
node server.js

# รัน Frontend Dev Server (Port 5173)
npm run dev
```

### 4. รันระบบในโหมด Production & แชร์ลิงก์สาธารณะ
```bash
# คอมไพล์ Production Bundle
npm run build

# รัน Unified Server (Port 5000)
node server.js

# เปิด Public Tunnel ให้คนอื่นดู (Optional)
node tunnel.js
```

---

## 🛠️ รายชื่อ REST API Endpoints

- `GET /api/menu` - ดึงรายการอาหารทั้งหมด
- `GET /api/categories` - ดึงหมวดหมู่อาหาร
- `GET /api/tables` - ดึงผังโต๊ะอาหารและสถานะ
- `GET /api/reservations` - ดึงรายการจอง (สำหรับ Admin)
- `POST /api/reservations` - บันทึกการจองโต๊ะและสั่งอาหาร
- `PATCH /api/reservations/:id/status` - อัปเดตสถานะการจอง
- `GET /api/admin/stats` - ดึงสถิติยอดขายและอัตราครองโต๊ะ

---

## 👥 คำแนะนำการแบ่งงานในกลุ่ม (Group Collaboration)

- **สมาชิกคนที่ 1 (Frontend Layout)**: ดูแล `src/components/Navbar.jsx`, `src/components/Hero.jsx`, `src/components/Footer.jsx`
- **สมาชิกคนที่ 2 (Interactive Features)**: ดูแล `src/components/TableMapModal.jsx`, `src/components/PaymentModal.jsx`, `src/components/EVoucherModal.jsx`
- **สมาชิกคนที่ 3 (Backend & Database)**: ดูแล `server.js`, `database/schema.sql`, `database/seed.sql`
- **สมาชิกคนที่ 4 (Admin Analytics)**: ดูแล `src/components/AdminDashboard.jsx`, `database/views.sql`
