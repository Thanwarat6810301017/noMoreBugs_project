# 🍽️ LUXE DINING - Food Booking & Table Reservation System

> 🌐 **ลิงก์เข้าใช้งานเว็บไซต์ออนไลน์ (Live Demo URL)**: 
> ## 🔗 👉 [https://view-xml-namespace-missile.trycloudflare.com](https://view-xml-namespace-missile.trycloudflare.com)
> *(สามารถเข้าใช้งานได้ทันทีทั้งบนคอมพิวเตอร์และมือถือ 24 ชั่วโมง)*

---

### 🔑 บัญชีสำหรับทดสอบเข้าใช้งาน (Test Accounts)

| บทบาท (Role) | อีเมล (Email) | รหัสผ่าน (Password) | สิทธิ์การใช้งาน (Permissions) |
| :--- | :--- | :--- | :--- |
| 👤 **ลูกค้าทั่วไป (Customer VIP)** | `customer@email.com` | `password123` | จองโต๊ะ, สั่งอาหาร, สะสมแต้ม, ดู E-Voucher และติดตามสถานะ |
| 👑 **ลูกค้า Diamond VIP** | `pimonwan@luxedining.com` | `password123` | สิทธิประโยชน์สมาชิกระดับสูงสุด |
| ✏️ **พนักงานแก้ไขข้อมูล (Staff Editor)** | `staff@luxedining.com` | `admin123` | เพิ่ม/แก้ไข/ลบ เมนูอาหาร และอัปเดตสถานะโต๊ะ |
| 🔒 **ผู้บริหารระบบ (Admin)** | `admin@luxedining.com` | `admin123` | สิทธิ์สูงสุด ดูแผงควบคุมสถิติมุมมองผู้บริหาร และจัดการทั้งหมด |

---

## 🌟 ฟีเจอร์หลักของระบบ (Features)

- 📱 **Clean Luxury UI**: ดีไซน์หรูหรา Clean Modern Dark Theme เหมาะกับร้านอาหาร Fine Dining ระดับ Michelin Guide
- 🗺️ **Interactive Table Floor Map**: เลือกตำแหน่งโต๊ะบนผังร้านเสมือนจริง 5 โซน (Indoor Main Dining, Garden Glasshouse Terrace, Chef Counter Live, VIP Presidential Suite, Rooftop Sky Bar)
- 🚴 **Grab-Style 4-Step Order Tracker**: ระบบติดตามสถานะการปรุงอาหารเรียลไทม์ 4 ขั้นตอน (รับออเดอร์ -> กำลังปรุง -> พร้อมเสิร์ฟ -> เสร็จสิ้น)
- 🍷 **Sommelier Wine Pairing & Allergen Alerts**: คำแนะนำไวน์คู่มื้ออาหาร และระบบแจ้งเตือนสารก่อภูมิแพ้บนเมนู
- 🏷️ **Promotions & Discount Vouchers**: โค้ดส่วนลด เช่น `LUXE2026` (ลด 10%), `VIPGOLD` (ลด 15%), `MICHELIN500` (ลด ฿500)
- 💳 **PromptPay QR Code Gateway**: ระบบจำลองชำระเงิน รวดเร็วและแม่นยำ
- 🎫 **Printable E-Voucher**: ออกตั๋วคิวนัดหมายและใบเสร็จรับเงินอิเล็กทรอนิกส์พร้อม QR Code
- 📊 **Executive Admin Analytics**: แผงควบคุมสรุปสถิติมุมมองผู้บริหาร (ยอดขายรวม, อัตราครองโต๊ะ %, เมนูขายดี)
- 🗄️ **PostgreSQL Auto-Fallback**: เชื่อมต่อฐานข้อมูล PostgreSQL โดยตรง พร้อมระบบสำรอง In-Memory Fallback เมื่อไม่ได้เปิด DB Server

---

## 📂 โครงสร้างโปรเจกต์สำหรับงานกลุ่ม (Folder Structure)

