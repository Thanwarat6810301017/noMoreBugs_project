import React from 'react';
import { Flame, AlertTriangle } from 'lucide-react';

export default function MenuGrid({ menuItems, onAddToCart }) {
  return (
    <section className="menu-grid">
      {menuItems.map(item => {
        const stock = item.stock_quantity ?? 99;
        const isSoldOut = stock <= 0;
        const isLowStock = stock > 0 && stock <= 5;

        return (
          <div key={item.item_id} className="menu-card" style={{ opacity: isSoldOut ? 0.55 : 1, position: 'relative' }}>
            <div className="card-image-wrap">
              <img src={item.image_url} alt={item.name} className="card-image" style={{ filter: isSoldOut ? 'grayscale(70%)' : 'none' }} />
              {item.is_popular && !isSoldOut && (
                <div className="popular-badge">
                  <Flame size={12} /> เมนูยอดนิยม
                </div>
              )}
              {/* Sold Out Overlay */}
              {isSoldOut && (
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0', zIndex: 2
                }}>
                  <div style={{
                    background: 'rgba(239,68,68,0.9)', color: '#fff', padding: '0.5rem 1.5rem',
                    borderRadius: '30px', fontWeight: 800, fontSize: '1rem',
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                    boxShadow: '0 4px 15px rgba(239,68,68,0.4)'
                  }}>
                    ❌ หมดแล้ว
                  </div>
                </div>
              )}
            </div>
            <div className="card-content">
              {item.dietary_tag && (
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent-gold)', background: 'rgba(229,168,83,0.1)', padding: '0.2rem 0.6rem', borderRadius: '12px', display: 'inline-block', marginBottom: '0.4rem' }}>
                  {item.dietary_tag === 'Gluten-Free' && '🌾 Gluten-Free'}
                  {item.dietary_tag === 'Halal' && '🌙 ฮาลาล'}
                  {!['Chef Signature', 'Vegetarian', 'Gluten-Free', 'Halal'].includes(item.dietary_tag) && item.dietary_tag}
                </span>
              )}
              <h3 className="card-title">{item.name}</h3>
              <p className="card-desc">{item.description}</p>
              
              {/* Stock Status Badge */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', margin: '0.5rem 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {isSoldOut && (
                  <span style={{
                    background: 'rgba(239,68,68,0.15)', color: '#f87171', padding: '0.2rem 0.7rem',
                    borderRadius: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.3rem'
                  }}>
                    <AlertTriangle size={12} /> หมดแล้ววันนี้
                  </span>
                )}
                {isLowStock && (
                  <span style={{
                    background: 'rgba(251,146,60,0.15)', color: '#fb923c', padding: '0.2rem 0.7rem',
                    borderRadius: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.3rem',
                    animation: 'pulse 2s infinite'
                  }}>
                    🔥 เหลือ {stock} จาน
                  </span>
                )}
                {!isSoldOut && !isLowStock && (
                  <span style={{
                    background: 'rgba(52,211,153,0.1)', color: '#34d399', padding: '0.2rem 0.7rem',
                    borderRadius: '12px', fontWeight: 'bold'
                  }}>
                    ✅ พร้อมเสิร์ฟ ({stock} จาน)
                  </span>
                )}
              </div>

              <div className="card-footer">
                <button
                  className="add-btn"
                  onClick={() => !isSoldOut && onAddToCart(item)}
                  disabled={isSoldOut}
                  style={{
                    opacity: isSoldOut ? 0.4 : 1,
                    cursor: isSoldOut ? 'not-allowed' : 'pointer',
                    width: '100%'
                  }}
                >
                  {isSoldOut ? '❌ สินค้าหมด' : '🍱 สั่งข้าวกล่อง'}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
