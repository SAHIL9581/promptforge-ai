import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Toast from '../components/Toast';
import api from '../services/api';

const DS = {
        bg: '#040610',
        surface: 'rgba(10, 15, 30, 0.6)',
        cyan: '#00e5ff',
        cyanDim: '#00b8cc',
        purple: '#7c3aed',
        purple2: '#a855f7',
        gold: '#f59e0b',
        textPrimary: '#e2e8f0',
        textMuted: '#64748b',
        border: 'rgba(0, 229, 255, 0.12)',
};

const gradientText = {
        background: 'linear-gradient(135deg, #00e5ff 0%, #a855f7 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
};

const cardStyle = {
        background: 'rgba(10, 15, 30, 0.6)',
        border: '1px solid rgba(0, 229, 255, 0.12)',
        borderRadius: '16px',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        padding: '24px',
};

export default function TechnicalChallenge() {
        const navigate = useNavigate();
        const location = useLocation();
        const resultsRef = useRef(null);

        const [problem, setProblem] = useState(location.state?.problem || null);
        const [promptText, setPromptText] = useState('');
        const [wordCount, setWordCount] = useState(0);
        const [charCount, setCharCount] = useState(0);
        const [tokenCount, setTokenCount] = useState(0);
        const [isEvaluating, setIsEvaluating] = useState(false);
        const [evaluationResults, setEvaluationResults] = useState(null);
        const [showResults, setShowResults] = useState(false);
        const [toast, setToast] = useState({ message: '', type: 'success', visible: false });

        useEffect(() => {
                const style = document.createElement('style');
                style.id = 'pf-tc-fonts';
                style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=DM+Sans:wght@400;500;600&display=swap');
      @keyframes slideUp {
        from { opacity: 0; transform: translateY(32px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes fillBar {
        from { width: 0; }
      }
      @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      @keyframes glowPulse {
        0%, 100% { box-shadow: 0 0 10px rgba(0,229,255,.3); }
        50%       { box-shadow: 0 0 30px rgba(0,229,255,.6); }
      }
      .tc-textarea::placeholder { color: #64748b; }
      .tc-textarea:focus {
        border-color: rgba(0,229,255,.5) !important;
        box-shadow: 0 0 0 3px rgba(0,229,255,.08) !important;
        outline: none;
      }
      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-track { background: #040610; }
      ::-webkit-scrollbar-thumb { background: #00b8cc; border-radius: 4px; }
    `;
                if (!document.getElementById('pf-tc-fonts')) {
                        document.head.appendChild(style);
                }
        }, []);

        const updateCounters = (text) => {
                const words = text.trim().split(/\s+/).filter((w) => w.length > 0).length;
                const chars = text.length;
                const tokens = Math.ceil(chars / 4);
                setWordCount(words);
                setCharCount(chars);
                setTokenCount(tokens);
        };

        const handlePromptChange = (e) => {
                const text = e.target.value;
                setPromptText(text);
                updateCounters(text);
        };

        const handleEvaluate = async () => {
                if (!promptText.trim()) {
                        setToast({ message: 'Please write a prompt first!', type: 'error', visible: true });
                        return;
                }
                setIsEvaluating(true);
                try {
                        const response = await api.post('/api/technical-evaluate', {
                                problem,
                                user_prompt: promptText,
                                constraints: {},
                        });
                        setEvaluationResults(response.data);
                        setShowResults(true);
                        setToast({ message: 'Evaluation complete! 🎉', type: 'success', visible: true });
                        setTimeout(() => {
                                resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        }, 100);
                } catch (error) {
                        console.error('Technical evaluation error:', error);
                        let errorMessage = 'Evaluation failed. Please try again.';
                        if (error.response?.data?.detail) {
                                if (typeof error.response.data.detail === 'string') {
                                        errorMessage = error.response.data.detail;
                                }
                        }
                        setToast({ message: errorMessage, type: 'error', visible: true });
                } finally {
                        setIsEvaluating(false);
                }
        };

        const handleNewChallenge = () => {
                navigate('/technical-challenge-selector');
        };

        const safeNumeric = (value) => {
                if (typeof value === 'object' && value !== null) {
                        return Number(value.amount ?? value.score ?? value.value ?? 0);
                }
                return Number(value ?? 0);
        };

        // ── No problem selected ──
        if (!problem) {
                return (
                        <div style={{
                                display: 'flex', minHeight: '100vh', background: DS.bg,
                                backgroundImage: 'linear-gradient(rgba(0,229,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,.04) 1px, transparent 1px)',
                                backgroundSize: '60px 60px', fontFamily: 'DM Sans, sans-serif',
                        }}>
                                <Sidebar />
                                <main style={{ flex: 1, marginLeft: '256px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <div style={{ ...cardStyle, textAlign: 'center', maxWidth: '420px', padding: '48px 32px', animation: 'slideUp 0.7s ease both' }}>
                                                <div style={{ fontSize: '64px', marginBottom: '20px' }}>💻</div>
                                                <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '22px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
                                                        No Challenge Selected
                                                </h2>
                                                <p style={{ color: DS.textMuted, fontSize: '14px', marginBottom: '28px', lineHeight: 1.7 }}>
                                                        Choose a challenge category and difficulty to get started.
                                                </p>
                                                <button
                                                        onClick={handleNewChallenge}
                                                        style={{
                                                                padding: '12px 28px', borderRadius: '8px', border: 'none',
                                                                background: 'linear-gradient(135deg, #00e5ff, #00b8cc)',
                                                                color: '#000', fontFamily: 'DM Sans, sans-serif',
                                                                fontWeight: 600, fontSize: '15px', cursor: 'pointer',
                                                                boxShadow: '0 0 20px rgba(0,229,255,.35)',
                                                                transition: 'transform .2s, box-shadow .2s',
                                                        }}
                                                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 40px rgba(0,229,255,.5)'; }}
                                                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(0,229,255,.35)'; }}
                                                >
                                                        Select Challenge
                                                </button>
                                        </div>
                                </main>
                        </div>
                );
        }

        return (
                <div style={{
                        display: 'flex', minHeight: '100vh', background: DS.bg,
                        backgroundImage: 'linear-gradient(rgba(0,229,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,.04) 1px, transparent 1px)',
                        backgroundSize: '60px 60px', fontFamily: 'DM Sans, sans-serif',
                }}>
                        <Sidebar />

                        {/* Glow blobs */}
                        <div style={{
                                position: 'fixed', top: '10%', left: '15%', width: '400px', height: '400px', borderRadius: '50%',
                                background: 'radial-gradient(circle, rgba(0,229,255,.05) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0
                        }} />
                        <div style={{
                                position: 'fixed', bottom: '10%', right: '5%', width: '350px', height: '350px', borderRadius: '50%',
                                background: 'radial-gradient(circle, rgba(124,58,237,.07) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0
                        }} />

                        <main style={{ flex: 1, marginLeft: '256px', position: 'relative', zIndex: 1 }}>

                                {/* Sticky Header */}
                                <header style={{
                                        background: 'rgba(4,6,16,0.85)', backdropFilter: 'blur(16px)',
                                        borderBottom: '1px solid rgba(0,229,255,0.1)',
                                        position: 'sticky', top: 0, zIndex: 40,
                                }}>
                                        <div style={{
                                                maxWidth: '1280px', margin: '0 auto', padding: '0 32px',
                                                height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        }}>
                                                <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: DS.textMuted }}>
                                                        <span>Home</span>
                                                        <span style={{ color: 'rgba(0,229,255,0.3)' }}>/</span>
                                                        <span>Technical Challenge</span>
                                                        <span style={{ color: 'rgba(0,229,255,0.3)' }}>/</span>
                                                        <span style={{ color: DS.cyan, fontWeight: 600 }}>
                                                                {problem.category} — {problem.difficulty}
                                                        </span>
                                                </nav>
                                                <button
                                                        onClick={handleNewChallenge}
                                                        style={{
                                                                padding: '9px 20px', borderRadius: '8px',
                                                                background: 'transparent', color: DS.cyan,
                                                                border: '1px solid rgba(0,229,255,.3)',
                                                                fontFamily: 'DM Sans, sans-serif', fontWeight: 600,
                                                                fontSize: '13px', cursor: 'pointer', transition: 'all .2s',
                                                        }}
                                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,229,255,.08)'}
                                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                                >
                                                        🔄 New Challenge
                                                </button>
                                        </div>
                                </header>

                                {/* Main Content */}
                                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

                                        {/* Problem Card */}
                                        <div style={{ ...cardStyle, height: 'fit-content', position: 'sticky', top: '88px', animation: 'slideUp 0.5s ease both' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                                        <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '16px', fontWeight: 700, color: '#fff' }}>
                                                                Problem Statement
                                                        </h2>
                                                        <span style={{
                                                                padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 600,
                                                                background: 'rgba(0,229,255,.08)', color: DS.cyan, border: '1px solid rgba(0,229,255,.2)',
                                                        }}>{problem.category}</span>
                                                        <span style={{
                                                                padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 600,
                                                                background: 'rgba(168,85,247,.1)', color: DS.purple2, border: '1px solid rgba(168,85,247,.25)',
                                                        }}>{problem.difficulty}</span>
                                                </div>

                                                <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '18px', fontWeight: 700, ...gradientText, marginBottom: '16px' }}>
                                                        {problem.title}
                                                </h3>

                                                {problem.tags && (
                                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                                                                {problem.tags.map((tag, index) => (
                                                                        <span key={index} style={{
                                                                                padding: '3px 10px', borderRadius: '999px', fontSize: '11px',
                                                                                background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(0,229,255,.1)',
                                                                                color: DS.textMuted,
                                                                        }}>{tag}</span>
                                                                ))}
                                                        </div>
                                                )}

                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                                        {/* Description */}
                                                        <div>
                                                                <h4 style={{
                                                                        fontFamily: 'Orbitron, sans-serif', fontSize: '11px', fontWeight: 700, color: DS.cyan,
                                                                        letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px'
                                                                }}>Description</h4>
                                                                <p style={{ color: DS.textMuted, fontSize: '14px', lineHeight: 1.7 }}>
                                                                        {problem.description || problem.problem_statement}
                                                                </p>
                                                        </div>

                                                        {/* Examples */}
                                                        {problem.examples && (
                                                                <div>
                                                                        <h4 style={{
                                                                                fontFamily: 'Orbitron, sans-serif', fontSize: '11px', fontWeight: 700, color: DS.cyan,
                                                                                letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px'
                                                                        }}>Examples</h4>
                                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                                                {problem.examples.map((example, index) => (
                                                                                        <div key={index} style={{
                                                                                                padding: '16px', background: 'rgba(0,0,0,0.4)',
                                                                                                border: '1px solid rgba(0,229,255,.08)', borderRadius: '10px',
                                                                                                fontFamily: 'monospace', fontSize: '12px',
                                                                                        }}>
                                                                                                <div style={{ marginBottom: '6px' }}>
                                                                                                        <span style={{ color: '#22c55e', fontWeight: 700 }}>Input:</span>
                                                                                                        <span style={{ color: DS.textPrimary, marginLeft: '8px' }}>{example.input}</span>
                                                                                                </div>
                                                                                                <div style={{ marginBottom: example.explanation ? '6px' : '0' }}>
                                                                                                        <span style={{ color: DS.gold, fontWeight: 700 }}>Output:</span>
                                                                                                        <span style={{ color: DS.textPrimary, marginLeft: '8px' }}>{example.output}</span>
                                                                                                </div>
                                                                                                {example.explanation && (
                                                                                                        <div style={{ color: DS.textMuted, fontSize: '11px', marginTop: '6px', paddingTop: '6px', borderTop: '1px solid rgba(255,255,255,.05)' }}>
                                                                                                                {example.explanation}
                                                                                                        </div>
                                                                                                )}
                                                                                        </div>
                                                                                ))}
                                                                        </div>
                                                                </div>
                                                        )}

                                                        {/* Constraints */}
                                                        {problem.constraints && (
                                                                <div>
                                                                        <h4 style={{
                                                                                fontFamily: 'Orbitron, sans-serif', fontSize: '11px', fontWeight: 700, color: DS.cyan,
                                                                                letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px'
                                                                        }}>Constraints</h4>
                                                                        <ul style={{ paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                                                {problem.constraints.map((constraint, index) => (
                                                                                        <li key={index} style={{ display: 'flex', gap: '10px', fontSize: '13px', color: DS.textMuted }}>
                                                                                                <span style={{ color: DS.gold }}>!</span>{constraint}
                                                                                        </li>
                                                                                ))}
                                                                        </ul>
                                                                </div>
                                                        )}

                                                        {/* Hints */}
                                                        {problem.hints && (
                                                                <div>
                                                                        <h4 style={{
                                                                                fontFamily: 'Orbitron, sans-serif', fontSize: '11px', fontWeight: 700, color: DS.purple2,
                                                                                letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px'
                                                                        }}>Hints</h4>
                                                                        <ul style={{ paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                                                {problem.hints.map((hint, index) => (
                                                                                        <li key={index} style={{ display: 'flex', gap: '10px', fontSize: '13px', color: DS.textMuted }}>
                                                                                                <span style={{ color: DS.purple2 }}>→</span>{hint}
                                                                                        </li>
                                                                                ))}
                                                                        </ul>
                                                                </div>
                                                        )}
                                                </div>
                                        </div>

                                        {/* Editor + Results */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                                                {/* Prompt Editor */}
                                                <div style={{ ...cardStyle, animation: 'slideUp 0.5s 0.1s ease both' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                                                                <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '18px', fontWeight: 700, color: '#fff' }}>
                                                                        Craft Your Prompt
                                                                </h2>
                                                                <span style={{ fontSize: '13px', color: DS.textMuted }}>Write your solution approach</span>
                                                        </div>

                                                        <textarea
                                                                className="tc-textarea"
                                                                style={{
                                                                        width: '100%', minHeight: '380px', padding: '14px 16px',
                                                                        background: 'rgba(0,0,0,0.4)',
                                                                        border: '1px solid rgba(0,229,255,.15)',
                                                                        borderRadius: '10px', color: DS.textPrimary,
                                                                        fontFamily: 'JetBrains Mono, monospace', fontSize: '13px',
                                                                        resize: 'vertical', transition: 'border-color .2s, box-shadow .2s',
                                                                        boxSizing: 'border-box', lineHeight: 1.7,
                                                                }}
                                                                placeholder={`Example:\nWrite a function that solves [problem name].\n- Use [data structure/algorithm]\n- Handle edge cases like [...]\n- Time complexity should be O(...)\n- Consider constraints: [...]`}
                                                                value={promptText}
                                                                onChange={handlePromptChange}
                                                        />

                                                        {/* Counters + Evaluate */}
                                                        <div style={{
                                                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                                marginTop: '16px', paddingTop: '16px',
                                                                borderTop: '1px solid rgba(0,229,255,.08)',
                                                        }}>
                                                                <div style={{ display: 'flex', gap: '24px', fontSize: '13px' }}>
                                                                        {[
                                                                                { label: 'Words', value: wordCount, color: DS.cyan },
                                                                                { label: 'Chars', value: charCount, color: DS.purple2 },
                                                                                { label: 'Tokens', value: tokenCount, color: DS.gold },
                                                                        ].map(({ label, value, color }) => (
                                                                                <div key={label}>
                                                                                        <span style={{ color: DS.textMuted }}>{label}: </span>
                                                                                        <span style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 700, fontSize: '14px', color }}>{value}</span>
                                                                                </div>
                                                                        ))}
                                                                </div>
                                                                <button
                                                                        onClick={handleEvaluate}
                                                                        disabled={isEvaluating}
                                                                        style={{
                                                                                padding: '12px 24px', borderRadius: '8px', border: 'none',
                                                                                background: isEvaluating ? 'rgba(0,229,255,0.15)' : 'linear-gradient(135deg, #00e5ff, #00b8cc)',
                                                                                color: isEvaluating ? DS.textMuted : '#000',
                                                                                fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '14px',
                                                                                cursor: isEvaluating ? 'not-allowed' : 'pointer',
                                                                                boxShadow: isEvaluating ? 'none' : '0 0 20px rgba(0,229,255,.35)',
                                                                                transition: 'transform .2s, box-shadow .2s',
                                                                                display: 'flex', alignItems: 'center', gap: '8px',
                                                                        }}
                                                                        onMouseEnter={e => {
                                                                                if (!isEvaluating) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 40px rgba(0,229,255,.5)'; }
                                                                        }}
                                                                        onMouseLeave={e => {
                                                                                e.currentTarget.style.transform = 'translateY(0)';
                                                                                e.currentTarget.style.boxShadow = isEvaluating ? 'none' : '0 0 20px rgba(0,229,255,.35)';
                                                                        }}
                                                                >
                                                                        {isEvaluating ? (
                                                                                <>
                                                                                        <div style={{ width: '16px', height: '16px', border: '2px solid rgba(0,0,0,0.2)', borderTop: '2px solid #000', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                                                                                        Evaluating...
                                                                                </>
                                                                        ) : '✨ Evaluate Prompt'}
                                                                </button>
                                                        </div>
                                                </div>

                                                {/* Evaluation Results */}
                                                {showResults && evaluationResults && (
                                                        <div ref={resultsRef} style={{ ...cardStyle, borderColor: 'rgba(0,229,255,0.25)', animation: 'slideUp 0.5s ease both' }}>
                                                                <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '24px' }}>
                                                                        Evaluation Results
                                                                </h2>

                                                                {/* Overall Score */}
                                                                <div style={{
                                                                        marginBottom: '28px', padding: '24px',
                                                                        background: 'rgba(0,229,255,0.04)',
                                                                        border: '1px solid rgba(0,229,255,0.2)',
                                                                        borderRadius: '12px',
                                                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                                }}>
                                                                        <div>
                                                                                <p style={{ color: DS.textMuted, fontSize: '13px', marginBottom: '6px', fontFamily: 'Orbitron, sans-serif', letterSpacing: '1px', textTransform: 'uppercase' }}>
                                                                                        Overall Score
                                                                                </p>
                                                                                <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '52px', fontWeight: 900, ...gradientText, animation: 'glowPulse 2s ease-in-out infinite' }}>
                                                                                        {safeNumeric(evaluationResults.overall_score)}<span style={{ fontSize: '24px', opacity: 0.6 }}>/100</span>
                                                                                </div>
                                                                        </div>
                                                                        <div style={{ fontSize: '56px' }}>
                                                                                {safeNumeric(evaluationResults.overall_score) >= 80 ? '🎉' : safeNumeric(evaluationResults.overall_score) >= 60 ? '👍' : '💪'}
                                                                        </div>
                                                                </div>

                                                                {/* Scores Grid */}
                                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '28px' }}>
                                                                        {Object.entries(evaluationResults)
                                                                                .filter(([key]) => ['problem_understanding', 'approach_clarity', 'implementation_details', 'edge_case_handling', 'complexity_analysis', 'code_structure', 'correctness'].includes(key))
                                                                                .map(([key, value]) => {
                                                                                        const numericValue = safeNumeric(value);
                                                                                        return (
                                                                                                <div key={key} style={{
                                                                                                        padding: '16px', background: 'rgba(0,0,0,0.35)',
                                                                                                        border: '1px solid rgba(0,229,255,.08)', borderRadius: '10px',
                                                                                                }}>
                                                                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                                                                                                <span style={{ fontSize: '12px', color: DS.textMuted, textTransform: 'capitalize' }}>
                                                                                                                        {key.replace(/_/g, ' ')}
                                                                                                                </span>
                                                                                                                <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '15px', fontWeight: 900, ...gradientText }}>
                                                                                                                        {numericValue}
                                                                                                                </span>
                                                                                                        </div>
                                                                                                        <div style={{ height: '6px', background: 'rgba(255,255,255,.06)', borderRadius: '6px', overflow: 'hidden' }}>
                                                                                                                <div style={{
                                                                                                                        height: '100%',
                                                                                                                        width: `${numericValue}%`,
                                                                                                                        background: 'linear-gradient(90deg, #00e5ff, #a855f7)',
                                                                                                                        borderRadius: '6px',
                                                                                                                        transition: 'width .8s ease',
                                                                                                                        animation: 'fillBar 1s ease both',
                                                                                                                }} />
                                                                                                        </div>
                                                                                                </div>
                                                                                        );
                                                                                })}
                                                                </div>

                                                                {/* Feedback Sections */}
                                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                                                        {evaluationResults.strengths && (
                                                                                <div>
                                                                                        <h4 style={{
                                                                                                fontFamily: 'Orbitron, sans-serif', fontSize: '12px', fontWeight: 700,
                                                                                                color: '#22c55e', letterSpacing: '1px', textTransform: 'uppercase',
                                                                                                marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px'
                                                                                        }}>
                                                                                                ✓ What You Did Well
                                                                                        </h4>
                                                                                        <ul style={{ paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                                                                {evaluationResults.strengths.map((strength, index) => (
                                                                                                        <li key={index} style={{ display: 'flex', gap: '10px', fontSize: '13px', color: DS.textMuted, lineHeight: 1.6 }}>
                                                                                                                <span style={{ color: '#22c55e', marginTop: '2px' }}>•</span>{strength}
                                                                                                        </li>
                                                                                                ))}
                                                                                        </ul>
                                                                                </div>
                                                                        )}

                                                                        {evaluationResults.weaknesses && (
                                                                                <div>
                                                                                        <h4 style={{
                                                                                                fontFamily: 'Orbitron, sans-serif', fontSize: '12px', fontWeight: 700,
                                                                                                color: DS.gold, letterSpacing: '1px', textTransform: 'uppercase',
                                                                                                marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px'
                                                                                        }}>
                                                                                                ⚠ Areas to Improve
                                                                                        </h4>
                                                                                        <ul style={{ paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                                                                {evaluationResults.weaknesses.map((weakness, index) => (
                                                                                                        <li key={index} style={{ display: 'flex', gap: '10px', fontSize: '13px', color: DS.textMuted, lineHeight: 1.6 }}>
                                                                                                                <span style={{ color: DS.gold, marginTop: '2px' }}>•</span>{weakness}
                                                                                                        </li>
                                                                                                ))}
                                                                                        </ul>
                                                                                </div>
                                                                        )}

                                                                        {evaluationResults.suggestions && (
                                                                                <div>
                                                                                        <h4 style={{
                                                                                                fontFamily: 'Orbitron, sans-serif', fontSize: '12px', fontWeight: 700,
                                                                                                color: DS.cyan, letterSpacing: '1px', textTransform: 'uppercase',
                                                                                                marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px'
                                                                                        }}>
                                                                                                💡 Suggestions
                                                                                        </h4>
                                                                                        <ul style={{ paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                                                                {evaluationResults.suggestions.map((suggestion, index) => (
                                                                                                        <li key={index} style={{ display: 'flex', gap: '10px', fontSize: '13px', color: DS.textMuted, lineHeight: 1.6 }}>
                                                                                                                <span style={{ color: DS.cyan, marginTop: '2px' }}>•</span>{suggestion}
                                                                                                        </li>
                                                                                                ))}
                                                                                        </ul>
                                                                                </div>
                                                                        )}

                                                                        {evaluationResults.improved_prompt && (
                                                                                <div style={{
                                                                                        padding: '20px', background: 'rgba(0,0,0,0.5)',
                                                                                        border: '1px solid rgba(0,229,255,.15)', borderRadius: '10px',
                                                                                }}>
                                                                                        <h4 style={{
                                                                                                fontFamily: 'Orbitron, sans-serif', fontSize: '12px', fontWeight: 700,
                                                                                                color: DS.cyan, letterSpacing: '1px', textTransform: 'uppercase',
                                                                                                marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px'
                                                                                        }}>
                                                                                                ✨ Improved Prompt
                                                                                        </h4>
                                                                                        <p style={{ fontSize: '13px', color: DS.textMuted, fontFamily: 'monospace', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                                                                                                {evaluationResults.improved_prompt}
                                                                                        </p>
                                                                                </div>
                                                                        )}
                                                                </div>

                                                                {/* Action Buttons */}
                                                                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                                                                        <button
                                                                                onClick={handleNewChallenge}
                                                                                style={{
                                                                                        flex: 1, padding: '12px', borderRadius: '8px', border: 'none',
                                                                                        background: 'linear-gradient(135deg, #00e5ff, #00b8cc)',
                                                                                        color: '#000', fontFamily: 'DM Sans, sans-serif',
                                                                                        fontWeight: 600, fontSize: '14px', cursor: 'pointer',
                                                                                        boxShadow: '0 0 20px rgba(0,229,255,.35)',
                                                                                        transition: 'transform .2s, box-shadow .2s',
                                                                                }}
                                                                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 40px rgba(0,229,255,.5)'; }}
                                                                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(0,229,255,.35)'; }}
                                                                        >
                                                                                Try Another Challenge
                                                                        </button>
                                                                        <button
                                                                                style={{
                                                                                        flex: 1, padding: '12px', borderRadius: '8px',
                                                                                        background: 'transparent', color: DS.cyan,
                                                                                        border: '1px solid rgba(0,229,255,.3)',
                                                                                        fontFamily: 'DM Sans, sans-serif', fontWeight: 600,
                                                                                        fontSize: '14px', cursor: 'pointer', transition: 'all .2s',
                                                                                }}
                                                                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,229,255,.08)'}
                                                                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                                                        >
                                                                                Download Report
                                                                        </button>
                                                                </div>
                                                        </div>
                                                )}
                                        </div>
                                </div>
                        </main>

                        <Toast
                                message={toast.message}
                                type={toast.type}
                                isVisible={toast.visible}
                                onClose={() => setToast((t) => ({ ...t, visible: false }))}
                        />
                </div>
        );
}
