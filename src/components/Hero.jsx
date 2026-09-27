import React from 'react';
import { Sparkles, Search, Clock, ShoppingBag, Zap, ShieldCheck, ArrowRight, Flame } from 'lucide-react';

export default function Hero({ 
  searchQuery, 
  setSearchQuery, 
  categories, 
  selectedCategory, 
  setSelectedCategory, 
  totalItemsCount, 
  selectedDietary, 
  setSelectedDietary, 
  onQuickOrder,
  onOpenCustomizer,
  onAddDemoFood,
  promotions = [], 
  sortBy = 'popular', 
  setSortBy 
}) {
  return (
    <section id="menu-section" className="hero">
      <div className="hero-tag">
        <Sparkles size={16} /> 🍲 ข้าวแกงสูตรโบราณพรีเมียม • สั่งล่วงหน้าเพื่อรับที่หน้าร้าน (Takeaway Pre-Order)
      </div>

      <h1 className="hero-title">
        สั่งข้าวแกงล่วงหน้า <span>แวะรับหน้าร้านได้ทันที ไม่ต้องรอคิว</span>
      </h1>

      <p className="hero-subtitle">
        เลือกเมนูกับข้าวสูตรเด็ด ปรุงสดใหม่จากหม้อทุกเช้า กดสั่งและระบุเวลานัดรับล่วงหน้า อาหารแพ็คกล่องร้อนๆ พร้อมรับทันทีที่จุดบริการ Express Pickup หน้าร้าน สะดวก รวดเร็ว ประหยัดเวลา
      </p>

      {/* Demo & Box Customizer Call to Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {onOpenCustomizer && (
          <button 
            type="button"
            onClick={onOpenCustomizer}
            style={{
              background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-orange))',
              border: 'none',
              color: '#0b0c10',
              fontWeight: 800,
              fontSize: '0.95rem',
              padding: '0.85rem 1.6rem',
              borderRadius: '30px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 8px 25px rgba(229,168,83,0.35)',
              transition: 'transform 0.2s ease'
            }}
          >
            🍱 จัดชุดข้าวกล่องแยกช่อง (1-3 อย่าง)
          </button>
        )}
        {onAddDemoFood && (
          <button 
            type="button"
            onClick={onAddDemoFood}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1.5px solid var(--accent-gold)',
              color: 'var(--accent-gold)',
              fontWeight: 700,
              fontSize: '0.92rem',
              padding: '0.85rem 1.4rem',
              borderRadius: '30px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'background 0.2s ease'
            }}
          >
            ✨ เพิ่มอาหารตัวอย่างลงตะกร้า (Quick Demo)
          </button>
        )}
      </div>



      {/* Takeaway Pre-order Core Highlights Bar */}
      <div style={{
        background: 'rgba(20,23,31,0.92)',
        border: '1px solid var(--border-active)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.2rem 1.6rem',
        margin: '0 auto 2rem auto',
        maxWidth: '920px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem',
        alignItems: 'center',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
          <div style={{ background: 'rgba(229,168,83,0.15)', color: 'var(--accent-gold)', width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#fff' }}>ไม่ต้องรอคิว</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>สั่งล่วงหน้า มารับได้ทันที</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
          <div style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Flame size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#fff' }}>ปรุงสดใหม่ทุกเช้า</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ร้อนๆ หอมกรุ่นจากหม้อ</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
          <div style={{ background: 'rgba(52,211,153,0.15)', color: '#34d399', width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#fff' }}>ระบุเวลารับตามใจ</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>เช้า / เที่ยง / บ่าย / เย็น</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
          <div style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa', width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShoppingBag size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#fff' }}>รับอาหารที่หน้าร้าน</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>จุด Express Pickup หน้าร้าน</div>
          </div>
        </div>
      </div>

      {/* Search & Sort Row */}
      <div style={{ maxWidth: '720px', margin: '0 auto 1.5rem auto', display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
        <div className="search-container" style={{ margin: 0, flex: 1 }}>
          <div className="search-input-wrapper">
            <Search className="search-icon" size={20} />
            <input 
              type="text" 
              placeholder="ค้นหาเมนูข้าวแกง เช่น แกงเขียวหวาน, พะแนง, ผัดกะเพรา, ไข่พะโล้, แกงส้ม..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <select 
          className="form-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{ width: 'auto', background: 'rgba(20,23,31,0.9)', border: '1px solid var(--border-color)', color: 'var(--accent-gold)', borderRadius: '30px', padding: '0.75rem 1.2rem', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 'bold' }}
        >
          <option value="popular">🔥 แนะนำ (Popular)</option>
          <option value="calories">🥗 แคลอรีต่ำสุด</option>
        </select>
      </div>

      {/* Dietary & Recipe Filter Pills */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {[
          { key: 'all', label: 'เมนูทั้งหมด' },
          { key: 'Halal', label: '🌙 ฮาลาล (Halal)' },
          { key: '❌ ไม่ฮาลาล', label: '🥩 เมนูหมู (ไม่ฮาลาล)' },

        ].map(tag => (
          <button 
            key={tag.key}
            onClick={() => setSelectedDietary(tag.key === 'all' ? null : tag.key)}
            style={{ 
              background: (selectedDietary === tag.key || (tag.key === 'all' && !selectedDietary)) ? 'rgba(229,168,83,0.2)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${(selectedDietary === tag.key || (tag.key === 'all' && !selectedDietary)) ? 'var(--accent-gold)' : 'var(--border-color)'}`,
              color: (selectedDietary === tag.key || (tag.key === 'all' && !selectedDietary)) ? 'var(--accent-gold)' : 'var(--text-muted)',
              padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 'bold', cursor: 'pointer',
              transition: 'all 0.2s ease'
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
