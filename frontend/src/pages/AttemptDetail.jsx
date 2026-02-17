import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Radar, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { getAttemptDetail } from '../services/api';

export default function AttemptDetail() {
        const { id } = useParams();
        const navigate = useNavigate();
        const [attempt, setAttempt] = useState(null);
        const [isLoading, setIsLoading] = useState(true);

        useEffect(() => {
                fetchAttemptDetail();
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

        if (isLoading) {
                return (
                        <div className="flex min-h-screen">
                                <Sidebar />
                                <main className="flex-1 ml-64 p-8 flex items-center justify-center">
                                        <div className="text-center">
                                                <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                                                <p className="text-text-secondary">Loading attempt details...</p>
                                        </div>
                                </main>
                        </div>
                );
        }

        if (!attempt) {
                return (
                        <div className="flex min-h-screen">
                                <Sidebar />
                                <main className="flex-1 ml-64 p-8 flex items-center justify-center">
                                        <Card className="p-8 text-center max-w-md">
                                                <div className="text-6xl mb-4">❌</div>
                                                <h2 className="text-2xl font-bold mb-2">Attempt Not Found</h2>
                                                <p className="text-text-secondary mb-6">This attempt doesn't exist or you don't have access to it.</p>
                                                <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
                                        </Card>
                                </main>
                        </div>
                );
        }

        const getScoreColor = (score) => {
                if (score >= 80) return 'from-success to-green-400';
                if (score >= 60) return 'from-warning to-yellow-400';
                return 'from-danger to-red-400';
        };

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
                <div className="flex min-h-screen">
                        <Sidebar />

                        <main className="flex-1 ml-64 p-8">
                                <div className="max-w-7xl mx-auto">
                                        {/* Header */}
                                        <header className="mb-8 animate-fade-in">
                                                <div className="flex items-center justify-between mb-4">
                                                        <button
                                                                onClick={() => navigate('/dashboard')}
                                                                className="text-primary hover:text-primary-light flex items-center gap-2"
                                                        >
                                                                ← Back to Dashboard
                                                        </button>
                                                        <Badge variant="default">{new Date(attempt.created_at).toLocaleDateString()}</Badge>
                                                </div>
                                                <h1 className="text-4xl font-extrabold mb-2">Attempt Report</h1>
                                                <p className="text-text-secondary">{attempt.problem_source}</p>
                                        </header>

                                        {/* Overall Score Card */}
                                        <Card className="p-8 mb-8 bg-gradient-to-br from-primary/10 to-accent-cyan/10 border-primary/30">
                                                <div className="grid md:grid-cols-2 gap-6">
                                                        <div className="text-center">
                                                                <div className={`text-7xl font-extrabold bg-gradient-to-r ${getScoreColor(attempt.overall_score)} bg-clip-text text-transparent mb-2`}>
                                                                        {attempt.overall_score.toFixed(1)}
                                                                </div>
                                                                <div className="text-lg text-text-secondary">Overall Score</div>
                                                        </div>
                                                        <div className="text-center border-l border-border pl-6">
                                                                <div className="text-5xl font-extrabold text-accent-cyan mb-2">+{attempt.xp_earned} XP</div>
                                                                <div className="text-lg text-text-secondary">Experience Earned</div>
                                                        </div>
                                                </div>
                                        </Card>

                                        {/* Problem */}
                                        <Card className="p-6 mb-8">
                                                <h2 className="text-2xl font-bold mb-4">Original Problem</h2>
                                                <div className="bg-bg-input rounded-lg p-6 border border-border">
                                                        <pre className="text-sm text-text-primary whitespace-pre-wrap">{attempt.problem_text}</pre>
                                                </div>
                                        </Card>

                                        {/* Charts */}
                                        <div className="grid md:grid-cols-2 gap-8 mb-8">
                                                <Card className="p-6">
                                                        <h2 className="text-2xl font-bold mb-6">Performance Radar</h2>
                                                        <ResponsiveContainer width="100%" height={350}>
                                                                <RechartsRadar data={radarData}>
                                                                        <PolarGrid stroke="#2d2d44" />
                                                                        <PolarAngleAxis dataKey="metric" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                                                        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#94a3b8' }} />
                                                                        <Radar name="Scores" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                                                                </RechartsRadar>
                                                        </ResponsiveContainer>
                                                </Card>

                                                <Card className="p-6">
                                                        <h2 className="text-2xl font-bold mb-6">Score Breakdown</h2>
                                                        <ResponsiveContainer width="100%" height={350}>
                                                                <BarChart data={barData}>
                                                                        <CartesianGrid strokeDasharray="3 3" stroke="#2d2d44" />
                                                                        <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} angle={-45} textAnchor="end" height={80} />
                                                                        <YAxis tick={{ fill: '#94a3b8' }} domain={[0, 100]} />
                                                                        <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: 'none', borderRadius: '8px', color: '#f8fafc' }} />
                                                                        <Bar dataKey="score" fill="#6366f1" radius={[8, 8, 0, 0]} />
                                                                </BarChart>
                                                        </ResponsiveContainer>
                                                </Card>
                                        </div>

                                        {/* Prompts Comparison */}
                                        <Card className="p-8 mb-8">
                                                <h2 className="text-2xl font-bold mb-6">Prompt Comparison</h2>
                                                <div className="grid md:grid-cols-2 gap-6">
                                                        <div className="space-y-3">
                                                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                                                        <Badge variant="default">Your Prompt</Badge>
                                                                </h3>
                                                                <div className="bg-bg-input rounded-lg p-6 border border-border max-h-96 overflow-y-auto">
                                                                        <pre className="text-sm text-text-primary whitespace-pre-wrap font-mono">{attempt.user_prompt}</pre>
                                                                </div>
                                                        </div>

                                                        <div className="space-y-3">
                                                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                                                        <Badge variant="dsa">AI Enhanced</Badge>
                                                                </h3>
                                                                <div className="bg-gradient-to-br from-primary/5 to-accent-cyan/5 rounded-lg p-6 border-2 border-primary/30 max-h-96 overflow-y-auto">
                                                                        <pre className="text-sm text-text-primary whitespace-pre-wrap font-mono">{attempt.ai_improved_prompt}</pre>
                                                                </div>
                                                        </div>
                                                </div>
                                        </Card>

                                        {/* Feedback */}
                                        <div className="grid md:grid-cols-3 gap-6 mb-8">
                                                {attempt.strengths && attempt.strengths.length > 0 && (
                                                        <Card className="p-6">
                                                                <h3 className="text-xl font-bold text-success mb-4">✓ Strengths</h3>
                                                                <ul className="space-y-2">
                                                                        {attempt.strengths.map((strength, idx) => (
                                                                                <li key={idx} className="flex items-start gap-2 text-sm text-text-secondary">
                                                                                        <span className="text-success">•</span>
                                                                                        <span>{strength}</span>
                                                                                </li>
                                                                        ))}
                                                                </ul>
                                                        </Card>
                                                )}

                                                {attempt.weaknesses && attempt.weaknesses.length > 0 && (
                                                        <Card className="p-6">
                                                                <h3 className="text-xl font-bold text-danger mb-4">⚠ Weaknesses</h3>
                                                                <ul className="space-y-2">
                                                                        {attempt.weaknesses.map((weakness, idx) => (
                                                                                <li key={idx} className="flex items-start gap-2 text-sm text-text-secondary">
                                                                                        <span className="text-danger">•</span>
                                                                                        <span>{weakness}</span>
                                                                                </li>
                                                                        ))}
                                                                </ul>
                                                        </Card>
                                                )}

                                                {attempt.suggestions && attempt.suggestions.length > 0 && (
                                                        <Card className="p-6">
                                                                <h3 className="text-xl font-bold text-warning mb-4">💡 Suggestions</h3>
                                                                <ul className="space-y-2">
                                                                        {attempt.suggestions.map((suggestion, idx) => (
                                                                                <li key={idx} className="flex items-start gap-2 text-sm text-text-secondary">
                                                                                        <span className="text-warning">•</span>
                                                                                        <span>{suggestion}</span>
                                                                                </li>
                                                                        ))}
                                                                </ul>
                                                        </Card>
                                                )}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="grid md:grid-cols-2 gap-4">
                                                <Button onClick={() => navigate('/dashboard')} className="w-full">
                                                        🏠 Back to Dashboard
                                                </Button>
                                                <Button onClick={() => navigate('/technical-challenge')} variant="secondary" className="w-full">
                                                        🔄 Try Another Challenge
                                                </Button>
                                        </div>
                                </div>
                        </main>
                </div>
        );
}
