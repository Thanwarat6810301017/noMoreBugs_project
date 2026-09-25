import React from 'react';
import { X, ShieldCheck } from 'lucide-react';

export default function PaymentModal({
  isOpen,
  onClose,
  couponCode,
  setCouponCode,
  onApplyCoupon,
  rawCartTotal,
  discountAmount,
  finalTotal,
  onConfirmPayment
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '500px', textAlign: 'center' }}>
        <button className="close-modal-btn" onClick={onClose}>
          <X size={24} />
        </button>

        <h2 style={{ fontSize: '1.6rem', color: '#fff', marginBottom: '0.5rem' }}>
          ชำระเงินผ่าน PromptPay QR Code
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          สแกน QR Code ด้วยแอปพลิเคชันธนาคารเพื่อยืนยันการจอง
        </p>

        {/* PromptPay QR Frame */}
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', display: 'inline-block', marginBottom: '1.5rem', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
          <img 
            src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=PROMPTPAY_PAYMENT_NET_${finalTotal}`} 
            alt="PromptPay QR Code"
            style={{ width: '180px', height: '180px' }}
          />
          <div style={{ color: '#000', fontWeight: 'bold', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            LUXE DINING PROMPTPAY
          </div>
        </div>

        {/* Coupon Input */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <input 
            type="text" 
            className="form-input" 
            placeholder="กรอกโค้ดส่วนลด (เช่น LUXE2026)"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
          />
          <button 
            type="button" 
            onClick={onApplyCoupon}
            style={{ background: 'var(--accent-gold)', color: '#0b0c10', border: 'none', padding: '0 1.2rem', borderRadius: 'var(--radius-md)', fontWeight: 'bold', cursor: 'pointer' }}
          >
            ใช้โค้ด
          </button>
        </div>

        {/* Total Summary */}
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', color: 'var(--text-muted)' }}>
            <span>ยอดรวมค่าอาหารล่วงหน้า</span>
            <span>฿{rawCartTotal.toLocaleString()}</span>
          </div>
          {discountAmount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', color: '#34d399' }}>
              <span>ส่วนลดพิเศษ (LUXE2026)</span>
              <span>- ฿{discountAmount.toLocaleString()}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
            <span>ยอดชำระสุทธิ</span>
            <span style={{ color: 'var(--accent-gold)' }}>฿{finalTotal.toLocaleString()}</span>
          </div>
        </div>

        <button className="submit-btn" onClick={onConfirmPayment}>
          <ShieldCheck style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} /> ยืนยันการชำระเงินเรียบร้อย
        </button>
      </div>
    </div>
  );
}
