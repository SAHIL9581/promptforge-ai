import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
        Radar, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
        ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
        LineChart, Line, AreaChart, Area, ComposedChart,
} from 'recharts';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';

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

const customTooltipStyle = {
        backgroundColor: 'rgba(4,6,16,0.95)',
        border: '1px solid rgba(0,229,255,0.2)',
        borderRadius: '8px',
        color: '#e2e8f0',
        fontFamily: 'DM Sans, sans-serif',
        fontSize: '13px',
        padding: '10px 14px',
};

const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
                return (
                        <div style={customTooltipStyle}>
                                <p style={{ color: DS.cyan, fontFamily: 'Orbitron, sans-serif', fontSize: '11px', marginBottom: '4px' }}>{label}</p>
                                <p style={{ color: '#e2e8f0' }}>{payload[0]?.value}</p>
                        </div>
                );
        }
        return null;
};

export default function EvaluationResult() {
        const location = useLocation();
        const navigate = useNavigate();
        const { evaluation, problem, userPrompt } = location.state || {};

        useEffect(() => {
                const style = document.createElement('style');
                style.id = 'pf-eval-fonts';
                style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=DM+Sans:wght@400;500;600&display=swap');
      @keyframes slideUp {
        from { opacity: 0; transform: translateY(32px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes fillBar { from { width: 0; } }
      @keyframes glowPulse {
        0%, 100% { box-shadow: 0 0 10px rgba(0,229,255,.3); }
        50%       { box-shadow: 0 0 30px rgba(0,229,255,.6); }
      }
      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-track { background: #040610; }
      ::-webkit-scrollbar-thumb { background: #00b8cc; border-radius: 4px; }
    `;
                if (!document.getElementById('pf-eval-fonts')) {
                        document.head.appendChild(style);
                }
        }, []);

        if (!evaluation) {
                return (
                        <div style={{
                                display: 'flex', minHeight: '100vh', background: DS.bg,
                                backgroundImage: 'linear-gradient(rgba(0,229,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,.04) 1px, transparent 1px)',
                                backgroundSize: '60px 60px', fontFamily: 'DM Sans, sans-serif',
                        }}>
                                <Sidebar />
                                <main style={{ flex: 1, marginLeft: '256px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <div style={{ ...cardStyle, textAlign: 'center', maxWidth: '420px', padding: '48px 32px', animation: 'slideUp 0.7s ease both' }}>
                                                <div style={{ fontSize: '64px', marginBottom: '20px' }}>📊</div>
                                                <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '22px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
                                                        No Evaluation Data
                                                </h2>
                                                <p style={{ color: DS.textMuted, fontSize: '14px', marginBottom: '28px', lineHeight: 1.7 }}>
                                                        Please complete a challenge first.
                                                </p>
                                                <button
                                                        onClick={() => navigate('/problem-mode')}
                                                        style={{
                                                                padding: '12px 28px', borderRadius: '8px', border: 'none',
                                                                background: 'linear-gradient(135deg, #00e5ff, #00b8cc)',
                                                                color: '#000', fontFamily: 'DM Sans, sans-serif',
                                                                fontWeight: 600, fontSize: '15px', cursor: 'pointer',
                                                                boxShadow: '0 0 20px rgba(0,229,255,.35)',
                                                        }}
                                                >
                                                        Start a Challenge
                                                </button>
                                        </div>
                                </main>
                        </div>
                );
        }

        const scoreData = [
                { label: 'Clarity', value: evaluation.clarity_score, color: '#00e5ff' },
                { label: 'Specificity', value: evaluation.specificity_score, color: '#a855f7' },
                { label: 'Effectiveness', value: evaluation.effectiveness_score, color: '#22c55e' },
                { label: 'Best Practices', value: evaluation.best_practices_score, color: '#f59e0b' },
                { label: 'Efficiency', value: evaluation.efficiency_score, color: '#00b8cc' },
                { label: 'Safety', value: evaluation.safety_score, color: '#ec4899' },
                { label: 'Cognitive Load', value: evaluation.cognitive_load_score, color: '#818cf8' },
                { label: 'Alignment', value: evaluation.alignment_score, color: '#34d399' },
        ];

        const radarData = scoreData.map(s => ({ subject: s.label, score: s.value, fullMark: 100 }));

        const barData = scoreData.map(s => ({ name: s.label, score: s.value }));

        const componentChecks = [
                { key: 'has_role_definition', label: 'Role Definition', desc: 'Assigns an expert persona to the model' },
                { key: 'has_clear_task', label: 'Clear Task', desc: 'Core objective is unambiguous' },
                { key: 'has_output_format', label: 'Output Format', desc: 'Desired output structure is specified' },
                { key: 'has_constraints', label: 'Constraints', desc: 'Limitations or boundaries are defined' },
                { key: 'has_examples', label: 'Examples', desc: 'Input/output examples are provided' },
                { key: 'has_step_by_step', label: 'Step-by-Step', desc: 'Chain-of-thought reasoning is prompted' },
                { key: 'has_negative_constraints', label: 'Negative Constraints', desc: "What the model should NOT do is stated" },
                { key: 'has_audience_definition', label: 'Audience Definition', desc: 'Target audience or context is stated' },
                { key: 'has_success_criteria', label: 'Success Criteria', desc: 'Clear definition of a good answer' },
        ];

        const promptPatternInfo = {
                'Zero-shot directive': { color: DS.cyan, icon: '⚡' },
                'Few-shot exemplar': { color: DS.gold, icon: '📚' },
                'Chain-of-thought': { color: '#22c55e', icon: '🔗' },
                'Role-play': { color: DS.purple2, icon: '🎭' },
                'Structured template': { color: '#ec4899', icon: '📋' },
                'Hybrid': { color: '#34d399', icon: '🔀' },
        };

        const currentPattern = promptPatternInfo[evaluation.prompt_pattern] || { color: DS.cyan, icon: '🧠' };

        const getRiskStyle = (risk) => {
                if (risk === 'LOW') return { color: '#22c55e', bg: 'rgba(34,197,94,.12)', border: 'rgba(34,197,94,.25)' };
                if (risk === 'HIGH') return { color: '#ef4444', bg: 'rgba(239,68,68,.12)', border: 'rgba(239,68,68,.25)' };
                return { color: DS.gold, bg: 'rgba(245,158,11,.12)', border: 'rgba(245,158,11,.25)' };
        };

        const riskStyle = getRiskStyle(evaluation.hallucination_risk);

        const getScoreColor = (score) => {
                if (score >= 80) return '#22c55e';
                if (score >= 60) return DS.gold;
                return '#ef4444';
        };

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

                        <main style={{ flex: 1, marginLeft: '256px', padding: '32px', position: 'relative', zIndex: 1 }}>
                                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

                                        {/* Header */}
                                        <header style={{ marginBottom: '32px', animation: 'slideUp 0.7s ease both' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <div>
                                                                <div style={{
                                                                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                                                                        padding: '6px 16px', border: '1px solid rgba(0,229,255,.25)',
                                                                        borderRadius: '999px', background: 'rgba(0,229,255,.06)',
                                                                        fontSize: '13px', color: DS.cyan, letterSpacing: '.5px', marginBottom: '12px',
                                                                }}>
                                                                        📊 Evaluation Report
                                                                </div>
                                                                <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '36px', fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>
                                                                        Prompt <span style={gradientText}>Analysis</span>
                                                                </h1>
                                                        </div>
                                                        <div style={{ display: 'flex', gap: '12px' }}>
                                                                <button
                                                                        onClick={() => navigate(-1)}
                                                                        style={{
                                                                                padding: '10px 20px', borderRadius: '8px',
                                                                                background: 'transparent', color: DS.cyan,
                                                                                border: '1px solid rgba(0,229,255,.3)',
                                                                                fontFamily: 'DM Sans, sans-serif', fontWeight: 600,
                                                                                fontSize: '14px', cursor: 'pointer', transition: 'all .2s',
                                                                        }}
                                                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,229,255,.08)'}
                                                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                                                >
                                                                        ← Back
                                                                </button>
                                                                <button
                                                                        onClick={() => navigate('/problem-mode')}
                                                                        style={{
                                                                                padding: '10px 20px', borderRadius: '8px', border: 'none',
                                                                                background: 'linear-gradient(135deg, #00e5ff, #00b8cc)',
                                                                                color: '#000', fontFamily: 'DM Sans, sans-serif',
                                                                                fontWeight: 600, fontSize: '14px', cursor: 'pointer',
                                                                                boxShadow: '0 0 20px rgba(0,229,255,.35)',
                                                                                transition: 'transform .2s, box-shadow .2s',
                                                                        }}
                                                                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 40px rgba(0,229,255,.5)'; }}
                                                                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(0,229,255,.35)'; }}
                                                                >
                                                                        🔄 Try Again
                                                                </button>
                                                        </div>
                                                </div>
                                        </header>

                                        {/* Row 1 — Overall Score + XP + Pattern + Risk */}
                                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '20px', marginBottom: '24px', animation: 'slideUp 0.5s 0.1s ease both' }}>

                                                {/* Overall Score */}
                                                <div style={{
                                                        ...cardStyle,
                                                        background: 'rgba(0,229,255,0.04)',
                                                        borderColor: 'rgba(0,229,255,0.25)',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                        padding: '28px',
                                                }}>
                                                        <div>
                                                                <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '11px', color: DS.cyan, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>
                                                                        Overall Score
                                                                </p>
                                                                <div style={{
                                                                        fontFamily: 'Orbitron, sans-serif', fontSize: '64px', fontWeight: 900,
                                                                        ...gradientText, lineHeight: 1, animation: 'glowPulse 2s ease-in-out infinite',
                                                                }}>
                                                                        {evaluation.overall_score}
                                                                        <span style={{ fontSize: '28px', opacity: 0.5 }}>/100</span>
                                                                </div>
                                                                <div style={{ marginTop: '16px' }}>
                                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                                                                <span style={{ fontSize: '12px', color: DS.textMuted }}>75% to next level</span>
                                                                                <span style={{ fontSize: '12px', color: DS.cyan }}>75%</span>
                                                                        </div>
                                                                        <div style={{ height: '6px', background: 'rgba(255,255,255,.06)', borderRadius: '6px', overflow: 'hidden' }}>
                                                                                <div style={{
                                                                                        height: '100%', width: '75%',
                                                                                        background: 'linear-gradient(90deg, #00e5ff, #a855f7)',
                                                                                        borderRadius: '6px', animation: 'fillBar 1.2s ease both',
                                                                                }} />
                                                                        </div>
                                                                </div>
                                                        </div>
                                                        <div style={{ fontSize: '64px', opacity: 0.8 }}>
                                                                {evaluation.overall_score >= 80 ? '🎉' : evaluation.overall_score >= 60 ? '👍' : '💪'}
                                                        </div>
                                                </div>

                                                {/* Improvement Potential */}
                                                <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                                                        <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '10px', color: DS.textMuted, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
                                                                Improvement
                                                        </p>
                                                        <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '40px', fontWeight: 900, color: DS.gold }}>
                                                                {evaluation.improvement_potential_score}
                                                        </div>
                                                        <p style={{ fontSize: '12px', color: DS.textMuted, marginTop: '4px' }}>possible improvement</p>
                                                </div>

                                                {/* Prompt Pattern */}
                                                <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                                                        <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '10px', color: DS.textMuted, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>
                                                                Pattern
                                                        </p>
                                                        <div style={{ fontSize: '32px', marginBottom: '8px' }}>{currentPattern.icon}</div>
                                                        <span style={{
                                                                padding: '4px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 600,
                                                                color: currentPattern.color,
                                                                background: `${currentPattern.color}18`,
                                                                border: `1px solid ${currentPattern.color}40`,
                                                                textAlign: 'center', lineHeight: 1.4,
                                                        }}>
                                                                {evaluation.prompt_pattern}
                                                        </span>
                                                </div>

                                                {/* Hallucination Risk */}
                                                <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                                                        <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '10px', color: DS.textMuted, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>
                                                                Hallucination Risk
                                                        </p>
                                                        <span style={{
                                                                padding: '8px 20px', borderRadius: '999px', fontSize: '14px', fontWeight: 700,
                                                                fontFamily: 'Orbitron, sans-serif', letterSpacing: '1px',
                                                                color: riskStyle.color,
                                                                background: riskStyle.bg,
                                                                border: `1px solid ${riskStyle.border}`,
                                                                marginBottom: '8px',
                                                        }}>
                                                                {evaluation.hallucination_risk}
                                                        </span>
                                                        <p style={{ fontSize: '11px', color: DS.textMuted, lineHeight: 1.5 }}>
                                                                {evaluation.hallucination_risk_reason}
                                                        </p>
                                                </div>
                                        </div>

                                        {/* Row 2 — Radar + Bar Chart */}
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px', animation: 'slideUp 0.5s 0.2s ease both' }}>

                                                {/* Radar Chart */}
                                                <div style={cardStyle}>
                                                        <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '14px', fontWeight: 700, color: '#fff', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '20px' }}>
                                                                Skill Radar
                                                        </h3>
                                                        <ResponsiveContainer width="100%" height={280}>
                                                                <RechartsRadar data={radarData}>
                                                                        <PolarGrid stroke="rgba(0,229,255,.1)" />
                                                                        <PolarAngleAxis dataKey="subject" tick={{ fill: DS.textMuted, fontSize: 11, fontFamily: 'DM Sans' }} />
                                                                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: DS.textMuted, fontSize: 10 }} />
                                                                        <Radar name="Score" dataKey="score" stroke="#00e5ff" fill="rgba(0,229,255,0.15)" fillOpacity={0.6} />
                                                                </RechartsRadar>
                                                        </ResponsiveContainer>
                                                </div>

                                                {/* Bar Chart */}
                                                <div style={cardStyle}>
                                                        <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '14px', fontWeight: 700, color: '#fff', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '20px' }}>
                                                                Score Breakdown
                                                        </h3>
                                                        <ResponsiveContainer width="100%" height={280}>
                                                                <BarChart data={barData} margin={{ top: 0, right: 0, bottom: 20, left: -20 }}>
                                                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,229,255,.06)" />
                                                                        <XAxis dataKey="name" tick={{ fill: DS.textMuted, fontSize: 10, fontFamily: 'DM Sans' }} angle={-35} textAnchor="end" />
                                                                        <YAxis domain={[0, 100]} tick={{ fill: DS.textMuted, fontSize: 10 }} />
                                                                        <Tooltip content={<CustomTooltip />} />
                                                                        <Bar dataKey="score" radius={[4, 4, 0, 0]}
                                                                                fill="url(#barGradient)" />
                                                                        <defs>
                                                                                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                                                                        <stop offset="0%" stopColor="#00e5ff" />
                                                                                        <stop offset="100%" stopColor="#a855f7" />
                                                                                </linearGradient>
                                                                        </defs>
                                                                </BarChart>
                                                        </ResponsiveContainer>
                                                </div>
                                        </div>

                                        {/* Row 3 — Score Bars + Component Checks */}
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px', animation: 'slideUp 0.5s 0.3s ease both' }}>

                                                {/* Detailed Score Bars */}
                                                <div style={cardStyle}>
                                                        <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '14px', fontWeight: 700, color: '#fff', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '20px' }}>
                                                                Dimension Scores
                                                        </h3>
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                                                {scoreData.map(({ label, value }) => (
                                                                        <div key={label}>
                                                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                                                                        <span style={{ fontSize: '13px', color: DS.textMuted }}>{label}</span>
                                                                                        <span style={{
                                                                                                fontFamily: 'Orbitron, sans-serif', fontSize: '13px', fontWeight: 700,
                                                                                                color: getScoreColor(value),
                                                                                        }}>
                                                                                                {value}
                                                                                        </span>
                                                                                </div>
                                                                                <div style={{ height: '6px', background: 'rgba(255,255,255,.06)', borderRadius: '6px', overflow: 'hidden' }}>
                                                                                        <div style={{
                                                                                                height: '100%', width: `${value}%`,
                                                                                                background: 'linear-gradient(90deg, #00e5ff, #a855f7)',
                                                                                                borderRadius: '6px', animation: 'fillBar 1s ease both',
                                                                                                transition: 'width .8s ease',
                                                                                        }} />
                                                                                </div>
                                                                        </div>
                                                                ))}
                                                        </div>
                                                </div>

                                                {/* Component Checks */}
                                                <div style={cardStyle}>
                                                        <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '14px', fontWeight: 700, color: '#fff', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '20px' }}>
                                                                Component Detection
                                                        </h3>
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                                {componentChecks.map((component) => {
                                                                        const present = evaluation[component.key];
                                                                        return (
                                                                                <div key={component.key} style={{
                                                                                        display: 'flex', alignItems: 'center', gap: '12px',
                                                                                        padding: '10px 14px', borderRadius: '8px',
                                                                                        background: present ? 'rgba(34,197,94,.06)' : 'rgba(239,68,68,.04)',
                                                                                        border: `1px solid ${present ? 'rgba(34,197,94,.2)' : 'rgba(239,68,68,.1)'}`,
                                                                                }}>
                                                                                        <span style={{
                                                                                                width: '22px', height: '22px', borderRadius: '50%',
                                                                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                                                fontSize: '12px', flexShrink: 0,
                                                                                                background: present ? 'rgba(34,197,94,.2)' : 'rgba(239,68,68,.15)',
                                                                                                color: present ? '#22c55e' : '#ef4444',
                                                                                        }}>
                                                                                                {present ? '✓' : '✗'}
                                                                                        </span>
                                                                                        <div style={{ flex: 1 }}>
                                                                                                <p style={{ fontSize: '13px', color: present ? DS.textPrimary : DS.textMuted, fontWeight: 600, marginBottom: '1px' }}>
                                                                                                        {component.label}
                                                                                                </p>
                                                                                                <p style={{ fontSize: '11px', color: DS.textMuted }}>{component.desc}</p>
                                                                                        </div>
                                                                                </div>
                                                                        );
                                                                })}
                                                        </div>
                                                </div>
                                        </div>

                                        {/* Row 4 — Token Analysis + Additional Scores */}
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px', animation: 'slideUp 0.5s 0.35s ease both' }}>

                                                {/* Token Analysis */}
                                                <div style={cardStyle}>
                                                        <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '14px', fontWeight: 700, color: '#fff', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '20px' }}>
                                                                Token Analysis
                                                        </h3>
                                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                                                {[
                                                                        { label: 'Est. Tokens', value: evaluation.estimated_tokens, suffix: '', color: DS.cyan },
                                                                        { label: 'Useful Tokens', value: `${evaluation.useful_tokens_percentage}%`, suffix: '', color: '#22c55e' },
                                                                        { label: 'Redundant', value: `${evaluation.redundant_tokens_percentage}%`, suffix: '', color: '#ef4444' },
                                                                        { label: 'Info Density', value: evaluation.information_density_score, suffix: '', color: DS.purple2 },
                                                                ].map(({ label, value, color }) => (
                                                                        <div key={label} style={{
                                                                                padding: '16px', background: 'rgba(0,0,0,0.35)',
                                                                                border: '1px solid rgba(0,229,255,.08)', borderRadius: '10px',
                                                                                textAlign: 'center',
                                                                        }}>
                                                                                <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '24px', fontWeight: 900, color, marginBottom: '4px' }}>
                                                                                        {value}
                                                                                </p>
                                                                                <p style={{ fontSize: '11px', color: DS.textMuted, textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</p>
                                                                        </div>
                                                                ))}
                                                        </div>
                                                </div>

                                                {/* Additional Quality Scores */}
                                                <div style={cardStyle}>
                                                        <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '14px', fontWeight: 700, color: '#fff', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '20px' }}>
                                                                Quality Metrics
                                                        </h3>
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                                                {[
                                                                        { label: 'Grammar', value: evaluation.grammar_score },
                                                                        { label: 'Readability', value: evaluation.readability_score },
                                                                        { label: 'Ambiguity', value: evaluation.ambiguity_score },
                                                                ].map(({ label, value }) => (
                                                                        <div key={label}>
                                                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                                                                        <span style={{ fontSize: '13px', color: DS.textMuted }}>{label}</span>
                                                                                        <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '13px', fontWeight: 700, color: getScoreColor(value) }}>
                                                                                                {value}
                                                                                        </span>
                                                                                </div>
                                                                                <div style={{ height: '6px', background: 'rgba(255,255,255,.06)', borderRadius: '6px', overflow: 'hidden' }}>
                                                                                        <div style={{
                                                                                                height: '100%', width: `${value}%`,
                                                                                                background: 'linear-gradient(90deg, #00e5ff, #a855f7)',
                                                                                                borderRadius: '6px', animation: 'fillBar 1s ease both',
                                                                                        }} />
                                                                                </div>
                                                                        </div>
                                                                ))}
                                                        </div>
                                                </div>
                                        </div>

                                        {/* Row 5 — Strengths + Weaknesses */}
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px', animation: 'slideUp 0.5s 0.4s ease both' }}>

                                                {/* Strengths */}
                                                <div style={{ ...cardStyle, borderColor: 'rgba(34,197,94,.2)', background: 'rgba(34,197,94,.03)' }}>
                                                        <h3 style={{
                                                                fontFamily: 'Orbitron, sans-serif', fontSize: '13px', fontWeight: 700, color: '#22c55e',
                                                                letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px',
                                                                display: 'flex', alignItems: 'center', gap: '8px'
                                                        }}>
                                                                ✓ Strengths
                                                        </h3>
                                                        <ul style={{ paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                                {(evaluation.strengths || []).map((strength, index) => (
                                                                        <li key={index} style={{
                                                                                display: 'flex', gap: '10px', fontSize: '13px', color: DS.textMuted,
                                                                                lineHeight: 1.6, padding: '8px 12px',
                                                                                background: 'rgba(34,197,94,.04)', borderRadius: '6px',
                                                                                border: '1px solid rgba(34,197,94,.1)',
                                                                        }}>
                                                                                <span style={{ color: '#22c55e', marginTop: '2px', flexShrink: 0 }}>•</span>
                                                                                {strength}
                                                                        </li>
                                                                ))}
                                                        </ul>
                                                </div>

                                                {/* Weaknesses */}
                                                <div style={{ ...cardStyle, borderColor: 'rgba(245,158,11,.2)', background: 'rgba(245,158,11,.03)' }}>
                                                        <h3 style={{
                                                                fontFamily: 'Orbitron, sans-serif', fontSize: '13px', fontWeight: 700, color: DS.gold,
                                                                letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px',
                                                                display: 'flex', alignItems: 'center', gap: '8px'
                                                        }}>
                                                                ⚠ Weaknesses
                                                        </h3>
                                                        <ul style={{ paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                                {(evaluation.weaknesses || []).map((weakness, index) => (
                                                                        <li key={index} style={{
                                                                                display: 'flex', gap: '10px', fontSize: '13px', color: DS.textMuted,
                                                                                lineHeight: 1.6, padding: '8px 12px',
                                                                                background: 'rgba(245,158,11,.04)', borderRadius: '6px',
                                                                                border: '1px solid rgba(245,158,11,.1)',
                                                                        }}>
                                                                                <span style={{ color: DS.gold, marginTop: '2px', flexShrink: 0 }}>•</span>
                                                                                {weakness}
                                                                        </li>
                                                                ))}
                                                        </ul>
                                                </div>
                                        </div>

                                        {/* Row 6 — Issues + Suggestions + Missing */}
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '24px', animation: 'slideUp 0.5s 0.45s ease both' }}>

                                                {/* Issues */}
                                                <div style={{ ...cardStyle, borderColor: 'rgba(239,68,68,.2)', background: 'rgba(239,68,68,.03)' }}>
                                                        <h3 style={{
                                                                fontFamily: 'Orbitron, sans-serif', fontSize: '12px', fontWeight: 700, color: '#ef4444',
                                                                letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '14px'
                                                        }}>
                                                                🚨 Issues Detected
                                                        </h3>
                                                        <ul style={{ paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                                {(evaluation.issues_detected || []).map((issue, index) => (
                                                                        <li key={index} style={{ display: 'flex', gap: '8px', fontSize: '13px', color: DS.textMuted, lineHeight: 1.6 }}>
                                                                                <span style={{ color: '#ef4444', flexShrink: 0 }}>!</span>{issue}
                                                                        </li>
                                                                ))}
                                                        </ul>
                                                </div>

                                                {/* Suggestions */}
                                                <div style={{ ...cardStyle, borderColor: 'rgba(0,229,255,.2)', background: 'rgba(0,229,255,.03)' }}>
                                                        <h3 style={{
                                                                fontFamily: 'Orbitron, sans-serif', fontSize: '12px', fontWeight: 700, color: DS.cyan,
                                                                letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '14px'
                                                        }}>
                                                                💡 Suggestions
                                                        </h3>
                                                        <ul style={{ paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                                {(evaluation.suggestions || []).map((suggestion, index) => (
                                                                        <li key={index} style={{ display: 'flex', gap: '8px', fontSize: '13px', color: DS.textMuted, lineHeight: 1.6 }}>
                                                                                <span style={{ color: DS.cyan, flexShrink: 0 }}>→</span>{suggestion}
                                                                        </li>
                                                                ))}
                                                        </ul>
                                                </div>

                                                {/* Missing Elements */}
                                                <div style={{ ...cardStyle, borderColor: 'rgba(168,85,247,.2)', background: 'rgba(168,85,247,.03)' }}>
                                                        <h3 style={{
                                                                fontFamily: 'Orbitron, sans-serif', fontSize: '12px', fontWeight: 700, color: DS.purple2,
                                                                letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '14px'
                                                        }}>
                                                                🔍 Missing Elements
                                                        </h3>
                                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                                                {(evaluation.missing_elements || []).map((element, index) => (
                                                                        <span key={index} style={{
                                                                                padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 600,
                                                                                background: 'rgba(168,85,247,.1)', color: DS.purple2,
                                                                                border: '1px solid rgba(168,85,247,.25)',
                                                                        }}>
                                                                                {element}
                                                                        </span>
                                                                ))}
                                                        </div>
                                                </div>
                                        </div>

                                        {/* Row 7 — Original vs Improved Prompt */}
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px', animation: 'slideUp 0.5s 0.5s ease both' }}>

                                                {/* Original Prompt */}
                                                <div style={cardStyle}>
                                                        <h3 style={{
                                                                fontFamily: 'Orbitron, sans-serif', fontSize: '13px', fontWeight: 700, color: DS.textMuted,
                                                                letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '14px',
                                                                display: 'flex', alignItems: 'center', gap: '8px'
                                                        }}>
                                                                📝 Your Original Prompt
                                                        </h3>
                                                        <div style={{
                                                                padding: '16px', background: 'rgba(0,0,0,0.5)',
                                                                border: '1px solid rgba(255,255,255,.06)', borderRadius: '10px',
                                                                maxHeight: '320px', overflowY: 'auto',
                                                        }}>
                                                                <p style={{ fontSize: '13px', color: DS.textMuted, fontFamily: 'monospace', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                                                                        {userPrompt || 'Your original prompt'}
                                                                </p>
                                                        </div>
                                                </div>

                                                {/* AI Improved Prompt */}
                                                <div style={{ ...cardStyle, borderColor: 'rgba(0,229,255,0.25)', background: 'rgba(0,229,255,0.03)' }}>
                                                        <h3 style={{
                                                                fontFamily: 'Orbitron, sans-serif', fontSize: '13px', fontWeight: 700, color: DS.cyan,
                                                                letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '14px',
                                                                display: 'flex', alignItems: 'center', gap: '8px'
                                                        }}>
                                                                ✨ AI Improved Prompt
                                                        </h3>
                                                        <div style={{
                                                                padding: '16px', background: 'rgba(0,0,0,0.5)',
                                                                border: '1px solid rgba(0,229,255,.15)', borderRadius: '10px',
                                                                maxHeight: '320px', overflowY: 'auto',
                                                        }}>
                                                                <p style={{ fontSize: '13px', color: DS.textPrimary, fontFamily: 'monospace', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                                                                        {evaluation.ai_improved_prompt || 'Enhanced version with best practices applied.'}
                                                                </p>
                                                        </div>
                                                </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', animation: 'slideUp 0.5s 0.55s ease both' }}>
                                                <button
                                                        onClick={() => navigate('/problem-mode')}
                                                        style={{
                                                                padding: '14px 36px', borderRadius: '8px', border: 'none',
                                                                background: 'linear-gradient(135deg, #00e5ff, #00b8cc)',
                                                                color: '#000', fontFamily: 'DM Sans, sans-serif',
                                                                fontWeight: 600, fontSize: '15px', cursor: 'pointer',
                                                                boxShadow: '0 0 20px rgba(0,229,255,.35)',
                                                                transition: 'transform .2s, box-shadow .2s',
                                                        }}
                                                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 40px rgba(0,229,255,.5)'; }}
                                                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(0,229,255,.35)'; }}
                                                >
                                                        🚀 Try New Challenge
                                                </button>
                                                <button
                                                        onClick={() => navigate(-1)}
                                                        style={{
                                                                padding: '14px 36px', borderRadius: '8px',
                                                                background: 'transparent', color: DS.cyan,
                                                                border: '1px solid rgba(0,229,255,.3)',
                                                                fontFamily: 'DM Sans, sans-serif', fontWeight: 600,
                                                                fontSize: '15px', cursor: 'pointer', transition: 'all .2s',
                                                        }}
                                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,229,255,.08)'}
                                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                                >
                                                        ← Improve This Prompt
                                                </button>
                                        </div>

                                </div>
                        </main>
                </div>
        );
}
