import React from 'react';
import { CheckCircle, Printer, Store, Clock, ShoppingBag } from 'lucide-react';

export default function EVoucherModal({ bookingSuccess, onClose }) {
  if (!bookingSuccess) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '520px' }}>
        <div className="voucher-ticket">
          <CheckCircle size={48} color="#10b981" style={{ margin: '0 auto 0.4rem auto' }} />
          <h2 style={{ fontSize: '1.5rem', color: '#fff' }}>E-VOUCHER บัตรคิวรับอาหารหน้าร้าน</h2>
          <p style={{ color: 'var(--accent-gold)', fontWeight: 'bold', fontSize: '1.3rem', margin: '0.2rem 0' }}>
            รหัสคิว: {bookingSuccess.booking_code || `LX-${bookingSuccess.reservation_id}`}
          </p>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.8rem' }}>
            (แสดงหน้าจอนี้ต่อพนักงานที่จุดบริการ Express Pickup เพื่อรับอาหาร)
          </div>

          <div className="voucher-qr" style={{ marginBottom: '1rem' }}>
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=PICKUP_QUEUE_${bookingSuccess.booking_code}`} 
              alt="Voucher QR Code"
              style={{ width: '130px', height: '130px' }}
            />
          </div>

          <div style={{ textAlign: 'left', background: 'rgba(0,0,0,0.4)', padding: '1rem', borderRadius: '10px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span>คุณผู้สั่งซื้อ:</span>
              <strong style={{ color: '#fff' }}>{bookingSuccess.customer_name}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span>เบอร์โทรติดต่อ:</span>
              <strong style={{ color: '#fff' }}>{bookingSuccess.customer_phone || '-'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span>เวลานัดรับอาหาร:</span>
              <strong style={{ color: 'var(--accent-gold)' }}>
                {bookingSuccess.reservation_date} เวลา {bookingSuccess.reservation_time} น.
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span>รูปแบบการรับ:</span>
              <strong style={{ color: '#34d399' }}>🛍️ รับที่หน้าร้าน (Store Pickup)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span>จุดรับอาหาร:</span>
              <span style={{ color: '#e5e7eb' }}>เคาน์เตอร์หน้าร้าน ข้าวแกง LUXE</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.4rem', marginTop: '0.4rem' }}>
              <span>สถานะการชำระเงิน:</span>
              <strong style={{ color: '#34d399' }}>ชำระเงินสำเร็จ (PromptPay)</strong>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.2rem' }}>
            <button 
              className="submit-btn" 
              style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-active)', color: '#fff', margin: 0 }}
              onClick={() => window.print()}
            >
              <Printer size={16} /> พิมพ์บัตรคิว
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
