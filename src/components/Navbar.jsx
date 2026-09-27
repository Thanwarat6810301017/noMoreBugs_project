import React from 'react';
import { Utensils, ShoppingBag, ShieldCheck, User, LogOut, LogIn, Phone, Sparkles } from 'lucide-react';

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

  const scrollToSection = (id) => {
    setActiveTab('menu');
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100 }}>
      {/* Top Announcement Bar */}
      <div style={{ background: 'linear-gradient(90deg, #12151e 0%, #1c1810 50%, #12151e 100%)', borderBottom: '1px solid rgba(229,168,83,0.3)', padding: '0.45rem 2rem', fontSize: '0.78rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#e5e7eb' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ color: 'var(--accent-gold)', fontWeight: 'bold' }}>⭐ ข้าวแกงระดับพรีเมียม</span>
          <span style={{ color: 'var(--border-color)' }}>|</span>
          <span style={{ color: 'var(--text-muted)' }}>สั่งอาหารล่วงหน้า แวะรับที่หน้าร้านได้ทันที สะดวกรวดเร็ว ไม่ต้องยืนรอคิว</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <a href="tel:029999999" style={{ color: 'var(--text-main)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Phone size={13} color="var(--accent-gold)" /> 02-999-9999
          </a>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="navbar" style={{ position: 'static' }}>
        <a href="#" className="brand-logo" onClick={() => setActiveTab('menu')}>
          <Utensils color="var(--accent-gold)" size={28} />
          ข้าวแกง <span>LUXE DINING</span>
        </a>

        {/* In-page Anchor Links (Visible when in menu tab) */}
        {activeTab === 'menu' ? (
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
            <button className="nav-btn" onClick={() => scrollToSection('menu-section')}>
              🍲 เมนูข้าวแกง
            </button>
            <button className="nav-btn" onClick={() => scrollToSection('pickup-guide')}>
              🛍️ วิธีสั่งรับหน้าร้าน
            </button>
            <button className="nav-btn" onClick={() => scrollToSection('customer-reviews')}>
              ⭐ รีวิวจากลูกค้า
            </button>
            <button className="nav-btn" onClick={() => scrollToSection('dining-policies')}>
              📋 ข้อมูลการรับอาหาร
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
            <button 
              className="nav-btn" 
              onClick={() => setActiveTab('menu')}
              style={{ 
                background: 'linear-gradient(135deg, rgba(229,168,83,0.25), rgba(255,94,54,0.2))',
                border: '1.5px solid var(--accent-gold)',
                color: 'var(--accent-gold)',
                fontWeight: 700,
                borderRadius: '20px',
                padding: '0.45rem 1.2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              🍲 หน้าร้าน / สั่งอาหาร (30 เมนู)
            </button>
          </div>
        )}

        <div className="nav-links">
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

          {/* Admin Navigation Button: COMPUTED for staff/admin */}
          {isAdminOrStaff && (
            <button 
              className={`nav-btn ${activeTab === 'admin' ? 'active' : ''}`}
              onClick={() => setActiveTab('admin')}
              style={{ border: '1px solid rgba(16,185,129,0.3)', color: '#34d399' }}
            >
              <ShieldCheck size={18} color="#34d399" /> แผงควบคุมแอดมิน ({currentUser.role.toUpperCase()})
            </button>
          )}

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
            <ShoppingBag size={18} /> ตะกร้าสั่งซื้อ / นัดรับอาหาร
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </button>
        </div>
      </nav>
    </header>
  );
}
