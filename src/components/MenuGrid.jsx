import React from 'react';
import { Flame } from 'lucide-react';

export default function MenuGrid({ menuItems, onAddToCart }) {
  return (
    <section className="menu-grid">
      {menuItems.map(item => (
        <div key={item.item_id} className="menu-card">
          <div className="card-image-wrap">
            <img src={item.image_url} alt={item.name} className="card-image" />
            {item.is_popular && (
              <div className="popular-badge">
                <Flame size={12} /> เมนูยอดนิยม
              </div>
            )}
          </div>
          <div className="card-content">
            {item.dietary_tag && (
              <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent-gold)', background: 'rgba(229,168,83,0.1)', padding: '0.2rem 0.6rem', borderRadius: '12px', display: 'inline-block', marginBottom: '0.4rem' }}>
                {item.dietary_tag === 'Chef Signature' && '🌟 Chef Signature'}
                {item.dietary_tag === 'Vegetarian' && '🌱 มังสวิรัติ'}
                {item.dietary_tag === 'Gluten-Free' && '🌾 Gluten-Free'}
                {item.dietary_tag === 'Halal' && '🌙 ฮาลาล'}
                {!['Chef Signature', 'Vegetarian', 'Gluten-Free', 'Halal'].includes(item.dietary_tag) && item.dietary_tag}
              </span>
            )}
            <h3 className="card-title">{item.name}</h3>
            <p className="card-desc">{item.description}</p>
            
            {/* Michelin Gourmet Details */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', margin: '0.5rem 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {item.calories && <span style={{ background: 'rgba(255,255,255,0.05)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>🔥 {item.calories} kcal</span>}
              {item.prep_time_mins && <span style={{ background: 'rgba(255,255,255,0.05)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>⏱️ {item.prep_time_mins} นาที</span>}
              {item.wine_pairing && item.wine_pairing !== 'None' && (
                <span style={{ background: 'rgba(229,168,83,0.08)', color: 'var(--accent-gold)', padding: '0.15rem 0.5rem', borderRadius: '4px', width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  🍷 คู่ไวน์: {item.wine_pairing}
                </span>
              )}
            </div>

            <div className="card-footer">
              <div className="price">
                ฿{Number(item.price).toLocaleString()}
              </div>
              <button className="add-btn" onClick={() => onAddToCart()}>
                🍱 สั่งข้าวกล่อง
              </button>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
