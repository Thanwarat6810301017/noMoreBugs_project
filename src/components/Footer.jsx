import React from 'react';
import { Utensils, MapPin, Phone, Mail, Clock, ShoppingBag } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: '#08090d', borderTop: '1px solid var(--border-color)', padding: '3rem 3rem 1.5rem 3rem', marginTop: '4rem' }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        <div>
          <div className="brand-logo" style={{ marginBottom: '1rem' }}>
            <Utensils color="var(--accent-gold)" size={24} />
            ข้าวแกง <span>LUXE DINING</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            ระบบสั่งอาหาร/สั่งข้าวแกงล่วงหน้าเพื่อรับที่หน้าร้าน (Takeaway Pre-Order) ปรุงสดใหม่จากหม้อทุกเช้า สั่งง่าย นัดเวลารับได้ทันใจ แวะรับอาหารร้อนๆ ได้ทันที ไม่ต้องยืนรอคิว
          </p>
        </div>

        <div>
          <h4 style={{ color: 'var(--accent-gold)', marginBottom: '1rem', fontSize: '1rem' }}>ข้อมูลร้านอาหาร & จุดรับอาหาร</h4>
          <ul style={{ listStyle: 'none', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 2 }}>
            <li><MapPin size={14} style={{ display: 'inline', marginRight: '6px' }} /> 123 อาคารลักซ์สตรีท สุขุมวิท กรุงเทพฯ</li>
            <li><Phone size={14} style={{ display: 'inline', marginRight: '6px' }} /> 02-999-9999 / 081-234-5678</li>
            <li><Mail size={14} style={{ display: 'inline', marginRight: '6px' }} /> contact@luxedining.com</li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: 'var(--accent-gold)', marginBottom: '1rem', fontSize: '1rem' }}>เวลาเปิดให้บริการรับหน้าร้าน</h4>
          <ul style={{ listStyle: 'none', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 2 }}>
            <li><Clock size={14} style={{ display: 'inline', marginRight: '6px' }} /> บริการรับหน้าร้าน: 07:00 - 20:00 น.</li>
            <li><ShoppingBag size={14} style={{ display: 'inline', marginRight: '6px' }} /> สั่งอาหารล่วงหน้าออนไลน์: ตลอด 24 ชั่วโมง</li>
            <li style={{ color: '#34d399', fontWeight: 'bold' }}>เปิดให้บริการทุกวันไม่มีวันหยุด</li>
          </ul>
        </div>
      </div>

      <div style={{ textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        © 2026 ข้าวแกง LUXE DINING - ระบบสั่งอาหารล่วงหน้าเพื่อรับที่หน้าร้าน (Takeaway Pre-Order). All rights reserved.
      </div>
    </footer>
  );
}
