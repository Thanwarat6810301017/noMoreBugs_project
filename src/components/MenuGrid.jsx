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
            <div className="card-footer">
              <div className="price">
                ฿{Number(item.price).toLocaleString()}
              </div>
              <button className="add-btn" onClick={() => onAddToCart(item)}>
                + สั่งล่วงหน้า
              </button>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
