import React from 'react';
import { Star, MessageSquareQuote, ShieldCheck } from 'lucide-react';

export default function CustomerReviews({ reviews }) {
  return (
    <section style={{ padding: '4rem 3rem', maxWidth: '1300px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <span style={{ background: 'rgba(229,168,83,0.12)', border: '1px solid var(--border-active)', color: 'var(--accent-gold)', padding: '0.4rem 1.2rem', borderRadius: '30px', fontSize: '0.85rem', fontWeight: 'bold' }}>
          ⭐ ความประทับใจจากลูกค้าจริง (Verified Reviews)
        </span>
        <h2 style={{ fontSize: '2.2rem', color: '#fff', marginTop: '0.8rem' }}>
          รีวิวระดับ 5 ดาวจากผู้ใช้บริการ LUXE DINING
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {reviews.map(rev => (
          <div key={rev.review_id || rev.customer_name} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.8rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', gap: '0.2rem', color: '#f59e0b', marginBottom: '0.8rem' }}>
                {[...Array(rev.rating || 5)].map((_, i) => (
                  <Star key={i} size={18} fill="#f59e0b" />
                ))}
              </div>
              <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '1.5rem' }}>
                "{rev.comment}"
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' }}>
              <strong style={{ color: 'var(--accent-gold)', fontSize: '0.95rem' }}>{rev.customer_name}</strong>
              <span style={{ fontSize: '0.75rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <ShieldCheck size={14} /> Verified Guest
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
