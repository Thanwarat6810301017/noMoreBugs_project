import React from 'react';
import { Sparkles, Search, Calendar, Clock, Users, ArrowRight } from 'lucide-react';

export default function Hero({ 
  searchQuery, 
  setSearchQuery, 
  categories, 
  selectedCategory, 
  setSelectedCategory,
  totalItemsCount,
  selectedDietary,
  setSelectedDietary,
  onQuickSearchTable,
  promotions = []
}) {
  return (
    <section className="hero">
      <div className="hero-tag">
        <Sparkles size={16} /> ประสบการณ์มื้ออาหาร Fine Dining สไตล์ Michelin Guide
      </div>
      <h1 className="hero-title">
        จองโต๊ะอาหารออนไลน์ <span>พร้อมเลือกสั่งอาหารล่วงหน้า</span>
      </h1>
      <p className="hero-subtitle">
        เลือกระบุโต๊ะโปรดบนผังร้านเสมือนจริง เลือกเมนูอาหารจานโปรด และรับ E-Voucher บัตรคิวนัดหมายทันที การันตีบริการระดับพรีเมียม
      </p>

      {/* Active Promotions & Deal Badges */}
      {promotions.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.8rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {promotions.map(p => (
            <div key={p.promo_id || p.code} style={{ background: 'rgba(229,168,83,0.12)', border: `1px solid ${p.badge_color || 'var(--accent-gold)'}`, borderRadius: '30px', padding: '0.4rem 1.2rem', fontSize: '0.82rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: 'bold', color: p.badge_color || 'var(--accent-gold)' }}>🏷️ {p.code}</span>
              <span>{p.title}</span>
            </div>
          ))}
        </div>
      )}

      {/* OpenTable-Style Instant Reservation Search Bar */}
      <div style={{ background: 'rgba(20,23,31,0.95)', border: '1px solid var(--border-active)', borderRadius: 'var(--radius-lg)', padding: '1rem 1.5rem', margin: '0 auto 2rem auto', maxWidth: '850px', display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr auto', gap: '0.8rem', alignItems: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.6rem 1rem', borderRadius: 'var(--radius-md)' }}>
          <Calendar size={18} color="var(--accent-gold)" />
          <input type="date" className="form-input" style={{ background: 'none', border: 'none', padding: 0, fontSize: '0.9rem' }} defaultValue={new Date(Date.now() + 86400000).toISOString().split('T')[0]} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.6rem 1rem', borderRadius: 'var(--radius-md)' }}>
          <Clock size={18} color="var(--accent-gold)" />
          <select className="form-select" style={{ background: 'none', border: 'none', padding: 0, fontSize: '0.9rem' }} defaultValue="19:00">
            <option value="17:00">17:00 น.</option>
            <option value="18:00">18:00 น.</option>
            <option value="19:00">19:00 น.</option>
            <option value="20:00">20:00 น.</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.6rem 1rem', borderRadius: 'var(--radius-md)' }}>
          <Users size={18} color="var(--accent-gold)" />
          <select className="form-select" style={{ background: 'none', border: 'none', padding: 0, fontSize: '0.9rem' }} defaultValue={2}>
            <option value={2}>2 ท่าน</option>
            <option value={4}>4 ท่าน</option>
            <option value={6}>6 ท่าน</option>
            <option value={8}>8 ท่าน (VIP)</option>
          </select>
        </div>

        <button className="nav-badge-btn" style={{ padding: '0.8rem 1.4rem' }} onClick={onQuickSearchTable}>
          ค้นหาโต๊ะว่าง <ArrowRight size={16} />
        </button>
      </div>

      {/* Menu Search Input */}
      <div className="search-container">
        <div className="search-input-wrapper">
          <Search className="search-icon" size={20} />
          <input 
            type="text" 
            placeholder="ค้นหาชื่อเมนู เช่น สเต๊ก, พาสต้า, ซูชิ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Michelin Guide Dietary Filter Pills */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {[
          { key: 'all', label: 'ทั้งหมด' },
          { key: 'Chef Signature', label: '🌟 Chef Signature' },
          { key: 'Vegetarian', label: '🌱 มังสวิรัติ (Vegetarian)' },
          { key: 'Gluten-Free', label: '🌾 Gluten-Free' },
          { key: 'Halal', label: '🌙 ฮาลาล (Halal)' }
        ].map(tag => (
          <button 
            key={tag.key}
            onClick={() => setSelectedDietary(tag.key === 'all' ? null : tag.key)}
            style={{ 
              background: (selectedDietary === tag.key || (tag.key === 'all' && !selectedDietary)) ? 'rgba(229,168,83,0.2)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${(selectedDietary === tag.key || (tag.key === 'all' && !selectedDietary)) ? 'var(--accent-gold)' : 'var(--border-color)'}`,
              color: (selectedDietary === tag.key || (tag.key === 'all' && !selectedDietary)) ? 'var(--accent-gold)' : 'var(--text-muted)',
              padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 'bold', cursor: 'pointer'
            }}
          >
            {tag.label}
          </button>
        ))}
      </div>

      {/* Category Filter Pills */}
      <div className="category-tabs">
        <button 
          className={`category-pill ${selectedCategory === null ? 'active' : ''}`}
          onClick={() => setSelectedCategory(null)}
        >
          ทั้งหมด ({totalItemsCount})
        </button>
        {categories.map(cat => (
          <button 
            key={cat.category_id}
            className={`category-pill ${selectedCategory === cat.category_id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.category_id)}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </section>
  );
}
