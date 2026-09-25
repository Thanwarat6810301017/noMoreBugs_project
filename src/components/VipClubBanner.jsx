import React, { useState } from 'react';
import { Crown, Sparkles, Send, CheckCircle2 } from 'lucide-react';

export default function VipClubBanner() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setIsSubscribed(true);
    }
  };

  return (
    <section style={{ padding: '4rem 2rem', background: 'radial-gradient(ellipse at center, rgba(229,168,83,0.15) 0%, rgba(11,12,16,0.9) 70%)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
      <div style={{ maxWidth: '850px', margin: '0 auto', textAlign: 'center', background: 'rgba(20,23,31,0.85)', backdropFilter: 'blur(20px)', border: '1px solid var(--border-active)', borderRadius: 'var(--radius-lg)', padding: '3rem 2.5rem', boxShadow: '0 20px 50px rgba(0,0,0,0.6)' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(229,168,83,0.15)', color: 'var(--accent-gold)', padding: '0.4rem 1.2rem', borderRadius: '30px', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          <Crown size={16} /> LUXE VIP CONCIERGE CLUB
        </div>
        
        <h2 style={{ fontSize: '2.2rem', color: '#fff', marginBottom: '0.8rem' }}>
          รับสิทธิพิเศษ Tasting Menu และส่วนลด 15% ในวันเกิด
        </h2>
        
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto 2rem auto', lineHeight: 1.6 }}>
          ลงทะเบียนรับการแจ้งเตือนคอร์สอาหารตามฤดูกาล สิทธิเข้าถึงโต๊ะ VIP และไวน์เทสติ้งสุดเอ็กซ์คลูซีฟก่อนใคร
        </p>

        {isSubscribed ? (
          <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid #10b981', color: '#34d399', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'inline-flex', alignItems: 'center', gap: '0.6rem', fontSize: '1rem', fontWeight: 'bold' }}>
            <CheckCircle2 size={20} /> ขอบคุณสำหรับการลงทะเบียน! สิทธิพิเศษถูกส่งไปยังอีเมลของคุณเรียบร้อยแล้ว
          </div>
        ) : (
          <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '0.8rem', maxWidth: '520px', margin: '0 auto' }}>
            <input 
              type="email" 
              placeholder="กรอกอีเมลของคุณ (เช่น yourname@email.com)" 
              className="form-input" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ flex: 1, padding: '0.9rem 1.2rem', borderRadius: '30px' }}
            />
            <button 
              type="submit" 
              className="nav-badge-btn"
              style={{ padding: '0.9rem 1.8rem', borderRadius: '30px', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              รับสิทธิพิเศษ <Send size={16} />
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
