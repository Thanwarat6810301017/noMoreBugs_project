import React from 'react';
import { Utensils, Calendar, ShieldCheck, User, LogOut, LogIn, Lock } from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  cartCount, 
  onOpenBooking, 
  currentUser, 
  onOpenAuth, 
  onLogout 
}) {
  const isAdminOrStaff = currentUser && (currentUser.role === 'admin' || currentUser.role === 'staff');

  const handleAdminTabClick = () => {
    if (isAdminOrStaff) {
      setActiveTab('admin');
    } else {
      alert('🔒 ส่วนแก้ไขข้อมูลอนุญาตเฉพาะผู้บริหาร/พนักงานที่มีสิทธิ์เท่านั้น กรุณาเข้าสู่ระบบด้วยบัญชีแอดมิน');
      onOpenAuth();
    }
  };

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

        {/* Protected Admin/Staff Data Editor Tab */}
        <button 
          className={`nav-btn ${activeTab === 'admin' ? 'active' : ''}`}
          onClick={handleAdminTabClick}
          style={{ border: isAdminOrStaff ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(239,68,68,0.3)' }}
        >
          {isAdminOrStaff ? <ShieldCheck size={18} color="#34d399" /> : <Lock size={18} color="#f87171" />}
          {isAdminOrStaff ? 'ผู้จัดการแก้ไขข้อมูล (Admin Authorized)' : 'ผู้จัดการแก้ไขข้อมูล 🔒'}
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
