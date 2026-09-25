import React, { useState } from 'react';
import { X, Flame, Plus, Check } from 'lucide-react';

export default function FoodCustomizerModal({ item, isOpen, onClose, onAddToCartWithOptions }) {
  const [spicyLevel, setSpicyLevel] = useState('เผ็ดปกติ');
  const [extraToppings, setExtraToppings] = useState([]);
  const [specialNote, setSpecialNote] = useState('');

  if (!isOpen || !item) return null;

  const toppingOptions = [
    { name: 'เพิ่มพาร์เมซานชีส', price: 40 },
    { name: 'เพิ่มเนยทรัฟเฟิลพรีเมียม', price: 80 },
    { name: 'เพิ่มเบคอนกรอบ', price: 50 },
  ];

  const handleToggleTopping = (topping) => {
    setExtraToppings(prev => {
      const exists = prev.find(t => t.name === topping.name);
      if (exists) return prev.filter(t => t.name !== topping.name);
      return [...prev, topping];
    });
  };

  const calculateTotalPrice = () => {
    const toppingsSum = extraToppings.reduce((sum, t) => sum + t.price, 0);
    return item.price + toppingsSum;
  };

  const handleConfirmAdd = () => {
    const optionStrings = [];
    if (spicyLevel) optionStrings.push(`ความเผ็ด: ${spicyLevel}`);
    if (extraToppings.length > 0) {
      optionStrings.push(`ท็อปปิ้ง: ${extraToppings.map(t => `${t.name} (+฿${t.price})`).join(', ')}`);
    }
    if (specialNote.trim()) optionStrings.push(`โน้ต: ${specialNote.trim()}`);

    onAddToCartWithOptions({
      ...item,
      price: calculateTotalPrice(),
      custom_options: optionStrings.join(' | ')
    });

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '480px' }}>
        <button className="close-modal-btn" onClick={onClose}>
          <X size={24} />
        </button>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.2rem', alignItems: 'center' }}>
          <img src={item.image_url} alt={item.name} style={{ width: '80px', height: '70px', objectFit: 'cover', borderRadius: '12px' }} />
          <div>
            <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>{item.name}</h3>
            <div style={{ color: 'var(--accent-gold)', fontWeight: 'bold', fontSize: '1.1rem' }}>
              ฿{item.price.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Spicy Level Selector */}
        <div className="form-group">
          <label style={{ color: 'var(--accent-gold)' }}>🌶️ ระดับความเผ็ด (Spicy Level)</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginTop: '0.4rem' }}>
            {['ไม่เผ็ด', 'เผ็ดน้อย', 'เผ็ดปกติ', 'เผ็ดมาก'].map(lvl => (
              <button 
                key={lvl}
                type="button"
                className={`category-pill ${spicyLevel === lvl ? 'active' : ''}`}
                style={{ padding: '0.5rem', fontSize: '0.8rem', textAlign: 'center' }}
                onClick={() => setSpicyLevel(lvl)}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Extra Toppings */}
        <div className="form-group">
          <label style={{ color: 'var(--accent-gold)' }}>🧀 ท็อปปิ้งเสริม (Extra Add-ons)</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.4rem' }}>
            {toppingOptions.map(top => {
              const isSelected = extraToppings.some(t => t.name === top.name);
              return (
                <div 
                  key={top.name}
                  onClick={() => handleToggleTopping(top)}
                  style={{ 
                    display: 'flex', justifyContent: 'space-between', padding: '0.7rem 1rem', 
                    background: isSelected ? 'rgba(229,168,83,0.15)' : 'rgba(255,255,255,0.03)', 
                    border: `1px solid ${isSelected ? 'var(--accent-gold)' : 'var(--border-color)'}`,
                    borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: '0.9rem' 
                  }}
                >
                  <span style={{ color: isSelected ? '#fff' : 'var(--text-muted)' }}>
                    {isSelected ? <Check size={14} style={{ display: 'inline', marginRight: '6px', color: 'var(--accent-gold)' }} /> : null}
                    {top.name}
                  </span>
                  <span style={{ color: 'var(--accent-gold)', fontWeight: 'bold' }}>+฿{top.price}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Special Chef Note */}
        <div className="form-group">
          <label>📝 คำขอพิเศษถึงเชฟ (Note to Chef)</label>
          <input 
            type="text" 
            className="form-input" 
            placeholder="เช่น แยกซอส, หวานน้อย..."
            value={specialNote}
            onChange={(e) => setSpecialNote(e.target.value)}
          />
        </div>

        <button className="submit-btn" onClick={handleConfirmAdd}>
          + เพิ่มลงตระกร้า (฿{calculateTotalPrice().toLocaleString()})
        </button>
      </div>
    </div>
  );
}
