# 🤖 AGENTS.md - Guide for AI Assistants & Developers

This document serves as the authoritative architectural guide for AI agents (Google Antigravity, Claude Code, Cursor, Copilot, ChatGPT) and human developers extending the **LUXE DINING** codebase.

---

## 🏗️ Project Architecture & Tech Stack

- **Frontend**: React 18, Vite, Lucide Icons, Pure Modern CSS (Glassmorphic Dark Theme)
- **Backend**: Node.js, Express.js (Serving both API endpoints and Production static bundle)
- **Database**: PostgreSQL 12+ (compatible with pgAdmin 4) with In-Memory Fallback mode
- **Tunneling**: Cloudflare Tunnel / Localtunnel with auto-reconnect

---

## 📁 Repository Directory Structure

```text
food-booking-app/
├── database/                   # PostgreSQL Scripts
│   ├── schema.sql              # Table definitions, constraints, indexes
│   ├── seed.sql                # Initial categories, menu items, table maps
│   └── views.sql               # Analytics views (daily sales, occupancy)
│
├── public/                     # Static assets
│   └── images/                 # High-res dish images (steak, pasta, sushi, dessert)
│
├── src/                        # Modular React Frontend
│   ├── components/             # Decoupled UI components
│   │   ├── Navbar.jsx          # Top navigation bar
│   │   ├── Hero.jsx            # Banner, search, category pills
│   │   ├── MenuGrid.jsx        # Food item cards & add-to-cart
│   │   ├── TableMapModal.jsx   # Interactive 3-zone floor table map
│   │   ├── PaymentModal.jsx    # PromptPay QR payment & coupon system
│   │   ├── EVoucherModal.jsx   # Digital voucher receipt modal
│   │   ├── AdminDashboard.jsx  # Executive stats & reservation table
│   │   └── Footer.jsx          # Footer & restaurant details
│   │
│   ├── services/               # API service layer
│   │   └── api.js              # Centralized fetch methods
│   │
│   ├── App.jsx                 # App composition root
│   └── index.css               # Styling design system
│
├── server.js                   # Unified Express API & Static Server (Port 5000)
├── tunnel.js                   # Persistent public tunnel background script
├── README.md                   # Human developer guide
└── AGENTS.md                   # AI Assistant context & prompt guide
```

---

## 🔌 API Endpoints Summary

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/menu` | Fetch all menu items (optional `?category_id=X`) |
| `GET` | `/api/categories` | Fetch category list |
| `GET` | `/api/tables` | Fetch table floor map data |
| `GET` | `/api/reservations` | Fetch all reservations for Admin |
| `POST` | `/api/reservations` | Submit new table booking & pre-ordered dishes |
| `PATCH` | `/api/reservations/:id/status` | Update reservation status (confirmed/cancelled) |
| `GET` | `/api/admin/stats` | Fetch executive stats (revenue, occupancy %, top dish) |
| `GET` | `/api/db-status` | Check PostgreSQL live connection state |

---

## 🗄️ Database Tables Reference

1. `categories`: `category_id`, `name`, `description`, `icon_name`
2. `menu_items`: `item_id`, `category_id`, `name`, `description`, `price`, `image_url`, `is_popular`
3. `restaurant_tables`: `table_id`, `table_number`, `zone`, `capacity`, `pos_x`, `pos_y`, `status`
4. `reservations`: `reservation_id`, `booking_code`, `customer_name`, `customer_email`, `customer_phone`, `reservation_date`, `reservation_time`, `guest_count`, `table_id`, `total_amount`, `payment_status`, `status`
5. `reservation_items`: `item_detail_id`, `reservation_id`, `item_id`, `quantity`, `unit_price`

---

## 💡 Prompt Guidelines for AI Assistant Tasks

When asking an AI agent to extend this project, use these structured prompts:

### To add a new food menu item:
> "Read AGENTS.md. Add a new dessert item called 'Mango Sticky Rice' priced at 220 THB into `src/services/api.js`, `server.js` mock data, and `database/seed.sql`."

### To add a new seating zone:
> "Read AGENTS.md. Add a new seating zone called 'Rooftop Lounge' with 4 new tables (R-01 to R-04) in `src/components/TableMapModal.jsx`, `server.js`, and `database/seed.sql`."

### To connect live PostgreSQL DB:
> "Read AGENTS.md. Update DB credentials in `.env` or `server.js` and execute `database/schema.sql`, `seed.sql`, `views.sql` in pgAdmin."
