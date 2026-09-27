import React, { useState } from 'react';
import { ShoppingBag, ArrowRight, Trash2, ChevronUp, ChevronDown, X, Package } from 'lucide-react';

export default function StickyCartBar({ cart, cartTotal, onOpenBooking, onRemoveFromCart, onUpdateQuantity }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!cart || cart.length === 0) return null;

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* Expanded Cart Detail Panel */}
      {isExpanded && (
        <div style={{
          position: 'fixed', bottom: '90px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 998, width: '90%', maxWidth: '680px', maxHeight: '50vh',
          background: 'rgba(20, 23, 31, 0.98)', backdropFilter: 'blur(20px)',
          border: '1px solid var(--accent-gold)', borderRadius: '20px',
          boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.7), 0 0 25px rgba(229, 168, 83, 0.15)',
          overflowY: 'auto', animation: 'slideUp 0.25s ease-out'
        }}>
          {/* Cart Header */}
          <div style={{
            padding: '1rem 1.4rem', borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            position: 'sticky', top: 0, background: 'rgba(20, 23, 31, 0.98)', zIndex: 1
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Package size={18} style={{ color: 'var(--accent-gold)' }} />
              <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>
                ข้าวกล่องในตะกร้า ({totalQuantity} กล่อง)
              </span>
            </div>
            <button onClick={() => setIsExpanded(false)} style={{
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              color: 'var(--text-muted)', borderRadius: '50%', width: '32px', height: '32px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
            }}>
              <X size={16} />
            </button>
          </div>

          {/* Cart Items */}
          <div style={{ padding: '0.8rem 1.2rem' }}>
            {cart.map((item, idx) => (
              <div key={item.item_id || idx} style={{
                display: 'flex', alignItems: 'flex-start', gap: '0.8rem',
                padding: '0.8rem', marginBottom: '0.5rem',
                background: 'rgba(255,255,255,0.03)', borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.06)'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-orange))',
                  color: '#0b0c10', minWidth: '36px', height: '36px', borderRadius: '10px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: '0.9rem', flexShrink: 0
                }}>
                  🍱
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.88rem', marginBottom: '0.2rem' }}>
                    {item.name}
                  </div>
                  {item.custom_options && (
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '0.3rem' }}>
                      {item.custom_options}
                    </div>
                  )}
                  <div style={{ fontWeight: 800, color: 'var(--accent-gold)', fontSize: '0.9rem' }}>
                    ฿{(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', flexShrink: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    {onUpdateQuantity && (
                      <button onClick={() => onUpdateQuantity(item.item_id, -1)} style={{
                        background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)',
                        color: '#fff', width: '26px', height: '26px', borderRadius: '6px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                      }}>
                        <span style={{ fontSize: '1rem', lineHeight: 1 }}>−</span>
                      </button>
                    )}
                    <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem', minWidth: '20px', textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    {onUpdateQuantity && (
                      <button onClick={() => onUpdateQuantity(item.item_id, 1)} style={{
                        background: 'rgba(229,168,83,0.2)', border: '1px solid var(--accent-gold)',
                        color: 'var(--accent-gold)', width: '26px', height: '26px', borderRadius: '6px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                      }}>
                        <span style={{ fontSize: '1rem', lineHeight: 1 }}>+</span>
                      </button>
                    )}
                  </div>
                  {onRemoveFromCart && (
                    <button onClick={() => onRemoveFromCart(item.item_id)} style={{
                      background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                      color: '#f87171', padding: '0.2rem 0.5rem', borderRadius: '6px',
                      fontSize: '0.65rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem',
                      fontWeight: 600
                    }}>
                      <Trash2 size={10} /> ลบ
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Price Summary in expanded panel */}
          <div style={{
            padding: '0.8rem 1.4rem', borderTop: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(229,168,83,0.05)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>ราคารวม ({totalQuantity} กล่อง)</span>
              <span style={{ color: 'var(--accent-gold)', fontWeight: 800, fontSize: '1.1rem' }}>
                ฿{cartTotal.toLocaleString()}
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              💡 ราคาตามจำนวนกับข้าวที่เลือก: 1 อย่าง ฿40 / 2 อย่าง ฿45 / 3 อย่าง ฿50 + ท็อปปิ้ง
            </div>
          </div>
        </div>
      )}

      {/* Main Floating Bar */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 999,
        width: '90%',
        maxWidth: '680px',
        background: 'rgba(20, 23, 31, 0.96)',
        backdropFilter: 'blur(16px)',
        border: '1px solid var(--accent-gold)',
        borderRadius: '50px',
        padding: '0.8rem 1.6rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 12px 35px rgba(0, 0, 0, 0.7), 0 0 20px rgba(229, 168, 83, 0.25)',
        animation: 'slideUp 0.3s ease-out'
      }}>
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}
        >
          <div style={{
            background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-orange))',
            color: '#0b0c10',
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '1rem'
          }}>
            {totalQuantity}
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              🍱 ข้าวกล่อง {totalQuantity} กล่อง
              {isExpanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--accent-gold)' }}>
              ฿{cartTotal.toLocaleString()}
            </div>
          </div>
        </div>

        <button
          onClick={onOpenBooking}
          style={{
            background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-orange))',
            color: '#0b0c10',
            border: 'none',
            padding: '0.8rem 1.6rem',
            borderRadius: '30px',
            fontWeight: 'bold',
            fontSize: '0.95rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 15px rgba(229, 168, 83, 0.4)'
          }}
        >
          ระบุเวลารับ & สั่งอาหาร <ArrowRight size={18} />
        </button>
      </div>
    </>
  );
}
