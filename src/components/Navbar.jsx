import React from 'react';
import { Utensils, Calendar, ShieldCheck, PhoneCall, Award } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, cartCount, onOpenBooking }) {
  return (
    <nav className="navbar">
      <a href="#" className="brand-logo" onClick={() => setActiveTab('menu')}>
        <Utensils color="var(--accent-gold)" size={28} />
        LUXE <span>DINING</span>
      </a>

      <div className="nav-links">
        <button 
          className={`nav-btn ${activeTab === 'menu' ? 'active' : ''}`}
          onClick={() => setActiveTab('menu')}
        >
          <Utensils size={18} /> หน้าแรก & เมนูอาหาร
        </button>

        <button 
          className={`nav-btn ${activeTab === 'about' ? 'active' : ''}`}
          onClick={() => setActiveTab('about')}
        >
          <Award size={18} /> เกี่ยวกับเรา
        </button>

        <button 
          className={`nav-btn ${activeTab === 'admin' ? 'active' : ''}`}
          onClick={() => setActiveTab('admin')}
        >
          <ShieldCheck size={18} /> ระบบผู้บริหาร (Admin)
        </button>

        <button 
          className="nav-badge-btn"
          onClick={onOpenBooking}
        >
          <Calendar size={18} /> จองโต๊ะอาหารออนไลน์
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </button>
      </div>
    </nav>
  );
}
