import React from 'react';
import { X, ShieldCheck, ShoppingBag, Clock, Store } from 'lucide-react';

export default function PaymentModal({
  isOpen,
  onClose,
  couponCode,
  setCouponCode,
  onApplyCoupon,
  rawCartTotal,
  discountAmount,
  finalTotal,
  onConfirmPayment,
  formData = {}
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '520px', textAlign: 'center' }}>
        <button className="close-modal-btn" onClick={onClose}>
          <X size={24} />
        </button>

        <h2 style={{ fontSize: '1.6rem', color: '#fff', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <ShoppingBag color="var(--accent-gold)" /> ชำระเงินค่าอาหารล่วงหน้า (PromptPay)
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.2rem' }}>
          สแกน QR Code เพื่อชำระเงินและรับ E-Voucher บัตรคิวนัดรับอาหารหน้าร้าน
        </p>

        {/* Pickup Details Snapshot */}
        <div style={{ background: 'rgba(229,168,83,0.1)', border: '1px solid var(--accent-gold)', borderRadius: 'var(--radius-md)', padding: '0.8rem 1rem', marginBottom: '1.2rem', textAlign: 'left', fontSize: '0.85rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>รูปแบบบริการ:</span>
            <strong style={{ color: '#34d399' }}>🛍️ รับที่หน้าร้าน (Store Pickup)</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>เวลานัดรับอาหาร:</span>
            <strong style={{ color: 'var(--accent-gold)' }}>
              {formData.reservation_date} เวลา {formData.reservation_time} น.
            </strong>
          </div>
          {formData.customer_name && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>ผู้สั่งซื้อ:</span>
              <strong style={{ color: '#fff' }}>{formData.customer_name} ({formData.customer_phone})</strong>
            </div>
          )}
        </div>

        {/* PromptPay QR Frame */}
        <div style={{ background: '#fff', padding: '1.2rem', borderRadius: '16px', display: 'inline-block', marginBottom: '1.2rem', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
          <img 
            src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=PROMPTPAY_PAYMENT_NET_${finalTotal}`} 
            alt="PromptPay QR Code"
            style={{ width: '170px', height: '170px' }}
          />
          <div style={{ color: '#000', fontWeight: 'bold', fontSize: '0.88rem', marginTop: '0.4rem' }}>
            ข้าวแกง LUXE DINING PROMPTPAY
          </div>
          <div style={{ color: '#666', fontSize: '0.75rem' }}>
            ยอดชำระ: ฿{finalTotal.toLocaleString()}
          </div>
        </div>

        {/* Coupon Input */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.2rem' }}>
          <input 
            type="text" 
            className="form-input" 
            placeholder="กรอกโค้ดส่วนลด (เช่น LUXE2026, VIPGOLD)"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
          />
          <button 
            type="button" 
            onClick={onApplyCoupon}
            style={{ background: 'var(--accent-gold)', color: '#0b0c10', border: 'none', padding: '0 1.2rem', borderRadius: 'var(--radius-md)', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            ใช้โค้ด
          </button>
        </div>

        {/* Total Summary */}
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.2rem', textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', color: 'var(--text-muted)' }}>
            <span>ยอดรวมค่าอาหารล่วงหน้า</span>
            <span>฿{rawCartTotal.toLocaleString()}</span>
          </div>
          {discountAmount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', color: '#34d399' }}>
              <span>ส่วนลดพิเศษ</span>
              <span>- ฿{discountAmount.toLocaleString()}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
            <span>ยอดชำระสุทธิ</span>
            <span style={{ color: 'var(--accent-gold)' }}>฿{finalTotal.toLocaleString()}</span>
          </div>
        </div>

        <button className="submit-btn" onClick={onConfirmPayment}>
          <ShieldCheck style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} /> ยืนยันการชำระเงินเรียบร้อย (รับบัตรคิว E-Voucher)
        </button>
      </div>
    </div>
  );
}
