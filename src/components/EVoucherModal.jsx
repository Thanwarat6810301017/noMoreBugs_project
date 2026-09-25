import React from 'react';
import { CheckCircle, Printer } from 'lucide-react';

export default function EVoucherModal({ bookingSuccess, onClose }) {
  if (!bookingSuccess) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '520px' }}>
        <div className="voucher-ticket">
          <CheckCircle size={50} color="#10b981" style={{ margin: '0 auto 0.5rem auto' }} />
          <h2 style={{ fontSize: '1.6rem', color: '#fff' }}>E-VOUCHER ใบเสร็จการจอง</h2>
          <p style={{ color: 'var(--accent-gold)', fontWeight: 'bold', fontSize: '1.2rem', margin: '0.3rem 0' }}>
            รหัสคิว: {bookingSuccess.booking_code || `LX-${bookingSuccess.reservation_id}`}
          </p>

          <div className="voucher-qr">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=BOOKING_${bookingSuccess.booking_code}`} 
              alt="Voucher QR Code"
              style={{ width: '120px', height: '120px' }}
            />
          </div>

          <div style={{ textAlign: 'left', background: 'rgba(0,0,0,0.4)', padding: '1rem', borderRadius: '10px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
              <span>คุณผู้จอง:</span>
              <strong style={{ color: '#fff' }}>{bookingSuccess.customer_name}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
              <span>วันที่ & เวลา:</span>
              <strong style={{ color: 'var(--accent-gold)' }}>{bookingSuccess.reservation_date} ({bookingSuccess.reservation_time} น.)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
              <span>จำนวนแขก:</span>
              <strong style={{ color: '#fff' }}>{bookingSuccess.guest_count} ท่าน</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>สถานะการชำระเงิน:</span>
              <strong style={{ color: '#34d399' }}>ชำระเงินสำเร็จ (PromptPay)</strong>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.5rem' }}>
            <button 
              className="submit-btn" 
              style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-active)', color: '#fff', margin: 0 }}
              onClick={() => window.print()}
            >
              <Printer size={16} /> พิมพ์ใบเสร็จ
            </button>
            <button 
              className="submit-btn" 
              style={{ margin: 0 }}
              onClick={onClose}
            >
              ตกลง / ปิดหน้าต่าง
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
