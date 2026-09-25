import React from 'react';
import { Clock, ShieldCheck, Shirt, Car, Wine, HelpCircle, Phone, MapPin } from 'lucide-react';

export default function DiningPolicies() {
  const policies = [
    {
      icon: Shirt,
      title: 'การแต่งกาย (Dress Code)',
      highlight: 'Smart Casual / Elegant',
      desc: 'ขอความกรุณางดสวมเสื้อกล้าม กางเกงขาสั้นชาย และรองเท้าแตะ เพื่อรักษาบรรยากาศอันงดงามของห้องอาหาร'
    },
    {
      icon: Clock,
      title: 'เวลาเปิดให้บริการ (Opening Hours)',
      highlight: 'เปิดบริการทุกวัน (Lunch & Dinner)',
      desc: 'มื้อกลางวัน: 11:30 - 14:30 น. (Last Order 14:00) | มื้อค่ำ: 17:30 - 23:30 น. (Last Order 22:30)'
    },
    {
      icon: Car,
      title: 'บริการที่จอดรถ (Valet Parking)',
      highlight: 'บริการรับจอดรถฟรี & EV Charger',
      desc: 'มีจุดบริการ Valet Parking ฟรีบริเวณหน้าทางเข้าหลัก พร้อมสถานีชาร์จรถยนต์ไฟฟ้าความเร็วสูง'
    },
    {
      icon: Wine,
      title: 'นโยบายการนำไวน์มาเอง (Corkage Fee)',
      highlight: '฿1,000 / ขวด หรือฟรีแบบ 1-for-1',
      desc: 'ค่าบริการเปิดขวดไวน์ ฿1,000 ต่อขวด 750ml หรือยกเว้นค่าบริการเปิดขวดเมื่อสั่งไวน์จากรายการของร้าน 1 ขวด'
    },
    {
      icon: ShieldCheck,
      title: 'นโยบายการสำรองที่นั่ง (Cancellation)',
      highlight: 'แจ้งล่วงหน้าอย่างน้อย 24 ชั่วโมง',
      desc: 'สามารถเปลี่ยนแปลงหรือยกเลิกการจองได้โดยไม่มีค่าธรรมเนียม เมื่อแจ้งล่วงหน้าอย่างน้อย 24 ชั่วโมงก่อนเวลานัด'
    },
    {
      icon: MapPin,
      title: 'การเดินทางและพิกัด (Location)',
      highlight: 'ถนนวิทยุ (Wireless Rd), ลุมพินี, กทม.',
      desc: 'เดินทางสะดวกด้วย BTS สถานีเพลินจิต (ทางออก 2) หรือ MRT สถานีลุมพินี มีรถลีมูซีนรับ-ส่งบริการ'
    }
  ];

  return (
    <section id="dining-policies" style={{ padding: '4.5rem 3rem', maxWidth: '1300px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span style={{ background: 'rgba(229,168,83,0.12)', border: '1px solid var(--border-active)', color: 'var(--accent-gold)', padding: '0.4rem 1.2rem', borderRadius: '30px', fontSize: '0.85rem', fontWeight: 'bold' }}>
          📋 ข้อมูลสำคัญและนโยบายห้องอาหาร (Dining Etiquette & Guide)
        </span>
        <h2 style={{ fontSize: '2.4rem', color: '#fff', marginTop: '0.8rem' }}>
          ข้อมูลสำหรับการเตรียมตัวก่อนมาเยือน LUXE DINING
        </h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0.6rem auto 0 auto', fontSize: '0.95rem' }}>
          เพื่อความสะดวกสบายและประสบการณ์มื้ออาหารที่ไร้รอยต่อ กรุณาตรวจสอบข้อมูลนโยบายการให้บริการ
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {policies.map((p, idx) => {
          const IconC = p.icon;
          return (
            <div 
              key={idx}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.8rem',
                display: 'flex',
                gap: '1.2rem',
                alignItems: 'flex-start'
              }}
            >
              <div style={{ background: 'rgba(229,168,83,0.1)', border: '1px solid var(--border-active)', padding: '0.8rem', borderRadius: 'var(--radius-md)', color: 'var(--accent-gold)' }}>
                <IconC size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '0.3rem' }}>{p.title}</h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  {p.highlight}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  {p.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
