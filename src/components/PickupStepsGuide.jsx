import React from 'react';
import { ShoppingBag, Clock, QrCode, Store, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export default function PickupStepsGuide({ onScrollToMenu }) {
  const steps = [
    {
      step: '01',
      icon: ShoppingBag,
      title: 'เลือกเมนูกับข้าว & ปรับแต่ง',
      desc: 'เลือกกับข้าวรสเด็ด ปรุงสดใหม่จากหม้อ ระบุความเผ็ด และเลือกท็อปปิ้งเสริม เช่น ไข่ดาวกรอบ หรือข้าวสวยหอมมะลิ',
      badge: '🍲 ปรุงสดใหม่ทุกวัน',
      color: '#e5a853'
    },
    {
      step: '02',
      icon: Clock,
      title: 'ระบุเวลาที่จะมารับอาหาร',
      desc: 'เลือกวันที่และเวลาที่คุณจะแวะมารับที่หน้าร้าน ทางร้านจะกะเวลาปรุงและตักใส่กล่องร้อนๆ รอคุณพอดี',
      badge: '⏰ ตรงเวลา ไม่ต้องรอคิว',
      color: '#34d399'
    },
    {
      step: '03',
      icon: QrCode,
      title: 'สแกนชำระเงินผ่าน PromptPay',
      desc: 'ชำระเงินสะดวกรวดเร็วผ่าน QR Code พร้อมรับโค้ดส่วนลดและ E-Voucher บัตรคิวดิจิทัลบนมือถือทันที',
      badge: '💳 ปลอดภัย & ไร้สัมผัส',
      color: '#3b82f6'
    },
    {
      step: '04',
      icon: Store,
      title: 'แวะรับอาหารที่เคาน์เตอร์หน้าร้าน',
      desc: 'มาถึงร้านแล้วเดินเข้าช่อง Express Pickup แสดงรหัสคิวหรือ QR บนมือถือ รับอาหารร้อนๆ กลับบ้านได้ทันที!',
      badge: '⚡ Express Lane',
      color: '#f59e0b'
    }
  ];

  return (
    <section id="pickup-guide" style={{ padding: '4.5rem 3rem', maxWidth: '1300px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span style={{ background: 'rgba(229,168,83,0.12)', border: '1px solid var(--border-active)', color: 'var(--accent-gold)', padding: '0.4rem 1.2rem', borderRadius: '30px', fontSize: '0.85rem', fontWeight: 'bold' }}>
          🛍️ บริการสั่งอาหารล่วงหน้ารับหน้าร้าน (Takeaway Pre-Order Service)
        </span>
        <h2 style={{ fontSize: '2.4rem', color: '#fff', marginTop: '0.8rem' }}>
          4 ขั้นตอนง่ายๆ แวะรับอาหารหน้าร้านได้ทันที ไม่ต้องรอคิว
        </h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '680px', margin: '0.6rem auto 0 auto', fontSize: '0.95rem' }}>
          ช่วยให้คุณประหยัดเวลาในชั่วโมงเร่งด่วน สั่งล่วงหน้าตั้งแต่เช้าหรือระหว่างเดินทาง แล้วแวะรับกับข้าวร้อนๆ อร่อยเหมือนทานที่ร้าน
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {steps.map((stg) => {
          const IconComp = stg.icon;
          return (
            <div
              key={stg.step}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem 1.6rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 24px rgba(0,0,0,0.35)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.borderColor = stg.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
              }}
            >
              <div style={{ position: 'absolute', top: '15px', right: '15px', fontSize: '2.5rem', fontWeight: '900', color: 'rgba(255,255,255,0.04)', userSelect: 'none' }}>
                {stg.step}
              </div>

              <div>
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: `rgba(${stg.color === '#e5a853' ? '229,168,83' : stg.color === '#34d399' ? '52,211,153' : stg.color === '#3b82f6' ? '59,130,246' : '245,158,11'}, 0.15)`, border: `1px solid ${stg.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stg.color, marginBottom: '1.2rem' }}>
                  <IconComp size={26} />
                </div>

                <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.05)', color: stg.color, fontSize: '0.75rem', fontWeight: 'bold', padding: '0.2rem 0.6rem', borderRadius: '12px', marginBottom: '0.6rem' }}>
                  {stg.badge}
                </div>

                <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.6rem' }}>
                  {stg.step}. {stg.title}
                </h3>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  {stg.desc}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: stg.color, fontSize: '0.82rem', fontWeight: 'bold' }}>
                <CheckCircle2 size={15} /> สะดวกรวดเร็ว ปรุงร้อนพร้อมรับ
              </div>
            </div>
          );
        })}
      </div>

      {onScrollToMenu && (
        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <button
            onClick={onScrollToMenu}
            className="nav-badge-btn"
            style={{ padding: '0.85rem 2rem', fontSize: '0.95rem' }}
          >
            เลือกดูเมนูข้าวแกงและสั่งอาหารล่วงหน้า <ArrowRight size={18} />
          </button>
        </div>
      )}
    </section>
  );
}
