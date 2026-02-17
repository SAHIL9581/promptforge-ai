import { useLocation, useNavigate } from 'react-router-dom';
import { Radar, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, AreaChart, Area, ComposedChart } from 'recharts';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';

export default function EvaluationResult() {
        const location = useLocation();
        const navigate = useNavigate();
        const { evaluation, problem, userPrompt } = location.state || {};

        if (!evaluation) {
                return (
                        <div className="flex min-h-screen">
                                <Sidebar />
                                <main className="flex-1 ml-64 p-8 flex items-center justify-center">
                                        <Card className="p-8 text-center max-w-md">
                                                <div className="text-6xl mb-4">📊</div>
                                                <h2 className="text-2xl font-bold mb-2">No Evaluation Data</h2>
                                                <p className="text-text-secondary mb-6">Please complete a challenge first.</p>
                                                <Button onClick={() => navigate('/problem-mode')}>Start Challenge</Button>
                                        </Card>
                                </main>
                        </div>
                );
        }

        const getScoreColor = (score) => {
                if (score >= 90) return 'from-emerald-500 to-green-400';
                if (score >= 80) return 'from-success to-green-400';
                if (score >= 70) return 'from-blue-500 to-cyan-400';
                if (score >= 60) return 'from-warning to-yellow-400';
                return 'from-danger to-red-400';
        };

        const getScoreColorSolid = (score) => {
                if (score >= 90) return 'text-emerald-500';
                if (score >= 80) return 'text-success';
                if (score >= 70) return 'text-blue-500';
                if (score >= 60) return 'text-warning';
                return 'text-danger';
        };

        const getScoreGrade = (score) => {
                if (score >= 90) return { text: 'Exceptional', emoji: '🎉', desc: 'Outstanding performance!' };
                if (score >= 80) return { text: 'Excellent', emoji: '🌟', desc: 'Great work!' };
                if (score >= 70) return { text: 'Good', emoji: '👍', desc: 'Nice job!' };
                if (score >= 60) return { text: 'Fair', emoji: '😊', desc: 'Keep improving!' };
                return { text: 'Needs Work', emoji: '💪', desc: 'Practice makes perfect!' };
        };

        const grade = getScoreGrade(evaluation.overall_score);

        // Enhanced Radar Data with more metrics
        const radarData = [
                { metric: 'Clarity', score: evaluation.clarity_score || 0, fullMark: 100 },
                { metric: 'Specificity', score: evaluation.specificity_score || 0, fullMark: 100 },
                { metric: 'Effectiveness', score: evaluation.effectiveness_score || 0, fullMark: 100 },
                { metric: 'Best Practices', score: evaluation.best_practices_score || 0, fullMark: 100 },
                { metric: 'Efficiency', score: evaluation.efficiency_score || 0, fullMark: 100 },
                { metric: 'Safety', score: evaluation.safety_score || 0, fullMark: 100 },
                { metric: 'Grammar', score: evaluation.grammar_score || 80, fullMark: 100 },
                { metric: 'Readability', score: evaluation.readability_score || 75, fullMark: 100 },
        ];

        // Comprehensive metrics breakdown
        const detailedMetrics = [
                {
                        category: 'Core Quality',
                        metrics: [
                                { name: 'Clarity', score: evaluation.clarity_score || 0, icon: '💎', color: 'primary' },
                                { name: 'Specificity', score: evaluation.specificity_score || 0, icon: '🎯', color: 'accent-cyan' },
                                { name: 'Effectiveness', score: evaluation.effectiveness_score || 0, icon: '⚡', color: 'success' },
                        ]
                },
                {
                        category: 'Best Practices',
                        metrics: [
                                { name: 'Structure', score: evaluation.best_practices_score || 0, icon: '🏗️', color: 'warning' },
                                { name: 'Efficiency', score: evaluation.efficiency_score || 0, icon: '🚀', color: 'accent-pink' },
                                { name: 'Safety', score: evaluation.safety_score || 0, icon: '🛡️', color: 'primary' },
                        ]
                },
                {
                        category: 'Language Quality',
                        metrics: [
                                { name: 'Grammar', score: evaluation.grammar_score || 80, icon: '📝', color: 'success' },
                                { name: 'Readability', score: evaluation.readability_score || 75, icon: '👁️', color: 'accent-cyan' },
                                { name: 'Ambiguity', score: 100 - (evaluation.ambiguity_score || 20), icon: '🔍', color: 'warning' },
                        ]
                }
        ];

        // Component Checklist with descriptions
        const components = [
                { name: 'Role Definition', present: evaluation.has_role_definition, icon: '👤', desc: 'Defines AI role and persona' },
                { name: 'Clear Task', present: evaluation.has_clear_task, icon: '🎯', desc: 'Specifies exact objective' },
                { name: 'Output Format', present: evaluation.has_output_format, icon: '📄', desc: 'Defines response structure' },
                { name: 'Constraints', present: evaluation.has_constraints, icon: '⚠️', desc: 'Sets boundaries and limits' },
                { name: 'Examples', present: evaluation.has_examples, icon: '💡', desc: 'Provides sample inputs/outputs' },
                { name: 'Step-by-Step', present: evaluation.has_step_by_step, icon: '📋', desc: 'Breaks down process' },
        ];

        // Token analysis data
        const tokenData = [
                { name: 'Useful', value: evaluation.useful_tokens_percentage || 70, color: '#10b981' },
                { name: 'Redundant', value: evaluation.redundant_tokens_percentage || 30, color: '#ef4444' },
        ];

        // Circular Progress Component
        const CircularProgress = ({ score, size = 120, strokeWidth = 8 }) => {
                const radius = (size - strokeWidth) / 2;
                const circumference = radius * 2 * Math.PI;
                const offset = circumference - (score / 100) * circumference;

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
                                        stroke="currentColor"
                                        strokeWidth={strokeWidth}
                                        fill="none"
                                        strokeDasharray={circumference}
                                        strokeDashoffset={offset}
                                        className={`transition-all duration-1000 ease-out ${getScoreColorSolid(score)}`}
                                        strokeLinecap="round"
                                />
                        </svg>
                );
        };

        return (
                <div className="flex min-h-screen">
                        <Sidebar />

                        <main className="flex-1 ml-64 p-8 bg-gradient-to-br from-bg-dark via-bg-card to-bg-dark">
                                <div className="max-w-7xl mx-auto">
                                        {/* Animated Header */}
                                        <header className="text-center mb-12 animate-fade-in">
                                                <div className="relative inline-block mb-6">
                                                        <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent-cyan to-accent-pink opacity-20 blur-3xl animate-pulse"></div>
                                                        <div className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary to-accent-cyan rounded-2xl shadow-2xl">
                                                                <span className="text-6xl animate-bounce">🏆</span>
                                                        </div>
                                                </div>
                                                <h1 className="text-5xl font-extrabold mb-3 bg-gradient-to-r from-primary via-accent-cyan to-accent-pink bg-clip-text text-transparent">
                                                        Evaluation Complete!
                                                </h1>
                                                <p className="text-xl text-text-secondary mb-2">Comprehensive analysis of your prompt engineering skills</p>
                                                <Badge variant="default" className="text-lg px-4 py-2">
                                                        {grade.emoji} {grade.text} - {grade.desc}
                                                </Badge>
                                        </header>

                                        {/* Hero Score Card with Circular Progress */}
                                        <Card className="p-10 mb-10 bg-gradient-to-br from-primary/5 via-accent-cyan/5 to-accent-pink/5 border-2 border-primary/20 backdrop-blur-sm animate-slide-up">
                                                <div className="grid md:grid-cols-3 gap-8 items-center">
                                                        {/* Main Score with Circular Progress */}
                                                        <div className="text-center">
                                                                <div className="relative inline-block">
                                                                        <CircularProgress score={evaluation.overall_score} size={160} strokeWidth={12} />
                                                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                                                <div className={`text-5xl font-extrabold bg-gradient-to-r ${getScoreColor(evaluation.overall_score)} bg-clip-text text-transparent`}>
                                                                                        {evaluation.overall_score.toFixed(1)}
                                                                                </div>
                                                                                <div className="text-sm text-text-secondary">/ 100</div>
                                                                        </div>
                                                                </div>
                                                                <div className="text-lg text-text-secondary mt-4 font-semibold">Overall Score</div>
                                                                <div className="mt-2 flex items-center justify-center gap-2">
                                                                        <div className="w-16 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full"></div>
                                                                </div>
                                                        </div>

                                                        {/* XP Earned */}
                                                        <div className="text-center border-l border-r border-border/50 px-6">
                                                                <div className="relative">
                                                                        <div className="text-6xl font-extrabold bg-gradient-to-r from-accent-cyan via-primary to-accent-pink bg-clip-text text-transparent mb-3 animate-pulse">
                                                                                +{evaluation.xp_earned || 50}
                                                                        </div>
                                                                        <div className="absolute -top-2 right-1/4 text-3xl animate-bounce">✨</div>
                                                                </div>
                                                                <div className="text-lg text-text-secondary mb-2 font-semibold">Experience Points</div>
                                                                <Badge variant="dsa" className="px-4 py-2">Level {evaluation.new_level || 1}</Badge>
                                                                <div className="mt-4 w-full bg-bg-input rounded-full h-2 overflow-hidden">
                                                                        <div className="h-full bg-gradient-to-r from-accent-cyan to-primary animate-fill-bar" style={{ width: '75%' }}></div>
                                                                </div>
                                                                <p className="text-xs text-text-secondary mt-2">75% to next level</p>
                                                        </div>

                                                        {/* Potential Score */}
                                                        <div className="text-center">
                                                                <div className="text-6xl font-extrabold bg-gradient-to-r from-success via-green-400 to-emerald-500 bg-clip-text text-transparent mb-3">
                                                                        {(evaluation.improvement_potential_score || evaluation.overall_score + 10).toFixed(0)}
                                                                </div>
                                                                <div className="text-lg text-text-secondary mb-3 font-semibold">Potential Score</div>
                                                                <div className="flex items-center justify-center gap-2 text-sm">
                                                                        <span className="text-success">↗</span>
                                                                        <span className="text-success font-bold">
                                                                                +{((evaluation.improvement_potential_score || evaluation.overall_score + 10) - evaluation.overall_score).toFixed(0)} points
                                                                        </span>
                                                                </div>
                                                                <p className="text-xs text-text-secondary mt-2">possible improvement</p>
                                                        </div>
                                                </div>
                                        </Card>

                                        {/* Detailed Metrics Grid */}
                                        <div className="grid md:grid-cols-3 gap-6 mb-10">
                                                {detailedMetrics.map((category, idx) => (
                                                        <Card
                                                                key={category.category}
                                                                className="p-6 animate-slide-up hover:shadow-2xl hover:scale-105 transition-all duration-300"
                                                                style={{ animationDelay: `${idx * 0.1}s` }}
                                                        >
                                                                <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
                                                                        <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent-cyan rounded-lg flex items-center justify-center text-sm">
                                                                                {idx + 1}
                                                                        </div>
                                                                        {category.category}
                                                                </h3>
                                                                <div className="space-y-4">
                                                                        {category.metrics.map((metric) => (
                                                                                <div key={metric.name} className="group">
                                                                                        <div className="flex items-center justify-between mb-2">
                                                                                                <div className="flex items-center gap-2">
                                                                                                        <span className="text-xl group-hover:scale-125 transition-transform">{metric.icon}</span>
                                                                                                        <span className="text-sm font-medium">{metric.name}</span>
                                                                                                </div>
                                                                                                <span className={`text-lg font-bold ${getScoreColorSolid(metric.score)}`}>
                                                                                                        {metric.score.toFixed(0)}
                                                                                                </span>
                                                                                        </div>
                                                                                        <div className="relative w-full bg-bg-input rounded-full h-2 overflow-hidden">
                                                                                                <div
                                                                                                        className={`h-full bg-gradient-to-r from-${metric.color} to-${metric.color}-light transition-all duration-1000 ease-out`}
                                                                                                        style={{
                                                                                                                width: `${metric.score}%`,
                                                                                                                background: `linear-gradient(90deg, var(--${metric.color}) 0%, var(--${metric.color}-light, var(--${metric.color})) 100%)`
                                                                                                        }}
                                                                                                ></div>
                                                                                        </div>
                                                                                </div>
                                                                        ))}
                                                                </div>
                                                        </Card>
                                                ))}
                                        </div>

                                        {/* Enhanced Charts Section */}
                                        <div className="grid md:grid-cols-2 gap-8 mb-10">
                                                {/* 3D Radar Chart */}
                                                <Card className="p-8 animate-slide-up hover:shadow-2xl transition-shadow duration-300">
                                                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                                                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent-cyan rounded-xl flex items-center justify-center">
                                                                        <span className="text-2xl">🎯</span>
                                                                </div>
                                                                Performance Radar
                                                        </h2>
                                                        <ResponsiveContainer width="100%" height={400}>
                                                                <RechartsRadar data={radarData}>
                                                                        <defs>
                                                                                <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
                                                                                        <stop offset="0%" stopColor="#6366f1" stopOpacity={0.8} />
                                                                                        <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.3} />
                                                                                </linearGradient>
                                                                        </defs>
                                                                        <PolarGrid stroke="#2d2d44" strokeWidth={1.5} />
                                                                        <PolarAngleAxis
                                                                                dataKey="metric"
                                                                                tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 600 }}
                                                                        />
                                                                        <PolarRadiusAxis
                                                                                angle={90}
                                                                                domain={[0, 100]}
                                                                                tick={{ fill: '#94a3b8', fontSize: 11 }}
                                                                                stroke="#2d2d44"
                                                                        />
                                                                        <Radar
                                                                                name="Scores"
                                                                                dataKey="score"
                                                                                stroke="#6366f1"
                                                                                fill="url(#radarGradient)"
                                                                                fillOpacity={0.7}
                                                                                strokeWidth={3}
                                                                        />
                                                                        <Tooltip
                                                                                contentStyle={{
                                                                                        backgroundColor: '#1a1a2e',
                                                                                        border: '2px solid #6366f1',
                                                                                        borderRadius: '12px',
                                                                                        boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
                                                                                }}
                                                                        />
                                                                </RechartsRadar>
                                                        </ResponsiveContainer>
                                                </Card>

                                                {/* Enhanced Bar Chart with Gradient */}
                                                <Card className="p-8 animate-slide-up hover:shadow-2xl transition-shadow duration-300" style={{ animationDelay: '0.1s' }}>
                                                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                                                <div className="w-10 h-10 bg-gradient-to-br from-success to-green-400 rounded-xl flex items-center justify-center">
                                                                        <span className="text-2xl">📊</span>
                                                                </div>
                                                                Detailed Breakdown
                                                        </h2>
                                                        <ResponsiveContainer width="100%" height={400}>
                                                                <ComposedChart data={radarData}>
                                                                        <defs>
                                                                                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                                                                        <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                                                                                        <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.8} />
                                                                                </linearGradient>
                                                                        </defs>
                                                                        <CartesianGrid strokeDasharray="3 3" stroke="#2d2d44" strokeWidth={1.5} />
                                                                        <XAxis
                                                                                dataKey="metric"
                                                                                tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                                                                                angle={-15}
                                                                                textAnchor="end"
                                                                                height={90}
                                                                        />
                                                                        <YAxis
                                                                                tick={{ fill: '#94a3b8', fontSize: 11 }}
                                                                                domain={[0, 100]}
                                                                        />
                                                                        <Tooltip
                                                                                contentStyle={{
                                                                                        backgroundColor: '#1a1a2e',
                                                                                        border: '2px solid #06b6d4',
                                                                                        borderRadius: '12px',
                                                                                        boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
                                                                                }}
                                                                        />
                                                                        <Bar dataKey="score" fill="url(#barGradient)" radius={[12, 12, 0, 0]} />
                                                                        <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} dot={{ r: 5, fill: '#10b981' }} />
                                                                </ComposedChart>
                                                        </ResponsiveContainer>
                                                </Card>
                                        </div>

                                        {/* Component Checklist - Enhanced */}
                                        <Card className="p-8 mb-10 animate-slide-up">
                                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-warning to-yellow-400 rounded-xl flex items-center justify-center">
                                                                <span className="text-2xl">✅</span>
                                                        </div>
                                                        Prompt Components Analysis
                                                </h2>
                                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                        {components.map((component, idx) => (
                                                                <div
                                                                        key={idx}
                                                                        className={`group p-5 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl ${component.present
                                                                                ? 'bg-success/5 border-success/30 hover:bg-success/10'
                                                                                : 'bg-danger/5 border-danger/30 hover:bg-danger/10'
                                                                                }`}
                                                                >
                                                                        <div className="flex items-start justify-between mb-3">
                                                                                <div className="flex items-center gap-3">
                                                                                        <span className="text-3xl group-hover:scale-125 transition-transform">{component.icon}</span>
                                                                                        <div>
                                                                                                <h4 className="font-semibold text-sm">{component.name}</h4>
                                                                                                <p className="text-xs text-text-secondary mt-1">{component.desc}</p>
                                                                                        </div>
                                                                                </div>
                                                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${component.present ? 'bg-success/20' : 'bg-danger/20'
                                                                                        }`}>
                                                                                        {component.present ? (
                                                                                                <span className="text-success text-xl font-bold">✓</span>
                                                                                        ) : (
                                                                                                <span className="text-danger text-xl font-bold">✕</span>
                                                                                        )}
                                                                                </div>
                                                                        </div>
                                                                </div>
                                                        ))}
                                                </div>
                                        </Card>

                                        {/* Token Efficiency - Enhanced */}
                                        <div className="grid md:grid-cols-2 gap-8 mb-10">
                                                <Card className="p-8 animate-slide-up hover:shadow-2xl transition-shadow duration-300">
                                                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                                                <div className="w-10 h-10 bg-gradient-to-br from-accent-cyan to-blue-500 rounded-xl flex items-center justify-center">
                                                                        <span className="text-2xl">⚡</span>
                                                                </div>
                                                                Token Efficiency
                                                        </h2>
                                                        <div className="flex items-center justify-center mb-6">
                                                                <div className="relative w-48 h-48">
                                                                        <svg className="w-full h-full transform -rotate-90">
                                                                                <circle
                                                                                        cx="96"
                                                                                        cy="96"
                                                                                        r="80"
                                                                                        stroke="currentColor"
                                                                                        strokeWidth="16"
                                                                                        fill="none"
                                                                                        className="text-bg-input"
                                                                                />
                                                                                <circle
                                                                                        cx="96"
                                                                                        cy="96"
                                                                                        r="80"
                                                                                        stroke="currentColor"
                                                                                        strokeWidth="16"
                                                                                        fill="none"
                                                                                        strokeDasharray={`${2 * Math.PI * 80 * (evaluation.useful_tokens_percentage || 70) / 100} ${2 * Math.PI * 80}`}
                                                                                        className="text-success transition-all duration-1000"
                                                                                        strokeLinecap="round"
                                                                                />
                                                                        </svg>
                                                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                                                <div className="text-4xl font-extrabold text-success">
                                                                                        {(evaluation.useful_tokens_percentage || 70).toFixed(0)}%
                                                                                </div>
                                                                                <div className="text-sm text-text-secondary">Useful</div>
                                                                        </div>
                                                                </div>
                                                        </div>
                                                        <div className="space-y-4">
                                                                <div className="flex items-center justify-between p-4 bg-success/5 border border-success/20 rounded-xl">
                                                                        <span className="text-sm font-medium flex items-center gap-2">
                                                                                <span className="w-3 h-3 bg-success rounded-full"></span>
                                                                                Useful Tokens
                                                                        </span>
                                                                        <span className="font-bold text-success">{(evaluation.useful_tokens_percentage || 70).toFixed(0)}%</span>
                                                                </div>
                                                                <div className="flex items-center justify-between p-4 bg-danger/5 border border-danger/20 rounded-xl">
                                                                        <span className="text-sm font-medium flex items-center gap-2">
                                                                                <span className="w-3 h-3 bg-danger rounded-full"></span>
                                                                                Redundant Tokens
                                                                        </span>
                                                                        <span className="font-bold text-danger">{(evaluation.redundant_tokens_percentage || 30).toFixed(0)}%</span>
                                                                </div>
                                                                <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-xl">
                                                                        <span className="text-sm font-medium">Estimated Tokens</span>
                                                                        <span className="font-bold text-primary">{Math.round(evaluation.estimated_tokens || 100)}</span>
                                                                </div>
                                                        </div>
                                                </Card>

                                                {/* Quality Metrics */}
                                                <Card className="p-8 animate-slide-up hover:shadow-2xl transition-shadow duration-300" style={{ animationDelay: '0.1s' }}>
                                                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                                                <div className="w-10 h-10 bg-gradient-to-br from-accent-pink to-pink-500 rounded-xl flex items-center justify-center">
                                                                        <span className="text-2xl">⭐</span>
                                                                </div>
                                                                Quality Metrics
                                                        </h2>
                                                        <div className="space-y-6">
                                                                {[
                                                                        { name: 'Grammar', score: evaluation.grammar_score || 80, icon: '📝', color: 'primary' },
                                                                        { name: 'Readability', score: evaluation.readability_score || 75, icon: '👁️', color: 'success' },
                                                                        { name: 'Clarity', score: evaluation.ambiguity_score ? 100 - evaluation.ambiguity_score : 80, icon: '🔍', color: 'accent-cyan' },
                                                                ].map((metric, idx) => (
                                                                        <div key={metric.name} className="group">
                                                                                <div className="flex items-center justify-between mb-3">
                                                                                        <div className="flex items-center gap-3">
                                                                                                <span className="text-2xl group-hover:scale-125 transition-transform">{metric.icon}</span>
                                                                                                <span className="font-semibold">{metric.name}</span>
                                                                                        </div>
                                                                                        <span className={`text-2xl font-bold ${getScoreColorSolid(metric.score)}`}>
                                                                                                {metric.score.toFixed(0)}
                                                                                        </span>
                                                                                </div>
                                                                                <div className="relative w-full bg-bg-input rounded-full h-3 overflow-hidden">
                                                                                        <div
                                                                                                className={`h-full bg-gradient-to-r from-${metric.color} to-${metric.color}-light transition-all duration-1000 ease-out shadow-lg`}
                                                                                                style={{ width: `${metric.score}%` }}
                                                                                        ></div>
                                                                                </div>
                                                                        </div>
                                                                ))}
                                                        </div>
                                                </Card>
                                        </div>

                                        {/* Prompt Comparison - Side by Side */}
                                        <Card className="p-8 mb-10 animate-slide-up">
                                                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent-pink rounded-xl flex items-center justify-center">
                                                                <span className="text-2xl">💻</span>
                                                        </div>
                                                        Prompt Comparison
                                                </h2>
                                                <div className="grid md:grid-cols-2 gap-6">
                                                        {/* Your Prompt */}
                                                        <div className="space-y-4">
                                                                <div className="flex items-center justify-between">
                                                                        <h3 className="text-lg font-semibold flex items-center gap-2">
                                                                                <Badge variant="default" className="px-3 py-1">Your Prompt</Badge>
                                                                        </h3>
                                                                        <div className="flex items-center gap-3 text-xs text-text-secondary">
                                                                                <span className="flex items-center gap-1">
                                                                                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                                                                                        {(userPrompt || '').split(/\s+/).length} words
                                                                                </span>
                                                                                <span className="flex items-center gap-1">
                                                                                        <span className="w-2 h-2 bg-accent-cyan rounded-full"></span>
                                                                                        ~{Math.round(evaluation.estimated_tokens || 100)} tokens
                                                                                </span>
                                                                        </div>
                                                                </div>
                                                                <div className="relative bg-bg-input rounded-xl p-6 border-2 border-border max-h-96 overflow-y-auto hover:border-primary/50 transition-colors">
                                                                        <pre className="text-sm text-text-primary whitespace-pre-wrap font-mono leading-relaxed">
                                                                                {userPrompt || 'Your original prompt'}
                                                                        </pre>
                                                                </div>
                                                        </div>

                                                        {/* AI Enhanced */}
                                                        <div className="space-y-4">
                                                                <div className="flex items-center justify-between">
                                                                        <h3 className="text-lg font-semibold flex items-center gap-2">
                                                                                <Badge variant="dsa" className="px-3 py-1">✨ AI Enhanced</Badge>
                                                                        </h3>
                                                                        <div className="px-3 py-1 bg-success/10 border border-success/30 rounded-full text-xs font-semibold text-success">
                                                                                Optimized
                                                                        </div>
                                                                </div>
                                                                <div className="relative bg-gradient-to-br from-primary/5 via-accent-cyan/5 to-accent-pink/5 rounded-xl p-6 border-2 border-primary/30 max-h-96 overflow-y-auto hover:border-primary/60 transition-colors">
                                                                        <pre className="text-sm text-text-primary whitespace-pre-wrap font-mono leading-relaxed">
                                                                                {evaluation.ai_improved_prompt || 'Enhanced version with best practices applied.'}
                                                                        </pre>
                                                                </div>
                                                        </div>
                                                </div>
                                        </Card>

                                        {/* Feedback Cards - Three Column Layout */}
                                        <div className="grid md:grid-cols-3 gap-6 mb-10">
                                                {/* Strengths */}
                                                {evaluation.strengths && evaluation.strengths.length > 0 && (
                                                        <Card className="p-6 animate-slide-up border-2 border-success/30 hover:shadow-2xl hover:border-success/50 transition-all duration-300">
                                                                <div className="flex items-center gap-3 mb-5">
                                                                        <div className="w-12 h-12 bg-success/10 border-2 border-success/30 rounded-xl flex items-center justify-center">
                                                                                <span className="text-2xl">✓</span>
                                                                        </div>
                                                                        <h3 className="text-xl font-bold text-success">Strengths</h3>
                                                                </div>
                                                                <ul className="space-y-3">
                                                                        {evaluation.strengths.map((strength, idx) => (
                                                                                <li key={idx} className="flex items-start gap-3 p-3 bg-success/5 border border-success/20 rounded-lg hover:bg-success/10 transition-colors">
                                                                                        <span className="text-success text-xl mt-0.5">●</span>
                                                                                        <span className="text-sm text-text-secondary flex-1">{strength}</span>
                                                                                </li>
                                                                        ))}
                                                                </ul>
                                                        </Card>
                                                )}

                                                {/* Issues */}
                                                {evaluation.issues_detected && evaluation.issues_detected.length > 0 && (
                                                        <Card className="p-6 animate-slide-up border-2 border-danger/30 hover:shadow-2xl hover:border-danger/50 transition-all duration-300" style={{ animationDelay: '0.1s' }}>
                                                                <div className="flex items-center gap-3 mb-5">
                                                                        <div className="w-12 h-12 bg-danger/10 border-2 border-danger/30 rounded-xl flex items-center justify-center">
                                                                                <span className="text-2xl">⚠</span>
                                                                        </div>
                                                                        <h3 className="text-xl font-bold text-danger">Issues Found</h3>
                                                                </div>
                                                                <ul className="space-y-3">
                                                                        {evaluation.issues_detected.map((issue, idx) => (
                                                                                <li key={idx} className="flex items-start gap-3 p-3 bg-danger/5 border border-danger/20 rounded-lg hover:bg-danger/10 transition-colors">
                                                                                        <span className="text-danger text-xl mt-0.5">●</span>
                                                                                        <span className="text-sm text-text-secondary flex-1">{issue}</span>
                                                                                </li>
                                                                        ))}
                                                                </ul>
                                                        </Card>
                                                )}

                                                {/* Suggestions */}
                                                {evaluation.suggestions && evaluation.suggestions.length > 0 && (
                                                        <Card className="p-6 animate-slide-up border-2 border-warning/30 hover:shadow-2xl hover:border-warning/50 transition-all duration-300" style={{ animationDelay: '0.2s' }}>
                                                                <div className="flex items-center gap-3 mb-5">
                                                                        <div className="w-12 h-12 bg-warning/10 border-2 border-warning/30 rounded-xl flex items-center justify-center">
                                                                                <span className="text-2xl">💡</span>
                                                                        </div>
                                                                        <h3 className="text-xl font-bold text-warning">Suggestions</h3>
                                                                </div>
                                                                <ul className="space-y-3">
                                                                        {evaluation.suggestions.map((suggestion, idx) => (
                                                                                <li key={idx} className="flex items-start gap-3 p-3 bg-warning/5 border border-warning/20 rounded-lg hover:bg-warning/10 transition-colors">
                                                                                        <span className="text-warning text-xl mt-0.5">●</span>
                                                                                        <span className="text-sm text-text-secondary flex-1">{suggestion}</span>
                                                                                </li>
                                                                        ))}
                                                                </ul>
                                                        </Card>
                                                )}
                                        </div>

                                        {/* Badges Earned */}
                                        {evaluation.badges_earned && evaluation.badges_earned.length > 0 && (
                                                <Card className="p-10 bg-gradient-to-r from-warning/10 via-accent-pink/10 to-primary/10 border-2 border-warning/30 mb-10 animate-slide-up">
                                                        <div className="flex items-center justify-center gap-4 mb-8">
                                                                <span className="text-6xl animate-bounce">🏆</span>
                                                                <h2 className="text-3xl font-bold">New Badges Unlocked!</h2>
                                                        </div>
                                                        <div className="flex flex-wrap justify-center gap-4">
                                                                {evaluation.badges_earned.map((badge, idx) => (
                                                                        <div
                                                                                key={idx}
                                                                                className="group px-8 py-4 bg-gradient-to-br from-warning/20 to-accent-pink/20 border-2 border-warning rounded-2xl shadow-xl animate-slide-up hover:scale-110 transition-all duration-300"
                                                                                style={{ animationDelay: `${idx * 0.1}s` }}
                                                                        >
                                                                                <span className="text-xl font-bold flex items-center gap-2">
                                                                                        <span className="text-3xl group-hover:rotate-12 transition-transform">🏆</span>
                                                                                        {badge}
                                                                                </span>
                                                                        </div>
                                                                ))}
                                                        </div>
                                                </Card>
                                        )}

                                        {/* Enhanced Action Buttons */}
                                        <div className="grid md:grid-cols-2 gap-6">
                                                <Button
                                                        onClick={() => navigate('/dashboard')}
                                                        className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-accent-cyan hover:from-primary-dark hover:to-accent-cyan-dark transition-all duration-300 transform hover:scale-105"
                                                >
                                                        <span className="text-2xl mr-2">🏠</span>
                                                        Back to Dashboard
                                                </Button>
                                                <Button
                                                        onClick={() => navigate('/problem-mode')}
                                                        variant="secondary"
                                                        className="w-full h-14 text-lg font-semibold border-2 border-primary/30 hover:border-primary hover:bg-primary/10 transition-all duration-300 transform hover:scale-105"
                                                >
                                                        <span className="text-2xl mr-2">🔄</span>
                                                        Try Another Challenge
                                                </Button>
                                        </div>
                                </div>
                        </main>
                </div>
        );
}
