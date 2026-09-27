import React, { useState, useEffect } from 'react';
import { X, Check, ChevronRight, ShoppingBag, Package, Utensils, Plus, Minus } from 'lucide-react';

/* ─── Static config ─────────────────────────────────────────────────── */
const BOX_SETS = [
  { id: 1, label: 'กล่องกับข้าว 1 อย่าง', slots: 1, basePrice: 40, emoji: '🍱' },
  { id: 2, label: 'กล่องกับข้าว 2 อย่าง', slots: 2, basePrice: 45, emoji: '🍱🍱' },
  { id: 3, label: 'กล่องกับข้าว 3 อย่าง', slots: 3, basePrice: 50, emoji: '🍱🍱🍱' },
];

const RICE_OPTIONS = [
  { id: 'white', label: 'ข้าวสวยธรรมดา', extra: 0, emoji: '🍚' },
  { id: 'riceberry', label: 'ข้าวไรซ์เบอร์รี่', extra: 10, emoji: '🍇' },
  { id: 'brown', label: 'ข้าวกล้อง', extra: 10, emoji: '🌾' },
];

const TOPPINGS = [
  { id: 'fried_egg', label: 'ไข่ดาว (กรอบ)', price: 10, emoji: '🍳' },
  { id: 'omelette', label: 'ไข่เจียว', price: 10, emoji: '🥚' },
  { id: 'soft_egg', label: 'ไข่ต้มยางมะตูม', price: 10, emoji: '🥚' },
  { id: 'fried_fish', label: 'ปลาทูทอด 1 ตัว', price: 25, emoji: '🐟' },
  { id: 'chili_sauce', label: 'น้ำพริกหนุ่ม/กุนเชียง', price: 15, emoji: '🌶️' },
];

const STEPS = ['เลือกชุดกล่อง', 'เลือกประเภทข้าว', 'เลือกกับข้าว', 'ท็อปปิ้งเสริม'];

/* ─── Helper: step progress bar ─────────────────────────────────────── */
function StepBar({ current }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: '1.6rem' }}>
      {STEPS.map((s, i) => (
        <React.Fragment key={i}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: 0 }}>
            <div style={{
              width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem',
              background: i < current ? 'var(--accent-gold)' : i === current ? 'rgba(229,168,83,0.25)' : 'rgba(255,255,255,0.05)',
              border: `2px solid ${i <= current ? 'var(--accent-gold)' : 'rgba(255,255,255,0.12)'}`,
              color: i < current ? '#0b0c10' : i === current ? 'var(--accent-gold)' : 'var(--text-muted)',
              transition: 'all 0.3s ease',
              flexShrink: 0
            }}>
              {i < current ? <Check size={14} /> : i + 1}
            </div>
            <div style={{ fontSize: '0.65rem', color: i === current ? 'var(--accent-gold)' : 'var(--text-muted)', marginTop: '4px', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '70px' }}>
              {s}
            </div>
          </div>
          {i < STEPS.length - 1 && (
            <div style={{ height: '2px', flex: 1, background: i < current ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)', transition: 'background 0.3s', marginBottom: '18px' }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

/* ─── Select card ────────────────────────────────────────────────────── */
function SelectCard({ selected, onClick, children }) {
  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0.85rem 1.1rem', borderRadius: 'var(--radius-md)', cursor: 'pointer',
      background: selected ? 'rgba(229,168,83,0.12)' : 'rgba(255,255,255,0.03)',
      border: `1.5px solid ${selected ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)'}`,
      transition: 'all 0.2s ease',
      marginBottom: '0.5rem'
    }}>
      {children}
      {selected && <Check size={16} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} />}
    </div>
  );
}

