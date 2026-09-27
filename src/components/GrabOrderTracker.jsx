import React from 'react';
import { CheckCircle, Clock, ShoppingBag, Award, Flame } from 'lucide-react';

export default function GrabOrderTracker({ reservation }) {
  if (!reservation) return null;

  const stages = [
    { key: 'confirmed', title: '1. ได้รับออเดอร์', desc: 'ร้านค้าได้รับรายการสั่งล่วงหน้าเรียบร้อยแล้ว', icon: CheckCircle },
    { key: 'preparing', title: '2. กำลังปรุงและแพ็ค 👨‍🍳', desc: 'ตักกับข้าวใส่กล่องร้อนๆ อย่างสะอาดและพิถีพิถัน', icon: Flame },
    { key: 'ready', title: '3. พร้อมรับที่หน้าร้าน 🛍️', desc: 'อาหารพร้อมให้คุณแวะมารับที่เคาน์เตอร์หน้าร้านแล้ว', icon: ShoppingBag },
    { key: 'completed', title: '4. รับอาหารเรียบร้อย 🏁', desc: 'ขอบคุณที่ใช้บริการสั่งข้าวแกงล่วงหน้า', icon: Award }
  ];

  const currentStageIndex = stages.findIndex(s => s.key === (reservation.order_stage || 'confirmed'));

  return (
    <div style={{ background: 'linear-gradient(135deg, rgba(20,23,31,0.95), rgba(15,17,23,0.95))', border: '1px solid var(--border-active)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.8rem', flexWrap: 'wrap', gap: '0.6rem' }}>
        <div>
          <span style={{ background: 'rgba(16,185,129,0.2)', color: '#34d399', padding: '0.2rem 0.6rem', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 'bold' }}>
            ติดตามสถานะออเดอร์รับหน้าร้านแบบ Realtime
          </span>
          <h4 style={{ fontSize: '1.2rem', color: '#fff', marginTop: '0.3rem' }}>
            รหัสคิวรับอาหาร: <span style={{ color: 'var(--accent-gold)' }}>{reservation.booking_code || `LX-${reservation.reservation_id}`}</span>
          </h4>
        </div>

        <div style={{ textAlign: 'right' }}>
          <small style={{ color: 'var(--text-muted)' }}>เวลานัดรับอาหาร</small>
          <div style={{ fontSize: '1.1rem', color: 'var(--accent-gold)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Clock size={16} /> {reservation.reservation_time} น.
          </div>
        </div>
      </div>

      {/* 4-Step Timeline Progress Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.8rem', position: 'relative' }}>
        {stages.map((stg, idx) => {
          const IconComp = stg.icon;
          const isPassed = idx <= currentStageIndex;
          const isCurrent = idx === currentStageIndex;

          return (
            <div 
              key={stg.key}
              style={{
                background: isCurrent ? 'linear-gradient(135deg, rgba(229,168,83,0.2), rgba(255,94,54,0.15))' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${isPassed ? 'var(--accent-gold)' : 'var(--border-color)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '1rem 0.8rem',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                boxShadow: isCurrent ? '0 0 15px rgba(229,168,83,0.3)' : 'none'
              }}
            >
              <div style={{ margin: '0 auto 0.5rem auto', width: '36px', height: '36px', borderRadius: '50%', background: isPassed ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isPassed ? '#0b0c10' : 'var(--text-muted)' }}>
                <IconComp size={18} />
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: isPassed ? '#fff' : 'var(--text-muted)', marginBottom: '0.2rem' }}>
                {stg.title}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>
                {stg.desc}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
