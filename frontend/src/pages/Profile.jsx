import { useState, useEffect } from 'react';
import {
        LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
        ResponsiveContainer, PieChart, Pie, Cell,
        RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from 'recharts';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Toast from '../components/Toast';
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

const PIE_COLORS = ['#00e5ff', '#a855f7', '#22c55e', '#f59e0b', '#ec4899'];

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

export default function Profile() {
        const { user } = useAuth();
        const [profileData, setProfileData] = useState(null);
        const [isLoading, setIsLoading] = useState(true);
        const [isEditing, setIsEditing] = useState(false);
        const [formData, setFormData] = useState({ name: '', bio: '' });
        const [toast, setToast] = useState({ message: '', type: 'success', visible: false });

        useEffect(() => {
                fetchProfile();
                const style = document.createElement('style');
                style.id = 'pf-profile-fonts';
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
      @keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
      .pf-input::placeholder { color: #64748b; }
      .pf-input:focus {
        border-color: rgba(0,229,255,.5) !important;
        box-shadow: 0 0 0 3px rgba(0,229,255,.08) !important;
        outline: none;
      }
      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-track { background: #040610; }
      ::-webkit-scrollbar-thumb { background: #00b8cc; border-radius: 4px; }
    `;
                if (!document.getElementById('pf-profile-fonts')) {
                        document.head.appendChild(style);
                }
        }, []);

        const fetchProfile = async () => {
                try {
                        const response = await api.get('/api/profile');
                        setProfileData(response.data);
                        setFormData({ name: response.data.name || '', bio: response.data.bio || '' });
                } catch (error) {
                        console.error('Failed to fetch profile:', error);
                        if (error.response?.status === 404 || error.response?.status === 500) {
                                const fallbackData = {
                                        name: user?.email?.split('@')[0] || 'User', bio: '',
                                        level: 1, xp: 0, total_attempts: 0, average_score: 0, streak: 0,
                                        badges: [], joined_date: new Date().toISOString(), recent_scores: [],
                                        category_stats: {
                                                'Prompt Engineering': { completed: 0, avg_score: 0 },
                                                'Technical Challenges': { completed: 0, avg_score: 0 },
                                                'System Design': { completed: 0, avg_score: 0 },
                                        },
                                        skill_levels: { clarity: 0, specificity: 0, effectiveness: 0, problem_solving: 0, code_quality: 0 },
                                };
                                setProfileData(fallbackData);
                                setFormData({ name: fallbackData.name, bio: fallbackData.bio });
                        }
                } finally {
                        setIsLoading(false);
                }
        };

        const handleSave = async () => {
                try {
                        await api.put('/api/profile', formData);
                        setProfileData({ ...profileData, ...formData });
                        setIsEditing(false);
                        setToast({ message: 'Profile updated successfully! ✓', type: 'success', visible: true });
                } catch (error) {
                        setToast({ message: error?.response?.data?.detail || 'Failed to update profile.', type: 'error', visible: true });
                }
        };

        const calculateProfileStrength = () => {
                if (!profileData) return 0;
                let strength = 0;
                if (profileData.name) strength += 10;
                if (profileData.bio && profileData.bio.length > 20) strength += 10;
                strength += Math.min((profileData.total_attempts || 0) / 10 * 30, 30);
                strength += (profileData.average_score || 0) / 100 * 25;
                strength += Math.min((profileData.streak || 0) / 7 * 15, 15);
                strength += Math.min((profileData.badges?.length || 0) / 5 * 10, 10);
                return Math.round(strength);
        };

        const profileStrength = calculateProfileStrength();

        const recentPerformanceData = profileData?.recent_scores?.slice(-10).map((score, idx) => ({
                challenge: `#${idx + 1}`, score,
        })) || [];

        const categoryData = Object.entries(profileData?.category_stats || {}).map(([name, stats]) => ({
                name, completed: stats.completed, avgScore: stats.avg_score,
        }));

        const skillRadarData = Object.entries(profileData?.skill_levels || {}).map(([skill, level]) => ({
                skill: skill.charAt(0).toUpperCase() + skill.slice(1).replace('_', ' '), level,
        }));

        const CircularProgress = ({ score, size = 120, strokeWidth = 8 }) => {
                const radius = (size - strokeWidth) / 2;
                const circumference = radius * 2 * Math.PI;
                const offset = circumference - (score / 100) * circumference;
                const getColor = (s) => {
                        if (s >= 80) return '#22c55e';
                        if (s >= 60) return '#00e5ff';
                        if (s >= 40) return '#f59e0b';
                        return '#ef4444';
                };
                return (
                        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                                <circle cx={size / 2} cy={size / 2} r={radius}
                                        fill="none" stroke="rgba(255,255,255,.06)" strokeWidth={strokeWidth} />
                                <circle cx={size / 2} cy={size / 2} r={radius}
                                        fill="none" stroke={getColor(score)} strokeWidth={strokeWidth}
                                        strokeDasharray={circumference} strokeDashoffset={offset}
                                        strokeLinecap="round"
                                        style={{ transition: 'stroke-dashoffset 1s ease', filter: `drop-shadow(0 0 6px ${getColor(score)})` }} />
                        </svg>
                );
        };

        if (isLoading) {
                return (
                        <div style={{ display: 'flex', minHeight: '100vh', background: DS.bg, fontFamily: 'DM Sans, sans-serif' }}>
                                <Sidebar />
                                <main style={{ flex: 1, marginLeft: '256px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <div style={{ textAlign: 'center' }}>
                                                <div style={{
                                                        width: '56px', height: '56px', margin: '0 auto 16px',
                                                        border: '3px solid rgba(0,229,255,.15)', borderTop: '3px solid #00e5ff',
                                                        borderRadius: '50%', animation: 'spin 0.8s linear infinite',
                                                }} />
                                                <p style={{ color: DS.textMuted, fontSize: '14px' }}>Loading profile...</p>
                                        </div>
                                </main>
                        </div>
                );
        }

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

                                        {/* Page Title */}
                                        <header style={{ marginBottom: '32px', animation: 'slideUp 0.7s ease both' }}>
                                                <div style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                                                        padding: '6px 16px', border: '1px solid rgba(0,229,255,.25)',
                                                        borderRadius: '999px', background: 'rgba(0,229,255,.06)',
                                                        fontSize: '13px', color: DS.cyan, letterSpacing: '.5px', marginBottom: '12px',
                                                }}>
                                                        👤 Your Profile
                                                </div>
                                                <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '40px', fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>
                                                        Profile & <span style={gradientText}>Progress</span>
                                                </h1>
                                        </header>

                                        {/* Row 1 — Profile Card + Stats */}
                                        <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '24px', marginBottom: '24px', animation: 'slideUp 0.5s 0.1s ease both' }}>

                                                {/* Profile Card */}
                                                <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: '20px' }}>

                                                        {/* Avatar + Name */}
                                                        <div style={{ textAlign: 'center' }}>
                                                                <div style={{
                                                                        width: '88px', height: '88px', borderRadius: '50%', margin: '0 auto 16px',
                                                                        background: 'linear-gradient(135deg, #00e5ff, #a855f7)',
                                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                        fontSize: '36px', fontWeight: 900, color: '#000',
                                                                        fontFamily: 'Orbitron, sans-serif',
                                                                        boxShadow: '0 0 30px rgba(0,229,255,.4)',
                                                                        animation: 'glowPulse 2s ease-in-out infinite',
                                                                }}>
                                                                        {(profileData?.name || user?.email || 'U').charAt(0).toUpperCase()}
                                                                </div>

                                                                {isEditing ? (
                                                                        <input
                                                                                className="pf-input"
                                                                                value={formData.name}
                                                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                                                style={{
                                                                                        width: '100%', padding: '10px 14px',
                                                                                        background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(0,229,255,.15)',
                                                                                        borderRadius: '8px', color: DS.textPrimary,
                                                                                        fontFamily: 'Orbitron, sans-serif', fontSize: '16px', fontWeight: 700,
                                                                                        textAlign: 'center', marginBottom: '10px', boxSizing: 'border-box',
                                                                                }}
                                                                                placeholder="Your name"
                                                                        />
                                                                ) : (
                                                                        <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                                                                                {profileData?.name || user?.email?.split('@')[0] || 'User'}
                                                                        </h2>
                                                                )}

                                                                <span style={{
                                                                        padding: '3px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 600,
                                                                        background: 'rgba(0,229,255,.08)', color: DS.cyan, border: '1px solid rgba(0,229,255,.2)',
                                                                }}>
                                                                        Level {profileData?.level || 1}
                                                                </span>
                                                        </div>

                                                        {/* Bio */}
                                                        <div>
                                                                <p style={{
                                                                        fontFamily: 'Orbitron, sans-serif', fontSize: '11px', color: DS.textMuted,
                                                                        letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px'
                                                                }}>Bio</p>
                                                                {isEditing ? (
                                                                        <textarea
                                                                                className="pf-input"
                                                                                value={formData.bio}
                                                                                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                                                                rows={3}
                                                                                style={{
                                                                                        width: '100%', padding: '10px 14px',
                                                                                        background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(0,229,255,.15)',
                                                                                        borderRadius: '8px', color: DS.textPrimary,
                                                                                        fontFamily: 'DM Sans, sans-serif', fontSize: '14px',
                                                                                        resize: 'none', boxSizing: 'border-box',
                                                                                }}
                                                                                placeholder="Tell us about yourself..."
                                                                        />
                                                                ) : (
                                                                        <p style={{ color: DS.textMuted, fontSize: '14px', lineHeight: 1.7 }}>
                                                                                {profileData?.bio || 'No bio added yet. Click Edit to add one.'}
                                                                        </p>
                                                                )}
                                                        </div>

                                                        {/* Email (read-only) */}
                                                        <div>
                                                                <p style={{
                                                                        fontFamily: 'Orbitron, sans-serif', fontSize: '11px', color: DS.textMuted,
                                                                        letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px'
                                                                }}>Email</p>
                                                                <div style={{
                                                                        padding: '10px 14px', background: 'rgba(0,0,0,0.3)',
                                                                        border: '1px solid rgba(255,255,255,.05)', borderRadius: '8px',
                                                                        fontSize: '13px', color: DS.textMuted,
                                                                }}>
                                                                        {user?.email}
                                                                </div>
                                                                <p style={{ fontSize: '11px', color: DS.textMuted, marginTop: '4px' }}>Email cannot be changed</p>
                                                        </div>

                                                        {/* Profile Strength */}
                                                        <div>
                                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                                        <p style={{
                                                                                fontFamily: 'Orbitron, sans-serif', fontSize: '11px', color: DS.textMuted,
                                                                                letterSpacing: '1px', textTransform: 'uppercase'
                                                                        }}>Profile Strength</p>
                                                                        <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '13px', fontWeight: 700, ...gradientText }}>
                                                                                {profileStrength}%
                                                                        </span>
                                                                </div>
                                                                <div style={{ height: '6px', background: 'rgba(255,255,255,.06)', borderRadius: '6px', overflow: 'hidden' }}>
                                                                        <div style={{
                                                                                height: '100%', width: `${profileStrength}%`,
                                                                                background: 'linear-gradient(90deg, #00e5ff, #a855f7)',
                                                                                borderRadius: '6px', animation: 'fillBar 1.2s ease both',
                                                                        }} />
                                                                </div>
                                                                <p style={{ fontSize: '12px', color: DS.textMuted, marginTop: '8px' }}>
                                                                        {profileStrength < 30 && '🚀 Just getting started! Complete more challenges.'}
                                                                        {profileStrength >= 30 && profileStrength < 60 && '💪 Making progress! Keep up the good work.'}
                                                                        {profileStrength >= 60 && profileStrength < 85 && "🌟 Looking great! You're on fire!"}
                                                                        {profileStrength >= 85 && "🏆 Exceptional profile! You're a master!"}
                                                                </p>
                                                        </div>

                                                        {/* Edit / Save Buttons */}
                                                        <div style={{ display: 'flex', gap: '10px' }}>
                                                                {isEditing ? (
                                                                        <>
                                                                                <button
                                                                                        onClick={handleSave}
                                                                                        style={{
                                                                                                flex: 1, padding: '11px', borderRadius: '8px', border: 'none',
                                                                                                background: 'linear-gradient(135deg, #00e5ff, #00b8cc)',
                                                                                                color: '#000', fontFamily: 'DM Sans, sans-serif',
                                                                                                fontWeight: 600, fontSize: '14px', cursor: 'pointer',
                                                                                                boxShadow: '0 0 20px rgba(0,229,255,.35)',
                                                                                                transition: 'transform .2s',
                                                                                        }}
                                                                                        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                                                                                        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                                                                                >
                                                                                        ✓ Save Changes
                                                                                </button>
                                                                                <button
                                                                                        onClick={() => setIsEditing(false)}
                                                                                        style={{
                                                                                                flex: 1, padding: '11px', borderRadius: '8px',
                                                                                                background: 'transparent', color: DS.textMuted,
                                                                                                border: '1px solid rgba(255,255,255,.1)',
                                                                                                fontFamily: 'DM Sans, sans-serif', fontWeight: 600,
                                                                                                fontSize: '14px', cursor: 'pointer', transition: 'all .2s',
                                                                                        }}
                                                                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.05)'}
                                                                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                                                                >
                                                                                        Cancel
                                                                                </button>
                                                                        </>
                                                                ) : (
                                                                        <button
                                                                                onClick={() => setIsEditing(true)}
                                                                                style={{
                                                                                        width: '100%', padding: '11px', borderRadius: '8px',
                                                                                        background: 'transparent', color: DS.cyan,
                                                                                        border: '1px solid rgba(0,229,255,.3)',
                                                                                        fontFamily: 'DM Sans, sans-serif', fontWeight: 600,
                                                                                        fontSize: '14px', cursor: 'pointer', transition: 'all .2s',
                                                                                }}
                                                                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,229,255,.08)'}
                                                                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                                                        >
                                                                                ✏️ Edit Profile
                                                                        </button>
                                                                )}
                                                        </div>
                                                </div>

                                                {/* Stats Grid */}
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                                                        {/* Top 4 stat cards */}
                                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                                                                {[
                                                                        { icon: '🏆', label: 'Total Challenges', value: profileData?.total_attempts || 0, color: DS.cyan },
                                                                        { icon: '📈', label: 'Average Score', value: (profileData?.average_score || 0).toFixed(1), color: '#22c55e' },
                                                                        { icon: '⚡', label: 'Current Streak', value: profileData?.streak || 0, color: DS.gold },
                                                                        { icon: '💎', label: 'Total XP', value: profileData?.xp || 0, color: DS.purple2 },
                                                                ].map((stat, i) => (
                                                                        <div key={stat.label} style={{
                                                                                ...cardStyle, padding: '20px',
                                                                                animation: `slideUp 0.5s ${i * 0.08}s ease both`,
                                                                                transition: 'all 0.3s ease',
                                                                        }}
                                                                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,229,255,.1)'; }}
                                                                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                                                                        >
                                                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                                                        <span style={{ fontSize: '24px' }}>{stat.icon}</span>
                                                                                        <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '28px', fontWeight: 900, color: stat.color }}>
                                                                                                {stat.value}
                                                                                        </span>
                                                                                </div>
                                                                                <p style={{ fontSize: '12px', color: DS.textMuted, textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'Orbitron, sans-serif' }}>
                                                                                        {stat.label}
                                                                                </p>
                                                                        </div>
                                                                ))}
                                                        </div>

                                                        {/* XP Progress to next level */}
                                                        <div style={{ ...cardStyle, padding: '20px' }}>
                                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                                                        <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '12px', color: DS.cyan, letterSpacing: '1px', textTransform: 'uppercase' }}>
                                                                                XP Progress — Level {profileData?.level || 1}
                                                                        </p>
                                                                        <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '13px', fontWeight: 700, ...gradientText }}>
                                                                                {profileData?.xp || 0} XP
                                                                        </span>
                                                                </div>
                                                                <div style={{ height: '8px', background: 'rgba(255,255,255,.06)', borderRadius: '6px', overflow: 'hidden' }}>
                                                                        <div style={{
                                                                                height: '100%',
                                                                                width: `${Math.min(((profileData?.xp || 0) % 1000) / 10, 100)}%`,
                                                                                background: 'linear-gradient(90deg, #00e5ff, #a855f7)',
                                                                                borderRadius: '6px', animation: 'fillBar 1.5s ease both',
                                                                        }} />
                                                                </div>
                                                                <p style={{ fontSize: '12px', color: DS.textMuted, marginTop: '8px' }}>
                                                                        {1000 - ((profileData?.xp || 0) % 1000)} XP to next level
                                                                </p>
                                                        </div>

                                                        {/* Joined date */}
                                                        <div style={{ ...cardStyle, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                                        <span style={{ fontSize: '20px' }}>📅</span>
                                                                        <div>
                                                                                <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '11px', color: DS.textMuted, letterSpacing: '1px', textTransform: 'uppercase' }}>Member Since</p>
                                                                                <p style={{ fontSize: '14px', color: DS.textPrimary, fontWeight: 600 }}>
                                                                                        {profileData?.joined_date ? new Date(profileData.joined_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'}
                                                                                </p>
                                                                        </div>
                                                                </div>
                                                                <span style={{
                                                                        padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 600,
                                                                        background: 'rgba(0,229,255,.08)', color: DS.cyan, border: '1px solid rgba(0,229,255,.2)',
                                                                }}>
                                                                        Active
                                                                </span>
                                                        </div>
                                                </div>
                                        </div>

                                        {/* Row 2 — Performance Chart + Category Pie */}
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px', animation: 'slideUp 0.5s 0.2s ease both' }}>

                                                {/* Recent Performance */}
                                                <div style={cardStyle}>
                                                        <h3 style={{
                                                                fontFamily: 'Orbitron, sans-serif', fontSize: '14px', fontWeight: 700, color: '#fff',
                                                                letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '20px'
                                                        }}>
                                                                Recent Performance
                                                        </h3>
                                                        {recentPerformanceData.length > 0 ? (
                                                                <ResponsiveContainer width="100%" height={220}>
                                                                        <AreaChart data={recentPerformanceData}>
                                                                                <defs>
                                                                                        <linearGradient id="perfGrad" x1="0" y1="0" x2="0" y2="1">
                                                                                                <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.3} />
                                                                                                <stop offset="95%" stopColor="#00e5ff" stopOpacity={0} />
                                                                                        </linearGradient>
                                                                                </defs>
                                                                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,229,255,.06)" />
                                                                                <XAxis dataKey="challenge" tick={{ fill: DS.textMuted, fontSize: 11 }} />
                                                                                <YAxis domain={[0, 100]} tick={{ fill: DS.textMuted, fontSize: 11 }} />
                                                                                <Tooltip content={<CustomTooltip />} />
                                                                                <Area type="monotone" dataKey="score" stroke="#00e5ff" strokeWidth={2}
                                                                                        fill="url(#perfGrad)" dot={{ fill: '#00e5ff', r: 4 }} />
                                                                        </AreaChart>
                                                                </ResponsiveContainer>
                                                        ) : (
                                                                <div style={{ height: '220px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                                                        <p style={{ fontSize: '32px', marginBottom: '8px' }}>📊</p>
                                                                        <p style={{ color: DS.textMuted, fontSize: '14px' }}>Complete challenges to see performance trends</p>
                                                                </div>
                                                        )}
                                                </div>

                                                {/* Category Distribution */}
                                                <div style={cardStyle}>
                                                        <h3 style={{
                                                                fontFamily: 'Orbitron, sans-serif', fontSize: '14px', fontWeight: 700, color: '#fff',
                                                                letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '20px'
                                                        }}>
                                                                Category Distribution
                                                        </h3>
                                                        {categoryData.some(c => c.completed > 0) ? (
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                                                        <ResponsiveContainer width="50%" height={200}>
                                                                                <PieChart>
                                                                                        <Pie data={categoryData} dataKey="completed" nameKey="name"
                                                                                                cx="50%" cy="50%" outerRadius={80} strokeWidth={0}>
                                                                                                {categoryData.map((_, index) => (
                                                                                                        <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                                                                                ))}
                                                                                        </Pie>
                                                                                        <Tooltip content={<CustomTooltip />} />
                                                                                </PieChart>
                                                                        </ResponsiveContainer>
                                                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                                                {categoryData.map((cat, i) => (
                                                                                        <div key={cat.name} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                                                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: PIE_COLORS[i % PIE_COLORS.length], flexShrink: 0 }} />
                                                                                                <div style={{ flex: 1 }}>
                                                                                                        <p style={{ fontSize: '12px', color: DS.textPrimary, marginBottom: '1px' }}>{cat.name}</p>
                                                                                                        <p style={{ fontSize: '11px', color: DS.textMuted }}>{cat.completed} completed</p>
                                                                                                </div>
                                                                                        </div>
                                                                                ))}
                                                                        </div>
                                                                </div>
                                                        ) : (
                                                                <div style={{ height: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                                                        <p style={{ fontSize: '32px', marginBottom: '8px' }}>🎯</p>
                                                                        <p style={{ color: DS.textMuted, fontSize: '14px' }}>No category data yet</p>
                                                                </div>
                                                        )}
                                                </div>
                                        </div>

                                        {/* Row 3 — Skill Radar + Skill Level Bars */}
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px', animation: 'slideUp 0.5s 0.3s ease both' }}>

                                                {/* Skill Radar */}
                                                <div style={cardStyle}>
                                                        <h3 style={{
                                                                fontFamily: 'Orbitron, sans-serif', fontSize: '14px', fontWeight: 700, color: '#fff',
                                                                letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '20px'
                                                        }}>
                                                                Skill Radar
                                                        </h3>
                                                        {skillRadarData.length > 0 ? (
                                                                <ResponsiveContainer width="100%" height={260}>
                                                                        <RadarChart data={skillRadarData}>
                                                                                <PolarGrid stroke="rgba(0,229,255,.1)" />
                                                                                <PolarAngleAxis dataKey="skill" tick={{ fill: DS.textMuted, fontSize: 11, fontFamily: 'DM Sans' }} />
                                                                                <PolarRadiusAxis domain={[0, 100]} tick={{ fill: DS.textMuted, fontSize: 10 }} />
                                                                                <Radar name="Level" dataKey="level" stroke="#00e5ff"
                                                                                        fill="rgba(0,229,255,0.15)" fillOpacity={0.6} />
                                                                        </RadarChart>
                                                                </ResponsiveContainer>
                                                        ) : (
                                                                <div style={{ height: '260px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                                                        <p style={{ fontSize: '32px', marginBottom: '8px' }}>🕸️</p>
                                                                        <p style={{ color: DS.textMuted, fontSize: '14px' }}>Complete challenges to build your radar</p>
                                                                </div>
                                                        )}
                                                </div>

                                                {/* Skill Level Bars with Circular Progress */}
                                                <div style={cardStyle}>
                                                        <h3 style={{
                                                                fontFamily: 'Orbitron, sans-serif', fontSize: '14px', fontWeight: 700, color: '#fff',
                                                                letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '20px'
                                                        }}>
                                                                Skill Breakdown
                                                        </h3>
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                                                {skillRadarData.map(({ skill, level }) => (
                                                                        <div key={skill}>
                                                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                                                                        <span style={{ fontSize: '13px', color: DS.textMuted }}>{skill}</span>
                                                                                        <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '13px', fontWeight: 700, ...gradientText }}>
                                                                                                {level}
                                                                                        </span>
                                                                                </div>
                                                                                <div style={{ height: '6px', background: 'rgba(255,255,255,.06)', borderRadius: '6px', overflow: 'hidden' }}>
                                                                                        <div style={{
                                                                                                height: '100%', width: `${level}%`,
                                                                                                background: 'linear-gradient(90deg, #00e5ff, #a855f7)',
                                                                                                borderRadius: '6px', animation: 'fillBar 1s ease both',
                                                                                                transition: 'width .8s ease',
                                                                                        }} />
                                                                                </div>
                                                                        </div>
                                                                ))}
                                                        </div>
                                                </div>
                                        </div>

                                        {/* Row 4 — Badges */}
                                        <div style={{ ...cardStyle, animation: 'slideUp 0.5s 0.4s ease both' }}>
                                                <h3 style={{
                                                        fontFamily: 'Orbitron, sans-serif', fontSize: '14px', fontWeight: 700, color: '#fff',
                                                        letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '20px',
                                                        display: 'flex', alignItems: 'center', gap: '10px'
                                                }}>
                                                        🏅 Badges
                                                        <span style={{
                                                                padding: '2px 10px', borderRadius: '999px', fontSize: '11px',
                                                                background: 'rgba(0,229,255,.08)', color: DS.cyan, border: '1px solid rgba(0,229,255,.2)',
                                                        }}>
                                                                {profileData?.badges?.length || 0} earned
                                                        </span>
                                                </h3>

                                                {/* Earned Badges */}
                                                {profileData?.badges && profileData.badges.length > 0 ? (
                                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px', marginBottom: '24px' }}>
                                                                {profileData.badges.map((badge, index) => (
                                                                        <div key={index} style={{
                                                                                padding: '16px', borderRadius: '12px',
                                                                                background: 'rgba(0,229,255,.05)',
                                                                                border: '1px solid rgba(0,229,255,.2)',
                                                                                textAlign: 'center', transition: 'all 0.3s ease',
                                                                        }}
                                                                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(0,229,255,.4)'; }}
                                                                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(0,229,255,.2)'; }}
                                                                        >
                                                                                <div style={{ fontSize: '32px', marginBottom: '8px' }}>{badge.icon || '🏆'}</div>
                                                                                <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '12px', fontWeight: 700, color: DS.cyan, marginBottom: '4px' }}>
                                                                                        {badge.name}
                                                                                </p>
                                                                                <p style={{ fontSize: '11px', color: DS.textMuted, lineHeight: 1.5 }}>{badge.description}</p>
                                                                        </div>
                                                                ))}
                                                        </div>
                                                ) : (
                                                        <div style={{ textAlign: 'center', padding: '32px 0', marginBottom: '24px' }}>
                                                                <p style={{ fontSize: '32px', marginBottom: '8px' }}>🎯</p>
                                                                <p style={{ color: DS.textMuted, fontSize: '14px' }}>Complete challenges to earn badges</p>
                                                        </div>
                                                )}

                                                {/* Locked Badges */}
                                                <div>
                                                        <p style={{
                                                                fontFamily: 'Orbitron, sans-serif', fontSize: '11px', color: DS.textMuted,
                                                                letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '14px'
                                                        }}>
                                                                🔒 Locked Badges
                                                        </p>
                                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
                                                                {[
                                                                        { icon: '🔥', name: 'Streak Master', desc: 'Maintain a 7-day streak' },
                                                                        { icon: '💯', name: 'Perfect Score', desc: 'Score 100 on any challenge' },
                                                                        { icon: '🚀', name: 'Speed Demon', desc: 'Complete 10 challenges in a day' },
                                                                        { icon: '🧠', name: 'Prompt Wizard', desc: 'Score 90+ on 5 consecutive challenges' },
                                                                ].map((badge, index) => (
                                                                        <div key={index} style={{
                                                                                padding: '16px', borderRadius: '12px',
                                                                                background: 'rgba(0,0,0,0.3)',
                                                                                border: '1px solid rgba(255,255,255,.05)',
                                                                                textAlign: 'center', opacity: 0.5,
                                                                        }}>
                                                                                <div style={{ fontSize: '32px', marginBottom: '8px', filter: 'grayscale(1)' }}>{badge.icon}</div>
                                                                                <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '12px', fontWeight: 700, color: DS.textMuted, marginBottom: '4px' }}>
                                                                                        {badge.name}
                                                                                </p>
                                                                                <p style={{ fontSize: '11px', color: DS.textMuted, lineHeight: 1.5 }}>{badge.desc}</p>
                                                                                <p style={{ fontSize: '10px', color: DS.textMuted, marginTop: '6px' }}>🔒 Locked</p>
                                                                        </div>
                                                                ))}
                                                        </div>
                                                </div>
                                        </div>

                                </div>
                        </main>

                        <Toast
                                message={toast.message}
                                type={toast.type}
                                isVisible={toast.visible}
                                onClose={() => setToast(t => ({ ...t, visible: false }))}
                        />
                </div>
        );
}
