import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Badge from '../components/Badge';
import RadarChart from '../components/RadarChart';
import { useAuth } from '../context/AuthContext';
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

export default function Dashboard() {
        const { user } = useAuth();
        const navigate = useNavigate();
        const [stats, setStats] = useState(null);
        const [history, setHistory] = useState([]);
        const [filter, setFilter] = useState('ALL');
        const [isLoading, setIsLoading] = useState(true);

        useEffect(() => {
                fetchDashboardData();
                const style = document.createElement('style');
                style.id = 'pf-dashboard-fonts';
                style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=DM+Sans:wght@400;500;600&display=swap');
      @keyframes slideUp {
        from { opacity: 0; transform: translateY(32px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes glowPulse {
        0%, 100% { box-shadow: 0 0 10px rgba(0,229,255,.3); }
        50%       { box-shadow: 0 0 30px rgba(0,229,255,.6); }
      }
      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-track { background: #040610; }
      ::-webkit-scrollbar-thumb { background: #00b8cc; border-radius: 4px; }
    `;
                if (!document.getElementById('pf-dashboard-fonts')) {
                        document.head.appendChild(style);
                }
        }, []);

        const fetchDashboardData = async () => {
                try {
                        const response = await api.get('/api/profile');
                        console.log('Dashboard data:', response.data);
                        setStats(response.data);
                        setHistory(response.data.attempts || []);
                } catch (error) {
                        console.error('Failed to fetch dashboard data:', error);
                } finally {
                        setIsLoading(false);
                }
        };

        const getCategoryFromSource = (source) => {
                const sourceLower = (source || '').toLowerCase();
                if (sourceLower.includes('dsa')) return 'DSA';
                if (sourceLower.includes('dbms')) return 'DBMS';
                if (sourceLower.includes('daa')) return 'DAA';
                if (sourceLower.includes('technical')) return 'Technical';
                return 'Problem';
        };

        const statsCards = [
                { label: 'Total Challenges', value: stats?.total_challenges || '0', change: '+12 this week', positive: true, icon: '💻', accentRgb: '0,229,255' },
                { label: 'Average Score', value: stats?.average_score?.toFixed(1) || '0', change: '+5.2% from last week', positive: true, icon: '📈', accentRgb: '34,197,94' },
                { label: 'Current Streak', value: stats?.streak || '0', change: '🔥 Keep it going!', positive: true, icon: '⚡', accentRgb: '245,158,11' },
                { label: 'Skill Level', value: stats?.user?.level || 'Beginner', change: '🎯 Top 15%', positive: true, icon: '🏆', accentRgb: '168,85,247' },
        ];

        const filteredHistory = history.filter((item) => {
                if (filter === 'ALL') return true;
                const category = getCategoryFromSource(item.problem_source);
                return category === filter;
        });

        const viewAttemptDetail = (attemptId) => {
                navigate(`/attempt/${attemptId}`);
        };

        if (isLoading) {
                return (
                        <div style={{ display: 'flex', minHeight: '100vh', background: DS.bg, fontFamily: 'DM Sans, sans-serif' }}>
                                <Sidebar />
                                <main style={{ flex: 1, marginLeft: '256px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <div style={{ textAlign: 'center' }}>
                                                <div style={{
                                                        width: '56px', height: '56px', margin: '0 auto 16px',
                                                        border: '3px solid rgba(0,229,255,0.15)',
                                                        borderTop: '3px solid #00e5ff',
                                                        borderRadius: '50%',
                                                        animation: 'spin 0.8s linear infinite',
                                                }} />
                                                <p style={{ color: DS.textMuted, fontSize: '14px' }}>Loading dashboard...</p>
                                        </div>
                                </main>
                        </div>
                );
        }

        return (
                <div style={{
                        display: 'flex', minHeight: '100vh',
                        background: DS.bg,
                        backgroundImage: 'linear-gradient(rgba(0,229,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,.04) 1px, transparent 1px)',
                        backgroundSize: '60px 60px',
                        fontFamily: 'DM Sans, sans-serif',
                }}>
                        <Sidebar />

                        {/* Background glow blobs */}
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
                                                <h1 style={{
                                                        fontFamily: 'Orbitron, sans-serif', fontSize: '40px', fontWeight: 900,
                                                        color: '#fff', marginBottom: '8px', letterSpacing: '-1px',
                                                }}>
                                                        Welcome back,{' '}
                                                        <span style={gradientText}>{user?.email?.split('@')[0] || 'User'}</span> 👋
                                                </h1>
                                                <p style={{ color: DS.textMuted, fontSize: '15px' }}>
                                                        Track your prompt engineering progress and improve your skills
                                                </p>
                                        </header>

                                        {/* Stats Grid */}
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '28px' }}>
                                                {statsCards.map((stat, index) => (
                                                        <div
                                                                key={stat.label}
                                                                style={{
                                                                        ...cardStyle,
                                                                        animation: `slideUp 0.5s ${index * 0.1}s ease both`,
                                                                        borderColor: `rgba(${stat.accentRgb}, 0.2)`,
                                                                        transition: 'all 0.3s ease',
                                                                        cursor: 'default',
                                                                }}
                                                                onMouseEnter={e => {
                                                                        e.currentTarget.style.transform = 'translateY(-4px)';
                                                                        e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,229,255,.1), 0 0 0 1px rgba(0,229,255,.25)';
                                                                        e.currentTarget.style.borderColor = 'rgba(0,229,255,.3)';
                                                                }}
                                                                onMouseLeave={e => {
                                                                        e.currentTarget.style.transform = 'translateY(0)';
                                                                        e.currentTarget.style.boxShadow = 'none';
                                                                        e.currentTarget.style.borderColor = `rgba(${stat.accentRgb}, 0.2)`;
                                                                }}
                                                        >
                                                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                                                                        <div style={{ fontSize: '28px' }}>{stat.icon}</div>
                                                                        <div style={{
                                                                                fontFamily: 'Orbitron, sans-serif', fontSize: '28px', fontWeight: 900,
                                                                                ...gradientText,
                                                                        }}>
                                                                                {stat.value}
                                                                        </div>
                                                                </div>
                                                                <h3 style={{ fontSize: '13px', color: DS.textMuted, marginBottom: '4px' }}>{stat.label}</h3>
                                                                <p style={{ fontSize: '12px', color: '#22c55e' }}>{stat.change}</p>
                                                        </div>
                                                ))}
                                        </div>

                                        {/* Charts Row */}
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>

                                                {/* Skill Distribution */}
                                                <div style={{ ...cardStyle, animation: 'slideUp 0.7s 0.2s ease both' }}>
                                                        <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>
                                                                Skill Distribution
                                                        </h3>
                                                        {history.length > 0 ? (
                                                                <RadarChart data={[
                                                                        { subject: 'Clarity', score: Math.min(100, stats?.average_score || 0), fullMark: 100 },
                                                                        { subject: 'Structure', score: Math.min(100, (stats?.average_score || 0) * 0.95), fullMark: 100 },
                                                                        { subject: 'Specificity', score: Math.min(100, (stats?.average_score || 0) * 1.05), fullMark: 100 },
                                                                        { subject: 'Context', score: Math.min(100, (stats?.average_score || 0) * 0.9), fullMark: 100 },
                                                                        { subject: 'Technical', score: Math.min(100, (stats?.average_score || 0) * 1.1), fullMark: 100 },
                                                                        { subject: 'Creativity', score: Math.min(100, (stats?.average_score || 0) * 0.88), fullMark: 100 },
                                                                ]} />
                                                        ) : (
                                                                <div style={{ height: '240px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                                                        <p style={{ fontSize: '32px' }}>📊</p>
                                                                        <p style={{ color: DS.textMuted, fontSize: '14px' }}>Complete challenges to see your skill distribution</p>
                                                                </div>
                                                        )}
                                                </div>

                                                {/* Recent Activity */}
                                                <div style={{ ...cardStyle, animation: 'slideUp 0.7s 0.3s ease both' }}>
                                                        <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>
                                                                Recent Activity
                                                        </h3>
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                                {history.slice(0, 5).length > 0 ? (
                                                                        history.slice(0, 5).map((attempt) => (
                                                                                <div
                                                                                        key={attempt.id}
                                                                                        style={{
                                                                                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                                                                padding: '10px 12px', borderRadius: '10px',
                                                                                                background: 'rgba(0,0,0,0.3)',
                                                                                                border: '1px solid rgba(0,229,255,0.06)',
                                                                                                cursor: 'pointer', transition: 'all 0.2s',
                                                                                        }}
                                                                                        onClick={() => viewAttemptDetail(attempt.id)}
                                                                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,229,255,0.04)'}
                                                                                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.3)'}
                                                                                >
                                                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, overflow: 'hidden' }}>
                                                                                                <span style={{
                                                                                                        padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 600,
                                                                                                        background: 'rgba(0,229,255,0.08)', color: DS.cyan,
                                                                                                        border: '1px solid rgba(0,229,255,0.2)', whiteSpace: 'nowrap',
                                                                                                }}>
                                                                                                        {getCategoryFromSource(attempt.problem_source)}
                                                                                                </span>
                                                                                                <span style={{
                                                                                                        fontSize: '13px', color: DS.textPrimary,
                                                                                                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                                                                                }}>
                                                                                                        {attempt.problem_text.substring(0, 50)}...
                                                                                                </span>
                                                                                        </div>
                                                                                        <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '15px', fontWeight: 900, ...gradientText, marginLeft: '12px', whiteSpace: 'nowrap' }}>
                                                                                                {attempt.overall_score.toFixed(1)}
                                                                                        </div>
                                                                                </div>
                                                                        ))
                                                                ) : (
                                                                        <div style={{ textAlign: 'center', padding: '32px 0', color: DS.textMuted }}>
                                                                                <p style={{ fontSize: '28px', marginBottom: '8px' }}>🚀</p>
                                                                                <p style={{ fontSize: '14px' }}>No attempts yet. Start your first challenge!</p>
                                                                        </div>
                                                                )}
                                                        </div>
                                                </div>
                                        </div>

                                        {/* Challenge History Table */}
                                        <div style={{ ...cardStyle, animation: 'slideUp 0.7s 0.4s ease both' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                                                        <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '18px', fontWeight: 700, color: '#fff' }}>
                                                                Challenge History
                                                        </h3>
                                                        <div style={{ display: 'flex', gap: '8px' }}>
                                                                {['ALL'].map((f) => (
                                                                        <button
                                                                                key={f}
                                                                                onClick={() => setFilter(f)}
                                                                                style={{
                                                                                        padding: '8px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
                                                                                        fontFamily: 'DM Sans, sans-serif', cursor: 'pointer', transition: 'all 0.2s',
                                                                                        background: filter === f ? 'linear-gradient(135deg, #00e5ff, #00b8cc)' : 'rgba(0,0,0,0.4)',
                                                                                        color: filter === f ? '#000' : DS.textMuted,
                                                                                        border: filter === f ? 'none' : '1px solid rgba(0,229,255,0.15)',
                                                                                        boxShadow: filter === f ? '0 0 20px rgba(0,229,255,.35)' : 'none',
                                                                                }}
                                                                        >
                                                                                {f}
                                                                        </button>
                                                                ))}
                                                        </div>
                                                </div>

                                                <div style={{ overflowX: 'auto' }}>
                                                        {filteredHistory.length > 0 ? (
                                                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                                        <thead>
                                                                                <tr style={{ background: 'rgba(0,229,255,.06)' }}>
                                                                                        {['Date', 'Challenge', 'Category', 'Score', 'XP', 'Action'].map((h) => (
                                                                                                <th key={h} style={{
                                                                                                        padding: '12px 16px', textAlign: 'left',
                                                                                                        fontFamily: 'Orbitron, sans-serif', fontSize: '11px',
                                                                                                        color: DS.cyan, letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 700,
                                                                                                }}>{h}</th>
                                                                                        ))}
                                                                                </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                                {filteredHistory.map((attempt) => (
                                                                                        <tr
                                                                                                key={attempt.id}
                                                                                                style={{ borderBottom: '1px solid rgba(0,229,255,.06)', cursor: 'pointer', transition: 'background 0.2s' }}
                                                                                                onClick={() => viewAttemptDetail(attempt.id)}
                                                                                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,229,255,.03)'}
                                                                                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                                                                        >
                                                                                                <td style={{ padding: '14px 16px', fontSize: '13px', color: DS.textMuted }}>
                                                                                                        {new Date(attempt.created_at).toLocaleDateString()}
                                                                                                </td>
                                                                                                <td style={{ padding: '14px 16px', fontSize: '13px', color: DS.textPrimary, maxWidth: '320px' }}>
                                                                                                        <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                                                                {attempt.problem_text.substring(0, 60)}...
                                                                                                        </span>
                                                                                                </td>
                                                                                                <td style={{ padding: '14px 16px' }}>
                                                                                                        <span style={{
                                                                                                                padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 600,
                                                                                                                background: 'rgba(0,229,255,0.08)', color: DS.cyan,
                                                                                                                border: '1px solid rgba(0,229,255,0.2)',
                                                                                                        }}>
                                                                                                                {getCategoryFromSource(attempt.problem_source)}
                                                                                                        </span>
                                                                                                </td>
                                                                                                <td style={{ padding: '14px 16px' }}>
                                                                                                        <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '17px', fontWeight: 900, ...gradientText }}>
                                                                                                                {attempt.overall_score.toFixed(1)}
                                                                                                        </span>
                                                                                                </td>
                                                                                                <td style={{ padding: '14px 16px' }}>
                                                                                                        <span style={{ fontSize: '13px', color: DS.gold, fontWeight: 600 }}>
                                                                                                                +{attempt.xp_earned} XP
                                                                                                        </span>
                                                                                                </td>
                                                                                                <td style={{ padding: '14px 16px' }}>
                                                                                                        <button
                                                                                                                style={{
                                                                                                                        background: 'transparent', color: DS.cyan, border: 'none',
                                                                                                                        fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                                                                                                                        fontFamily: 'DM Sans, sans-serif', transition: 'color 0.2s',
                                                                                                                }}
                                                                                                                onClick={(e) => { e.stopPropagation(); viewAttemptDetail(attempt.id); }}
                                                                                                                onMouseEnter={e => e.currentTarget.style.color = DS.cyanDim}
                                                                                                                onMouseLeave={e => e.currentTarget.style.color = DS.cyan}
                                                                                                        >
                                                                                                                View Report →
                                                                                                        </button>
                                                                                                </td>
                                                                                        </tr>
                                                                                ))}
                                                                        </tbody>
                                                                </table>
                                                        ) : (
                                                                <div style={{ textAlign: 'center', padding: '48px 0' }}>
                                                                        <div style={{ fontSize: '56px', marginBottom: '16px' }}>📚</div>
                                                                        <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                                                                                No challenges found
                                                                        </p>
                                                                        <p style={{ color: DS.textMuted, fontSize: '14px', marginBottom: '24px' }}>
                                                                                {filter === 'ALL'
                                                                                        ? 'Start your journey by attempting your first challenge!'
                                                                                        : `No ${filter} challenges attempted yet.`}
                                                                        </p>
                                                                        <button
                                                                                onClick={() => navigate('/technical-challenge')}
                                                                                style={{
                                                                                        padding: '12px 28px', borderRadius: '8px',
                                                                                        background: 'linear-gradient(135deg, #00e5ff, #00b8cc)',
                                                                                        color: '#000', fontFamily: 'DM Sans, sans-serif',
                                                                                        fontWeight: 600, fontSize: '15px', border: 'none',
                                                                                        cursor: 'pointer', boxShadow: '0 0 20px rgba(0,229,255,.35)',
                                                                                        transition: 'transform .2s, box-shadow .2s',
                                                                                }}
                                                                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 40px rgba(0,229,255,.5)'; }}
                                                                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(0,229,255,.35)'; }}
                                                                        >
                                                                                Start Challenge
                                                                        </button>
                                                                </div>
                                                        )}
                                                </div>
                                        </div>

                                </div>
                        </main>
                </div>
        );
}
