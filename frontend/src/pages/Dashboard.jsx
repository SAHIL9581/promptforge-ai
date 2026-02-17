import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Badge from '../components/Badge';
import RadarChart from '../components/RadarChart';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Dashboard() {
        const { user } = useAuth();
        const navigate = useNavigate();
        const [stats, setStats] = useState(null);
        const [history, setHistory] = useState([]);
        const [filter, setFilter] = useState('ALL');
        const [isLoading, setIsLoading] = useState(true);

        useEffect(() => {
                fetchDashboardData();
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
                {
                        label: 'Total Challenges',
                        value: stats?.total_challenges || '0',
                        change: '+12 this week',
                        positive: true,
                        color: 'from-primary to-accent-cyan',
                        icon: '💻',
                },
                {
                        label: 'Average Score',
                        value: stats?.average_score?.toFixed(1) || '0',
                        change: '+5.2% from last week',
                        positive: true,
                        color: 'from-success to-green-400',
                        icon: '📈',
                },
                {
                        label: 'Current Streak',
                        value: stats?.streak || '0',
                        change: '🔥 Keep it going!',
                        positive: true,
                        color: 'from-warning to-yellow-400',
                        icon: '⚡',
                },
                {
                        label: 'Skill Level',
                        value: stats?.user?.level || 'Beginner',
                        change: '🎯 Top 15%',
                        positive: true,
                        color: 'from-accent-pink to-pink-400',
                        icon: '🏆',
                },
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
                        <div className="flex min-h-screen">
                                <Sidebar />
                                <main className="flex-1 ml-64 p-8 flex items-center justify-center">
                                        <div className="text-center">
                                                <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                                                <p className="text-text-secondary">Loading dashboard...</p>
                                        </div>
                                </main>
                        </div>
                );
        }

        return (
                <div className="flex min-h-screen">
                        <Sidebar />

                        <main className="flex-1 ml-64 p-8">
                                {/* Background */}
                                <div className="fixed inset-0 ml-64 -z-10">
                                        <div className="absolute w-96 h-96 bg-primary/10 rounded-full blur-3xl top-1/4 left-1/4 animate-pulse" />
                                        <div className="absolute w-96 h-96 bg-accent-cyan/8 rounded-full blur-3xl bottom-1/4 right-1/4 animate-pulse" />
                                </div>

                                <div className="max-w-7xl mx-auto">
                                        {/* Header */}
                                        <header className="mb-8 animate-slide-up">
                                                <h1 className="text-4xl font-extrabold mb-2">
                                                        Welcome back, {user?.email?.split('@')[0] || 'User'} 👋
                                                </h1>
                                                <p className="text-text-secondary">Track your prompt engineering progress and improve your skills</p>
                                        </header>

                                        {/* Stats Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                                {statsCards.map((stat, index) => (
                                                        <Card
                                                                key={stat.label}
                                                                className="p-6 animate-slide-up"
                                                                style={{ animationDelay: `${index * 0.1}s` }}
                                                                hasTopBorder
                                                                borderColor={stat.color}
                                                        >
                                                                <div className="flex items-start justify-between mb-4">
                                                                        <div className="text-3xl">{stat.icon}</div>
                                                                        <div className={`text-2xl font-extrabold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                                                                                {stat.value}
                                                                        </div>
                                                                </div>
                                                                <h3 className="text-sm font-medium text-text-secondary mb-1">{stat.label}</h3>
                                                                <p className={`text-xs ${stat.positive ? 'text-success' : 'text-text-secondary'}`}>
                                                                        {stat.change}
                                                                </p>
                                                        </Card>
                                                ))}
                                        </div>

                                        {/* Charts */}
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                                <Card className="p-6">
                                                        <h3 className="text-xl font-bold mb-4">Skill Distribution</h3>
                                                        {stats?.average_score > 0 ? (
                                                                <RadarChart data={[
                                                                        { subject: 'Clarity', score: stats.average_score, fullMark: 100 },
                                                                        { subject: 'Structure', score: stats.average_score * 0.95, fullMark: 100 },
                                                                        { subject: 'Specificity', score: stats.average_score * 1.05, fullMark: 100 },
                                                                        { subject: 'Creativity', score: stats.average_score * 0.9, fullMark: 100 },
                                                                        { subject: 'Technical', score: stats.average_score * 1.1, fullMark: 100 },
                                                                ]} />
                                                        ) : (
                                                                <div className="h-64 flex items-center justify-center text-text-secondary">
                                                                        <p>Complete challenges to see your skill distribution</p>
                                                                </div>
                                                        )}
                                                </Card>

                                                <Card className="p-6">
                                                        <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
                                                        <div className="space-y-4">
                                                                {history.slice(0, 5).length > 0 ? (
                                                                        history.slice(0, 5).map((attempt) => (
                                                                                <div
                                                                                        key={attempt.id}
                                                                                        className="flex items-center justify-between p-3 bg-bg-input rounded-lg hover:bg-bg-input/70 transition-colors cursor-pointer"
                                                                                        onClick={() => viewAttemptDetail(attempt.id)}
                                                                                >
                                                                                        <div className="flex items-center gap-3 flex-1">
                                                                                                <Badge variant={getCategoryFromSource(attempt.problem_source).toLowerCase()}>
                                                                                                        {getCategoryFromSource(attempt.problem_source)}
                                                                                                </Badge>
                                                                                                <span className="text-sm truncate max-w-xs">{attempt.problem_text.substring(0, 50)}...</span>
                                                                                        </div>
                                                                                        <div className="text-lg font-bold text-primary">{attempt.overall_score.toFixed(1)}</div>
                                                                                </div>
                                                                        ))
                                                                ) : (
                                                                        <div className="text-center py-8 text-text-secondary">
                                                                                <p className="text-3xl mb-2">🚀</p>
                                                                                <p>No attempts yet. Start your first challenge!</p>
                                                                        </div>
                                                                )}
                                                        </div>
                                                </Card>
                                        </div>

                                        {/* History Table */}
                                        <Card className="p-6">
                                                <div className="flex items-center justify-between mb-6">
                                                        <h3 className="text-xl font-bold">Challenge History</h3>
                                                        <div className="flex gap-2">
                                                                {['ALL'].map((f) => (
                                                                        <button
                                                                                key={f}
                                                                                onClick={() => setFilter(f)}
                                                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === f
                                                                                        ? 'bg-primary text-white'
                                                                                        : 'bg-bg-input text-text-secondary hover:text-text-primary'
                                                                                        }`}
                                                                        >
                                                                                {f}
                                                                        </button>
                                                                ))}
                                                        </div>
                                                </div>

                                                <div className="overflow-x-auto">
                                                        {filteredHistory.length > 0 ? (
                                                                <table className="w-full">
                                                                        <thead className="border-b border-border">
                                                                                <tr>
                                                                                        <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary">Date</th>
                                                                                        <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary">Challenge</th>
                                                                                        <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary">Category</th>
                                                                                        <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary">Score</th>
                                                                                        <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary">XP</th>
                                                                                        <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary">Action</th>
                                                                                </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                                {filteredHistory.map((attempt) => (
                                                                                        <tr
                                                                                                key={attempt.id}
                                                                                                className="border-b border-border/50 hover:bg-bg-input transition-colors cursor-pointer"
                                                                                                onClick={() => viewAttemptDetail(attempt.id)}
                                                                                        >
                                                                                                <td className="py-3 px-4 text-sm">
                                                                                                        {new Date(attempt.created_at).toLocaleDateString()}
                                                                                                </td>
                                                                                                <td className="py-3 px-4 text-sm max-w-md truncate">
                                                                                                        {attempt.problem_text.substring(0, 60)}...
                                                                                                </td>
                                                                                                <td className="py-3 px-4">
                                                                                                        <Badge variant={getCategoryFromSource(attempt.problem_source).toLowerCase()}>
                                                                                                                {getCategoryFromSource(attempt.problem_source)}
                                                                                                        </Badge>
                                                                                                </td>
                                                                                                <td className="py-3 px-4">
                                                                                                        <span className="text-lg font-bold text-primary">
                                                                                                                {attempt.overall_score.toFixed(1)}
                                                                                                        </span>
                                                                                                </td>
                                                                                                <td className="py-3 px-4">
                                                                                                        <span className="text-sm text-accent-cyan font-semibold">
                                                                                                                +{attempt.xp_earned} XP
                                                                                                        </span>
                                                                                                </td>
                                                                                                <td className="py-3 px-4">
                                                                                                        <button
                                                                                                                className="text-primary-light hover:text-primary text-sm font-medium"
                                                                                                                onClick={(e) => {
                                                                                                                        e.stopPropagation();
                                                                                                                        viewAttemptDetail(attempt.id);
                                                                                                                }}
                                                                                                        >
                                                                                                                View Report →
                                                                                                        </button>
                                                                                                </td>
                                                                                        </tr>
                                                                                ))}
                                                                        </tbody>
                                                                </table>
                                                        ) : (
                                                                <div className="text-center py-12">
                                                                        <div className="text-6xl mb-4">📚</div>
                                                                        <p className="text-xl font-semibold mb-2">No challenges found</p>
                                                                        <p className="text-text-secondary mb-6">
                                                                                {filter === 'ALL'
                                                                                        ? 'Start your journey by attempting your first challenge!'
                                                                                        : `No ${filter} challenges attempted yet.`}
                                                                        </p>
                                                                        <button
                                                                                onClick={() => navigate('/technical-challenge')}
                                                                                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                                                                        >
                                                                                Start Challenge
                                                                        </button>
                                                                </div>
                                                        )}
                                                </div>
                                        </Card>
                                </div>
                        </main>
                </div>
        );
}
