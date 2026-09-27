import React, { useState } from 'react';
import { Flame, AlertTriangle, Info } from 'lucide-react';

export default function MenuGrid({ menuItems, onAddToCart }) {
  const [allergenModalItem, setAllergenModalItem] = useState(null);
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
                <div style={{ marginBottom: '0.6rem' }}>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    fontWeight: 'bold', 
                    color: '#f6ad55', 
                    background: 'rgba(255,255,255,0.06)', 
                    border: '1px solid rgba(255,255,255,0.08)',
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '20px', 
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}>
                    {item.dietary_tag === 'Gluten-Free' && '🌾 Gluten-Free'}
                    {item.dietary_tag === 'Halal' && '🌙 ฮาลาล'}
                    {!['Chef Signature', 'Vegetarian', 'Gluten-Free', 'Halal'].includes(item.dietary_tag) && item.dietary_tag}
                  </span>
                </div>
              )}
              <h3 className="card-title">{item.name}</h3>
              <p className="card-desc" style={{ marginBottom: '1rem' }}>{item.description}</p>
              
              {/* Calories & Prep Time Pills */}
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: 'auto', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
                {item.calories && (
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    color: '#94a3b8'
                  }}>
                    🔥 {item.calories} kcal
                  </span>
                )}
                {item.prep_time_mins && (
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    color: '#94a3b8'
                  }}>
                    ⏱️ {item.prep_time_mins} นาที
                  </span>
                )}
                {isSoldOut && (
                  <span style={{
                    background: 'rgba(239,68,68,0.15)', color: '#f87171', padding: '0.2rem 0.6rem',
                    borderRadius: '8px', fontWeight: 'bold', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem'
                  }}>
                    <AlertTriangle size={12} /> หมดแล้ว
                  </span>
                )}
                {isLowStock && (
                  <span style={{
                    background: 'rgba(251,146,60,0.15)', color: '#fb923c', padding: '0.2rem 0.6rem',
                    borderRadius: '8px', fontWeight: 'bold', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem'
                  }}>
                    🔥 เหลือ {stock} จาน
                  </span>
                )}
              </div>

              <div className="card-footer">
                <span className="price">฿{item.price}</span>
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={() => setAllergenModalItem(item)}
                    title="ดูส่วนประกอบสำคัญและข้อมูลผู้แพ้อาหาร"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(229, 168, 83, 0.35)',
                      color: 'var(--accent-gold)',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      transition: 'all 0.25s ease'
                    }}
                  >
                    <Info size={15} /> ส่วนประกอบ
                  </button>
                  <button
                    className="add-btn"
                    onClick={() => !isSoldOut && onAddToCart(item)}
                    disabled={isSoldOut}
                    style={{
                      opacity: isSoldOut ? 0.4 : 1,
                      cursor: isSoldOut ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {isSoldOut ? '❌ สินค้าหมด' : '🍱 สั่งข้าวกล่อง'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Important Ingredients & Allergen Modal */}
      {allergenModalItem && (
        <div className="modal-overlay" onClick={() => setAllergenModalItem(null)}>
          <div 
            className="modal-card" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '440px', padding: '1.8rem', position: 'relative' }}
          >
            {/* Close button */}
            <button
              onClick={() => setAllergenModalItem(null)}
              style={{
                position: 'absolute', top: '1rem', right: '1rem',
                background: 'rgba(255,255,255,0.06)', border: 'none',
                color: '#94a3b8', width: '32px', height: '32px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', fontSize: '1rem'
              }}
            >
              ✕
            </button>

            {/* Dish Header */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.2rem' }}>
              <img
                src={allergenModalItem.image_url}
                alt={allergenModalItem.name}
                style={{ width: '65px', height: '65px', borderRadius: '12px', objectFit: 'cover', border: '1px solid var(--border-color)' }}
              />
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: 'bold' }}>
                  {allergenModalItem.dietary_tag || 'เมนูแนะนำ'}
                </span>
                <h3 style={{ fontSize: '1.25rem', color: '#fff', margin: '0.2rem 0' }}>{allergenModalItem.name}</h3>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                  🔥 {allergenModalItem.calories || 150} kcal &nbsp;|&nbsp; ⏱️ {allergenModalItem.prep_time_mins || 10} นาที
                </span>
              </div>
            </div>

            {/* Ingredients / Allergens Details Box */}
            <div style={{
              background: 'rgba(229, 168, 83, 0.08)',
              border: '1px solid rgba(229, 168, 83, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '1.2rem',
              marginBottom: '1.2rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '1.2rem' }}>⚠️</span>
                <strong style={{ color: 'var(--accent-gold)', fontSize: '0.95rem' }}>
                  ส่วนประกอบสำคัญ & ข้อมูลผู้แพ้อาหาร:
                </strong>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem' }}>
                {allergenModalItem.allergens && allergenModalItem.allergens !== 'None' ? (
                  allergenModalItem.allergens.split(',').map((alg, idx) => (
                    <span
                      key={idx}
                      style={{
                        background: 'rgba(239, 68, 68, 0.15)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#fca5a5',
                        padding: '0.3rem 0.7rem',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}
                    >
                      ⚠️ {alg.trim()}
                    </span>
                  ))
                ) : (
                  <span style={{
                    background: 'rgba(52, 211, 153, 0.15)',
                    border: '1px solid rgba(52, 211, 153, 0.3)',
                    color: '#6ee7b7',
                    padding: '0.3rem 0.7rem',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: 600
                  }}>
                    ✅ ไม่มีสารก่อภูมิแพ้ทั่วไป (None)
                  </span>
                )}
              </div>
            </div>

            {/* Dish Description */}
            <div style={{ marginBottom: '1.4rem' }}>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.3rem', fontWeight: 600 }}>รายละเอียดเมนู:</div>
              <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                {allergenModalItem.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setAllergenModalItem(null)}
                style={{
                  background: 'var(--bg-glass)',
                  border: '1px solid var(--border-color)',
                  color: '#fff',
                  padding: '0.6rem 1.2rem',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                ปิด
              </button>
              <button
                type="button"
                onClick={() => {
                  const item = allergenModalItem;
                  setAllergenModalItem(null);
                  onAddToCart(item);
                }}
                disabled={(allergenModalItem.stock_quantity ?? 99) <= 0}
                style={{
                  background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-orange))',
                  border: 'none',
                  color: '#0b0c10',
                  padding: '0.6rem 1.4rem',
                  borderRadius: 'var(--radius-md)',
                  cursor: (allergenModalItem.stock_quantity ?? 99) <= 0 ? 'not-allowed' : 'pointer',
                  fontWeight: 800,
                  opacity: (allergenModalItem.stock_quantity ?? 99) <= 0 ? 0.5 : 1
                }}
              >
                🍱 ไปจัดเซ็ตข้าวกล่อง
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
