import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export default function StickyCartBar({ cart, cartTotal, onOpenBooking }) {
  if (!cart || cart.length === 0) return null;

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            สั่งอาหารล่วงหน้าแล้ว {totalQuantity} จาน
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
        จองโต๊ะและสั่งอาหารทันที <ArrowRight size={18} />
      </button>
    </div>
  );
}