```text
food-booking-app/
├── database.sql                 # 🗄️ สคริปต์ฐานข้อมูล PostgreSQL ไฟล์เดียวจบ (8 ตารางจริง + ข้อมูลเริ่มต้น)
├── public/                      # 🖼️ ไฟล์ Static Images
│   └── images/                  # รูปภาพอาหารความละเอียดสูง
│
├── src/                         # 💻 React Frontend Components
│   ├── components/              # คอมโพเนนต์แยกสำหรับแจกจ่ายงานในกลุ่ม
│   │   ├── Navbar.jsx           # แถบเมนูด้านบน (ซ่อนปุ่ม Admin สำหรับบุคคลทั่วไป)
│   │   ├── Hero.jsx             # แบนเนอร์ ค้นหาโต๊ะ OpenTable, Dietary Filter Pills และ Promotions Banner
│   │   ├── MenuGrid.jsx         # การ์ดรายการอาหารพร้อมราคา แคลอรี ไวน์คู่มื้อ และเตือนแพ้อาหาร
│   │   ├── TableMapModal.jsx    # ป๊อปอัปผังโต๊ะ Interactive 5 โซน พร้อมเลือกโอกาสพิเศษ SevenRooms
│   │   ├── FoodCustomizerModal.jsx # ป๊อปอัปปรับแต่งความเผ็ด ท็อปปิ้ง คำขอถึงเชฟ และแนะนำไวน์
│   │   ├── GrabOrderTracker.jsx # ระบบติดตามสถานะอาหารเรียลไทม์ 4 ขั้นตอน สไตล์ GrabFood
│   │   ├── CustomerReviews.jsx  # รีวิวความประทับใจระดับ 5 ดาว จากลูกค้าจริง (Verified Reviews)
│   │   ├── CustomerProfile.jsx  # หน้าประวัติการจอง ตั๋วคิว E-Voucher และแต้มสะสม Loyalty Tier
│   │   ├── PaymentModal.jsx     # ป๊อปอัปชำระเงิน PromptPay QR
│   │   ├── EVoucherModal.jsx    # ป๊อปอัปใบเสร็จ E-Voucher
│   │   ├── AdminDashboard.jsx   # แผงควบคุมสถิติผู้บริหาร และระบบ CRUD จัดการเมนู
│   │   └── Footer.jsx           # ส่วนท้ายเว็บไซต์
│   │
│   ├── services/                # 🌐 API Service Layer (Centralized Fetch Functions)
│   │   └── api.js               # สื่อสารระหว่าง Frontend กับ Express Backend
│   │
│   ├── App.jsx                  # Main App Component
│   ├── index.css                # Global Stylesheet
│   └── main.jsx                 # Entry Point
│
├── server.js                    # 🚀 Express Production Server (Port 5000)
├── .env.example                 # ⚙️ ตัวอย่างไฟล์ Environment Variables
├── package.json                 # 📦 Node Dependencies
└── README.md                    # 📘 คู่มือโปรเจกต์
```

---

## 🚀 ขั้นตอนการติดตั้งและรันโปรเจกต์ (Local Setup Guide)

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

### 3. รันระบบในโหมด Production & Server
```bash
# คอมไพล์ Production Bundle
npm run build

# รัน Unified Express Server (Port 5000)
node server.js
```

---

## 🛠️ รายชื่อ REST API Endpoints

- `GET /api/menu` - ดึงรายการอาหารทั้งหมด (รองรับ filter `category_id` และ `dietary_tag`)
- `GET /api/categories` - ดึงหมวดหมู่อาหารทั้ง 8 หมวดหมู่
- `GET /api/promotions` - ดึงรายการคูปองส่วนลดที่ใช้งานได้
- `GET /api/reviews` - ดึงรีวิวระดับ 5 ดาวจากลูกค้าจริง
- `GET /api/tables` - ดึงผังโต๊ะอาหารและสถานะทั้ง 5 โซน
- `GET /api/reservations` - ดึงรายการจอง (สำหรับ Admin/Staff)
- `POST /api/reservations` - บันทึกการจองโต๊ะ สั่งอาหาร และสะสมแต้ม
- `PATCH /api/reservations/:id/status` - อัปเดตสถานะการจองและการปรุงอาหาร
- `GET /api/admin/stats` - ดึงสถิติยอดขายและอัตราครองโต๊ะ

---

## 👥 คำแนะนำการแบ่งงานในกลุ่ม (Group Collaboration)

- **สมาชิกคนที่ 1 (Frontend Layout & Promotions)**: ดูแล `src/components/Navbar.jsx`, `src/components/Hero.jsx`, `src/components/Footer.jsx`
- **สมาชิกคนที่ 2 (Interactive Features & Customizer)**: ดูแล `src/components/TableMapModal.jsx`, `src/components/FoodCustomizerModal.jsx`, `src/components/PaymentModal.jsx`, `src/components/EVoucherModal.jsx`
- **สมาชิกคนที่ 3 (Order Tracking & Reviews)**: ดูแล `src/components/GrabOrderTracker.jsx`, `src/components/CustomerReviews.jsx`, `src/components/CustomerProfile.jsx`
- **สมาชิกคนที่ 4 (Backend Server, DB & Admin Dashboard)**: ดูแล `server.js`, `src/components/AdminDashboard.jsx`, `database/schema.sql`, `database/seed.sql`
