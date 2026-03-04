import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
        Radar, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
        ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { getAttemptDetail } from '../services/api';

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

const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
                return (
                        <div style={{
                                background: 'rgba(4,6,16,0.95)', border: '1px solid rgba(0,229,255,0.2)',
                                borderRadius: '8px', padding: '10px 14px',
                                fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#e2e8f0',
                        }}>
                                <p style={{ color: DS.cyan, fontFamily: 'Orbitron, sans-serif', fontSize: '11px', marginBottom: '4px' }}>{label}</p>
                                <p>{payload[0]?.value}</p>
                        </div>
                );
        }
        return null;
};

export default function AttemptDetail() {
        const { id } = useParams();
        const navigate = useNavigate();
        const [attempt, setAttempt] = useState(null);
        const [isLoading, setIsLoading] = useState(true);

        useEffect(() => {
                fetchAttemptDetail();
                const style = document.createElement('style');
                style.id = 'pf-attempt-fonts';
                style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=DM+Sans:wght@400;500;600&display=swap');
      @keyframes slideUp {
        from { opacity: 0; transform: translateY(32px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes fillBar { from { width: 0; } }
      @keyframes glowPulse {
        0%,100% { box-shadow: 0 0 10px rgba(0,229,255,.3); }
        50%      { box-shadow: 0 0 30px rgba(0,229,255,.6); }
      }
      @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-track { background: #040610; }
      ::-webkit-scrollbar-thumb { background: #00b8cc; border-radius: 4px; }
    `;
                if (!document.getElementById('pf-attempt-fonts')) {
                        document.head.appendChild(style);
                }
        }, [id]);

        const fetchAttemptDetail = async () => {
                try {
                        const data = await getAttemptDetail(id);
                        setAttempt(data);
                } catch (error) {
                        console.error('Failed to fetch attempt:', error);
                } finally {
                        setIsLoading(false);
                }
        };

        const getScoreColor = (score) => {
                if (score >= 80) return '#22c55e';
                if (score >= 60) return DS.gold;
                return '#ef4444';
        };

        const baseLayout = (children) => (
                <div style={{
                        display: 'flex', minHeight: '100vh', background: DS.bg,
                        backgroundImage: 'linear-gradient(rgba(0,229,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,255,.04) 1px,transparent 1px)',
                        backgroundSize: '60px 60px', fontFamily: 'DM Sans, sans-serif',
                }}>
                        <Sidebar />
                        <main style={{ flex: 1, marginLeft: '256px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {children}
                        </main>
                </div>
        );

        if (isLoading) {
                return baseLayout(
                        <div style={{ textAlign: 'center' }}>
                                <div style={{
                                        width: '56px', height: '56px', margin: '0 auto 16px',
                                        border: '3px solid rgba(0,229,255,.15)', borderTop: '3px solid #00e5ff',
                                        borderRadius: '50%', animation: 'spin 0.8s linear infinite',
                                }} />
                                <p style={{ color: DS.textMuted, fontSize: '14px' }}>Loading attempt details...</p>
                        </div>
                );
        }

        if (!attempt) {
                return baseLayout(
                        <div style={{ ...cardStyle, textAlign: 'center', maxWidth: '420px', padding: '48px 32px', animation: 'slideUp 0.7s ease both' }}>
                                <div style={{ fontSize: '64px', marginBottom: '20px' }}>❌</div>
                                <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '22px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
                                        Attempt Not Found
                                </h2>
                                <p style={{ color: DS.textMuted, fontSize: '14px', marginBottom: '28px', lineHeight: 1.7 }}>
                                        This attempt doesn't exist or you don't have access to it.
                                </p>
                                <button
                                        onClick={() => navigate('/dashboard')}
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
                                        Back to Dashboard
                                </button>
                        </div>
                );
        }

        const radarData = [
                { metric: 'Clarity', score: attempt.clarity_score, fullMark: 100 },
                { metric: 'Structure', score: attempt.structure_score, fullMark: 100 },
                { metric: 'Specificity', score: attempt.specificity_score, fullMark: 100 },
                { metric: 'Context', score: attempt.context_score, fullMark: 100 },
                { metric: 'Creativity', score: attempt.creativity_score, fullMark: 100 },
                { metric: 'Technical', score: attempt.technical_depth_score, fullMark: 100 },
        ];

        const barData = [
                { name: 'Clarity', score: attempt.clarity_score },
                { name: 'Structure', score: attempt.structure_score },
                { name: 'Specificity', score: attempt.specificity_score },
                { name: 'Context', score: attempt.context_score },
                { name: 'Creativity', score: attempt.creativity_score },
                { name: 'Technical', score: attempt.technical_depth_score },
        ];

        return (
                <div style={{
                        display: 'flex', minHeight: '100vh', background: DS.bg,
                        backgroundImage: 'linear-gradient(rgba(0,229,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,255,.04) 1px,transparent 1px)',
                        backgroundSize: '60px 60px', fontFamily: 'DM Sans, sans-serif',
                }}>
                        <Sidebar />

                        {/* Glow blobs */}
                        <div style={{
                                position: 'fixed', top: '10%', left: '15%', width: '400px', height: '400px', borderRadius: '50%',
                                background: 'radial-gradient(circle,rgba(0,229,255,.05) 0%,transparent 70%)', pointerEvents: 'none', zIndex: 0
                        }} />
                        <div style={{
                                position: 'fixed', bottom: '10%', right: '5%', width: '350px', height: '350px', borderRadius: '50%',
                                background: 'radial-gradient(circle,rgba(124,58,237,.07) 0%,transparent 70%)', pointerEvents: 'none', zIndex: 0
                        }} />

                        <main style={{ flex: 1, marginLeft: '256px', padding: '32px', position: 'relative', zIndex: 1 }}>
                                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

                                        {/* Header */}
                                        <header style={{ marginBottom: '32px', animation: 'slideUp 0.7s ease both' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                                                        <button
                                                                onClick={() => navigate('/dashboard')}
                                                                style={{
                                                                        display: 'flex', alignItems: 'center', gap: '6px',
                                                                        background: 'transparent', border: 'none',
                                                                        color: DS.cyan, fontFamily: 'DM Sans, sans-serif',
                                                                        fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                                                                        transition: 'opacity .2s',
                                                                }}
                                                                onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                                                                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                                                        >
                                                                ← Back to Dashboard
                                                        </button>
                                                        <span style={{
                                                                padding: '4px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: 600,
                                                                background: 'rgba(0,229,255,.08)', color: DS.cyan, border: '1px solid rgba(0,229,255,.2)',
                                                        }}>
                                                                {new Date(attempt.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </span>
                                                </div>
                                                <div style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                                                        padding: '6px 16px', border: '1px solid rgba(0,229,255,.25)',
                                                        borderRadius: '999px', background: 'rgba(0,229,255,.06)',
                                                        fontSize: '13px', color: DS.cyan, letterSpacing: '.5px', marginBottom: '12px',
                                                }}>
                                                        📋 Attempt Report
                                                </div>
                                                <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '40px', fontWeight: 900, color: '#fff', letterSpacing: '-1px', marginBottom: '8px' }}>
                                                        Attempt <span style={gradientText}>Report</span>
                                                </h1>
                                                <p style={{ color: DS.textMuted, fontSize: '14px' }}>{attempt.problem_source}</p>
                                        </header>

                                        {/* Overall Score Card */}
                                        <div style={{
                                                ...cardStyle,
                                                background: 'rgba(0,229,255,0.04)',
                                                borderColor: 'rgba(0,229,255,0.25)',
                                                marginBottom: '24px',
                                                animation: 'slideUp 0.5s 0.1s ease both',
                                        }}>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

                                                        {/* Overall Score */}
                                                        <div style={{ textAlign: 'center', padding: '16px' }}>
                                                                <p style={{
                                                                        fontFamily: 'Orbitron, sans-serif', fontSize: '11px', color: DS.textMuted,
                                                                        letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px'
                                                                }}>
                                                                        Overall Score
                                                                </p>
                                                                <div style={{
                                                                        fontFamily: 'Orbitron, sans-serif', fontSize: '72px', fontWeight: 900,
                                                                        color: getScoreColor(attempt.overall_score),
                                                                        lineHeight: 1,
                                                                        filter: `drop-shadow(0 0 20px ${getScoreColor(attempt.overall_score)}60)`,
                                                                        animation: 'glowPulse 2s ease-in-out infinite',
                                                                }}>
                                                                        {attempt.overall_score.toFixed(1)}
                                                                </div>
                                                                <p style={{ color: DS.textMuted, fontSize: '14px', marginTop: '8px' }}>out of 100</p>

                                                                {/* Score bar */}
                                                                <div style={{ marginTop: '16px', height: '6px', background: 'rgba(255,255,255,.06)', borderRadius: '6px', overflow: 'hidden' }}>
                                                                        <div style={{
                                                                                height: '100%', width: `${attempt.overall_score}%`,
                                                                                background: `linear-gradient(90deg, ${getScoreColor(attempt.overall_score)}, ${getScoreColor(attempt.overall_score)}99)`,
                                                                                borderRadius: '6px', animation: 'fillBar 1.2s ease both',
                                                                        }} />
                                                                </div>
                                                        </div>

                                                        {/* XP Earned */}
                                                        <div style={{
                                                                textAlign: 'center', padding: '16px',
                                                                borderLeft: '1px solid rgba(0,229,255,.1)',
                                                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                                        }}>
                                                                <p style={{
                                                                        fontFamily: 'Orbitron, sans-serif', fontSize: '11px', color: DS.textMuted,
                                                                        letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px'
                                                                }}>
                                                                        Experience Earned
                                                                </p>
                                                                <div style={{
                                                                        fontFamily: 'Orbitron, sans-serif', fontSize: '60px', fontWeight: 900,
                                                                        ...gradientText, lineHeight: 1,
                                                                }}>
                                                                        +{attempt.xp_earned}
                                                                </div>
                                                                <span style={{
                                                                        marginTop: '10px', padding: '4px 16px', borderRadius: '999px', fontSize: '13px', fontWeight: 600,
                                                                        background: 'rgba(168,85,247,.1)', color: DS.purple2, border: '1px solid rgba(168,85,247,.25)',
                                                                }}>
                                                                        XP
                                                                </span>
                                                        </div>
                                                </div>
                                        </div>

                                        {/* Problem Statement */}
                                        <div style={{ ...cardStyle, marginBottom: '24px', animation: 'slideUp 0.5s 0.15s ease both' }}>
                                                <h2 style={{
                                                        fontFamily: 'Orbitron, sans-serif', fontSize: '16px', fontWeight: 700, color: '#fff',
                                                        letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px'
                                                }}>
                                                        Original Problem
                                                </h2>
                                                <div style={{
                                                        padding: '20px', background: 'rgba(0,0,0,0.4)',
                                                        border: '1px solid rgba(0,229,255,.08)', borderRadius: '10px',
                                                }}>
                                                        <pre style={{
                                                                fontSize: '13px', color: DS.textMuted, fontFamily: 'JetBrains Mono, monospace',
                                                                whiteSpace: 'pre-wrap', lineHeight: 1.7, margin: 0,
                                                        }}>
                                                                {attempt.problem_text}
                                                        </pre>
                                                </div>
                                        </div>

                                        {/* Charts */}
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px', animation: 'slideUp 0.5s 0.2s ease both' }}>

                                                {/* Radar Chart */}
                                                <div style={cardStyle}>
                                                        <h2 style={{
                                                                fontFamily: 'Orbitron, sans-serif', fontSize: '14px', fontWeight: 700, color: '#fff',
                                                                letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '20px'
                                                        }}>
                                                                Performance Radar
                                                        </h2>
                                                        <ResponsiveContainer width="100%" height={320}>
                                                                <RechartsRadar data={radarData}>
                                                                        <PolarGrid stroke="rgba(0,229,255,.1)" />
                                                                        <PolarAngleAxis dataKey="metric" tick={{ fill: DS.textMuted, fontSize: 11, fontFamily: 'DM Sans' }} />
                                                                        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: DS.textMuted, fontSize: 10 }} />
                                                                        <Radar name="Scores" dataKey="score" stroke="#00e5ff" fill="rgba(0,229,255,0.15)" fillOpacity={0.6} />
                                                                </RechartsRadar>
                                                        </ResponsiveContainer>
                                                </div>

                                                {/* Bar Chart */}
                                                <div style={cardStyle}>
                                                        <h2 style={{
                                                                fontFamily: 'Orbitron, sans-serif', fontSize: '14px', fontWeight: 700, color: '#fff',
                                                                letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '20px'
                                                        }}>
                                                                Score Breakdown
                                                        </h2>
                                                        <ResponsiveContainer width="100%" height={320}>
                                                                <BarChart data={barData} margin={{ top: 0, right: 0, bottom: 30, left: -20 }}>
                                                                        <defs>
                                                                                <linearGradient id="attemptBarGrad" x1="0" y1="0" x2="0" y2="1">
                                                                                        <stop offset="0%" stopColor="#00e5ff" />
                                                                                        <stop offset="100%" stopColor="#a855f7" />
                                                                                </linearGradient>
                                                                        </defs>
                                                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,229,255,.06)" />
                                                                        <XAxis dataKey="name" tick={{ fill: DS.textMuted, fontSize: 11 }} angle={-45} textAnchor="end" height={60} />
                                                                        <YAxis domain={[0, 100]} tick={{ fill: DS.textMuted, fontSize: 10 }} />
                                                                        <Tooltip content={<CustomTooltip />} />
                                                                        <Bar dataKey="score" fill="url(#attemptBarGrad)" radius={[6, 6, 0, 0]} />
                                                                </BarChart>
                                                        </ResponsiveContainer>
                                                </div>
                                        </div>

                                        {/* Prompt Comparison */}
                                        <div style={{ ...cardStyle, marginBottom: '24px', animation: 'slideUp 0.5s 0.25s ease both' }}>
                                                <h2 style={{
                                                        fontFamily: 'Orbitron, sans-serif', fontSize: '16px', fontWeight: 700, color: '#fff',
                                                        letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '20px'
                                                }}>
                                                        Prompt Comparison
                                                </h2>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

                                                        {/* Your Prompt */}
                                                        <div>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                                                                        <span style={{
                                                                                padding: '4px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 600,
                                                                                background: 'rgba(255,255,255,.06)', color: DS.textMuted,
                                                                                border: '1px solid rgba(255,255,255,.1)',
                                                                        }}>
                                                                                📝 Your Prompt
                                                                        </span>
                                                                </div>
                                                                <div style={{
                                                                        padding: '20px', background: 'rgba(0,0,0,0.5)',
                                                                        border: '1px solid rgba(255,255,255,.06)', borderRadius: '10px',
                                                                        maxHeight: '360px', overflowY: 'auto',
                                                                }}>
                                                                        <pre style={{
                                                                                fontSize: '13px', color: DS.textMuted, fontFamily: 'JetBrains Mono, monospace',
                                                                                whiteSpace: 'pre-wrap', lineHeight: 1.7, margin: 0,
                                                                        }}>
                                                                                {attempt.user_prompt}
                                                                        </pre>
                                                                </div>
                                                        </div>

                                                        {/* AI Enhanced */}
                                                        <div>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                                                                        <span style={{
                                                                                padding: '4px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 600,
                                                                                background: 'rgba(0,229,255,.08)', color: DS.cyan,
                                                                                border: '1px solid rgba(0,229,255,.25)',
                                                                        }}>
                                                                                ✨ AI Enhanced
                                                                        </span>
                                                                </div>
                                                                <div style={{
                                                                        padding: '20px', background: 'rgba(0,229,255,0.03)',
                                                                        border: '1px solid rgba(0,229,255,.2)', borderRadius: '10px',
                                                                        maxHeight: '360px', overflowY: 'auto',
                                                                }}>
                                                                        <pre style={{
                                                                                fontSize: '13px', color: DS.textPrimary, fontFamily: 'JetBrains Mono, monospace',
                                                                                whiteSpace: 'pre-wrap', lineHeight: 1.7, margin: 0,
                                                                        }}>
                                                                                {attempt.ai_improved_prompt}
                                                                        </pre>
                                                                </div>
                                                        </div>
                                                </div>
                                        </div>

                                        {/* Feedback Grid */}
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px', animation: 'slideUp 0.5s 0.3s ease both' }}>

                                                {/* Strengths */}
                                                {attempt.strengths && attempt.strengths.length > 0 && (
                                                        <div style={{
                                                                ...cardStyle,
                                                                background: 'rgba(34,197,94,.03)',
                                                                borderColor: 'rgba(34,197,94,.2)',
                                                        }}>
                                                                <h3 style={{
                                                                        fontFamily: 'Orbitron, sans-serif', fontSize: '13px', fontWeight: 700,
                                                                        color: '#22c55e', letterSpacing: '1px', textTransform: 'uppercase',
                                                                        marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px'
                                                                }}>
                                                                        ✓ Strengths
                                                                </h3>
                                                                <ul style={{ paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                                        {attempt.strengths.map((strength, idx) => (
                                                                                <li key={idx} style={{
                                                                                        display: 'flex', gap: '10px', fontSize: '13px',
                                                                                        color: DS.textMuted, lineHeight: 1.6,
                                                                                }}>
                                                                                        <span style={{ color: '#22c55e', flexShrink: 0, marginTop: '2px' }}>•</span>
                                                                                        {strength}
                                                                                </li>
                                                                        ))}
                                                                </ul>
                                                        </div>
                                                )}

                                                {/* Weaknesses */}
                                                {attempt.weaknesses && attempt.weaknesses.length > 0 && (
                                                        <div style={{
                                                                ...cardStyle,
                                                                background: 'rgba(239,68,68,.03)',
                                                                borderColor: 'rgba(239,68,68,.2)',
                                                        }}>
                                                                <h3 style={{
                                                                        fontFamily: 'Orbitron, sans-serif', fontSize: '13px', fontWeight: 700,
                                                                        color: '#ef4444', letterSpacing: '1px', textTransform: 'uppercase',
                                                                        marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px'
                                                                }}>
                                                                        ⚠ Weaknesses
                                                                </h3>
                                                                <ul style={{ paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                                        {attempt.weaknesses.map((weakness, idx) => (
                                                                                <li key={idx} style={{
                                                                                        display: 'flex', gap: '10px', fontSize: '13px',
                                                                                        color: DS.textMuted, lineHeight: 1.6,
                                                                                }}>
                                                                                        <span style={{ color: '#ef4444', flexShrink: 0, marginTop: '2px' }}>•</span>
                                                                                        {weakness}
                                                                                </li>
                                                                        ))}
                                                                </ul>
                                                        </div>
                                                )}

                                                {/* Suggestions */}
                                                {attempt.suggestions && attempt.suggestions.length > 0 && (
                                                        <div style={{
                                                                ...cardStyle,
                                                                background: 'rgba(245,158,11,.03)',
                                                                borderColor: 'rgba(245,158,11,.2)',
                                                        }}>
                                                                <h3 style={{
                                                                        fontFamily: 'Orbitron, sans-serif', fontSize: '13px', fontWeight: 700,
                                                                        color: DS.gold, letterSpacing: '1px', textTransform: 'uppercase',
                                                                        marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px'
                                                                }}>
                                                                        💡 Suggestions
                                                                </h3>
                                                                <ul style={{ paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                                        {attempt.suggestions.map((suggestion, idx) => (
                                                                                <li key={idx} style={{
                                                                                        display: 'flex', gap: '10px', fontSize: '13px',
                                                                                        color: DS.textMuted, lineHeight: 1.6,
                                                                                }}>
                                                                                        <span style={{ color: DS.gold, flexShrink: 0, marginTop: '2px' }}>•</span>
                                                                                        {suggestion}
                                                                                </li>
                                                                        ))}
                                                                </ul>
                                                        </div>
                                                )}
                                        </div>

                                        {/* Action Buttons */}
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', animation: 'slideUp 0.5s 0.35s ease both' }}>
                                                <button
                                                        onClick={() => navigate('/dashboard')}
                                                        style={{
                                                                width: '100%', padding: '14px', borderRadius: '8px', border: 'none',
                                                                background: 'linear-gradient(135deg, #00e5ff, #00b8cc)',
                                                                color: '#000', fontFamily: 'DM Sans, sans-serif',
                                                                fontWeight: 600, fontSize: '15px', cursor: 'pointer',
                                                                boxShadow: '0 0 20px rgba(0,229,255,.35)',
                                                                transition: 'transform .2s, box-shadow .2s',
                                                        }}
                                                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 40px rgba(0,229,255,.5)'; }}
                                                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(0,229,255,.35)'; }}
                                                >
                                                        🏠 Back to Dashboard
                                                </button>
                                                <button
                                                        onClick={() => navigate('/technical-challenge')}
                                                        style={{
                                                                width: '100%', padding: '14px', borderRadius: '8px',
                                                                background: 'transparent', color: DS.cyan,
                                                                border: '1px solid rgba(0,229,255,.3)',
                                                                fontFamily: 'DM Sans, sans-serif', fontWeight: 600,
                                                                fontSize: '15px', cursor: 'pointer', transition: 'all .2s',
                                                        }}
                                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,229,255,.08)'}
                                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                                >
                                                        🔄 Try Another Challenge
                                                </button>
                                        </div>

                                </div>
                        </main>
                </div>
        );
}
