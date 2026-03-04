import { useLocation, useNavigate } from 'react-router-dom';
import {
        Radar, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
        ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import Sidebar from '../components/Sidebar';

/* ── Design tokens ── */
const DS = {
        bg: '#040610',
        surface: 'rgba(10,15,30,0.65)',
        cyan: '#00e5ff',
        cyanDim: '#00b8cc',
        purple: '#7c3aed',
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

  @keyframes teSlideUp {
    from { opacity:0; transform:translateY(28px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes tePulse {
    0%,100% { opacity:.6; }
    50%      { opacity:1; }
  }
  @keyframes teSpin { to { transform:rotate(360deg); } }
  @keyframes teFill {
    from { transform:scaleX(0); }
    to   { transform:scaleX(1); }
  }
  @keyframes teBounce {
    0%,100% { transform:translateY(0); }
    50%      { transform:translateY(-8px); }
  }
  @keyframes teScan {
    0%   { top:0%; }
    100% { top:100%; }
  }

  .te-page { font-family:'DM Sans',sans-serif; }

  .te-card-hover {
    transition: transform .3s, box-shadow .3s, border-color .3s;
  }
  .te-card-hover:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 50px rgba(0,229,255,.1);
    border-color: rgba(0,229,255,.25) !important;
  }

  .te-section-label {
    font-family:'Orbitron',sans-serif; font-size:10px; font-weight:700;
    color:#00e5ff; letter-spacing:2px; text-transform:uppercase;
    display:flex; align-items:center; gap:10px; margin-bottom:20px;
  }
  .te-section-label::after {
    content:''; flex:1; height:1px;
    background:linear-gradient(90deg,rgba(0,229,255,.2),transparent);
  }

  .te-bar-fill {
    height:100%; border-radius:4px;
    background:linear-gradient(90deg,#00e5ff,#a855f7);
    transform-origin:left;
    animation: teFill .9s ease both;
  }

  .te-action-btn {
    display:flex; align-items:center; justify-content:center; gap:10px;
    padding:14px 28px; border-radius:10px; font-family:'DM Sans',sans-serif;
    font-weight:700; font-size:15px; cursor:pointer;
    transition:transform .2s, box-shadow .2s;
  }
  .te-action-btn:hover { transform:translateY(-2px); }

  .te-feedback-item {
    display:flex; align-items:flex-start; gap:10px;
    padding:10px 14px; border-radius:10px; margin-bottom:8px;
    font-size:13px; line-height:1.7;
    transition:background .2s;
  }

  .te-pre {
    font-family:'JetBrains Mono','Fira Code',monospace;
    font-size:12px; white-space:pre-wrap; line-height:1.8;
    color:#e2e8f0;
  }

  ::-webkit-scrollbar { width:4px; }
  ::-webkit-scrollbar-track { background:#040610; }
  ::-webkit-scrollbar-thumb { background:#00b8cc; border-radius:4px; }
`;

/* ── helpers ── */
const scoreColor = (s) => {
        if (s >= 90) return DS.cyan;
        if (s >= 80) return DS.green;
        if (s >= 70) return '#60a5fa';
        if (s >= 60) return DS.gold;
        return DS.red;
};

const getGrade = (s) => {
        if (s >= 90) return { text: 'Exceptional', emoji: '🎉', desc: 'Production ready!' };
        if (s >= 80) return { text: 'Excellent', emoji: '🌟', desc: 'Well structured!' };
        if (s >= 70) return { text: 'Good', emoji: '👍', desc: 'Solid approach!' };
        if (s >= 60) return { text: 'Fair', emoji: '😊', desc: 'Needs refinement' };
        return { text: 'Needs Work', emoji: '💪', desc: 'Keep practicing!' };
};

/* ── circular SVG progress ── */
function CircularProgress({ score, size = 130, stroke = 9 }) {
        const r = (size - stroke) / 2;
        const circ = r * 2 * Math.PI;
        const offset = circ - (score / 100) * circ;
        const color = scoreColor(score);
        return (
                <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                        <circle cx={size / 2} cy={size / 2} r={r} fill="none"
                                stroke="rgba(255,255,255,.06)" strokeWidth={stroke} />
                        <circle cx={size / 2} cy={size / 2} r={r} fill="none"
                                stroke={color} strokeWidth={stroke}
                                strokeDasharray={circ} strokeDashoffset={offset}
                                strokeLinecap="round"
                                style={{ transition: 'stroke-dashoffset 1.2s ease', filter: `drop-shadow(0 0 6px ${color})` }}
                        />
                </svg>
        );
}

/* ── metric bar row ── */
function MetricRow({ icon, label, score, delay = 0 }) {
        const color = scoreColor(score);
        return (
                <div style={{ marginBottom: 14 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span style={{ fontSize: 16 }}>{icon}</span>
                                        <span style={{ fontSize: 13, color: DS.text, fontWeight: 500 }}>{label}</span>
                                </div>
                                <span style={{ fontFamily: 'Orbitron,sans-serif', fontSize: 13, fontWeight: 700, color }}>{score.toFixed(0)}</span>
                        </div>
                        <div style={{ height: 4, background: 'rgba(255,255,255,.06)', borderRadius: 4, overflow: 'hidden' }}>
                                <div className="te-bar-fill" style={{ width: `${score}%`, animationDelay: `${delay}s` }} />
                        </div>
                </div>
        );
}

export default function TechnicalEvaluation() {
        const location = useLocation();
        const navigate = useNavigate();
        const { evaluation, problem, userPrompt, constraints } = location.state || {};

        /* inject styles once */
        if (typeof document !== 'undefined' && !document.getElementById('pf-te-styles')) {
                const s = document.createElement('style');
                s.id = 'pf-te-styles';
                s.textContent = STYLES;
                document.head.appendChild(s);
        }

        if (!evaluation) {
                return (
                        <div style={{ display: 'flex', minHeight: '100vh', background: DS.bg }}>
                                <Sidebar />
                                <main style={{ flex: 1, marginLeft: 240, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <div style={{ ...card, textAlign: 'center', maxWidth: 400 }}>
                                                <div style={{ fontSize: 56, marginBottom: 16 }}>💻</div>
                                                <h2 style={{ fontFamily: 'Orbitron,sans-serif', fontSize: 22, color: '#fff', marginBottom: 8 }}>No Evaluation Data</h2>
                                                <p style={{ color: DS.muted, marginBottom: 24 }}>Please complete a technical challenge first.</p>
                                                <button
                                                        onClick={() => navigate('/technical-challenge-selector')}
                                                        style={{
                                                                padding: '12px 28px', borderRadius: 10, border: 'none',
                                                                background: `linear-gradient(135deg,${DS.cyan},${DS.cyanDim})`,
                                                                color: '#000', fontFamily: 'DM Sans,sans-serif', fontWeight: 700,
                                                                fontSize: 15, cursor: 'pointer', boxShadow: `0 0 20px rgba(0,229,255,.3)`,
                                                        }}
                                                >
                                                        Start Challenge
                                                </button>
                                        </div>
                                </main>
                        </div>
                );
        }

        /* mock token efficiency if absent */
        if (!evaluation.token_efficiency) {
                evaluation.token_efficiency = { useful_percentage: 90, redundant_percentage: 10, estimated_tokens: 70 };
        }

        const grade = getGrade(evaluation.overall_score);
        const passRate = evaluation.estimated_test_pass_rate || 0;
        const passedTests = evaluation.passed_test_cases || 0;
        const totalTests = evaluation.total_test_cases || 10;
        const mainColor = scoreColor(evaluation.overall_score);

        const technicalMetrics = [
                {
                        category: 'Problem Analysis', icon: '🧠',
                        metrics: [
                                { name: 'Problem Understanding', score: evaluation.problem_understanding || 0, icon: '🎯' },
                                { name: 'Approach Clarity', score: evaluation.approach_clarity || 0, icon: '💡' },
                                { name: 'Edge Case Handling', score: evaluation.edge_case_handling || 0, icon: '🛡️' },
                        ]
                },
                {
                        category: 'Implementation', icon: '⚙️',
                        metrics: [
                                { name: 'Implementation Details', score: evaluation.implementation_details || 0, icon: '🔧' },
                                { name: 'Code Structure', score: evaluation.code_structure || 0, icon: '📝' },
                                { name: 'Correctness', score: evaluation.correctness || 0, icon: '✓' },
                        ]
                },
                {
                        category: 'Optimization', icon: '🚀',
                        metrics: [
                                { name: 'Complexity Analysis', score: evaluation.complexity_analysis || 0, icon: '📊' },
                                { name: 'Constraint Adherence', score: evaluation.constraint_adherence || 0, icon: '✅' },
                                { name: 'Efficiency', score: evaluation.readability_score || 75, icon: '⚡' },
                        ]
                },
        ];

        const radarData = [
                { metric: 'Understanding', score: evaluation.problem_understanding || 0, fullMark: 100 },
                { metric: 'Approach', score: evaluation.approach_clarity || 0, fullMark: 100 },
                { metric: 'Implementation', score: evaluation.implementation_details || 0, fullMark: 100 },
                { metric: 'Edge Cases', score: evaluation.edge_case_handling || 0, fullMark: 100 },
                { metric: 'Complexity', score: evaluation.complexity_analysis || 0, fullMark: 100 },
                { metric: 'Structure', score: evaluation.code_structure || 0, fullMark: 100 },
                { metric: 'Correctness', score: evaluation.correctness || 0, fullMark: 100 },
                { metric: 'Constraints', score: evaluation.constraint_adherence || 0, fullMark: 100 },
        ];

        const tooltipStyle = {
                contentStyle: {
                        background: '#0a0f1e', border: `1px solid ${DS.border}`,
                        borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,.5)',
                        color: DS.text, fontFamily: 'DM Sans,sans-serif', fontSize: 13,
                }
        };

        return (
                <div className="te-page" style={{
                        display: 'flex', minHeight: '100vh',
                        background: DS.bg,
                        backgroundImage: 'linear-gradient(rgba(0,229,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,255,.04) 1px,transparent 1px)',
                        backgroundSize: '60px 60px',
                }}>
                        <Sidebar />

                        {/* blobs */}
                        <div style={{ position: 'fixed', top: '5%', left: '18%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,229,255,.05),transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
                        <div style={{ position: 'fixed', bottom: '5%', right: '4%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,58,237,.07),transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

                        <main style={{ flex: 1, marginLeft: 240, padding: '36px 32px', position: 'relative', zIndex: 1 }}>
                                <div style={{ maxWidth: 1280, margin: '0 auto' }}>

                                        {/* ══════════════════════════════
              HEADER
          ══════════════════════════════ */}
                                        <header style={{ textAlign: 'center', marginBottom: 52, animation: 'teSlideUp .7s ease both' }}>
                                                {/* icon */}
                                                <div style={{ position: 'relative', display: 'inline-block', marginBottom: 24 }}>
                                                        <div style={{
                                                                position: 'absolute', inset: -20,
                                                                background: 'radial-gradient(circle,rgba(0,229,255,.12),transparent 70%)',
                                                                borderRadius: '50%', pointerEvents: 'none',
                                                                animation: 'tePulse 2.5s ease-in-out infinite',
                                                        }} />
                                                        <div style={{
                                                                width: 88, height: 88, borderRadius: 22,
                                                                background: 'linear-gradient(135deg,#00e5ff,#7c3aed)',
                                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                fontSize: 44, boxShadow: '0 0 40px rgba(0,229,255,.3)',
                                                                animation: 'teBounce 2s ease-in-out infinite',
                                                        }}>💻</div>
                                                </div>

                                                <h1 style={{
                                                        fontFamily: 'Orbitron,sans-serif', fontSize: 'clamp(28px,4vw,48px)',
                                                        fontWeight: 900, color: '#fff', marginBottom: 10, letterSpacing: '-1px',
                                                }}>
                                                        Technical Challenge <span style={gradText}>Complete!</span>
                                                </h1>
                                                <p style={{ color: DS.muted, fontSize: 16, marginBottom: 20 }}>
                                                        Comprehensive code generation analysis
                                                </p>
                                                <div style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: 8,
                                                        padding: '8px 20px', borderRadius: '999px',
                                                        background: `rgba(${mainColor === DS.cyan ? '0,229,255' : mainColor === DS.green ? '34,197,94' : '245,158,11'},.08)`,
                                                        border: `1px solid ${mainColor}40`,
                                                        fontFamily: 'DM Sans,sans-serif', fontSize: 14, fontWeight: 600, color: mainColor,
                                                }}>
                                                        {grade.emoji} {grade.text} — {grade.desc}
                                                </div>
                                        </header>

                                        {/* ══════════════════════════════
              HERO STATS
          ══════════════════════════════ */}
                                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 20, marginBottom: 28, animation: 'teSlideUp .6s .1s ease both' }}>

                                                {/* Overall Score */}
                                                <div style={{
                                                        ...card,
                                                        background: 'linear-gradient(135deg,rgba(0,229,255,.04),rgba(124,58,237,.06))',
                                                        border: `1px solid rgba(0,229,255,.2)`,
                                                        display: 'flex', alignItems: 'center', gap: 32,
                                                }}>
                                                        <div style={{ flex: 1 }}>
                                                                <div style={{ fontFamily: 'Orbitron,sans-serif', fontSize: 11, color: DS.muted, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 12 }}>
                                                                        Overall Score
                                                                </div>
                                                                <div style={{
                                                                        fontFamily: 'Orbitron,sans-serif', fontSize: 72, fontWeight: 900,
                                                                        color: mainColor, lineHeight: 1,
                                                                        filter: `drop-shadow(0 0 20px ${mainColor}60)`,
                                                                        marginBottom: 8,
                                                                }}>
                                                                        {evaluation.overall_score.toFixed(1)}
                                                                </div>
                                                                <div style={{ color: DS.muted, fontSize: 15, marginBottom: 16 }}>
                                                                        {grade.emoji} {grade.text}
                                                                </div>
                                                                {/* progress bar */}
                                                                <div style={{ height: 6, background: 'rgba(255,255,255,.06)', borderRadius: 6, overflow: 'hidden' }}>
                                                                        <div style={{
                                                                                height: '100%', width: `${evaluation.overall_score}%`,
                                                                                background: `linear-gradient(90deg,${DS.cyan},${DS.purple2})`,
                                                                                borderRadius: 6, transition: 'width 1.2s ease',
                                                                        }} />
                                                                </div>
                                                        </div>
                                                        <CircularProgress score={evaluation.overall_score} size={120} stroke={8} />
                                                </div>

                                                {/* Tests */}
                                                <div style={{
                                                        ...card,
                                                        border: `1px solid ${evaluation.would_generate_working_code ? 'rgba(34,197,94,.25)' : 'rgba(239,68,68,.25)'}`,
                                                        background: evaluation.would_generate_working_code ? 'rgba(34,197,94,.04)' : 'rgba(239,68,68,.04)',
                                                        textAlign: 'center',
                                                }}>
                                                        <div style={{ fontSize: 40, marginBottom: 8, animation: 'teBounce 2s ease-in-out infinite' }}>
                                                                {evaluation.would_generate_working_code ? '✅' : '❌'}
                                                        </div>
                                                        <div style={{
                                                                fontFamily: 'Orbitron,sans-serif', fontSize: 42, fontWeight: 900,
                                                                color: evaluation.would_generate_working_code ? DS.green : DS.red,
                                                                lineHeight: 1, marginBottom: 4,
                                                        }}>
                                                                {passedTests}/{totalTests}
                                                        </div>
                                                        <div style={{ fontSize: 12, color: DS.muted, marginBottom: 12 }}>Tests Passed</div>
                                                        <div style={{ height: 4, background: 'rgba(255,255,255,.06)', borderRadius: 4, overflow: 'hidden', marginBottom: 6 }}>
                                                                <div style={{
                                                                        height: '100%', width: `${passRate}%`,
                                                                        background: evaluation.would_generate_working_code ? DS.green : DS.red,
                                                                        borderRadius: 4, transition: 'width 1s ease',
                                                                }} />
                                                        </div>
                                                        <div style={{ fontSize: 11, color: DS.muted }}>{passRate.toFixed(0)}% Success</div>
                                                </div>

                                                {/* XP */}
                                                <div style={{
                                                        ...card,
                                                        border: `1px solid rgba(245,158,11,.2)`,
                                                        background: 'rgba(245,158,11,.03)',
                                                        textAlign: 'center',
                                                }}>
                                                        <div style={{ position: 'relative', marginBottom: 8 }}>
                                                                <div style={{
                                                                        fontFamily: 'Orbitron,sans-serif', fontSize: 52, fontWeight: 900,
                                                                        background: 'linear-gradient(135deg,#f59e0b,#a855f7)',
                                                                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                                                                        backgroundClip: 'text', lineHeight: 1,
                                                                        animation: 'tePulse 2s ease-in-out infinite',
                                                                }}>
                                                                        +{evaluation.xp_earned || 0}
                                                                </div>
                                                                <div style={{ position: 'absolute', top: -4, right: 8, fontSize: 22, animation: 'teBounce 1.5s ease-in-out infinite' }}>✨</div>
                                                        </div>
                                                        <div style={{ fontSize: 12, color: DS.muted, marginBottom: 14, fontWeight: 600 }}>XP Earned</div>
                                                        <div style={{
                                                                display: 'inline-flex', padding: '4px 14px', borderRadius: '999px',
                                                                background: 'rgba(168,85,247,.1)', border: '1px solid rgba(168,85,247,.25)',
                                                                fontSize: 12, fontWeight: 700, color: DS.purple2,
                                                                fontFamily: 'Orbitron,sans-serif',
                                                        }}>
                                                                LEVEL {evaluation.new_level || 1}
                                                        </div>
                                                        {evaluation.constraints_met && (
                                                                <div style={{
                                                                        marginTop: 12, padding: '8px 12px', borderRadius: 10,
                                                                        background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.25)',
                                                                        fontSize: 12, fontWeight: 600, color: DS.green,
                                                                }}>
                                                                        ✓ Constraints Met
                                                                </div>
                                                        )}
                                                </div>
                                        </div>

                                        {/* ══════════════════════════════
              CONSTRAINT ADHERENCE
          ══════════════════════════════ */}
                                        {constraints && (
                                                <div style={{
                                                        ...card,
                                                        border: `1px solid ${evaluation.constraints_met ? 'rgba(34,197,94,.25)' : 'rgba(239,68,68,.25)'}`,
                                                        background: evaluation.constraints_met ? 'rgba(34,197,94,.03)' : 'rgba(239,68,68,.03)',
                                                        marginBottom: 28, animation: 'teSlideUp .6s .15s ease both',
                                                }}>
                                                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24 }}>
                                                                <div style={{ flex: 1 }}>
                                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                                                                                <div style={{
                                                                                        width: 48, height: 48, borderRadius: 12,
                                                                                        background: evaluation.constraints_met ? 'rgba(34,197,94,.12)' : 'rgba(239,68,68,.12)',
                                                                                        border: `1px solid ${evaluation.constraints_met ? 'rgba(34,197,94,.3)' : 'rgba(239,68,68,.3)'}`,
                                                                                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
                                                                                }}>
                                                                                        {evaluation.constraints_met ? '✅' : '⚠️'}
                                                                                </div>
                                                                                <h3 style={{ fontFamily: 'Orbitron,sans-serif', fontSize: 16, fontWeight: 700, color: '#fff' }}>
                                                                                        Constraint Analysis
                                                                                </h3>
                                                                        </div>

                                                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                                                                {[
                                                                                        { label: 'Word Count', val: evaluation.word_count || 0, limit: constraints.word_limit || 0 },
                                                                                        { label: 'Token Count', val: evaluation.token_count || 0, limit: constraints.token_limit || 0 },
                                                                                ].map(({ label, val, limit }) => {
                                                                                        const over = val > limit;
                                                                                        const pct = Math.min((val / (limit || 1)) * 100, 100);
                                                                                        return (
                                                                                                <div key={label}>
                                                                                                        <div style={{
                                                                                                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                                                                                padding: '12px 16px', borderRadius: 10,
                                                                                                                background: 'rgba(0,0,0,.3)', marginBottom: 6,
                                                                                                        }}>
                                                                                                                <span style={{ fontSize: 13, color: DS.muted }}>{label}</span>
                                                                                                                <span style={{ fontFamily: 'Orbitron,sans-serif', fontSize: 16, fontWeight: 700, color: over ? DS.red : DS.green }}>
                                                                                                                        {val} / {limit}
                                                                                                                </span>
                                                                                                        </div>
                                                                                                        <div style={{ height: 4, background: 'rgba(255,255,255,.06)', borderRadius: 4, overflow: 'hidden' }}>
                                                                                                                <div style={{ height: '100%', width: `${pct}%`, background: over ? DS.red : DS.green, borderRadius: 4 }} />
                                                                                                        </div>
                                                                                                </div>
                                                                                        );
                                                                                })}
                                                                        </div>

                                                                        {evaluation.constraint_violations?.length > 0 && (
                                                                                <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                                                                        {evaluation.constraint_violations.map((v, i) => (
                                                                                                <div key={i} style={{
                                                                                                        padding: '10px 14px', borderRadius: 10,
                                                                                                        background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.2)',
                                                                                                        fontSize: 13, color: DS.red, display: 'flex', gap: 8,
                                                                                                }}>
                                                                                                        <span>⚠️</span>{v}
                                                                                                </div>
                                                                                        ))}
                                                                                </div>
                                                                        )}
                                                                </div>
                                                                <div style={{ fontSize: 64 }}>{evaluation.constraints_met ? '✅' : '❌'}</div>
                                                        </div>
                                                </div>
                                        )}

                                        {/* ══════════════════════════════
              TECHNICAL METRIC CATEGORIES
          ══════════════════════════════ */}
                                        <div style={{ marginBottom: 28 }}>
                                                <div className="te-section-label">Technical Metrics</div>
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
                                                        {technicalMetrics.map((cat, idx) => (
                                                                <div
                                                                        key={cat.category}
                                                                        className="te-card-hover"
                                                                        style={{
                                                                                ...card,
                                                                                animation: `teSlideUp .5s ${idx * .1}s ease both`,
                                                                        }}
                                                                >
                                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                                                                                <div style={{
                                                                                        width: 40, height: 40, borderRadius: 10,
                                                                                        background: 'linear-gradient(135deg,rgba(0,229,255,.12),rgba(124,58,237,.12))',
                                                                                        border: '1px solid rgba(0,229,255,.15)',
                                                                                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                                                                                }}>
                                                                                        {cat.icon}
                                                                                </div>
                                                                                <h3 style={{ fontFamily: 'Orbitron,sans-serif', fontSize: 13, fontWeight: 700, color: '#fff' }}>
                                                                                        {cat.category}
                                                                                </h3>
                                                                        </div>
                                                                        {cat.metrics.map((m, mi) => (
                                                                                <MetricRow key={m.name} icon={m.icon} label={m.name} score={m.score} delay={idx * .1 + mi * .05} />
                                                                        ))}
                                                                </div>
                                                        ))}
                                                </div>
                                        </div>

                                        {/* ══════════════════════════════
              CHARTS
          ══════════════════════════════ */}
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>

                                                {/* Radar */}
                                                <div className="te-card-hover" style={{ ...card, animation: 'teSlideUp .6s .2s ease both' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                                                                <div style={{
                                                                        width: 40, height: 40, borderRadius: 10,
                                                                        background: 'linear-gradient(135deg,rgba(0,229,255,.12),rgba(124,58,237,.12))',
                                                                        border: '1px solid rgba(0,229,255,.15)',
                                                                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                                                                }}>🎯</div>
                                                                <h2 style={{ fontFamily: 'Orbitron,sans-serif', fontSize: 14, fontWeight: 700, color: '#fff' }}>
                                                                        Technical Performance
                                                                </h2>
                                                        </div>
                                                        <ResponsiveContainer width="100%" height={340}>
                                                                <RechartsRadar data={radarData}>
                                                                        <defs>
                                                                                <linearGradient id="teRadarFill" x1="0" y1="0" x2="0" y2="1">
                                                                                        <stop offset="0%" stopColor="#00e5ff" stopOpacity={0.5} />
                                                                                        <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.1} />
                                                                                </linearGradient>
                                                                        </defs>
                                                                        <PolarGrid stroke="rgba(0,229,255,.08)" strokeWidth={1} />
                                                                        <PolarAngleAxis dataKey="metric" tick={{ fill: DS.muted, fontSize: 11, fontWeight: 600 }} />
                                                                        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: DS.muted, fontSize: 10 }} stroke="rgba(0,229,255,.06)" />
                                                                        <Radar name="Scores" dataKey="score"
                                                                                stroke={DS.cyan} fill="url(#teRadarFill)" fillOpacity={1} strokeWidth={2} />
                                                                        <Tooltip {...tooltipStyle} />
                                                                </RechartsRadar>
                                                        </ResponsiveContainer>
                                                </div>

                                                {/* Area Chart */}
                                                <div className="te-card-hover" style={{ ...card, animation: 'teSlideUp .6s .25s ease both' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                                                                <div style={{
                                                                        width: 40, height: 40, borderRadius: 10,
                                                                        background: 'linear-gradient(135deg,rgba(34,197,94,.12),rgba(0,229,255,.12))',
                                                                        border: '1px solid rgba(34,197,94,.2)',
                                                                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                                                                }}>📊</div>
                                                                <h2 style={{ fontFamily: 'Orbitron,sans-serif', fontSize: 14, fontWeight: 700, color: '#fff' }}>
                                                                        Metric Distribution
                                                                </h2>
                                                        </div>
                                                        <ResponsiveContainer width="100%" height={340}>
                                                                <AreaChart data={radarData}>
                                                                        <defs>
                                                                                <linearGradient id="teAreaFill" x1="0" y1="0" x2="0" y2="1">
                                                                                        <stop offset="0%" stopColor="#00e5ff" stopOpacity={0.4} />
                                                                                        <stop offset="100%" stopColor="#00e5ff" stopOpacity={0.02} />
                                                                                </linearGradient>
                                                                        </defs>
                                                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,229,255,.06)" />
                                                                        <XAxis dataKey="metric" tick={{ fill: DS.muted, fontSize: 10 }} angle={-15} textAnchor="end" height={80} />
                                                                        <YAxis domain={[0, 100]} tick={{ fill: DS.muted, fontSize: 10 }} />
                                                                        <Tooltip {...tooltipStyle} />
                                                                        <Area type="monotone" dataKey="score"
                                                                                stroke={DS.cyan} fill="url(#teAreaFill)" strokeWidth={2} />
                                                                </AreaChart>
                                                        </ResponsiveContainer>
                                                </div>
                                        </div>

                                        {/* ══════════════════════════════
              CODE QUALITY MINI CARDS
          ══════════════════════════════ */}
                                        <div style={{ marginBottom: 28 }}>
                                                <div className="te-section-label">Code Quality Indicators</div>
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
                                                        {[
                                                                { name: 'Code Quality', value: evaluation.code_generation_quality || 'Good', icon: '💻', score: 80 },
                                                                { name: 'Readability', value: evaluation.readability_score || 75, icon: '📖', score: evaluation.readability_score || 75 },
                                                                { name: 'Completeness', value: evaluation.completeness_score || 80, icon: '📊', score: evaluation.completeness_score || 80 },
                                                                { name: 'Working Code', value: evaluation.would_generate_working_code ? 'Yes' : 'No', icon: evaluation.would_generate_working_code ? '✅' : '❌', score: evaluation.would_generate_working_code ? 100 : 0 },
                                                        ].map((item, i) => {
                                                                const c = scoreColor(item.score);
                                                                return (
                                                                        <div key={item.name} className="te-card-hover" style={{
                                                                                ...card, textAlign: 'center', padding: '20px 16px',
                                                                                animation: `teSlideUp .5s ${i * .08}s ease both`,
                                                                        }}>
                                                                                <div style={{ fontSize: 28, marginBottom: 8 }}>{item.icon}</div>
                                                                                <div style={{
                                                                                        fontFamily: 'Orbitron,sans-serif', fontSize: 22, fontWeight: 900,
                                                                                        color: c, marginBottom: 4,
                                                                                }}>
                                                                                        {typeof item.value === 'number' ? item.value.toFixed(0) : item.value}
                                                                                </div>
                                                                                <div style={{ fontSize: 12, color: DS.muted, marginBottom: 12 }}>{item.name}</div>
                                                                                <div style={{ height: 3, background: 'rgba(255,255,255,.06)', borderRadius: 3, overflow: 'hidden' }}>
                                                                                        <div style={{ height: '100%', width: `${item.score}%`, background: c, borderRadius: 3 }} />
                                                                                </div>
                                                                        </div>
                                                                );
                                                        })}
                                                </div>
                                        </div>

                                        {/* ══════════════════════════════
              TOKEN EFFICIENCY
          ══════════════════════════════ */}
                                        {evaluation.token_efficiency && (
                                                <div style={{ ...card, marginBottom: 28, animation: 'teSlideUp .6s .3s ease both' }}>
                                                        <div className="te-section-label">Token Efficiency</div>
                                                        <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 32, alignItems: 'center' }}>
                                                                <div style={{ position: 'relative', width: 160, height: 160 }}>
                                                                        <CircularProgress score={evaluation.token_efficiency.useful_percentage || 0} size={160} stroke={12} />
                                                                        <div style={{
                                                                                position: 'absolute', inset: 0,
                                                                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                                                        }}>
                                                                                <div style={{
                                                                                        fontFamily: 'Orbitron,sans-serif', fontSize: 28, fontWeight: 900,
                                                                                        color: scoreColor(evaluation.token_efficiency.useful_percentage || 0),
                                                                                }}>
                                                                                        {(evaluation.token_efficiency.useful_percentage || 0).toFixed(0)}%
                                                                                </div>
                                                                                <div style={{ fontSize: 11, color: DS.muted }}>Useful</div>
                                                                        </div>
                                                                </div>
                                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                                                        {[
                                                                                { label: 'Useful Tokens', val: `${(evaluation.token_efficiency.useful_percentage || 0).toFixed(0)}%`, color: DS.green, bg: 'rgba(34,197,94,.08)', border: 'rgba(34,197,94,.2)' },
                                                                                { label: 'Redundant Tokens', val: `${(evaluation.token_efficiency.redundant_percentage || 0).toFixed(0)}%`, color: DS.red, bg: 'rgba(239,68,68,.08)', border: 'rgba(239,68,68,.2)' },
                                                                                { label: 'Estimated Tokens', val: evaluation.token_efficiency.estimated_tokens || 0, color: DS.cyan, bg: 'rgba(0,229,255,.05)', border: 'rgba(0,229,255,.15)' },
                                                                        ].map(row => (
                                                                                <div key={row.label} style={{
                                                                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                                                        padding: '12px 18px', borderRadius: 10,
                                                                                        background: row.bg, border: `1px solid ${row.border}`,
                                                                                }}>
                                                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                                                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: row.color }} />
                                                                                                <span style={{ fontSize: 13, fontWeight: 600, color: DS.text }}>{row.label}</span>
                                                                                        </div>
                                                                                        <span style={{ fontFamily: 'Orbitron,sans-serif', fontSize: 20, fontWeight: 900, color: row.color }}>
                                                                                                {row.val}
                                                                                        </span>
                                                                                </div>
                                                                        ))}
                                                                </div>
                                                        </div>
                                                </div>
                                        )}

                                        {/* ══════════════════════════════
              PROMPT COMPARISON
          ══════════════════════════════ */}
                                        <div style={{ ...card, marginBottom: 28, animation: 'teSlideUp .6s .35s ease both' }}>
                                                <div className="te-section-label">Prompt Analysis</div>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                                                        {/* Your prompt */}
                                                        <div>
                                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                                                                        <div style={{
                                                                                padding: '4px 14px', borderRadius: '999px', fontSize: 12, fontWeight: 600,
                                                                                background: 'rgba(0,229,255,.08)', border: '1px solid rgba(0,229,255,.2)', color: DS.cyan,
                                                                        }}>Your Solution</div>
                                                                        <div style={{ display: 'flex', gap: 12, fontSize: 12, color: DS.muted }}>
                                                                                <span>📝 {evaluation.word_count || 0} words</span>
                                                                                <span>🔢 {evaluation.token_count || 0} tokens</span>
                                                                        </div>
                                                                </div>
                                                                <div style={{
                                                                        background: 'rgba(0,0,0,.4)', border: '1px solid rgba(0,229,255,.1)',
                                                                        borderLeft: `3px solid ${DS.cyan}`,
                                                                        borderRadius: 12, padding: '16px 18px',
                                                                        maxHeight: 320, overflowY: 'auto',
                                                                }}>
                                                                        <pre className="te-pre">{userPrompt || 'Your original prompt'}</pre>
                                                                </div>
                                                        </div>
                                                        {/* Enhanced */}
                                                        <div>
                                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                                                                        <div style={{
                                                                                padding: '4px 14px', borderRadius: '999px', fontSize: 12, fontWeight: 600,
                                                                                background: 'rgba(34,197,94,.08)', border: '1px solid rgba(34,197,94,.2)', color: DS.green,
                                                                        }}>✨ Enhanced Version</div>
                                                                        <div style={{
                                                                                padding: '4px 12px', borderRadius: '999px', fontSize: 11, fontWeight: 600,
                                                                                background: 'rgba(34,197,94,.08)', border: '1px solid rgba(34,197,94,.15)', color: DS.green,
                                                                        }}>Optimized</div>
                                                                </div>
                                                                <div style={{
                                                                        background: 'rgba(34,197,94,.03)', border: '1px solid rgba(34,197,94,.15)',
                                                                        borderLeft: `3px solid ${DS.green}`,
                                                                        borderRadius: 12, padding: '16px 18px',
                                                                        maxHeight: 320, overflowY: 'auto',
                                                                }}>
                                                                        <pre className="te-pre">{evaluation.improved_prompt || 'Enhanced version with optimizations applied.'}</pre>
                                                                </div>
                                                        </div>
                                                </div>
                                        </div>

                                        {/* ══════════════════════════════
              FEEDBACK: STRENGTHS / ISSUES / SUGGESTIONS
          ══════════════════════════════ */}
                                        {(evaluation.strengths?.length > 0 || evaluation.issues_found?.length > 0 || evaluation.suggestions?.length > 0) && (
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, marginBottom: 28 }}>
                                                        {[
                                                                { key: 'strengths', label: 'Strengths', icon: '✓', items: evaluation.strengths, color: DS.green, rgb: '34,197,94' },
                                                                { key: 'issues_found', label: 'Issues Found', icon: '⚠', items: evaluation.issues_found, color: DS.red, rgb: '239,68,68' },
                                                                { key: 'suggestions', label: 'Improvements', icon: '💡', items: evaluation.suggestions, color: DS.gold, rgb: '245,158,11' },
                                                        ].filter(s => s.items?.length > 0).map((section, i) => (
                                                                <div key={section.key} className="te-card-hover" style={{
                                                                        ...card,
                                                                        border: `1px solid rgba(${section.rgb},.2)`,
                                                                        animation: `teSlideUp .5s ${i * .1}s ease both`,
                                                                }}>
                                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                                                                                <div style={{
                                                                                        width: 44, height: 44, borderRadius: 12,
                                                                                        background: `rgba(${section.rgb},.1)`, border: `1px solid rgba(${section.rgb},.25)`,
                                                                                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                                                                                }}>
                                                                                        {section.icon}
                                                                                </div>
                                                                                <h3 style={{ fontFamily: 'Orbitron,sans-serif', fontSize: 13, fontWeight: 700, color: section.color }}>
                                                                                        {section.label}
                                                                                </h3>
                                                                        </div>
                                                                        {section.items.map((item, idx) => (
                                                                                <div key={idx} className="te-feedback-item" style={{
                                                                                        background: `rgba(${section.rgb},.05)`,
                                                                                        border: `1px solid rgba(${section.rgb},.12)`,
                                                                                }}>
                                                                                        <span style={{ color: section.color, fontSize: 16, flexShrink: 0 }}>●</span>
                                                                                        <span style={{ color: DS.muted }}>{item}</span>
                                                                                </div>
                                                                        ))}
                                                                </div>
                                                        ))}
                                                </div>
                                        )}

                                        {/* ══════════════════════════════
              BADGES EARNED
          ══════════════════════════════ */}
                                        {evaluation.badges_earned?.length > 0 && (
                                                <div style={{
                                                        ...card,
                                                        background: 'linear-gradient(135deg,rgba(245,158,11,.04),rgba(168,85,247,.06))',
                                                        border: '1px solid rgba(245,158,11,.2)',
                                                        textAlign: 'center', padding: '44px', marginBottom: 28,
                                                        animation: 'teSlideUp .6s .4s ease both',
                                                }}>
                                                        <div style={{ fontSize: 52, marginBottom: 12, animation: 'teBounce 2s ease-in-out infinite' }}>🏆</div>
                                                        <h2 style={{ fontFamily: 'Orbitron,sans-serif', fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 24 }}>
                                                                New Badges Unlocked!
                                                        </h2>
                                                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>
                                                                {evaluation.badges_earned.map((badge, i) => (
                                                                        <div key={i} style={{
                                                                                padding: '10px 24px', borderRadius: 12,
                                                                                background: 'rgba(245,158,11,.1)', border: '1px solid rgba(245,158,11,.3)',
                                                                                fontSize: 14, fontWeight: 700, color: DS.gold,
                                                                                display: 'flex', alignItems: 'center', gap: 8,
                                                                                animation: `teSlideUp .4s ${i * .1}s ease both`,
                                                                        }}>
                                                                                <span style={{ fontSize: 20 }}>🏆</span>{badge}
                                                                        </div>
                                                                ))}
                                                        </div>
                                                </div>
                                        )}

                                        {/* ══════════════════════════════
              ACTION BUTTONS
          ══════════════════════════════ */}
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, animation: 'teSlideUp .6s .45s ease both' }}>
                                                <button
                                                        className="te-action-btn"
                                                        onClick={() => navigate('/technical-challenge-selector')}
                                                        style={{
                                                                background: 'linear-gradient(135deg,#00e5ff,#00b8cc)',
                                                                color: '#000', border: 'none',
                                                                boxShadow: '0 0 24px rgba(0,229,255,.3)',
                                                        }}
                                                >
                                                        <span style={{ fontSize: 20 }}>🎯</span> Try Another Challenge
                                                </button>
                                                <button
                                                        className="te-action-btn"
                                                        onClick={() => navigate('/dashboard')}
                                                        style={{
                                                                background: 'transparent', color: DS.cyan,
                                                                border: `1px solid rgba(0,229,255,.3)`,
                                                        }}
                                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,229,255,.07)'}
                                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                                >
                                                        <span style={{ fontSize: 20 }}>🏠</span> Back to Dashboard
                                                </button>
                                        </div>

                                </div>
                        </main>
                </div>
        );
}