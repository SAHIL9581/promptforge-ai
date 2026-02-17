import { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Toast from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Profile() {
        const { user } = useAuth();
        const [profileData, setProfileData] = useState(null);
        const [isLoading, setIsLoading] = useState(true);
        const [isEditing, setIsEditing] = useState(false);
        const [formData, setFormData] = useState({ name: '', bio: '' });
        const [toast, setToast] = useState({ message: '', type: 'success', visible: false });

        useEffect(() => {
                fetchProfile();
        }, []);

        const fetchProfile = async () => {
                try {
                        const response = await api.get('/api/profile');
                        setProfileData(response.data);
                        setFormData({
                                name: response.data.name || '',
                                bio: response.data.bio || '',
                        });
                } catch (error) {
                        console.error('Failed to fetch profile:', error);

                        // Enhanced fallback data
                        if (error.response?.status === 404 || error.response?.status === 500) {
                                const fallbackData = {
                                        name: user?.email?.split('@')[0] || 'User',
                                        bio: '',
                                        level: 1,
                                        xp: 0,
                                        total_attempts: 0,
                                        average_score: 0,
                                        streak: 0,
                                        badges: [],
                                        joined_date: new Date().toISOString(),
                                        recent_scores: [],
                                        category_stats: {
                                                'Prompt Engineering': { completed: 0, avg_score: 0 },
                                                'Technical Challenges': { completed: 0, avg_score: 0 },
                                                'System Design': { completed: 0, avg_score: 0 }
                                        },
                                        skill_levels: {
                                                clarity: 0,
                                                specificity: 0,
                                                effectiveness: 0,
                                                problem_solving: 0,
                                                code_quality: 0
                                        }
                                };
                                setProfileData(fallbackData);
                                setFormData({
                                        name: fallbackData.name,
                                        bio: fallbackData.bio,
                                });
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
                        setToast({
                                message: error?.response?.data?.detail || 'Failed to update profile.',
                                type: 'error',
                                visible: true,
                        });
                }
        };

        // Calculate profile strength (0-100)
        const calculateProfileStrength = () => {
                if (!profileData) return 0;

                let strength = 0;

                // Name and bio (20 points)
                if (profileData.name) strength += 10;
                if (profileData.bio && profileData.bio.length > 20) strength += 10;

                // Challenges completed (30 points)
                const challengeScore = Math.min((profileData.total_attempts || 0) / 10 * 30, 30);
                strength += challengeScore;

                // Average score (25 points)
                const avgScore = (profileData.average_score || 0) / 100 * 25;
                strength += avgScore;

                // Streak (15 points)
                const streakScore = Math.min((profileData.streak || 0) / 7 * 15, 15);
                strength += streakScore;

                // Badges (10 points)
                const badgeScore = Math.min((profileData.badges?.length || 0) / 5 * 10, 10);
                strength += badgeScore;

                return Math.round(strength);
        };

        const profileStrength = calculateProfileStrength();

        // Prepare chart data
        const recentPerformanceData = profileData?.recent_scores?.slice(-10).map((score, idx) => ({
                challenge: `#${idx + 1}`,
                score: score
        })) || [];

        const categoryData = Object.entries(profileData?.category_stats || {}).map(([name, stats]) => ({
                name,
                completed: stats.completed,
                avgScore: stats.avg_score
        }));

        const skillRadarData = Object.entries(profileData?.skill_levels || {}).map(([skill, level]) => ({
                skill: skill.charAt(0).toUpperCase() + skill.slice(1).replace('_', ' '),
                level: level
        }));

        // Circular Progress Component
        const CircularProgress = ({ score, size = 120, strokeWidth = 8 }) => {
                const radius = (size - strokeWidth) / 2;
                const circumference = radius * 2 * Math.PI;
                const offset = circumference - (score / 100) * circumference;

                const getColor = (score) => {
                        if (score >= 80) return '#10b981';
                        if (score >= 60) return '#06b6d4';
                        if (score >= 40) return '#f59e0b';
                        return '#ef4444';
                };

                return (
                        <svg width={size} height={size} className="transform -rotate-90">
                                <circle
                                        cx={size / 2}
                                        cy={size / 2}
                                        r={radius}
                                        stroke="currentColor"
                                        strokeWidth={strokeWidth}
                                        fill="none"
                                        className="text-bg-input"
                                />
                                <circle
                                        cx={size / 2}
                                        cy={size / 2}
                                        r={radius}
                                        stroke={getColor(score)}
                                        strokeWidth={strokeWidth}
                                        fill="none"
                                        strokeDasharray={circumference}
                                        strokeDashoffset={offset}
                                        className="transition-all duration-1000 ease-out"
                                        strokeLinecap="round"
                                />
                        </svg>
                );
        };

        if (isLoading) {
                return (
                        <div className="flex min-h-screen">
                                <Sidebar />
                                <main className="flex-1 ml-64 p-8 flex items-center justify-center">
                                        <div className="text-center">
                                                <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                                                <p className="text-text-secondary">Loading profile...</p>
                                        </div>
                                </main>
                        </div>
                );
        }

        return (
                <div className="flex min-h-screen">
                        <Sidebar />

                        <main className="flex-1 ml-64 p-8 bg-gradient-to-br from-bg-dark via-bg-card to-bg-dark">
                                <div className="max-w-7xl mx-auto">
                                        <header className="mb-8 animate-fade-in">
                                                <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-primary via-accent-cyan to-accent-pink bg-clip-text text-transparent">
                                                        Your Profile
                                                </h1>
                                                <p className="text-text-secondary">Track your journey and celebrate your achievements</p>
                                        </header>

                                        {/* Profile Strength Banner */}
                                        <Card className="p-6 mb-8 bg-gradient-to-br from-primary/5 via-accent-cyan/5 to-accent-pink/5 border-2 border-primary/20 animate-slide-up">
                                                <div className="flex items-center justify-between">
                                                        <div className="flex-1">
                                                                <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                                                                        <span className="text-2xl">⭐</span>
                                                                        Profile Strength
                                                                </h3>
                                                                <div className="flex items-center gap-4">
                                                                        <div className="flex-1 bg-bg-input rounded-full h-4 overflow-hidden">
                                                                                <div
                                                                                        className="h-full bg-gradient-to-r from-primary via-accent-cyan to-success transition-all duration-1000 ease-out"
                                                                                        style={{ width: `${profileStrength}%` }}
                                                                                ></div>
                                                                        </div>
                                                                        <span className="text-2xl font-bold text-primary min-w-[60px]">{profileStrength}%</span>
                                                                </div>
                                                                <p className="text-sm text-text-secondary mt-2">
                                                                        {profileStrength < 30 && "🚀 Just getting started! Complete more challenges."}
                                                                        {profileStrength >= 30 && profileStrength < 60 && "💪 Making progress! Keep up the good work."}
                                                                        {profileStrength >= 60 && profileStrength < 85 && "🌟 Looking great! You're on fire!"}
                                                                        {profileStrength >= 85 && "🏆 Exceptional profile! You're a master!"}
                                                                </p>
                                                        </div>
                                                        <div className="ml-6">
                                                                <CircularProgress score={profileStrength} size={100} strokeWidth={10} />
                                                        </div>
                                                </div>
                                        </Card>

                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                                {/* Left Column - Profile Card */}
                                                <div className="space-y-6">
                                                        {/* Profile Card */}
                                                        <Card className="p-6 animate-slide-up">
                                                                <div className="text-center">
                                                                        <div className="relative inline-block mb-4">
                                                                                <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent-cyan rounded-full flex items-center justify-center text-4xl font-bold text-white">
                                                                                        {formData.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                                                                                </div>
                                                                                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-success rounded-full flex items-center justify-center border-4 border-bg-card">
                                                                                        <span className="text-xs font-bold">L{profileData?.level || 1}</span>
                                                                                </div>
                                                                        </div>
                                                                        <h2 className="text-2xl font-bold mb-1">{formData.name || 'User'}</h2>
                                                                        <p className="text-text-secondary text-sm mb-3">{user?.email}</p>
                                                                        <Badge variant="default" className="mb-4">
                                                                                {profileData?.level < 5 ? '🌱 Beginner' : profileData?.level < 10 ? '⚡ Intermediate' : '🏆 Advanced'}
                                                                        </Badge>

                                                                        {/* XP Progress */}
                                                                        <div className="mt-4 p-3 bg-primary/5 rounded-xl">
                                                                                <div className="flex items-center justify-between mb-2">
                                                                                        <span className="text-xs text-text-secondary">XP Progress</span>
                                                                                        <span className="text-xs font-bold text-primary">{profileData?.xp || 0} / {(profileData?.level || 1) * 100}</span>
                                                                                </div>
                                                                                <div className="w-full bg-bg-input rounded-full h-2">
                                                                                        <div
                                                                                                className="h-full bg-gradient-to-r from-primary to-accent-cyan rounded-full transition-all duration-500"
                                                                                                style={{ width: `${((profileData?.xp || 0) / ((profileData?.level || 1) * 100)) * 100}%` }}
                                                                                        ></div>
                                                                                </div>
                                                                        </div>

                                                                        <div className="mt-6 pt-6 border-t border-border space-y-3">
                                                                                <div className="flex items-center justify-between">
                                                                                        <span className="text-sm text-text-secondary">Member Since</span>
                                                                                        <span className="text-sm font-semibold">
                                                                                                {new Date(profileData?.joined_date || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                                                                        </span>
                                                                                </div>
                                                                                <div className="flex items-center justify-between">
                                                                                        <span className="text-sm text-text-secondary">Total Attempts</span>
                                                                                        <span className="text-sm font-semibold text-primary">
                                                                                                {profileData?.total_attempts || 0}
                                                                                        </span>
                                                                                </div>
                                                                                <div className="flex items-center justify-between">
                                                                                        <span className="text-sm text-text-secondary">Avg Score</span>
                                                                                        <span className="text-sm font-semibold text-success">
                                                                                                {profileData?.average_score?.toFixed(1) || '0'}/100
                                                                                        </span>
                                                                                </div>
                                                                                <div className="flex items-center justify-between">
                                                                                        <span className="text-sm text-text-secondary">🔥 Streak</span>
                                                                                        <span className="text-sm font-semibold text-warning">
                                                                                                {profileData?.streak || 0} days
                                                                                        </span>
                                                                                </div>
                                                                        </div>
                                                                </div>
                                                        </Card>

                                                        {/* Quick Stats */}
                                                        <Card className="p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                                                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                                                        <span className="text-xl">⚡</span>
                                                                        Quick Stats
                                                                </h3>
                                                                <div className="space-y-3">
                                                                        <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                                                                                <span className="text-sm font-medium">Best Score</span>
                                                                                <span className="text-lg font-bold text-primary">
                                                                                        {Math.max(...(profileData?.recent_scores || [0]))}
                                                                                </span>
                                                                        </div>
                                                                        <div className="flex items-center justify-between p-3 bg-success/5 rounded-lg">
                                                                                <span className="text-sm font-medium">Completion Rate</span>
                                                                                <span className="text-lg font-bold text-success">
                                                                                        {profileData?.total_attempts > 0 ? '100%' : '0%'}
                                                                                </span>
                                                                        </div>
                                                                        <div className="flex items-center justify-between p-3 bg-accent-cyan/5 rounded-lg">
                                                                                <span className="text-sm font-medium">Active Days</span>
                                                                                <span className="text-lg font-bold text-accent-cyan">
                                                                                        {profileData?.active_days || Math.max(profileData?.streak || 0, profileData?.total_attempts || 0)}
                                                                                </span>
                                                                        </div>
                                                                </div>
                                                        </Card>
                                                </div>

                                                {/* Right Column - Details & Stats */}
                                                <div className="lg:col-span-2 space-y-6">
                                                        {/* Personal Info */}
                                                        <Card className="p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                                                                <div className="flex items-center justify-between mb-6">
                                                                        <h3 className="text-xl font-bold flex items-center gap-2">
                                                                                <span className="text-2xl">👤</span>
                                                                                Personal Information
                                                                        </h3>
                                                                        <Button
                                                                                onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                                                                                variant="secondary"
                                                                                className="text-sm"
                                                                        >
                                                                                {isEditing ? '💾 Save Changes' : '✏️ Edit Profile'}
                                                                        </Button>
                                                                </div>

                                                                <div className="space-y-4">
                                                                        <div>
                                                                                <label className="block text-sm font-medium mb-2">Display Name</label>
                                                                                <input
                                                                                        type="text"
                                                                                        className="input-field"
                                                                                        placeholder="Enter your name"
                                                                                        value={formData.name}
                                                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                                                        disabled={!isEditing}
                                                                                />
                                                                        </div>

                                                                        <div>
                                                                                <label className="block text-sm font-medium mb-2">Email</label>
                                                                                <input
                                                                                        type="email"
                                                                                        className="input-field opacity-60 cursor-not-allowed"
                                                                                        value={user?.email || ''}
                                                                                        disabled
                                                                                />
                                                                                <p className="text-xs text-text-secondary mt-1">Email cannot be changed</p>
                                                                        </div>

                                                                        <div>
                                                                                <label className="block text-sm font-medium mb-2">Bio</label>
                                                                                <textarea
                                                                                        className="input-field min-h-[100px] resize-none"
                                                                                        placeholder="Aspire to inspire before you expire."
                                                                                        value={formData.bio}
                                                                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                                                                        disabled={!isEditing}
                                                                                />
                                                                        </div>
                                                                </div>
                                                        </Card>

                                                        {/* Performance Charts */}
                                                        {recentPerformanceData.length > 0 && (
                                                                <Card className="p-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                                                                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                                                                <span className="text-2xl">📈</span>
                                                                                Recent Performance
                                                                        </h3>
                                                                        <ResponsiveContainer width="100%" height={250}>
                                                                                <AreaChart data={recentPerformanceData}>
                                                                                        <defs>
                                                                                                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                                                                                                        <stop offset="0%" stopColor="#6366f1" stopOpacity={0.8} />
                                                                                                        <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.1} />
                                                                                                </linearGradient>
                                                                                        </defs>
                                                                                        <CartesianGrid strokeDasharray="3 3" stroke="#2d2d44" />
                                                                                        <XAxis dataKey="challenge" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                                                                        <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} domain={[0, 100]} />
                                                                                        <Tooltip
                                                                                                contentStyle={{
                                                                                                        backgroundColor: '#1a1a2e',
                                                                                                        border: '2px solid #6366f1',
                                                                                                        borderRadius: '12px',
                                                                                                }}
                                                                                        />
                                                                                        <Area
                                                                                                type="monotone"
                                                                                                dataKey="score"
                                                                                                stroke="#6366f1"
                                                                                                fill="url(#scoreGradient)"
                                                                                                strokeWidth={3}
                                                                                        />
                                                                                </AreaChart>
                                                                        </ResponsiveContainer>
                                                                </Card>
                                                        )}

                                                        {/* Skill Radar */}
                                                        {skillRadarData.length > 0 && (
                                                                <Card className="p-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                                                                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                                                                <span className="text-2xl">🎯</span>
                                                                                Skill Breakdown
                                                                        </h3>
                                                                        <ResponsiveContainer width="100%" height={300}>
                                                                                <RadarChart data={skillRadarData}>
                                                                                        <PolarGrid stroke="#2d2d44" />
                                                                                        <PolarAngleAxis dataKey="skill" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                                                                        <PolarRadiusAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                                                                        <Radar
                                                                                                name="Skill Level"
                                                                                                dataKey="level"
                                                                                                stroke="#06b6d4"
                                                                                                fill="#06b6d4"
                                                                                                fillOpacity={0.6}
                                                                                        />
                                                                                        <Tooltip
                                                                                                contentStyle={{
                                                                                                        backgroundColor: '#1a1a2e',
                                                                                                        border: '2px solid #06b6d4',
                                                                                                        borderRadius: '12px',
                                                                                                }}
                                                                                        />
                                                                                </RadarChart>
                                                                        </ResponsiveContainer>
                                                                </Card>
                                                        )}

                                                        {/* Statistics */}
                                                        <Card className="p-6 animate-slide-up" style={{ animationDelay: '0.5s' }}>
                                                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                                                        <span className="text-2xl">📊</span>
                                                                        Statistics
                                                                </h3>
                                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                                                        <div className="text-center p-4 bg-primary/5 rounded-xl border border-primary/20 hover:scale-105 transition-transform">
                                                                                <div className="text-4xl font-extrabold text-primary mb-2">
                                                                                        {profileData?.total_attempts || 0}
                                                                                </div>
                                                                                <div className="text-sm text-text-secondary">Total Challenges</div>
                                                                        </div>
                                                                        <div className="text-center p-4 bg-success/5 rounded-xl border border-success/20 hover:scale-105 transition-transform">
                                                                                <div className="text-4xl font-extrabold text-success mb-2">
                                                                                        {profileData?.average_score?.toFixed(1) || '0'}
                                                                                </div>
                                                                                <div className="text-sm text-text-secondary">Average Score</div>
                                                                        </div>
                                                                        <div className="text-center p-4 bg-warning/5 rounded-xl border border-warning/20 hover:scale-105 transition-transform">
                                                                                <div className="text-4xl font-extrabold text-warning mb-2">
                                                                                        {profileData?.streak || 0}
                                                                                </div>
                                                                                <div className="text-sm text-text-secondary">Day Streak</div>
                                                                        </div>
                                                                        <div className="text-center p-4 bg-accent-cyan/5 rounded-xl border border-accent-cyan/20 hover:scale-105 transition-transform">
                                                                                <div className="text-4xl font-extrabold text-accent-cyan mb-2">
                                                                                        {profileData?.badges?.length || 0}
                                                                                </div>
                                                                                <div className="text-sm text-text-secondary">Badges Earned</div>
                                                                        </div>
                                                                </div>
                                                        </Card>

                                                        {/* Achievements */}
                                                        <Card className="p-6 animate-slide-up" style={{ animationDelay: '0.6s' }}>
                                                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                                                        <span className="text-2xl">🏆</span>
                                                                        Achievements & Badges
                                                                </h3>
                                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                                        {profileData?.badges?.length > 0 ? (
                                                                                profileData.badges.map((badge, index) => (
                                                                                        <div
                                                                                                key={index}
                                                                                                className="group p-4 bg-gradient-to-br from-warning/10 to-accent-pink/10 border-2 border-warning/30 rounded-xl text-center hover:scale-110 hover:border-warning transition-all cursor-pointer"
                                                                                        >
                                                                                                <div className="text-4xl mb-2 group-hover:scale-125 transition-transform">{badge.icon || '🏆'}</div>
                                                                                                <h4 className="text-sm font-bold mb-1">{badge.name}</h4>
                                                                                                <p className="text-xs text-text-secondary">{badge.description}</p>
                                                                                        </div>
                                                                                ))
                                                                        ) : (
                                                                                <>
                                                                                        {/* Placeholder badges */}
                                                                                        {[
                                                                                                { icon: '🎯', name: 'First Attempt', desc: 'Complete your first challenge', locked: true },
                                                                                                { icon: '🌟', name: 'Clarity Champion', desc: 'Score 90+ on clarity', locked: true },
                                                                                                { icon: '📝', name: 'Structure Master', desc: 'Use all prompt components', locked: true },
                                                                                                { icon: '💪', name: 'Consistent', desc: 'Maintain 7-day streak', locked: true },
                                                                                                { icon: '🏆', name: 'Expert Promper', desc: 'Complete 10 challenges', locked: true },
                                                                                                { icon: '⚡', name: 'Prompt Pro', desc: 'Average score above 85', locked: true }
                                                                                        ].map((badge, idx) => (
                                                                                                <div
                                                                                                        key={idx}
                                                                                                        className="p-4 bg-bg-input/50 border-2 border-dashed border-border rounded-xl text-center opacity-50 hover:opacity-75 transition-opacity"
                                                                                                >
                                                                                                        <div className="text-3xl mb-2 grayscale">{badge.icon}</div>
                                                                                                        <h4 className="text-sm font-semibold mb-1">{badge.name}</h4>
                                                                                                        <p className="text-xs text-text-secondary">{badge.desc}</p>
                                                                                                        <p className="text-xs text-warning mt-2">🔒 Locked</p>
                                                                                                </div>
                                                                                        ))}
                                                                                </>
                                                                        )}
                                                                </div>
                                                        </Card>
                                                </div>
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
