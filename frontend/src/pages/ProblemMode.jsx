import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Toast from '../components/Toast';
import api from '../services/api';

/* ── Design tokens ── */
const DS = {
        bg: '#040610',
        surface: 'rgba(10,15,30,0.65)',
        cyan: '#00e5ff',
        cyanDim: '#00b8cc',
        purple: '#7c3aed',
        purple2: '#a855f7',
        gold: '#f59e0b',
        text: '#e2e8f0',
        muted: '#64748b',
        border: 'rgba(0,229,255,0.12)',
        borderHover: 'rgba(0,229,255,0.3)',
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
        background: 'linear-gradient(135deg, #00e5ff 0%, #a855f7 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
};

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=DM+Sans:wght@400;500;600&display=swap');

  @keyframes pmSlideUp {
    from { opacity:0; transform:translateY(28px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes pmSpin { to { transform: rotate(360deg); } }
  @keyframes pmScanline {
    0%   { top: 0%; }
    100% { top: 100%; }
  }
  @keyframes pmGlow {
    0%,100% { box-shadow: 0 0 10px rgba(0,229,255,.2); }
    50%      { box-shadow: 0 0 30px rgba(0,229,255,.5); }
  }

  .pm-page { font-family: 'DM Sans', sans-serif; }

  /* type selection cards */
  .pm-type-card {
    transition: transform .3s, box-shadow .3s, border-color .3s !important;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .pm-type-card:hover {
    transform: translateY(-6px) !important;
    box-shadow: 0 24px 60px rgba(0,229,255,.12), 0 0 0 1px rgba(0,229,255,.3) !important;
    border-color: rgba(0,229,255,.3) !important;
  }
  /* scan line on type cards */
  .pm-type-card::after {
    content: '';
    position: absolute; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, rgba(0,229,255,.2), transparent);
    animation: pmScanline 4s linear infinite;
    pointer-events: none;
  }

  /* textarea */
  .pm-textarea {
    width: 100%; min-height: 360px; padding: 14px 16px;
    background: rgba(0,0,0,0.45);
    border: 1px solid rgba(0,229,255,.15);
    border-radius: 10px;
    color: #e2e8f0;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 13px; resize: vertical;
    transition: border-color .2s, box-shadow .2s;
    box-sizing: border-box; line-height: 1.7;
    outline: none;
  }
  .pm-textarea::placeholder { color: #475569; }
  .pm-textarea:focus {
    border-color: rgba(0,229,255,.5) !important;
    box-shadow: 0 0 0 3px rgba(0,229,255,.07) !important;
  }

  /* ghost btn */
  .pm-ghost-btn {
    padding: 10px 20px; border-radius: 8px;
    background: transparent; color: #00e5ff;
    border: 1px solid rgba(0,229,255,.3);
    font-family: 'DM Sans', sans-serif; font-weight: 600;
    font-size: 14px; cursor: pointer; transition: all .2s;
    white-space: nowrap;
  }
  .pm-ghost-btn:hover { background: rgba(0,229,255,.08); box-shadow: 0 0 16px rgba(0,229,255,.15); }

  /* primary btn */
  .pm-primary-btn {
    padding: 12px 28px; border-radius: 8px; border: none;
    background: linear-gradient(135deg, #00e5ff, #00b8cc);
    color: #000; font-family: 'DM Sans', sans-serif;
    font-weight: 700; font-size: 15px; cursor: pointer;
    box-shadow: 0 0 20px rgba(0,229,255,.3);
    transition: transform .2s, box-shadow .2s;
    display: flex; align-items: center; gap: 8px;
  }
  .pm-primary-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 0 40px rgba(0,229,255,.5);
  }
  .pm-primary-btn:disabled {
    background: rgba(0,229,255,.15); color: #64748b;
    box-shadow: none; cursor: not-allowed;
  }

  /* badge pill */
  .pm-badge {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 5px 14px; border-radius: 999px; font-size: 12px; font-weight: 600;
  }
  .pm-badge-cyan   { background: rgba(0,229,255,.08);  color: #00e5ff; border: 1px solid rgba(0,229,255,.2);  }
  .pm-badge-purple { background: rgba(168,85,247,.1);  color: #a855f7; border: 1px solid rgba(168,85,247,.25); }
  .pm-badge-gold   { background: rgba(245,158,11,.1);  color: #f59e0b; border: 1px solid rgba(245,158,11,.25); }

  /* hover row for nav items */
  .pm-tip-item { transition: color .15s; }
  .pm-tip-item:hover { color: #e2e8f0 !important; }

  /* scrollbar */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #040610; }
  ::-webkit-scrollbar-thumb { background: #00b8cc; border-radius: 4px; }
`;

function Spinner() {
        return (
                <div style={{
                        width: 16, height: 16,
                        border: '2px solid rgba(0,0,0,.2)',
                        borderTop: '2px solid #000',
                        borderRadius: '50%',
                        animation: 'pmSpin .8s linear infinite',
                }} />
        );
}

export default function ProblemMode() {
        const navigate = useNavigate();
        const [problemType, setProblemType] = useState('');
        const [currentProblem, setCurrentProblem] = useState(null);
        const [userPrompt, setUserPrompt] = useState('');
        const [wordCount, setWordCount] = useState(0);
        const [isLoading, setIsLoading] = useState(false);
        const [isEvaluating, setIsEvaluating] = useState(false);
        const [toast, setToast] = useState({ message: '', type: 'success', visible: false });

        const problemTypes = [
                { id: 'system', name: 'System Design', icon: '🏗️', description: 'Design scalable systems and architectures', color: DS.cyan },
                { id: 'ai', name: 'AI Problems', icon: '🤖', description: 'AI/ML challenges and prompt optimization', color: DS.purple2 },
        ];

        useEffect(() => {
                if (!document.getElementById('pf-pm-styles')) {
                        const s = document.createElement('style');
                        s.id = 'pf-pm-styles';
                        s.textContent = STYLES;
                        document.head.appendChild(s);
                }
        }, []);

        const updateWordCount = (text) => {
                setWordCount(text.trim().split(/\s+/).filter(w => w.length > 0).length);
        };

        const handlePromptChange = (e) => {
                setUserPrompt(e.target.value);
                updateWordCount(e.target.value);
        };

        /* ── NEW: safe normalisation helpers ── */
        const safeString = (val) => {
                if (!val) return '';
                if (typeof val === 'string') return val;
                if (typeof val === 'object') {
                        const preferredKeys = ['summary', 'description', 'text', 'content', 'problem'];
                        for (const key of preferredKeys) {
                                if (val[key]) return val[key];
                        }
                        return JSON.stringify(val, null, 2);
                }
                return String(val);
        };

        const safeArray = (val) => {
                if (!val) return [];
                if (Array.isArray(val)) return val.map(safeString);
                if (typeof val === 'string') return [val];
                if (typeof val === 'object') {
                        return Object.values(val).flatMap(v =>
                                Array.isArray(v) ? v.map(safeString) : [safeString(v)]
                        );
                }
                return [String(val)];
        };

        const handleGenerateProblem = async (type) => {
                setIsLoading(true);
                setProblemType(type);
                try {
                        const response = await api.get(`/api/problem/${type}`);
                        const problemData = response.data;
                        console.log('Raw problem data:', problemData);
                        const problemText = problemData.problem || problemData.problem_text || problemData.scenario || problemData.description;
                        if (!problemText) {
                                console.error('No problem text found in:', problemData);
                                throw new Error('No problem returned from API');
                        }
                        // ── UPDATED: every field is now sanitised ──
                        const normalizedProblem = {
                                title: safeString(problemData.title),
                                scenario: safeString(problemData.problem || problemData.problem_text || problemData.scenario || problemData.description),
                                context: safeString(problemData.context || problemData.source || 'Generated Problem'),
                                source: safeString(problemData.source || (type === 'ai' ? 'AI Generated' : 'System')),
                                difficulty: safeString(problemData.difficulty || 'Medium'),
                                requirements: safeArray(problemData.requirements),
                                constraints: safeArray(problemData.constraints),
                                example_input: safeString(problemData.example_input),
                                example_output: safeString(problemData.example_output),
                        };
                        console.log('Normalized problem:', normalizedProblem);
                        setCurrentProblem(normalizedProblem);
                        setUserPrompt('');
                        setWordCount(0);
                        setToast({ message: 'Problem loaded! 🎉', type: 'success', visible: true });
                } catch (error) {
                        console.error('Problem fetch error:', error);
                        let errorMessage = 'Failed to load problem.';
                        if (error.response?.data?.detail) {
                                if (typeof error.response.data.detail === 'string') errorMessage = error.response.data.detail;
                                else if (Array.isArray(error.response.data.detail)) errorMessage = error.response.data.detail.map(e => e.msg).join(', ');
                                else errorMessage = 'Server error occurred.';
                        } else if (error.message) errorMessage = error.message;
                        setToast({ message: errorMessage, type: 'error', visible: true });
                } finally {
                        setIsLoading(false);
                }
        };

        const handleEvaluate = async () => {
                if (!userPrompt.trim()) {
                        setToast({ message: 'Please write your prompt first!', type: 'error', visible: true });
                        return;
                }
                setIsEvaluating(true);
                try {
                        const response = await api.post('/api/evaluate', {
                                problem_text: currentProblem.scenario || currentProblem.title,
                                problem_source: currentProblem.source || 'Unknown',
                                user_prompt: userPrompt,
                        });
                        navigate('/evaluation-result', { state: { evaluation: response.data, problem: currentProblem, userPrompt } });
                } catch (error) {
                        console.error('Evaluation error:', error);
                        let errorMessage = 'Evaluation failed. Please try again.';
                        if (error.response?.data?.detail) {
                                if (typeof error.response.data.detail === 'string') errorMessage = error.response.data.detail;
                                else if (Array.isArray(error.response.data.detail)) errorMessage = error.response.data.detail.map(e => e.msg).join(', ');
                        } else if (error.message) errorMessage = error.message;
                        setToast({ message: errorMessage, type: 'error', visible: true });
                } finally {
                        setIsEvaluating(false);
                }
        };

        /* ─────────── difficulty badge color ─────────── */
        const difficultyBadge = (d) => {
                if (!d) return 'pm-badge pm-badge-cyan';
                const lower = d.toLowerCase();
                if (lower === 'easy') return 'pm-badge pm-badge-cyan';
                if (lower === 'hard') return 'pm-badge pm-badge-purple';
                return 'pm-badge pm-badge-gold';
        };

        return (
                <div className="pm-page" style={{
                        display: 'flex', minHeight: '100vh',
                        background: DS.bg,
                        backgroundImage: 'linear-gradient(rgba(0,229,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,.04) 1px, transparent 1px)',
                        backgroundSize: '60px 60px',
                }}>
                        <Sidebar />

                        {/* Glow blobs */}
                        <div style={{ position: 'fixed', top: '10%', left: '18%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,229,255,.05),transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
                        <div style={{ position: 'fixed', bottom: '8%', right: '4%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,58,237,.07),transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

                        <main style={{ flex: 1, marginLeft: 240, padding: '36px 32px', position: 'relative', zIndex: 1 }}>
                                <div style={{ maxWidth: 1240, margin: '0 auto' }}>

                                        {!currentProblem ? (
                                                /* ══════════════════════════════════
                                                   PROBLEM TYPE SELECTION
                                                ══════════════════════════════════ */
                                                <div style={{ animation: 'pmSlideUp .7s ease both' }}>
                                                        {/* Header */}
                                                        <header style={{ textAlign: 'center', marginBottom: 56 }}>
                                                                <div className="pm-badge pm-badge-cyan" style={{ marginBottom: 20 }}>
                                                                        🎯 Challenge Mode
                                                                </div>
                                                                <h1 style={{
                                                                        fontFamily: 'Orbitron,sans-serif', fontSize: 'clamp(36px,5vw,56px)',
                                                                        fontWeight: 900, letterSpacing: '-1px', color: '#fff', marginBottom: 16,
                                                                }}>
                                                                        Problem <span style={gradText}>Mode</span>
                                                                </h1>
                                                                <p style={{ fontSize: 16, color: DS.muted, lineHeight: 1.7, maxWidth: 480, margin: '0 auto' }}>
                                                                        Choose a problem type to start practicing your prompt engineering skills
                                                                </p>
                                                        </header>

                                                        {/* Type cards */}
                                                        <div style={{
                                                                display: 'grid', gridTemplateColumns: 'repeat(2,1fr)',
                                                                gap: 24, maxWidth: 760, margin: '0 auto',
                                                        }}>
                                                                {problemTypes.map((type, i) => (
                                                                        <div
                                                                                key={type.id}
                                                                                className="pm-type-card"
                                                                                style={{
                                                                                        ...card, textAlign: 'center', padding: '44px 28px',
                                                                                        animation: `pmSlideUp .5s ${i * .12}s ease both`,
                                                                                }}
                                                                        >
                                                                                {/* icon */}
                                                                                <div style={{
                                                                                        width: 80, height: 80, borderRadius: 20, margin: '0 auto 24px',
                                                                                        background: `${type.color}12`, border: `1px solid ${type.color}30`,
                                                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                                        fontSize: 36, animation: 'pmGlow 3s ease-in-out infinite',
                                                                                }}>
                                                                                        {type.icon}
                                                                                </div>

                                                                                <h2 style={{
                                                                                        fontFamily: 'Orbitron,sans-serif', fontSize: 20, fontWeight: 700,
                                                                                        color: '#fff', marginBottom: 12,
                                                                                }}>
                                                                                        {type.name}
                                                                                </h2>
                                                                                <p style={{ color: DS.muted, fontSize: 14, marginBottom: 28, lineHeight: 1.7 }}>
                                                                                        {type.description}
                                                                                </p>

                                                                                {/* divider */}
                                                                                <div style={{ height: 1, background: `linear-gradient(90deg,transparent,${type.color}30,transparent)`, marginBottom: 28 }} />

                                                                                <button
                                                                                        className="pm-primary-btn"
                                                                                        onClick={() => handleGenerateProblem(type.id)}
                                                                                        disabled={isLoading && problemType === type.id}
                                                                                        style={{
                                                                                                width: '100%', justifyContent: 'center',
                                                                                                background: type.id === 'ai'
                                                                                                        ? 'linear-gradient(135deg,#7c3aed,#a855f7)'
                                                                                                        : 'linear-gradient(135deg,#00e5ff,#00b8cc)',
                                                                                                boxShadow: type.id === 'ai'
                                                                                                        ? '0 0 20px rgba(124,58,237,.35)'
                                                                                                        : '0 0 20px rgba(0,229,255,.3)',
                                                                                        }}
                                                                                >
                                                                                        {isLoading && problemType === type.id ? (<><Spinner /> Loading...</>) : '⚡ Start Challenge'}
                                                                                </button>
                                                                        </div>
                                                                ))}
                                                        </div>
                                                </div>

                                        ) : (
                                                /* ══════════════════════════════════
                                                   PROBLEM WORKSPACE
                                                ══════════════════════════════════ */
                                                <div style={{ animation: 'pmSlideUp .6s ease both' }}>

                                                        {/* ── Problem Header ── */}
                                                        <div style={{
                                                                ...card, marginBottom: 24,
                                                                border: '1px solid rgba(0,229,255,.2)',
                                                                background: 'rgba(0,229,255,.02)',
                                                        }}>
                                                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                                                                        <div style={{ flex: 1 }}>
                                                                                {/* badges row */}
                                                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
                                                                                        <span className="pm-badge pm-badge-cyan">
                                                                                                {problemType === 'system' ? '🏗️ System Design' : '🤖 AI Problem'}
                                                                                        </span>
                                                                                        <span className={difficultyBadge(currentProblem.difficulty)}>
                                                                                                {currentProblem.difficulty}
                                                                                        </span>
                                                                                </div>
                                                                                <h1 style={{
                                                                                        fontFamily: 'Orbitron,sans-serif', fontSize: 22, fontWeight: 700,
                                                                                        color: '#fff', marginBottom: 6,
                                                                                }}>
                                                                                        {currentProblem.title}
                                                                                </h1>
                                                                                <p style={{ color: DS.muted, fontSize: 13 }}>{currentProblem.context}</p>
                                                                        </div>
                                                                        <button className="pm-ghost-btn" onClick={() => setCurrentProblem(null)}>
                                                                                ← Change Problem
                                                                        </button>
                                                                </div>
                                                        </div>

                                                        {/* ── Two Column ── */}
                                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

                                                                {/* LEFT — Problem Details */}
                                                                <div style={{ ...card, height: 'fit-content', position: 'sticky', top: 24 }}>
                                                                        <h2 style={{
                                                                                fontFamily: 'Orbitron,sans-serif', fontSize: 11, fontWeight: 700,
                                                                                color: DS.cyan, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 20,
                                                                        }}>
                                                                                Problem Details
                                                                        </h2>

                                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                                                                                {/* Scenario */}
                                                                                <div>
                                                                                        <h3 style={{ fontFamily: 'Orbitron,sans-serif', fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 10, letterSpacing: 1 }}>
                                                                                                Scenario
                                                                                        </h3>
                                                                                        <p style={{ color: DS.muted, fontSize: 14, lineHeight: 1.8 }}>
                                                                                                {currentProblem.scenario}
                                                                                        </p>
                                                                                </div>

                                                                                {/* Divider */}
                                                                                {(currentProblem.requirements?.length > 0 || currentProblem.constraints?.length > 0) && (
                                                                                        <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,rgba(0,229,255,.12),transparent)' }} />
                                                                                )}

                                                                                {/* Requirements */}
                                                                                {currentProblem.requirements?.length > 0 && (
                                                                                        <div>
                                                                                                <h3 style={{ fontFamily: 'Orbitron,sans-serif', fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 12, letterSpacing: 1 }}>
                                                                                                        Requirements
                                                                                                </h3>
                                                                                                <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 0, listStyle: 'none' }}>
                                                                                                        {currentProblem.requirements.map((req, i) => (
                                                                                                                <li key={i} style={{ display: 'flex', gap: 10, fontSize: 13, color: DS.muted, lineHeight: 1.6 }}>
                                                                                                                        <span style={{ color: '#22c55e', fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
                                                                                                                        {req}
                                                                                                                </li>
                                                                                                        ))}
                                                                                                </ul>
                                                                                        </div>
                                                                                )}

                                                                                {/* Constraints */}
                                                                                {currentProblem.constraints?.length > 0 && (
                                                                                        <div>
                                                                                                <h3 style={{ fontFamily: 'Orbitron,sans-serif', fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 12, letterSpacing: 1 }}>
                                                                                                        Constraints
                                                                                                </h3>
                                                                                                <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 0, listStyle: 'none' }}>
                                                                                                        {currentProblem.constraints.map((c, i) => (
                                                                                                                <li key={i} style={{ display: 'flex', gap: 10, fontSize: 13, color: DS.muted, lineHeight: 1.6 }}>
                                                                                                                        <span style={{ color: DS.gold, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>!</span>
                                                                                                                        {c}
                                                                                                                </li>
                                                                                                        ))}
                                                                                                </ul>
                                                                                        </div>
                                                                                )}

                                                                                {/* Example Input */}
                                                                                {currentProblem.example_input && (
                                                                                        <div style={{
                                                                                                padding: 16, background: 'rgba(0,0,0,0.4)',
                                                                                                border: '1px solid rgba(0,229,255,.1)', borderRadius: 10,
                                                                                                borderLeft: `3px solid ${DS.cyan}`,
                                                                                        }}>
                                                                                                <h3 style={{
                                                                                                        fontFamily: 'Orbitron,sans-serif', fontSize: 10, fontWeight: 700,
                                                                                                        color: DS.cyan, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 8,
                                                                                                }}>
                                                                                                        Example Input
                                                                                                </h3>
                                                                                                <p style={{ color: DS.muted, fontSize: 13, fontFamily: 'monospace', lineHeight: 1.7 }}>
                                                                                                        {currentProblem.example_input}
                                                                                                </p>
                                                                                        </div>
                                                                                )}

                                                                                {/* Expected Output */}
                                                                                {currentProblem.example_output && (
                                                                                        <div style={{
                                                                                                padding: 16, background: 'rgba(0,0,0,0.4)',
                                                                                                border: '1px solid rgba(34,197,94,.15)', borderRadius: 10,
                                                                                                borderLeft: '3px solid #22c55e',
                                                                                        }}>
                                                                                                <h3 style={{
                                                                                                        fontFamily: 'Orbitron,sans-serif', fontSize: 10, fontWeight: 700,
                                                                                                        color: '#22c55e', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 8,
                                                                                                }}>
                                                                                                        Expected Output
                                                                                                </h3>
                                                                                                <p style={{ color: DS.muted, fontSize: 13, fontFamily: 'monospace', lineHeight: 1.7 }}>
                                                                                                        {currentProblem.example_output}
                                                                                                </p>
                                                                                        </div>
                                                                                )}
                                                                        </div>
                                                                </div>

                                                                {/* RIGHT — Prompt Editor + Tips */}
                                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                                                                        {/* Editor card */}
                                                                        <div style={{ ...card }}>
                                                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                                                                                        <h2 style={{
                                                                                                fontFamily: 'Orbitron,sans-serif', fontSize: 16, fontWeight: 700, color: '#fff',
                                                                                        }}>
                                                                                                Write Your Prompt
                                                                                        </h2>
                                                                                        <div style={{ fontSize: 12, color: DS.muted }}>
                                                                                                <span style={gradText}>
                                                                                                        <span style={{ fontFamily: 'Orbitron,sans-serif', fontWeight: 700, fontSize: 14 }}>{wordCount}</span>
                                                                                                </span>
                                                                                                <span style={{ marginLeft: 4 }}>words</span>
                                                                                        </div>
                                                                                </div>

                                                                                <textarea
                                                                                        className="pm-textarea"
                                                                                        placeholder={`Write a clear, specific prompt to solve this ${problemType === 'system' ? 'system design' : 'AI'} problem...\n\nSuggested structure:\n1. Understand the problem\n2. Break down requirements\n3. Propose solution approach\n4. Address constraints\n5. Provide implementation details`}
                                                                                        value={userPrompt}
                                                                                        onChange={handlePromptChange}
                                                                                />

                                                                                {/* bottom bar */}
                                                                                <div style={{
                                                                                        display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                                                                                        marginTop: 16, paddingTop: 16,
                                                                                        borderTop: '1px solid rgba(0,229,255,.08)',
                                                                                }}>
                                                                                        <button
                                                                                                className="pm-primary-btn"
                                                                                                onClick={handleEvaluate}
                                                                                                disabled={isEvaluating}
                                                                                        >
                                                                                                {isEvaluating ? (<><Spinner /> Evaluating...</>) : '✨ Evaluate Prompt'}
                                                                                        </button>
                                                                                </div>
                                                                        </div>

                                                                        {/* Tips card */}
                                                                        <div style={{
                                                                                ...card,
                                                                                background: 'rgba(0,229,255,.02)',
                                                                                borderColor: 'rgba(0,229,255,.15)',
                                                                        }}>
                                                                                <h3 style={{
                                                                                        fontFamily: 'Orbitron,sans-serif', fontSize: 11, fontWeight: 700,
                                                                                        color: DS.cyan, letterSpacing: '2px', textTransform: 'uppercase',
                                                                                        marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8,
                                                                                }}>
                                                                                        💡 Prompt Writing Tips
                                                                                </h3>

                                                                                {/* mini progress bar visual */}
                                                                                <div style={{
                                                                                        height: 3, borderRadius: 3, marginBottom: 20,
                                                                                        background: 'linear-gradient(90deg,#00e5ff,#a855f7)',
                                                                                        width: wordCount === 0 ? '0%' : `${Math.min((wordCount / 200) * 100, 100)}%`,
                                                                                        transition: 'width .5s ease',
                                                                                }} />

                                                                                <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingLeft: 0, listStyle: 'none' }}>
                                                                                        {[
                                                                                                'Be specific about what you want the AI to do',
                                                                                                'Include relevant context and constraints',
                                                                                                'Break down complex problems into steps',
                                                                                                'Specify the desired output format',
                                                                                        ].map((tip, i) => (
                                                                                                <li key={i} className="pm-tip-item" style={{
                                                                                                        display: 'flex', gap: 10, fontSize: 13, color: DS.muted, lineHeight: 1.7,
                                                                                                }}>
                                                                                                        <span style={{
                                                                                                                color: DS.cyan, flexShrink: 0, fontFamily: 'Orbitron,sans-serif',
                                                                                                                fontSize: 10, fontWeight: 700, marginTop: 2,
                                                                                                        }}>
                                                                                                                {String(i + 1).padStart(2, '0')}
                                                                                                        </span>
                                                                                                        {tip}
                                                                                                </li>
                                                                                        ))}
                                                                                </ul>
                                                                        </div>
                                                                </div>
                                                        </div>
                                                </div>
                                        )}
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
