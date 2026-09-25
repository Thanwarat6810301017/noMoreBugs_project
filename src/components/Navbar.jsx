import React from 'react';
import { Utensils, Calendar, ShieldCheck, User, LogOut, Award, LogIn } from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  cartCount, 
  onOpenBooking, 
  currentUser, 
  onOpenAuth, 
  onLogout 
}) {
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

        {currentUser && (
          <button 
            className={`nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={18} /> บัญชีของฉัน
            <span style={{ background: 'var(--accent-gold)', color: '#0b0c10', padding: '0.1rem 0.5rem', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 'bold' }}>
              ⭐ {currentUser.reward_points || 0} แต้ม
            </span>
          </button>
        )}

        <button 
          className={`nav-btn ${activeTab === 'admin' ? 'active' : ''}`}
          onClick={() => setActiveTab('admin')}
        >
          <ShieldCheck size={18} /> ผู้จัดการแก้ไขข้อมูล (Staff Editor)
        </button>

        {currentUser ? (
          <button 
            className="nav-btn" 
            onClick={onLogout}
            style={{ color: '#f87171' }}
          >
            <LogOut size={16} /> ออกจากระบบ
          </button>
        ) : (
          <button 
            className="nav-btn" 
            onClick={onOpenAuth}
            style={{ color: 'var(--accent-gold)' }}
          >
            <LogIn size={16} /> เข้าสู่ระบบ / สมัครสมาชิก
          </button>
        )}

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
