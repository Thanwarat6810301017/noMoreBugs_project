import React from 'react';
import { Utensils, MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: '#08090d', borderTop: '1px solid var(--border-color)', padding: '3rem 3rem 1.5rem 3rem', marginTop: '4rem' }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        <div>
          <div className="brand-logo" style={{ marginBottom: '1rem' }}>
            <Utensils color="var(--accent-gold)" size={24} />
            LUXE <span>DINING</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            ประสบการณ์มื้ออาหาร Fine Dining สัมผัสรสชาติอันพิถีพิถันจากเชฟระดับมิชลิน จองโต๊ะอาหารและสั่งอาหารล่วงหน้าออนไลน์ได้ตลอด 24 ชั่วโมง
          </p>
        </div>

        <div>
          <h4 style={{ color: 'var(--accent-gold)', marginBottom: '1rem', fontSize: '1rem' }}>ข้อมูลร้านอาหาร</h4>
          <ul style={{ listStyle: 'none', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 2 }}>
            <li><MapPin size={14} style={{ display: 'inline', marginRight: '6px' }} /> 123 อาคารลักซ์สตรีท สุขุมวิท กรุงเทพฯ</li>
            <li><Phone size={14} style={{ display: 'inline', marginRight: '6px' }} /> 02-123-4567 / 081-234-5678</li>
            <li><Mail size={14} style={{ display: 'inline', marginRight: '6px' }} /> contact@luxedining.com</li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: 'var(--accent-gold)', marginBottom: '1rem', fontSize: '1rem' }}>เวลาเปิดให้บริการ</h4>
          <ul style={{ listStyle: 'none', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 2 }}>
            <li><Clock size={14} style={{ display: 'inline', marginRight: '6px' }} /> จันทร์ - ศุกร์: 17:00 - 23:00 น.</li>
            <li><Clock size={14} style={{ display: 'inline', marginRight: '6px' }} /> เสาร์ - อาทิตย์: 12:00 - 23:30 น.</li>
            <li style={{ color: '#34d399', fontWeight: 'bold' }}>เปิดให้บริการทุกวันไม่มีวันหยุด</li>
          </ul>
        </div>
      </div>

      <div style={{ textAlgin: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        © 2026 LUXE DINING Fine Dining System. All rights reserved. Built for Group Project & Open Source.
      </div>
    </footer>
  );
}
