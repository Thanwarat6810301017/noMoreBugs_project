import React from 'react';
import { Utensils, Calendar, ShieldCheck, User, LogOut, LogIn, Phone, Sparkles } from 'lucide-react';

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
          <span style={{ color: 'var(--accent-gold)', fontWeight: 'bold' }}>⭐ MICHELIN SELECTED 2026</span>
          <span style={{ color: 'var(--border-color)' }}>|</span>
          <span style={{ color: 'var(--text-muted)' }}>สัมผัสรสชาติอันวิจิตรและผังโต๊ะอาหารเสมือนจริง</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <span style={{ color: 'var(--accent-gold)', background: 'rgba(229,168,83,0.15)', padding: '0.15rem 0.6rem', borderRadius: '10px', fontWeight: 'bold' }}>
            🏷️ ใช้โค้ด: LUXE2026 ลด 10%
          </span>
          <a href="tel:029999999" style={{ color: 'var(--text-main)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Phone size={13} color="var(--accent-gold)" /> 02-999-9999
          </a>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="navbar" style={{ position: 'static' }}>
        <a href="#" className="brand-logo" onClick={() => setActiveTab('menu')}>
          <Utensils color="var(--accent-gold)" size={28} />
          LUXE <span>DINING</span>
        </a>

        {/* In-page Anchor Links (Visible when in menu tab) */}
        {activeTab === 'menu' && (
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
            <button className="nav-btn" onClick={() => scrollToSection('menu-section')}>
              🍽️ เมนูกูร์เมต์
            </button>
            <button className="nav-btn" onClick={() => scrollToSection('dining-zones')}>
              🏛️ 5 โซนบรรยากาศ
            </button>
            <button className="nav-btn" onClick={() => scrollToSection('chef-story')}>
              👨‍🍳 เชฟมิชลิน
            </button>
            <button className="nav-btn" onClick={() => scrollToSection('customer-reviews')}>
              ⭐ รีวิว 5 ดาว
            </button>
            <button className="nav-btn" onClick={() => scrollToSection('dining-policies')}>
              📋 นโยบายห้องอาหาร
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

          {/* Admin Navigation Button: COMPLETELY HIDDEN for normal users/customers */}
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
            <Calendar size={18} /> จองโต๊ะอาหารออนไลน์
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </button>
        </div>
      </nav>
    </header>
  );
}
