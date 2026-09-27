import React from 'react';
import { Clock, ShieldCheck, ShoppingBag, PackageCheck, Phone, MapPin, Sparkles } from 'lucide-react';

export default function DiningPolicies() {
  const policies = [
    {
      icon: ShoppingBag,
      title: 'จุดรับอาหารหน้าร้าน (Express Pickup)',
      highlight: 'ช่องรับอาหารด่วนพิเศษ ไม่ต้องรอคิว',
      desc: 'แสดงรหัสคิวหรือ QR Code บนหน้าจอ E-Voucher ต่อพนักงานที่เคาน์เตอร์ Express Pickup เพื่อรับอาหารร้อนๆ ได้ทันที'
    },
    {
      icon: Clock,
      title: 'เวลาเปิดรับอาหาร (Pickup Operating Hours)',
      highlight: 'เปิดบริการทุกวัน 07:00 - 20:00 น.',
      desc: 'สามารถสั่งอาหารล่วงหน้าผ่านระบบได้ตลอด 24 ชั่วโมง และเลือกเวลานัดรับได้ตั้งแต่ช่วงเช้า มื้อเที่ยง ถึงมื้อค่ำ'
    },
    {
      icon: PackageCheck,
      title: 'บรรจุภัณฑ์คุณภาพ (Food Grade Packaging)',
      highlight: 'ซีลกล่องปิดสนิท เก็บความร้อน',
      desc: 'บรรจุภัณฑ์เกรดพรีเมียม ปลอดภัย ซีลฝามิดชิด แยกน้ำแกงและกับข้าวอย่างเรียบร้อย คงความสดใหม่และรสชาติต้นตำรับ'
    },
    {
      icon: Sparkles,
      title: 'ปรุงสดใหม่ตามเวลานัด (Hot & Fresh Guarantee)',
      highlight: 'อาหารร้อนพร้อมรับตามเวลาที่คุณระบุ',
      desc: 'ทางร้านจะจัดเตรียมอาหารเสร็จพอดีกับเวลาที่คุณนัดรับ แนะนำให้มารับตามเวลาที่กำหนดเพื่อรสชาติที่ดีที่สุดจากเตา'
    },

    {
      icon: Phone,
      title: 'การติดต่อหรือแจ้งเลื่อนเวลา (Customer Support)',
      highlight: 'โทร 02-999-9999 หรือ 081-234-5678',
      desc: 'หากต้องการเปลี่ยนแปลงเวลานัดรับอาหาร กรุณาติดต่อทางร้านล่วงหน้าอย่างน้อย 20 นาที เพื่อการจัดเตรียมที่สมบูรณ์'
    }
  ];

  return (
    <section id="dining-policies" style={{ padding: '4.5rem 3rem', maxWidth: '1300px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span style={{ background: 'rgba(229,168,83,0.12)', border: '1px solid var(--border-active)', color: 'var(--accent-gold)', padding: '0.4rem 1.2rem', borderRadius: '30px', fontSize: '0.85rem', fontWeight: 'bold' }}>
          📋 ข้อกำหนดและข้อมูลการรับอาหารหน้าร้าน (Store Pickup Guide)
        </span>
        <h2 style={{ fontSize: '2.4rem', color: '#fff', marginTop: '0.8rem' }}>
          ข้อมูลสำหรับการแวะรับอาหารหน้าร้าน ข้าวแกง LUXE DINING
        </h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0.6rem auto 0 auto', fontSize: '0.95rem' }}>
          เพื่อความสะดวกรวดเร็วและประสบการณ์สั่งอาหารกลับบ้านที่ราบรื่น กรุณาตรวจสอบข้อมูลการให้บริการ
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
