import React from 'react';
import { Award, Sparkles, Flame, CheckCircle, Utensils, Heart } from 'lucide-react';

export default function ChefStory() {
  const pillars = [
    {
      title: 'Dry-Aging Cellar 45 วัน',
      desc: 'ห้องบ่มเนื้อควบคุมอุณหภูมิและความชื้นด้วยหินเกลือหิมาลายันสีชมพู เพื่อให้เนื้อวากิวและริบอายนุ่มเข้มข้นที่สุด'
    },
    {
      title: 'Farm-to-Table Organic',
      desc: 'ผักสลัดและสมุนไพรสดทั้งหมดส่งตรงจากฟาร์มออร์แกนิกเขาใหญ่ที่ได้รับการรับรองมาตรฐานสากลทุกเช้า'
    },
    {
      title: 'Air-Flown Seafood & Caviar',
      desc: 'แซลมอนสดจากฟยอร์ดนอร์เวย์ หอยนางรมบริตตานี และคาร์เวียร์พรีเมียม ขนส่งทางอากาศควบคุมความเย็น 0-2°C'
    },
    {
      title: 'Sommelier Wine Collection',
      desc: 'คอลเลกชันไวน์หายากกว่า 500 ฉลาก คัดสรรโดย Head Sommelier เพื่อจับคู่รสชาติให้สมบูรณ์แบบในทุกจาน'
    }
  ];

  return (
    <section id="chef-story" style={{ padding: '5rem 3rem', background: 'linear-gradient(180deg, rgba(20,23,31,0.7) 0%, rgba(11,12,16,0.95) 100%)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '3.5rem', alignItems: 'center' }}>
        {/* Left Chef Photo / Showcase */}
        <div style={{ position: 'relative' }}>
          <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-active)', boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }}>
            <img 
              src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=800&q=80" 
              alt="Executive Chef Antoine Laurent"
              style={{ width: '100%', height: '520px', objectFit: 'cover' }}
            />
          </div>

          {/* Floating Michelin Distinction Badge */}
          <div style={{ position: 'absolute', bottom: '-20px', right: '-15px', background: 'rgba(11,12,16,0.95)', border: '1px solid var(--accent-gold)', borderRadius: 'var(--radius-md)', padding: '1rem 1.4rem', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{ background: 'rgba(229,168,83,0.15)', padding: '0.6rem', borderRadius: '50%', color: 'var(--accent-gold)' }}>
              <Award size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>MICHELIN GUIDE 2026</div>
              <div style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--accent-gold)' }}>⭐⭐⭐ Selected Dining</div>
            </div>
          </div>
        </div>

        {/* Right Story Description */}
        <div>
          <span style={{ background: 'rgba(229,168,83,0.12)', border: '1px solid var(--border-active)', color: 'var(--accent-gold)', padding: '0.4rem 1.2rem', borderRadius: '30px', fontSize: '0.85rem', fontWeight: 'bold' }}>
            👨‍🍳 เรื่องราวและความหลงใหลในอาหาร (Our Philosophy)
          </span>
          <h2 style={{ fontSize: '2.5rem', color: '#fff', marginTop: '1rem', lineHeight: 1.25 }}>
            ศิลปะแห่งรสชาติระดับมิชลิน <br /><span style={{ color: 'var(--accent-gold)' }}>ที่รังสรรค์ด้วยหัวใจและความพิถีพิถัน</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.8, marginTop: '1rem', marginBottom: '1.8rem' }}>
            ที่ <strong>LUXE DINING</strong> เราเชื่อว่ามื้ออาหารชั้นเลิศไม่ได้เป็นเพียงแค่อาหาร แต่คือความทรงจำที่ตราตรึง โดยทีมเชฟนำโดย <em>Executive Chef Antoine Laurent</em> ผู้สั่งสมประสบการณ์จากร้านอาหารระดับ 3 ดาวมิชลินในปารีสและโตเกียว ผสานความลุ่มลึกของวัตถุดิบท้องถิ่นไทยเกรดพรีเมียม
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
            {pillars.map((item, idx) => (
              <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--radius-md)', padding: '1rem 1.2rem' }}>
                <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                  <CheckCircle size={15} color="var(--accent-gold)" /> {item.title}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
