import React, { useState, useEffect } from 'react';
import { User, Award, Calendar, CheckCircle, Clock, MapPin, QrCode } from 'lucide-react';
import { fetchUserReservations } from '../services/api';
import GrabOrderTracker from './GrabOrderTracker';

export default function CustomerProfile({ user, onSelectVoucher }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (user && user.user_id) {
      loadHistory();
    }
  }, [user]);

  const loadHistory = async () => {
    const res = await fetchUserReservations(user.user_id);
    setHistory(res);
  };

  if (!user) return null;

  const activeReservation = history.find(r => r.status === 'confirmed');

  return (
    <div style={{ padding: '3rem', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Profile Header Banner */}
      <div style={{ background: 'linear-gradient(135deg, rgba(229,168,83,0.15), rgba(255,94,54,0.1))', border: '1px solid var(--border-active)', borderRadius: 'var(--radius-lg)', padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ background: 'var(--accent-gold)', color: '#0b0c10', padding: '0.2rem 0.8rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>
              {user.role === 'customer' ? 'สมาชิกทรงเกียรติ (VIP Customer)' : 'พนักงานเจ้าหน้าที่ (Staff Editor)'}
            </span>
            <span style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--accent-gold)', border: '1px solid var(--accent-gold)', padding: '0.2rem 0.8rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>
              👑 {user.membership_tier || 'Gold Membership'}
            </span>
          </div>
          <h2 style={{ fontSize: '2rem', color: '#fff', marginTop: '0.4rem' }}>{user.name}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>อีเมล: {user.email} | โทร: {user.phone || '-'}</p>
        </div>

        <div style={{ textAlign: 'right', background: 'rgba(0,0,0,0.4)', padding: '1rem 1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', minWidth: '220px' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
            <Award size={16} color="var(--accent-gold)" /> คะแนนสะสม Reward Points
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--accent-gold)' }}>
            {user.reward_points || 0} <small style={{ fontSize: '1rem' }}>แต้ม</small>
          </div>
          <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginTop: '0.4rem', overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(100, ((user.reward_points || 0) / 2000) * 100)}%`, height: '100%', background: 'linear-gradient(90deg, #e5a853, #f59e0b)' }}></div>
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>สะสมอีก {Math.max(0, 2000 - (user.reward_points || 0))} แต้ม เพื่อเลื่อนเป็น Diamond VIP</div>
        </div>
      </div>

      {/* Grab-Style Live Order Tracker Component */}
      {activeReservation && (
        <GrabOrderTracker reservation={activeReservation} />
      )}

      {/* Reservation History Section */}
      <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Calendar color="var(--accent-gold)" /> ประวัติการจองโต๊ะและสั่งอาหารของคุณ ({history.length} รายการ)
      </h3>

      {history.length === 0 ? (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          คุณยังไม่มีประวัติการจองโต๊ะ (สามารถคลิกปุ่ม "จองโต๊ะอาหารออนไลน์" ด้านบนเพื่อทำการจอง)
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {history.map(item => (
            <div key={item.reservation_id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                <span style={{ fontWeight: 'bold', color: 'var(--accent-gold)', fontSize: '1.1rem' }}>
                  {item.booking_code || `LX-${item.reservation_id}`}
                </span>
                <span style={{ background: 'rgba(16,185,129,0.2)', color: '#34d399', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                  {item.status === 'confirmed' ? 'ยืนยันแล้ว' : item.status}
                </span>
              </div>

              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
                <div><Calendar size={14} style={{ display: 'inline', marginRight: '6px' }} /> วันที่: {item.reservation_date}</div>
                <div><Clock size={14} style={{ display: 'inline', marginRight: '6px' }} /> เวลา: {item.reservation_time} น.</div>
                <div><MapPin size={14} style={{ display: 'inline', marginRight: '6px' }} /> โต๊ะ: {item.table_number || 'T-01'} ({item.zone || 'Indoor Main'})</div>
                <div style={{ fontWeight: 'bold', color: '#fff', marginTop: '0.5rem' }}>
                  ยอดชำระ: <span style={{ color: 'var(--accent-gold)' }}>฿{Number(item.total_amount).toLocaleString()}</span> (+{item.earned_points || 0} แต้ม)
                </div>
              </div>

              <button 
                onClick={() => onSelectVoucher(item)}
                style={{ width: '100%', background: 'var(--bg-glass)', border: '1px solid var(--border-active)', color: 'var(--accent-gold)', padding: '0.6rem', borderRadius: 'var(--radius-md)', marginTop: '1rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
              >
                <QrCode size={16} /> ดู E-Voucher บัตรคิว
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
