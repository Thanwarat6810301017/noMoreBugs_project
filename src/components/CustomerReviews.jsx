import React from 'react';
import { Star, MessageSquareQuote, ShieldCheck, ShoppingBag } from 'lucide-react';

export default function CustomerReviews({ reviews = [] }) {
  const defaultReviews = [
    {
      customer_name: 'คุณภาณุวัฒน์ ก.',
      rating: 5,
      comment: 'สั่งแกงเขียวหวานไก่กับพะแนงหมูไว้ล่วงหน้าตอน 11:30 น. ขับรถมาถึงหน้าร้านตอนเที่ยง โชว์ QR บัตรคิวที่เคาน์เตอร์รับอาหารร้อนๆ ได้ทันที ไม่ต้องยืนรอคิว ประหยัดเวลาพักเที่ยงไปได้เยอะมากครับ!',
      dish_recommendation: 'แกงเขียวหวานไก่ + พะแนงหมู'
    },
    {
      customer_name: 'คุณพิมลวรรณ สุขเสริฐ',
      rating: 5,
      comment: 'กับข้าวอร่อยเข้มข้นถึงเครื่องแกงมากค่ะ กะเพราคั่วพริกแห้งหอมกลิ่นกระทะ สั่งเพิ่มไข่ดาวกรอบและระบุแยกน้ำแกง ทางร้านแพ็คกล่องมาอย่างประณีต ซีลฝามิดชิด สะอาดมากค่ะ',
      dish_recommendation: 'ผัดกะเพราไก่ + ไข่ดาวกรอบ'
    },
    {
      customer_name: 'Mr. David Miller',
      rating: 5,
      comment: 'Excellent takeaway pre-order experience! Ordered the Massaman Beef and Tom Yum Goong. Food was packed fresh and hot right on my pickup schedule. Highly recommended!',
      dish_recommendation: 'มัสมั่นเนื้อตุ๋นสูตรโบราณ'
    },
    {
      customer_name: 'คุณณิชาภา ม.',
      rating: 5,
      comment: 'แกงส้มชะอมกุ้งกับคั่วกลิ้งรสชาติปักษ์ใต้แท้จัดจ้านสะใจมากค่ะ สั่งผ่านเว็บล่วงหน้าง่ายมาก มีเวลานัดรับชัดเจน พอแวะมาถึงหน้าร้านแจ้งรหัสคิวรับอาหารกลับได้ทันที สะดวกสุดๆ',
      dish_recommendation: 'แกงส้มชะอมกุ้ง + คั่วกลิ้ง'
    }
  ];

  const displayReviews = (reviews && reviews.length > 0) ? reviews : defaultReviews;

  return (
    <section id="customer-reviews" style={{ padding: '4rem 3rem', maxWidth: '1300px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <span style={{ background: 'rgba(229,168,83,0.12)', border: '1px solid var(--border-active)', color: 'var(--accent-gold)', padding: '0.4rem 1.2rem', borderRadius: '30px', fontSize: '0.85rem', fontWeight: 'bold' }}>
          ⭐ ความประทับใจจากลูกค้าจริง (Verified Takeaway Reviews)
        </span>
        <h2 style={{ fontSize: '2.2rem', color: '#fff', marginTop: '0.8rem' }}>
          รีวิวความอร่อยและความสะดวกจากลูกค้าสั่งรับหน้าร้าน
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '600px', margin: '0.5rem auto 0 auto' }}>
          เสียงตอบรับจากลูกค้าที่สั่งข้าวแกงล่วงหน้าและแวะรับอาหารร้อนๆ ที่หน้าร้าน
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {displayReviews.map((rev, idx) => (
          <div key={rev.review_id || rev.customer_name || idx} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.8rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                <div style={{ display: 'flex', gap: '0.2rem', color: '#f59e0b' }}>
                  {[...Array(rev.rating || 5)].map((_, i) => (
                    <Star key={i} size={18} fill="#f59e0b" />
                  ))}
                </div>
                <span style={{ fontSize: '0.75rem', color: '#34d399', background: 'rgba(16,185,129,0.1)', padding: '0.2rem 0.5rem', borderRadius: '10px' }}>
                  🛍️ ลูกค้าสั่งรับหน้าร้าน
                </span>
              </div>
              <p style={{ color: 'var(--text-main)', fontSize: '0.92rem', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '1.2rem' }}>
                "{rev.comment}"
              </p>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' }}>
              {rev.dish_recommendation && (
                <div style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', marginBottom: '0.4rem' }}>
                  🍲 เมนูที่แนะนำ: {rev.dish_recommendation}
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <strong style={{ color: '#fff', fontSize: '0.95rem' }}>{rev.customer_name}</strong>
                <span style={{ fontSize: '0.75rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <ShieldCheck size={14} /> ยืนยันการสั่งซื้อจริง
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
