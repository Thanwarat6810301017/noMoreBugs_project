import React from 'react';
import { Award, DollarSign, Calendar, PieChart, Flame } from 'lucide-react';

export default function AdminDashboard({ adminStats, reservations, onStatusUpdate }) {
  return (
    <div style={{ padding: '3rem', maxWidth: '1300px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Award color="var(--accent-gold)" /> แผงควบคุมผู้บริหารและสถิติร้าน (Admin Analytics)
      </h2>

      {/* Analytics Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <DollarSign size={16} color="var(--accent-gold)" /> ยอดขายรวมสะสม
          </span>
          <span className="stat-value">฿{adminStats.totalRevenue.toLocaleString()}</span>
        </div>

        <div className="stat-card">
          <span className="stat-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Calendar size={16} color="#34d399" /> จำนวนการจองทั้งหมด
          </span>
          <span className="stat-value" style={{ color: '#34d399' }}>{adminStats.totalBookings} รายการ</span>
        </div>

        <div className="stat-card">
          <span className="stat-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <PieChart size={16} color="var(--accent-orange)" /> อัตราการถูกจองโต๊ะ (Occupancy)
          </span>
          <span className="stat-value" style={{ color: 'var(--accent-orange)' }}>{adminStats.tableOccupancyRate}%</span>
        </div>

        <div className="stat-card">
          <span className="stat-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Flame size={16} color="#a855f7" /> เมนูที่ถูกสั่งบ่อยที่สุด
          </span>
          <span className="stat-value" style={{ fontSize: '1.2rem', color: '#a855f7', marginTop: '0.8rem' }}>
            {adminStats.popularDish}
          </span>
        </div>
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '1rem', textAlign: 'left' }}>รหัสคิว</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>ชื่อผู้จอง</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>วันที่ / เวลา</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>โต๊ะ / โซน</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>จำนวนแขก</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>ยอดชำระ</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>สถานะ</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map(res => (
              <tr key={res.reservation_id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '1rem', fontWeight: 'bold', color: 'var(--accent-gold)' }}>
                  {res.booking_code || `LX-${res.reservation_id}`}
                </td>
                <td style={{ padding: '1rem' }}>
                  <strong style={{ color: '#fff', display: 'block' }}>{res.customer_name}</strong>
                  <small style={{ color: 'var(--text-muted)' }}>{res.customer_phone}</small>
                </td>
                <td style={{ padding: '1rem' }}>
                  {res.reservation_date}<br/>
                  <small style={{ color: 'var(--accent-gold)' }}>{res.reservation_time} น.</small>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ color: '#34d399', fontWeight: 600 }}>{res.table_number || 'T-01'}</span><br/>
                  <small style={{ color: 'var(--text-muted)' }}>{res.zone || 'Indoor Main'}</small>
                </td>
                <td style={{ padding: '1rem' }}>{res.guest_count} ท่าน</td>
                <td style={{ padding: '1rem', fontWeight: 'bold', color: 'var(--accent-gold)' }}>
                  ฿{Number(res.total_amount || 0).toLocaleString()}
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{
                    padding: '0.3rem 0.8rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    background: res.status === 'confirmed' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    color: res.status === 'confirmed' ? '#34d399' : '#f87171'
                  }}>
                    {res.status === 'confirmed' ? 'ยืนยันแล้ว' : res.status}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  {res.status === 'confirmed' ? (
                    <button 
                      onClick={() => onStatusUpdate(res.reservation_id, 'cancelled')}
                      style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid #ef4444', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}
                    >
                      ยกเลิก
                    </button>
                  ) : (
                    <button 
                      onClick={() => onStatusUpdate(res.reservation_id, 'confirmed')}
                      style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid #10b981', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}
                    >
                      ยืนยัน
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
