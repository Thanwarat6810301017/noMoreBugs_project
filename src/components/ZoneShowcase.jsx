import React from 'react';
import { MapPin, Users, Sparkles, Music, Wine, Eye, ShieldCheck, ArrowRight } from 'lucide-react';

export default function ZoneShowcase({ onSelectZone }) {
  const zones = [
    {
      id: 'Indoor Main Dining',
      name: 'Indoor Main Dining',
      thaiName: 'ห้องรับรองหลัก (Main Grand Hall)',
      desc: 'บรรยากาศหรูหรา แชนเดอเลียร์คริสตัล คลอเคล้าเสียงดนตรีแจ๊สสด เหมาะสำหรับมื้อค่ำสุดประทับใจ',
      capacity: '2 - 6 ท่าน / โต๊ะ',
      icon: Music,
      badge: '🎷 Live Jazz Nightly',
      color: '#e5a853',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'Garden Glasshouse Terrace',
      name: 'Garden Glasshouse Terrace',
      thaiName: 'ระเบียงสวนพฤกษศาสตร์เรือนกระจก',
      desc: 'เรือนกระจกรายล้อมด้วยพรรณไม้เขียวขจี ให้แสงธรรมชาติในเวลากลางวัน และแสงเทียนโรแมนติกยามค่ำคืน',
      capacity: '2 - 6 ท่าน / โต๊ะ',
      icon: Sparkles,
      badge: '🌿 Romantic Glasshouse',
      color: '#10b981',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'Chef Counter Live Kitchen',
      name: 'Chef Counter Live Kitchen',
      thaiName: 'ที่นั่งเคาน์เตอร์ครัวเปิด (Chef Table)',
      desc: 'สัมผัสประสบการณ์ใกล้ชิดหน้าเตา ชมศิลปะการปรุงอาหารและการจัดจานแบบสดๆ จากทีมเชฟมิชลิน',
      capacity: '2 - 4 ท่าน / เคาน์เตอร์',
      icon: Eye,
      badge: '👨‍🍳 Omakase Experience',
      color: '#f59e0b',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'VIP Presidential Suite',
      name: 'VIP Presidential Suite',
      thaiName: 'ห้องรับรองประธานาธิบดี (Private Suite)',
      desc: 'ความเป็นส่วนตัวขั้นสูงสุด พร้อมบัตเลอร์ส่วนตัวดูแลตลอดมื้ออาหาร ห้องน้ำส่วนตัว และระบบเสียงไฮเอนด์',
      capacity: '8 - 10 ท่าน (กลุ่มใหญ่)',
      icon: ShieldCheck,
      badge: '👑 Private Butler Service',
      color: '#a855f7',
      image: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'Rooftop Sky Bar',
      name: 'Rooftop Sky Bar',
      thaiName: 'สกายบาร์ดาดฟ้าชมวิวพาโนรามา',
      desc: 'ชมทัศนียภาพเส้นขอบฟ้ากรุงเทพฯ ยามราตรีแบบ 360 องศา พร้อมค็อกเทลสูตรพิเศษจาก Mixologist ชั้นนำ',
      capacity: '2 - 6 ท่าน / โต๊ะ',
      icon: Wine,
      badge: '🍸 360° Skyline View',
      color: '#3b82f6',
      image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80'
    }
  ];

  return (
    <section id="dining-zones" style={{ padding: '4.5rem 3rem', maxWidth: '1300px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span style={{ background: 'rgba(229,168,83,0.12)', border: '1px solid var(--border-active)', color: 'var(--accent-gold)', padding: '0.4rem 1.2rem', borderRadius: '30px', fontSize: '0.85rem', fontWeight: 'bold' }}>
          🏛️ โซนที่นั่งและบรรยากาศ (5 Signature Dining Zones)
        </span>
        <h2 style={{ fontSize: '2.4rem', color: '#fff', marginTop: '0.8rem' }}>
          เลือกบรรยากาศที่ใช่ สำหรับทุกช่วงเวลาสำคัญของคุณ
        </h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0.6rem auto 0 auto', fontSize: '0.95rem' }}>
          ร้านอาหาร LUXE DINING ออกแบบพื้นที่ 5 โซนเฉพาะทาง เพื่อมอบอารมณ์และประสบการณ์ที่แตกต่างในทุกการมาเยือน
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        {zones.map(z => {
          const IconComp = z.icon;
          return (
            <div 
              key={z.id}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease, border-color 0.3s ease',
                boxShadow: '0 8px 24px rgba(0,0,0,0.35)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.borderColor = z.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
              }}
            >
              <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                <img 
                  src={z.image} 
                  alt={z.thaiName} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', border: `1px solid ${z.color}`, color: z.color, padding: '0.25rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                  {z.badge}
                </div>
              </div>

              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <IconComp size={18} color={z.color} />
                    <h3 style={{ fontSize: '1.25rem', color: '#fff' }}>{z.thaiName}</h3>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', marginBottom: '0.8rem', fontWeight: '500' }}>
                    {z.name} • 👥 {z.capacity}
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.2rem' }}>
                    {z.desc}
                  </p>
                </div>

                <button 
                  onClick={() => onSelectZone(z.id)}
                  style={{
                    width: '100%',
                    background: 'var(--bg-glass)',
                    border: '1px solid var(--border-active)',
                    color: 'var(--accent-gold)',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, var(--accent-gold), var(--accent-orange))';
                    e.currentTarget.style.color = '#0b0c10';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--bg-glass)';
                    e.currentTarget.style.color = 'var(--accent-gold)';
                  }}
                >
                  เลือกโต๊ะในโซนนี้ <ArrowRight size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