/* ─── Main Modal ─────────────────────────────────────────────────────── */
export default function FoodCustomizerModal({ isOpen, onClose, onAddToCartWithOptions, menuItems = [] }) {
  const [step, setStep] = useState(0);
  const [selectedBox, setSelectedBox] = useState(null);    // BOX_SETS item
  const [selectedRice, setSelectedRice] = useState(RICE_OPTIONS[0]);
  const [selectedDishes, setSelectedDishes] = useState([]); // array of menuItem objects (length = slots)
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [specialNote, setSpecialNote] = useState('');

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setStep(0);
      setSelectedBox(null);
      setSelectedRice(RICE_OPTIONS[0]);
      setSelectedDishes([]);
      setSelectedToppings([]);
      setSpecialNote('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  /* ── Price calculation ─────────────────────────── */
  const calcTotal = () => {
    const boxPrice  = selectedBox  ? selectedBox.basePrice : 0;
    const riceExtra = selectedRice ? selectedRice.extra    : 0;
    const toppingSum = selectedToppings.reduce((s, t) => s + t.price, 0);
    return boxPrice + riceExtra + toppingSum;
  };

  /* ── Dish slot toggle ──────────────────────────── */
  const handleToggleDish = (dish) => {
    const slots = selectedBox ? selectedBox.slots : 1;
    setSelectedDishes(prev => {
      const exists = prev.find(d => d.item_id === dish.item_id);
      if (exists) return prev.filter(d => d.item_id !== dish.item_id);
      if (prev.length >= slots) {
        // Replace last
        return [...prev.slice(0, slots - 1), dish];
      }
      return [...prev, dish];
    });
  };

  /* ── Topping toggle ────────────────────────────── */
  const handleToggleTopping = (top) => {
    setSelectedToppings(prev => {
      const exists = prev.find(t => t.id === top.id);
      return exists ? prev.filter(t => t.id !== top.id) : [...prev, top];
    });
  };

  /* ── Next / Back ───────────────────────────────── */
  const canNext = () => {
    if (step === 0) return !!selectedBox;
    if (step === 1) return !!selectedRice;
    if (step === 2) return selectedDishes.length === (selectedBox?.slots || 0);
    return true;
  };

  /* ── Add to cart ───────────────────────────────── */
  const handleConfirm = () => {
    const dishNames = selectedDishes.map(d => d.name).join(', ');
    const toppingNames = selectedToppings.map(t => t.label).join(', ');

    const label = `${selectedBox.label} (${selectedRice.label})`;
    const customNote = [
      `กับข้าว: ${dishNames || '-'}`,
      toppingNames ? `ท็อปปิ้ง: ${toppingNames}` : '',
      specialNote ? `หมายเหตุ: ${specialNote}` : ''
    ].filter(Boolean).join(' | ');

    onAddToCartWithOptions({
      item_id: `box_${Date.now()}`,  // unique cart key
      name: label,
      price: calcTotal(),
      image_url: '/images/steak.jpg',
      custom_options: customNote,
      category: 'box_set',
    });

    onClose();
  };

  /* ──────────────────────────────────────────────────────────────────── */
  const total = calcTotal();

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-card" style={{ maxWidth: '560px', width: '95%', maxHeight: '92vh', overflowY: 'auto', padding: '1.8rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Package size={22} style={{ color: 'var(--accent-gold)' }} />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>สั่งข้าวกล่องข้าวแกง</h2>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              กล่องแยกช่อง • รับกลับบ้าน • Takeaway Box Set
            </p>
          </div>
          <button className="close-modal-btn" onClick={onClose} style={{ position: 'relative', top: 0, right: 0 }}>
            <X size={22} />
          </button>
        </div>

        {/* Step Progress */}
        <StepBar current={step} />

        {/* ── STEP 0: Box Selection ── */}
        {step === 0 && (
          <div>
            <h3 style={{ color: 'var(--accent-gold)', fontSize: '0.95rem', marginBottom: '0.8rem', fontWeight: 700 }}>
              🍱 เลือกชุดกล่องข้าวแกงแยกช่อง
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              กล่องพลาสติกแยกช่องอาหาร ป้องกันน้ำแกงซึม เหมาะสำหรับรับกลับบ้าน
            </p>
            {BOX_SETS.map(box => (
              <SelectCard key={box.id} selected={selectedBox?.id === box.id} onClick={() => setSelectedBox(box)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <div style={{ fontSize: '1.5rem' }}>{box.emoji}</div>
                  <div>
                    <div style={{ fontWeight: 700, color: selectedBox?.id === box.id ? '#fff' : 'var(--text-main)', fontSize: '0.95rem' }}>
                      {box.label}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      เลือกกับข้าวได้ {box.slots} อย่าง
                    </div>
                  </div>
                </div>
                <div style={{ fontWeight: 800, color: 'var(--accent-gold)', fontSize: '1.05rem', flexShrink: 0, marginLeft: '0.5rem' }}>
                  ฿{box.basePrice}
                </div>
              </SelectCard>
            ))}
          </div>
        )}

        {/* ── STEP 1: Rice Type ── */}
        {step === 1 && (
          <div>
            <h3 style={{ color: 'var(--accent-gold)', fontSize: '0.95rem', marginBottom: '0.8rem', fontWeight: 700 }}>
              🍚 เลือกประเภทข้าว
            </h3>
            {RICE_OPTIONS.map(rice => (
              <SelectCard key={rice.id} selected={selectedRice?.id === rice.id} onClick={() => setSelectedRice(rice)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <span style={{ fontSize: '1.4rem' }}>{rice.emoji}</span>
                  <span style={{ fontWeight: 600, color: selectedRice?.id === rice.id ? '#fff' : 'var(--text-main)' }}>
                    {rice.label}
                  </span>
                </div>
                <div style={{ fontWeight: 700, color: rice.extra > 0 ? '#60a5fa' : 'var(--text-muted)', flexShrink: 0 }}>
                  {rice.extra > 0 ? `+฿${rice.extra}` : 'ฟรี'}
                </div>
              </SelectCard>
            ))}
          </div>
        )}

        {/* ── STEP 2: Dish Selection ── */}
        {step === 2 && selectedBox && (
          <div>
            <h3 style={{ color: 'var(--accent-gold)', fontSize: '0.95rem', marginBottom: '0.3rem', fontWeight: 700 }}>
              <Utensils size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
              เลือกกับข้าวใส่ช่อง ({selectedDishes.length}/{selectedBox.slots} อย่าง)
            </h3>

            {/* Selected slots preview */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              {Array.from({ length: selectedBox.slots }).map((_, i) => {
                const dish = selectedDishes[i];
                return (
                  <div key={i} style={{
                    flex: 1, minWidth: '80px', padding: '0.5rem 0.7rem', borderRadius: '10px',
                    border: dish ? '1.5px solid var(--accent-gold)' : '1.5px dashed rgba(255,255,255,0.2)',
                    background: dish ? 'rgba(229,168,83,0.1)' : 'transparent',
                    textAlign: 'center', fontSize: '0.75rem',
                    color: dish ? 'var(--accent-gold)' : 'var(--text-muted)'
                  }}>
                    {dish ? <>✓ {dish.name.length > 10 ? dish.name.slice(0, 10) + '…' : dish.name}</> : `ช่อง ${i + 1}`}
                  </div>
                );
              })}
            </div>

            {/* Menu list */}
            <div style={{ maxHeight: '280px', overflowY: 'auto', paddingRight: '4px' }}>
              {menuItems.filter(m => m.is_available !== false).map(dish => {
                const isSelected = selectedDishes.some(d => d.item_id === dish.item_id);
                return (
                  <div key={dish.item_id} onClick={() => handleToggleDish(dish)} style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.7rem 0.9rem', borderRadius: 'var(--radius-md)', cursor: 'pointer', marginBottom: '0.4rem',
                    background: isSelected ? 'rgba(229,168,83,0.12)' : 'rgba(255,255,255,0.03)',
                    border: `1.5px solid ${isSelected ? 'var(--accent-gold)' : 'rgba(255,255,255,0.08)'}`,
                    transition: 'all 0.2s ease'
                  }}>
                    <img src={dish.image_url} alt={dish.name} style={{ width: 44, height: 40, objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, color: isSelected ? '#fff' : 'var(--text-main)', fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {dish.dietary_tag === 'Halal' && <span style={{ fontSize: '0.65rem', background: 'rgba(52,211,153,0.15)', color: '#34d399', padding: '1px 5px', borderRadius: '4px', marginRight: '5px' }}>🌙</span>}
                        {dish.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '1px' }}>{dish.description?.slice(0, 42)}…</div>
                    </div>
                    <div style={{ flexShrink: 0, textAlign: 'right' }}>
                      {isSelected
                        ? <Check size={18} style={{ color: 'var(--accent-gold)' }} />
                        : <Plus size={18} style={{ color: 'var(--text-muted)' }} />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── STEP 3: Toppings ── */}
        {step === 3 && (
          <div>
            <h3 style={{ color: 'var(--accent-gold)', fontSize: '0.95rem', marginBottom: '0.3rem', fontWeight: 700 }}>
              🍳 ท็อปปิ้งเสริมใส่กล่อง (เลือกได้หลายอย่าง)
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>ไม่เลือกก็ได้ — ข้ามได้เลย</p>
            {TOPPINGS.map(top => {
              const isSelected = selectedToppings.some(t => t.id === top.id);
              return (
                <div key={top.id} onClick={() => handleToggleTopping(top)} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.8rem 1.1rem', borderRadius: 'var(--radius-md)', cursor: 'pointer', marginBottom: '0.5rem',
                  background: isSelected ? 'rgba(229,168,83,0.12)' : 'rgba(255,255,255,0.03)',
                  border: `1.5px solid ${isSelected ? 'var(--accent-gold)' : 'rgba(255,255,255,0.08)'}`,
                  transition: 'all 0.2s ease'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <span style={{ fontSize: '1.3rem' }}>{top.emoji}</span>
                    <span style={{ fontWeight: 600, color: isSelected ? '#fff' : 'var(--text-main)', fontSize: '0.9rem' }}>{top.label}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontWeight: 700, color: 'var(--accent-gold)' }}>+฿{top.price}</span>
                    {isSelected && <Check size={16} style={{ color: 'var(--accent-gold)' }} />}
                  </div>
                </div>
              );
            })}

            {/* Special note */}
            <div style={{ marginTop: '1rem' }}>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                📝 หมายเหตุถึงทางร้าน (ไม่บังคับ)
              </label>
              <textarea
                className="form-input"
                rows={2}
                placeholder="เช่น แยกน้ำแกงใส่ถุง, ไม่ใส่ผักชี, ข้าวน้อย..."
                value={specialNote}
                onChange={e => setSpecialNote(e.target.value)}
                style={{ resize: 'none', fontFamily: 'inherit' }}
              />
            </div>
          </div>
        )}

        {/* ── Real-time price bar ── */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'rgba(229,168,83,0.08)', border: '1px solid rgba(229,168,83,0.25)',
          borderRadius: 'var(--radius-md)', padding: '0.8rem 1.2rem', marginTop: '1.4rem'
        }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            {selectedBox && <><strong style={{ color: '#fff' }}>{selectedBox.label}</strong> • {selectedRice?.label}</>}
            {!selectedBox && <span>เลือกชุดกล่องก่อน</span>}
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
            ฿{total}
          </div>
        </div>

        {/* ── Navigation Buttons ── */}
        <div style={{ display: 'flex', gap: '0.7rem', marginTop: '1rem' }}>
          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              style={{
                flex: 1, padding: '0.85rem', borderRadius: 'var(--radius-md)',
                background: 'transparent', border: '1px solid var(--border-color)',
                color: 'var(--text-muted)', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem',
                fontFamily: 'inherit'
              }}
            >
              ← ย้อนกลับ
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => canNext() && setStep(s => s + 1)}
              disabled={!canNext()}
              style={{
                flex: 2, padding: '0.85rem', borderRadius: 'var(--radius-md)',
                background: canNext() ? 'linear-gradient(135deg, var(--accent-gold), var(--accent-orange))' : 'rgba(255,255,255,0.06)',
                border: 'none', color: canNext() ? '#0b0c10' : 'var(--text-muted)',
                fontWeight: 700, cursor: canNext() ? 'pointer' : 'not-allowed',
                fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                transition: 'all 0.2s ease', fontFamily: 'inherit'
              }}
            >
              ถัดไป <ChevronRight size={18} />
            </button>
          ) : (
            <button
              onClick={handleConfirm}
              style={{
                flex: 2, padding: '0.85rem', borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-orange))',
                border: 'none', color: '#0b0c10', fontWeight: 800,
                cursor: 'pointer', fontSize: '0.95rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                fontFamily: 'inherit'
              }}
            >
              <ShoppingBag size={18} /> ใส่ตะกร้า ฿{total}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
