import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Toast from '../components/Toast';
import api from '../services/api';

const DS = {
        bg: '#040610',
        surface: 'rgba(10,15,30,0.65)',
        cyan: '#00e5ff',
        purple2: '#a855f7',
        gold: '#f59e0b',
        green: '#22c55e',
        red: '#ef4444',
        text: '#e2e8f0',
        muted: '#64748b',
        border: 'rgba(0,229,255,0.12)',
};

const card = {
        background: DS.surface,
        border: `1px solid ${DS.border}`,
        borderRadius: '16px',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        padding: '24px',
};

const gradText = {
        background: 'linear-gradient(135deg,#00e5ff 0%,#a855f7 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
};

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=DM+Sans:wght@400;500;600&display=swap');

  @keyframes tcsSlideUp {
    from { opacity:0; transform:translateY(28px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes tcsSpin { to { transform: rotate(360deg); } }
  @keyframes tcsGlow {
    0%,100% { box-shadow: 0 0 10px rgba(0,229,255,.2); }
    50%      { box-shadow: 0 0 28px rgba(0,229,255,.5); }
  }
  @keyframes tcsScan {
    0%   { top: 0%; }
    100% { top: 100%; }
  }

  .tcs-page { font-family: 'DM Sans', sans-serif; }

  /* selectable cards */
  .tcs-card {
    cursor: pointer;
    position: relative; overflow: hidden;
    transition: transform .3s, box-shadow .3s, border-color .3s !important;
  }
  .tcs-card:hover {
    transform: translateY(-5px) !important;
    box-shadow: 0 20px 50px rgba(0,229,255,.1) !important;
    border-color: rgba(0,229,255,.28) !important;
  }
  .tcs-card.selected {
    box-shadow: 0 0 0 1px rgba(0,229,255,.4), 0 16px 48px rgba(0,229,255,.12) !important;
  }
  .tcs-card::after {
    content: '';
    position: absolute; left:0; right:0; height:2px;
    background: linear-gradient(90deg, transparent, rgba(0,229,255,.18), transparent);
    animation: tcsScan 5s linear infinite;
    pointer-events: none;
  }

  /* difficulty cards */
  .tcs-diff-easy.selected   { border-color: rgba(34,197,94,.45) !important; box-shadow: 0 0 0 1px rgba(34,197,94,.3), 0 16px 40px rgba(34,197,94,.08) !important; }
  .tcs-diff-medium.selected { border-color: rgba(245,158,11,.45) !important; box-shadow: 0 0 0 1px rgba(245,158,11,.3), 0 16px 40px rgba(245,158,11,.08) !important; }
  .tcs-diff-hard.selected   { border-color: rgba(239,68,68,.45) !important;  box-shadow: 0 0 0 1px rgba(239,68,68,.3),  0 16px 40px rgba(239,68,68,.08)  !important; }

  .tcs-diff-easy:hover   { border-color: rgba(34,197,94,.3) !important;  box-shadow: 0 16px 40px rgba(34,197,94,.06) !important; }
  .tcs-diff-medium:hover { border-color: rgba(245,158,11,.3) !important; box-shadow: 0 16px 40px rgba(245,158,11,.06) !important; }
  .tcs-diff-hard:hover   { border-color: rgba(239,68,68,.3) !important;  box-shadow: 0 16px 40px rgba(239,68,68,.06) !important; }

  .tcs-primary-btn {
    padding: 14px 40px; border-radius: 10px; border: none;
    background: linear-gradient(135deg, #00e5ff, #00b8cc);
    color: #000; font-family: 'DM Sans', sans-serif;
    font-weight: 700; font-size: 16px; cursor: pointer;
    box-shadow: 0 0 24px rgba(0,229,255,.3);
    transition: transform .2s, box-shadow .2s;
    display: inline-flex; align-items: center; gap: 10px;
  }
  .tcs-primary-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 0 44px rgba(0,229,255,.5);
  }
  .tcs-primary-btn:disabled {
    background: rgba(255,255,255,.06); color: #475569;
    box-shadow: none; cursor: not-allowed; border: 1px solid rgba(255,255,255,.08);
  }

  .tcs-step-label {
    font-family: 'Orbitron', sans-serif; font-size: 10px; font-weight: 700;
    color: #00e5ff; letter-spacing: 2px; text-transform: uppercase;
    display: flex; align-items: center; gap: 10px; margin-bottom: 20px;
  }
  .tcs-step-label::after {
    content: ''; flex: 1; height: 1px;
    background: linear-gradient(90deg, rgba(0,229,255,.2), transparent);
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #040610; }
  ::-webkit-scrollbar-thumb { background: #00b8cc; border-radius: 4px; }
`;

function Spinner() {
        return (
                <div style={{
                        width: 18, height: 18,
                        border: '2px solid rgba(0,0,0,.2)',
                        borderTop: '2px solid #000',
                        borderRadius: '50%',
                        animation: 'tcsSpin .8s linear infinite',
                        flexShrink: 0,
                }} />
        );
}

export default function TechnicalChallengeSelector() {
        const navigate = useNavigate();
        const [selectedCategory, setSelectedCategory] = useState('');
        const [selectedDifficulty, setSelectedDifficulty] = useState('');
        const [isLoading, setIsLoading] = useState(false);
        const [toast, setToast] = useState({ message: '', type: 'success', visible: false });

        useEffect(() => {
                if (!document.getElementById('pf-tcs-styles')) {
                        const s = document.createElement('style');
                        s.id = 'pf-tcs-styles';
                        s.textContent = STYLES;
                        document.head.appendChild(s);
                }
        }, []);

        const categories = [
                { id: 'dsa', name: 'Data Structures & Algorithms', icon: '💻', accent: DS.cyan, accentRgb: '0,229,255' },
                { id: 'dbms', name: 'Database Management', icon: '🗄️', accent: DS.green, accentRgb: '34,197,94' },
                { id: 'daa', name: 'Design & Analysis', icon: '📊', accent: DS.purple2, accentRgb: '168,85,247' },
        ];

        const difficulties = [
                { id: 'Easy', label: 'Easy', desc: 'Great for beginners', color: DS.green, rgb: '34,197,94', cls: 'tcs-diff-easy' },
                { id: 'Medium', label: 'Medium', desc: 'Intermediate challenges', color: DS.gold, rgb: '245,158,11', cls: 'tcs-diff-medium' },
                { id: 'Hard', label: 'Hard', desc: 'For advanced learners', color: DS.red, rgb: '239,68,68', cls: 'tcs-diff-hard' },
        ];

        const handleGenerate = async () => {
                if (!selectedCategory || !selectedDifficulty) {
                        setToast({ message: 'Please select both category and difficulty!', type: 'error', visible: true });
                        return;
                }
                setIsLoading(true);
                try {
                        const response = await api.post('/api/technical-challenge', {
                                category: selectedCategory,
                                difficulty: selectedDifficulty,
                        });
                        navigate('/technical-challenge', { state: { problem: response.data } });
                } catch (error) {
                        console.error('Technical challenge generation error:', error);
                        let errorMessage = 'Failed to generate challenge. Please try again.';
                        if (error.response?.data?.detail) {
                                if (typeof error.response.data.detail === 'string') errorMessage = error.response.data.detail;
                        }
                        setToast({ message: errorMessage, type: 'error', visible: true });
                } finally {
                        setIsLoading(false);
                }
        };

        const bothSelected = selectedCategory && selectedDifficulty;
        const selCat = categories.find(c => c.id === selectedCategory);
        const selDiff = difficulties.find(d => d.id === selectedDifficulty);

        return (
                <div className="tcs-page" style={{
                        display: 'flex', minHeight: '100vh',
                        background: DS.bg,
                        backgroundImage: 'linear-gradient(rgba(0,229,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,.04) 1px, transparent 1px)',
                        backgroundSize: '60px 60px',
                }}>
                        <Sidebar />

                        {/* Glow blobs */}
                        <div style={{ position: 'fixed', top: '8%', left: '20%', width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,229,255,.05),transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
                        <div style={{ position: 'fixed', bottom: '5%', right: '5%', width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,58,237,.07),transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

                        <main style={{ flex: 1, marginLeft: 240, padding: '40px 32px', position: 'relative', zIndex: 1 }}>
                                <div style={{ maxWidth: 900, margin: '0 auto' }}>

                                        {/* ── Header ── */}
                                        <header style={{ textAlign: 'center', marginBottom: 56, animation: 'tcsSlideUp .7s ease both' }}>
                                                <div style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: 6,
                                                        padding: '6px 16px', border: '1px solid rgba(0,229,255,.25)',
                                                        borderRadius: '999px', background: 'rgba(0,229,255,.06)',
                                                        fontSize: 13, color: DS.cyan, marginBottom: 20,
                                                }}>
                                                        💻 Technical Challenge
                                                </div>
                                                <h1 style={{
                                                        fontFamily: 'Orbitron,sans-serif', fontSize: 'clamp(32px,4.5vw,52px)',
                                                        fontWeight: 900, letterSpacing: '-1px', color: '#fff', marginBottom: 14,
                                                }}>
                                                        Choose Your <span style={gradText}>Challenge</span>
                                                </h1>
                                                <p style={{ fontSize: 16, color: DS.muted, lineHeight: 1.7 }}>
                                                        Select a category and difficulty to generate your technical challenge
                                                </p>
                                        </header>

                                        {/* ── Step 1: Category ── */}
                                        <div style={{ marginBottom: 44, animation: 'tcsSlideUp .6s .1s ease both' }}>
                                                <div className="tcs-step-label">Step 01 — Select Category</div>
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
                                                        {categories.map((cat, i) => (
                                                                <div
                                                                        key={cat.id}
                                                                        className={`tcs-card${selectedCategory === cat.id ? ' selected' : ''}`}
                                                                        style={{
                                                                                ...card,
                                                                                textAlign: 'center', padding: '36px 20px',
                                                                                borderColor: selectedCategory === cat.id
                                                                                        ? `rgba(${cat.accentRgb},.4)`
                                                                                        : DS.border,
                                                                                animation: `tcsSlideUp .5s ${i * .1}s ease both`,
                                                                        }}
                                                                        onClick={() => setSelectedCategory(cat.id)}
                                                                >
                                                                        {/* selected check */}
                                                                        {selectedCategory === cat.id && (
                                                                                <div style={{
                                                                                        position: 'absolute', top: 12, right: 12,
                                                                                        width: 22, height: 22, borderRadius: '50%',
                                                                                        background: `rgba(${cat.accentRgb},.15)`,
                                                                                        border: `1px solid rgba(${cat.accentRgb},.4)`,
                                                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                                        fontSize: 11, color: `rgb(${cat.accentRgb})`, fontWeight: 700,
                                                                                }}>✓</div>
                                                                        )}

                                                                        <div style={{
                                                                                width: 72, height: 72, borderRadius: 18, margin: '0 auto 20px',
                                                                                background: `rgba(${cat.accentRgb},.1)`,
                                                                                border: `1px solid rgba(${cat.accentRgb},.25)`,
                                                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                                fontSize: 32,
                                                                        }}>
                                                                                {cat.icon}
                                                                        </div>

                                                                        <h3 style={{
                                                                                fontFamily: 'Orbitron,sans-serif', fontSize: 14, fontWeight: 700,
                                                                                color: '#fff', marginBottom: 8,
                                                                        }}>
                                                                                {cat.name}
                                                                        </h3>

                                                                        <div style={{
                                                                                fontFamily: 'Orbitron,sans-serif', fontSize: 10, fontWeight: 700,
                                                                                color: `rgba(${cat.accentRgb},1)`, letterSpacing: '2px',
                                                                        }}>
                                                                                {cat.id.toUpperCase()}
                                                                        </div>
                                                                </div>
                                                        ))}
                                                </div>
                                        </div>

                                        {/* ── Step 2: Difficulty ── */}
                                        <div style={{ marginBottom: 44, animation: 'tcsSlideUp .6s .2s ease both' }}>
                                                <div className="tcs-step-label">Step 02 — Select Difficulty</div>
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
                                                        {difficulties.map((diff, i) => (
                                                                <div
                                                                        key={diff.id}
                                                                        className={`tcs-card ${diff.cls}${selectedDifficulty === diff.id ? ' selected' : ''}`}
                                                                        style={{
                                                                                ...card,
                                                                                textAlign: 'center', padding: '32px 20px',
                                                                                borderColor: selectedDifficulty === diff.id
                                                                                        ? `rgba(${diff.rgb},.45)`
                                                                                        : DS.border,
                                                                                animation: `tcsSlideUp .5s ${i * .1 + .1}s ease both`,
                                                                        }}
                                                                        onClick={() => setSelectedDifficulty(diff.id)}
                                                                >
                                                                        {selectedDifficulty === diff.id && (
                                                                                <div style={{
                                                                                        position: 'absolute', top: 12, right: 12,
                                                                                        width: 22, height: 22, borderRadius: '50%',
                                                                                        background: `rgba(${diff.rgb},.15)`,
                                                                                        border: `1px solid rgba(${diff.rgb},.4)`,
                                                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                                        fontSize: 11, color: diff.color, fontWeight: 700,
                                                                                }}>✓</div>
                                                                        )}

                                                                        {/* letter circle */}
                                                                        <div style={{
                                                                                width: 60, height: 60, borderRadius: '50%', margin: '0 auto 18px',
                                                                                background: `rgba(${diff.rgb},.1)`,
                                                                                border: `2px solid rgba(${diff.rgb},.3)`,
                                                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                        }}>
                                                                                <span style={{
                                                                                        fontFamily: 'Orbitron,sans-serif', fontSize: 22, fontWeight: 900,
                                                                                        color: diff.color,
                                                                                }}>
                                                                                        {diff.label[0]}
                                                                                </span>
                                                                        </div>

                                                                        <h3 style={{
                                                                                fontFamily: 'Orbitron,sans-serif', fontSize: 16, fontWeight: 700,
                                                                                color: diff.color, marginBottom: 6,
                                                                        }}>
                                                                                {diff.label}
                                                                        </h3>
                                                                        <p style={{ fontSize: 13, color: DS.muted }}>{diff.desc}</p>
                                                                </div>
                                                        ))}
                                                </div>
                                        </div>

                                        {/* ── Step 3: Generate ── */}
                                        <div style={{ animation: 'tcsSlideUp .6s .3s ease both' }}>
                                                <div className="tcs-step-label">Step 03 — Generate Challenge</div>
                                                <div style={{
                                                        ...card,
                                                        background: bothSelected
                                                                ? 'linear-gradient(135deg,rgba(0,229,255,.04),rgba(124,58,237,.06))'
                                                                : DS.surface,
                                                        borderColor: bothSelected ? 'rgba(0,229,255,.2)' : DS.border,
                                                        textAlign: 'center', padding: '40px',
                                                        transition: 'all .3s',
                                                }}>
                                                        {bothSelected ? (
                                                                <>
                                                                        {/* selection summary */}
                                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 24 }}>
                                                                                <div style={{
                                                                                        padding: '8px 18px', borderRadius: '999px', fontSize: 13, fontWeight: 600,
                                                                                        background: `rgba(${selCat.accentRgb},.1)`,
                                                                                        border: `1px solid rgba(${selCat.accentRgb},.25)`,
                                                                                        color: `rgb(${selCat.accentRgb})`,
                                                                                        fontFamily: 'DM Sans,sans-serif',
                                                                                }}>
                                                                                        {selCat.icon} {selCat.id.toUpperCase()}
                                                                                </div>
                                                                                <div style={{ color: DS.muted, fontSize: 18 }}>×</div>
                                                                                <div style={{
                                                                                        padding: '8px 18px', borderRadius: '999px', fontSize: 13, fontWeight: 600,
                                                                                        background: `rgba(${selDiff.rgb},.1)`,
                                                                                        border: `1px solid rgba(${selDiff.rgb},.25)`,
                                                                                        color: selDiff.color,
                                                                                        fontFamily: 'DM Sans,sans-serif',
                                                                                }}>
                                                                                        {selDiff.label}
                                                                                </div>
                                                                        </div>
                                                                        <h3 style={{
                                                                                fontFamily: 'Orbitron,sans-serif', fontSize: 18, fontWeight: 700,
                                                                                color: '#fff', marginBottom: 8,
                                                                        }}>
                                                                                Ready to Start!
                                                                        </h3>
                                                                        <p style={{ color: DS.muted, fontSize: 14, marginBottom: 28 }}>
                                                                                Generate a {selDiff.label} {selCat.id.toUpperCase()} challenge
                                                                        </p>
                                                                </>
                                                        ) : (
                                                                <>
                                                                        <div style={{ fontSize: 40, marginBottom: 16 }}>⚡</div>
                                                                        <h3 style={{
                                                                                fontFamily: 'Orbitron,sans-serif', fontSize: 16, fontWeight: 700,
                                                                                color: DS.muted, marginBottom: 8,
                                                                        }}>
                                                                                Almost There
                                                                        </h3>
                                                                        <p style={{ color: DS.muted, fontSize: 14, marginBottom: 28 }}>
                                                                                Select a category and difficulty level above to continue
                                                                        </p>
                                                                </>
                                                        )}

                                                        <button
                                                                className="tcs-primary-btn"
                                                                onClick={handleGenerate}
                                                                disabled={!bothSelected || isLoading}
                                                        >
                                                                {isLoading ? (<><Spinner /> Generating Challenge...</>) : '🚀 Generate Challenge'}
                                                        </button>
                                                </div>
                                        </div>

                                </div>
                        </main>

                        <Toast
                                message={toast.message} type={toast.type}
                                isVisible={toast.visible}
                                onClose={() => setToast(t => ({ ...t, visible: false }))}
                        />
                </div>
        );
}