import { useLocation, useNavigate } from 'react-router-dom';
import { Radar, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ComposedChart, Line, Area, AreaChart } from 'recharts';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';

export default function TechnicalEvaluation() {
        const location = useLocation();
        const navigate = useNavigate();
        const { evaluation, problem, userPrompt, constraints } = location.state || {};

        if (!evaluation) {
                return (
                        <div className="flex min-h-screen">
                                <Sidebar />
                                <main className="flex-1 ml-64 p-8 flex items-center justify-center">
                                        <Card className="p-8 text-center max-w-md">
                                                <div className="text-6xl mb-4">💻</div>
                                                <h2 className="text-2xl font-bold mb-2">No Evaluation Data</h2>
                                                <p className="text-text-secondary mb-6">Please complete a technical challenge first.</p>
                                                <Button onClick={() => navigate('/technical-challenge-selector')}>Start Challenge</Button>
                                        </Card>
                                </main>
                        </div>
                );
        }

        // Mock token efficiency if not provided
        if (!evaluation.token_efficiency) {
                evaluation.token_efficiency = {
                        useful_percentage: 90,
                        redundant_percentage: 10,
                        estimated_tokens: 70
                };
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
                if (score >= 90) return { text: 'Exceptional', emoji: '🎉', desc: 'Production ready!' };
                if (score >= 80) return { text: 'Excellent', emoji: '🌟', desc: 'Well structured!' };
                if (score >= 70) return { text: 'Good', emoji: '👍', desc: 'Solid approach!' };
                if (score >= 60) return { text: 'Fair', emoji: '😊', desc: 'Needs refinement' };
                return { text: 'Needs Work', emoji: '💪', desc: 'Keep practicing!' };
        };

        const grade = getScoreGrade(evaluation.overall_score);

        // Comprehensive metrics with categories
        const technicalMetrics = [
                {
                        category: 'Problem Analysis',
                        icon: '🧠',
                        metrics: [
                                { name: 'Problem Understanding', score: evaluation.problem_understanding || 0, icon: '🎯', color: 'primary' },
                                { name: 'Approach Clarity', score: evaluation.approach_clarity || 0, icon: '💡', color: 'accent-cyan' },
                                { name: 'Edge Case Handling', score: evaluation.edge_case_handling || 0, icon: '🛡️', color: 'success' },
                        ]
                },
                {
                        category: 'Implementation',
                        icon: '⚙️',
                        metrics: [
                                { name: 'Implementation Details', score: evaluation.implementation_details || 0, icon: '🔧', color: 'warning' },
                                { name: 'Code Structure', score: evaluation.code_structure || 0, icon: '📝', color: 'accent-pink' },
                                { name: 'Correctness', score: evaluation.correctness || 0, icon: '✓', color: 'success' },
                        ]
                },
                {
                        category: 'Optimization',
                        icon: '🚀',
                        metrics: [
                                { name: 'Complexity Analysis', score: evaluation.complexity_analysis || 0, icon: '📊', color: 'primary' },
                                { name: 'Constraint Adherence', score: evaluation.constraint_adherence || 0, icon: '✅', color: 'accent-cyan' },
                                { name: 'Efficiency', score: evaluation.readability_score || 75, icon: '⚡', color: 'warning' },
                        ]
                }
        ];

        // Radar chart data
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

        // Circular Progress Component
        const CircularProgress = ({ score, size = 140, strokeWidth = 10 }) => {
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

        // Test case visualization
        const passRate = evaluation.estimated_test_pass_rate || 0;
        const passedTests = evaluation.passed_test_cases || 0;
        const totalTests = evaluation.total_test_cases || 10;

        return (
                <div className="flex min-h-screen">
                        <Sidebar />

                        <main className="flex-1 ml-64 p-8 bg-gradient-to-br from-bg-dark via-bg-card to-bg-dark">
                                <div className="max-w-7xl mx-auto">
                                        {/* Animated Header */}
                                        <header className="text-center mb-12 animate-fade-in">
                                                <div className="relative inline-block mb-6">
                                                        <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan via-primary to-accent-pink opacity-20 blur-3xl animate-pulse"></div>
                                                        <div className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-accent-cyan to-primary rounded-2xl shadow-2xl">
                                                                <span className="text-6xl animate-bounce">💻</span>
                                                        </div>
                                                </div>
                                                <h1 className="text-5xl font-extrabold mb-3 bg-gradient-to-r from-accent-cyan via-primary to-accent-pink bg-clip-text text-transparent">
                                                        Technical Challenge Complete!
                                                </h1>
                                                <p className="text-xl text-text-secondary mb-2">Comprehensive code generation analysis</p>
                                                <Badge variant="default" className="text-lg px-4 py-2">
                                                        {grade.emoji} {grade.text} - {grade.desc}
                                                </Badge>
                                        </header>

                                        {/* Hero Stats Grid */}
                                        <div className="grid md:grid-cols-4 gap-6 mb-10">
                                                {/* Overall Score */}
                                                <Card className="p-8 bg-gradient-to-br from-primary/5 via-accent-cyan/5 to-accent-pink/5 border-2 border-primary/20 col-span-2 animate-slide-up">
                                                        <div className="flex items-center justify-between">
                                                                <div className="flex-1">
                                                                        <h3 className="text-lg text-text-secondary mb-4 font-semibold">Overall Score</h3>
                                                                        <div className={`text-7xl font-extrabold bg-gradient-to-r ${getScoreColor(evaluation.overall_score)} bg-clip-text text-transparent mb-2`}>
                                                                                {evaluation.overall_score.toFixed(1)}
                                                                        </div>
                                                                        <div className="text-xl mb-3">{grade.emoji} {grade.text}</div>
                                                                        <div className="w-full bg-bg-input rounded-full h-3 overflow-hidden">
                                                                                <div className={`h-full bg-gradient-to-r ${getScoreColor(evaluation.overall_score)} animate-fill-bar`} style={{ width: `${evaluation.overall_score}%` }}></div>
                                                                        </div>
                                                                </div>
                                                                <div className="ml-6">
                                                                        <CircularProgress score={evaluation.overall_score} size={120} strokeWidth={8} />
                                                                </div>
                                                        </div>
                                                </Card>

                                                {/* Test Results */}
                                                <Card className={`p-8 animate-slide-up border-2 ${evaluation.would_generate_working_code
                                                        ? 'bg-gradient-to-br from-success/10 to-green-400/10 border-success/30'
                                                        : 'bg-gradient-to-br from-danger/10 to-red-400/10 border-danger/30'
                                                        }`} style={{ animationDelay: '0.1s' }}>
                                                        <div className="text-center">
                                                                <div className="text-5xl mb-4 animate-bounce">
                                                                        {evaluation.would_generate_working_code ? '✅' : '❌'}
                                                                </div>
                                                                <div className="text-5xl font-extrabold mb-2">
                                                                        {passedTests}/{totalTests}
                                                                </div>
                                                                <div className="text-sm text-text-secondary mb-3">Tests Passed</div>
                                                                <div className="w-full bg-bg-input rounded-full h-2">
                                                                        <div className={`h-2 rounded-full ${evaluation.would_generate_working_code ? 'bg-success' : 'bg-danger'}`} style={{ width: `${passRate}%` }}></div>
                                                                </div>
                                                                <p className="text-xs text-text-secondary mt-2">{passRate.toFixed(0)}% Success</p>
                                                        </div>
                                                </Card>

                                                {/* XP & Level */}
                                                <Card className="p-8 bg-gradient-to-br from-warning/10 to-accent-pink/10 border-2 border-warning/30 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                                                        <div className="text-center">
                                                                <div className="relative mb-3">
                                                                        <div className="text-6xl font-extrabold bg-gradient-to-r from-warning via-accent-pink to-primary bg-clip-text text-transparent animate-pulse">
                                                                                +{evaluation.xp_earned || 0}
                                                                        </div>
                                                                        <div className="absolute -top-1 right-4 text-2xl animate-bounce">✨</div>
                                                                </div>
                                                                <div className="text-sm text-text-secondary mb-3 font-semibold">XP Earned</div>
                                                                <Badge variant="dsa" className="px-3 py-1">Level {evaluation.new_level || 1}</Badge>
                                                                {evaluation.constraints_met && (
                                                                        <div className="mt-3 px-3 py-2 bg-success/20 border border-success/40 rounded-lg text-xs font-semibold text-success flex items-center justify-center gap-1">
                                                                                <span>✓</span> Constraints Met
                                                                        </div>
                                                                )}
                                                        </div>
                                                </Card>
                                        </div>

                                        {/* Constraint Adherence Card */}
                                        {constraints && (
                                                <Card className={`p-8 mb-10 animate-slide-up border-2 ${evaluation.constraints_met
                                                        ? 'bg-success/5 border-success/30'
                                                        : 'bg-danger/5 border-danger/30'
                                                        }`}>
                                                        <div className="flex items-center justify-between">
                                                                <div className="flex-1">
                                                                        <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                                                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${evaluation.constraints_met ? 'bg-success/20 border-2 border-success/40' : 'bg-danger/20 border-2 border-danger/40'
                                                                                        }`}>
                                                                                        <span className="text-3xl">{evaluation.constraints_met ? '✅' : '⚠️'}</span>
                                                                                </div>
                                                                                Constraint Analysis
                                                                        </h3>
                                                                        <div className="grid grid-cols-2 gap-6">
                                                                                <div className="space-y-2">
                                                                                        <div className="flex items-center justify-between p-4 bg-bg-input rounded-xl">
                                                                                                <span className="text-sm text-text-secondary">Word Count</span>
                                                                                                <span className={`text-xl font-bold ${evaluation.word_count > (constraints.word_limit || 0) ? 'text-danger' : 'text-success'}`}>
                                                                                                        {evaluation.word_count || 0} / {constraints.word_limit || 0}
                                                                                                </span>
                                                                                        </div>
                                                                                        <div className="w-full bg-bg-dark rounded-full h-2">
                                                                                                <div className={`h-2 rounded-full ${evaluation.word_count > (constraints.word_limit || 0) ? 'bg-danger' : 'bg-success'}`}
                                                                                                        style={{ width: `${Math.min((evaluation.word_count / constraints.word_limit) * 100, 100)}%` }}></div>
                                                                                        </div>
                                                                                </div>
                                                                                <div className="space-y-2">
                                                                                        <div className="flex items-center justify-between p-4 bg-bg-input rounded-xl">
                                                                                                <span className="text-sm text-text-secondary">Token Count</span>
                                                                                                <span className={`text-xl font-bold ${evaluation.token_count > (constraints.token_limit || 0) ? 'text-danger' : 'text-success'}`}>
                                                                                                        {evaluation.token_count || 0} / {constraints.token_limit || 0}
                                                                                                </span>
                                                                                        </div>
                                                                                        <div className="w-full bg-bg-dark rounded-full h-2">
                                                                                                <div className={`h-2 rounded-full ${evaluation.token_count > (constraints.token_limit || 0) ? 'bg-danger' : 'bg-success'}`}
                                                                                                        style={{ width: `${Math.min((evaluation.token_count / constraints.token_limit) * 100, 100)}%` }}></div>
                                                                                        </div>
                                                                                </div>
                                                                        </div>
                                                                        {evaluation.constraint_violations && evaluation.constraint_violations.length > 0 && (
                                                                                <div className="mt-4 space-y-2">
                                                                                        {evaluation.constraint_violations.map((violation, idx) => (
                                                                                                <div key={idx} className="flex items-center gap-2 p-3 bg-danger/10 border border-danger/30 rounded-lg text-sm text-danger">
                                                                                                        <span>⚠️</span> {violation}
                                                                                                </div>
                                                                                        ))}
                                                                                </div>
                                                                        )}
                                                                </div>
                                                                <div className="ml-8 text-8xl">
                                                                        {evaluation.constraints_met ? '✅' : '❌'}
                                                                </div>
                                                        </div>
                                                </Card>
                                        )}

                                        {/* Technical Metrics by Category */}
                                        <div className="grid md:grid-cols-3 gap-6 mb-10">
                                                {technicalMetrics.map((category, idx) => (
                                                        <Card
                                                                key={category.category}
                                                                className="p-6 animate-slide-up hover:shadow-2xl hover:scale-105 transition-all duration-300"
                                                                style={{ animationDelay: `${idx * 0.1}s` }}
                                                        >
                                                                <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
                                                                        <div className="w-10 h-10 bg-gradient-to-br from-accent-cyan to-primary rounded-xl flex items-center justify-center text-xl">
                                                                                {category.icon}
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
                                                                                                        className={`h-full bg-gradient-to-r transition-all duration-1000 ease-out`}
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
                                                {/* Radar Chart */}
                                                <Card className="p-8 animate-slide-up hover:shadow-2xl transition-shadow duration-300">
                                                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                                                <div className="w-10 h-10 bg-gradient-to-br from-accent-cyan to-primary rounded-xl flex items-center justify-center">
                                                                        <span className="text-2xl">🎯</span>
                                                                </div>
                                                                Technical Performance
                                                        </h2>
                                                        <ResponsiveContainer width="100%" height={400}>
                                                                <RechartsRadar data={radarData}>
                                                                        <defs>
                                                                                <linearGradient id="technicalGradient" x1="0" y1="0" x2="0" y2="1">
                                                                                        <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.8} />
                                                                                        <stop offset="100%" stopColor="#6366f1" stopOpacity={0.3} />
                                                                                </linearGradient>
                                                                        </defs>
                                                                        <PolarGrid stroke="#2d2d44" strokeWidth={1.5} />
                                                                        <PolarAngleAxis
                                                                                dataKey="metric"
                                                                                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
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
                                                                                stroke="#06b6d4"
                                                                                fill="url(#technicalGradient)"
                                                                                fillOpacity={0.7}
                                                                                strokeWidth={3}
                                                                        />
                                                                        <Tooltip
                                                                                contentStyle={{
                                                                                        backgroundColor: '#1a1a2e',
                                                                                        border: '2px solid #06b6d4',
                                                                                        borderRadius: '12px',
                                                                                        boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
                                                                                }}
                                                                        />
                                                                </RechartsRadar>
                                                        </ResponsiveContainer>
                                                </Card>

                                                {/* Area Chart - Test Coverage Visualization */}
                                                <Card className="p-8 animate-slide-up hover:shadow-2xl transition-shadow duration-300" style={{ animationDelay: '0.1s' }}>
                                                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                                                <div className="w-10 h-10 bg-gradient-to-br from-success to-green-400 rounded-xl flex items-center justify-center">
                                                                        <span className="text-2xl">📊</span>
                                                                </div>
                                                                Metric Distribution
                                                        </h2>
                                                        <ResponsiveContainer width="100%" height={400}>
                                                                <AreaChart data={radarData}>
                                                                        <defs>
                                                                                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                                                                        <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                                                                                        <stop offset="100%" stopColor="#10b981" stopOpacity={0.1} />
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
                                                                                        border: '2px solid #10b981',
                                                                                        borderRadius: '12px',
                                                                                        boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
                                                                                }}
                                                                        />
                                                                        <Area
                                                                                type="monotone"
                                                                                dataKey="score"
                                                                                stroke="#10b981"
                                                                                fill="url(#areaGradient)"
                                                                                strokeWidth={3}
                                                                        />
                                                                </AreaChart>
                                                        </ResponsiveContainer>
                                                </Card>
                                        </div>

                                        {/* Code Quality Indicators */}
                                        <div className="grid md:grid-cols-4 gap-6 mb-10">
                                                {[
                                                        { name: 'Code Quality', value: evaluation.code_generation_quality || 'Good', icon: '💻', score: 80, color: 'primary' },
                                                        { name: 'Readability', value: evaluation.readability_score || 75, icon: '📖', score: evaluation.readability_score || 75, color: 'success' },
                                                        { name: 'Completeness', value: evaluation.completeness_score || 80, icon: '📊', score: evaluation.completeness_score || 80, color: 'accent-pink' },
                                                        { name: 'Working Code', value: evaluation.would_generate_working_code ? 'Yes' : 'No', icon: evaluation.would_generate_working_code ? '✅' : '❌', score: evaluation.would_generate_working_code ? 100 : 0, color: evaluation.would_generate_working_code ? 'success' : 'danger' },
                                                ].map((item, idx) => (
                                                        <Card
                                                                key={item.name}
                                                                className="p-6 animate-slide-up hover:scale-105 transition-all duration-300"
                                                                style={{ animationDelay: `${idx * 0.1}s` }}
                                                                hasTopBorder
                                                                borderColor={`from-${item.color} to-${item.color}-light`}
                                                        >
                                                                <div className="flex items-center justify-between mb-3">
                                                                        <span className="text-3xl">{item.icon}</span>
                                                                        <span className={`text-2xl font-bold ${getScoreColorSolid(item.score)}`}>
                                                                                {typeof item.value === 'number' ? item.value.toFixed(0) : item.value}
                                                                        </span>
                                                                </div>
                                                                <div className="text-sm text-text-secondary mb-2">{item.name}</div>
                                                                <div className="w-full bg-bg-dark rounded-full h-2">
                                                                        <div
                                                                                className={`h-2 rounded-full bg-${item.color} transition-all duration-1000`}
                                                                                style={{ width: `${item.score}%` }}
                                                                        ></div>
                                                                </div>
                                                        </Card>
                                                ))}
                                        </div>

                                        {/* Token Efficiency Card */}
                                        {evaluation.token_efficiency && (
                                                <Card className="p-8 mb-10 animate-slide-up">
                                                        <div className="flex items-center gap-3 mb-6">
                                                                <div className="w-12 h-12 bg-gradient-to-br from-accent-cyan to-primary rounded-xl flex items-center justify-center">
                                                                        <span className="text-2xl">🎯</span>
                                                                </div>
                                                                <h2 className="text-2xl font-bold">Token Efficiency</h2>
                                                        </div>

                                                        <div className="grid md:grid-cols-3 gap-6">
                                                                {/* Circular Progress */}
                                                                <div className="flex flex-col items-center justify-center">
                                                                        <div className="relative mb-4">
                                                                                <CircularProgress
                                                                                        score={evaluation.token_efficiency?.useful_percentage || 0}
                                                                                        size={160}
                                                                                        strokeWidth={12}
                                                                                />
                                                                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                                                        <div className={`text-4xl font-extrabold ${getScoreColorSolid(evaluation.token_efficiency?.useful_percentage || 0)}`}>
                                                                                                {(evaluation.token_efficiency?.useful_percentage || 0).toFixed(0)}%
                                                                                        </div>
                                                                                        <div className="text-xs text-text-secondary mt-1">Useful</div>
                                                                                </div>
                                                                        </div>
                                                                </div>

                                                                {/* Metrics */}
                                                                <div className="md:col-span-2 space-y-4">
                                                                        {/* Useful Tokens */}
                                                                        <div className="flex items-center justify-between p-4 bg-success/10 border-2 border-success/30 rounded-xl">
                                                                                <div className="flex items-center gap-3">
                                                                                        <div className="w-3 h-3 bg-success rounded-full"></div>
                                                                                        <span className="text-sm font-semibold">Useful Tokens</span>
                                                                                </div>
                                                                                <span className="text-2xl font-bold text-success">
                                                                                        {(evaluation.token_efficiency?.useful_percentage || 0).toFixed(0)}%
                                                                                </span>
                                                                        </div>

                                                                        {/* Redundant Tokens */}
                                                                        <div className="flex items-center justify-between p-4 bg-danger/10 border-2 border-danger/30 rounded-xl">
                                                                                <div className="flex items-center gap-3">
                                                                                        <div className="w-3 h-3 bg-danger rounded-full"></div>
                                                                                        <span className="text-sm font-semibold">Redundant Tokens</span>
                                                                                </div>
                                                                                <span className="text-2xl font-bold text-danger">
                                                                                        {(evaluation.token_efficiency?.redundant_percentage || 0).toFixed(0)}%
                                                                                </span>
                                                                        </div>

                                                                        {/* Estimated Tokens */}
                                                                        <div className="flex items-center justify-between p-4 bg-bg-input border-2 border-border rounded-xl">
                                                                                <div className="flex items-center gap-3">
                                                                                        <span className="text-xl">📊</span>
                                                                                        <span className="text-sm font-semibold">Estimated Tokens</span>
                                                                                </div>
                                                                                <span className="text-2xl font-bold text-primary">
                                                                                        {evaluation.token_efficiency?.estimated_tokens || 0}
                                                                                </span>
                                                                        </div>
                                                                </div>
                                                        </div>
                                                </Card>
                                        )}

                                        {/* Prompt Comparison */}
                                        <Card className="p-8 mb-10 animate-slide-up">
                                                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent-pink rounded-xl flex items-center justify-center">
                                                                <span className="text-2xl">💻</span>
                                                        </div>
                                                        Prompt Analysis
                                                </h2>
                                                <div className="grid md:grid-cols-2 gap-6">
                                                        {/* Your Prompt */}
                                                        <div className="space-y-4">
                                                                <div className="flex items-center justify-between">
                                                                        <h3 className="text-lg font-semibold flex items-center gap-2">
                                                                                <Badge variant="default" className="px-3 py-1">Your Solution</Badge>
                                                                        </h3>
                                                                        <div className="flex items-center gap-3 text-xs text-text-secondary">
                                                                                <span className="flex items-center gap-1">
                                                                                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                                                                                        {evaluation.word_count || 0} words
                                                                                </span>
                                                                                <span className="flex items-center gap-1">
                                                                                        <span className="w-2 h-2 bg-accent-cyan rounded-full"></span>
                                                                                        {evaluation.token_count || 0} tokens
                                                                                </span>
                                                                        </div>
                                                                </div>
                                                                <div className="relative bg-bg-input rounded-xl p-6 border-2 border-border max-h-96 overflow-y-auto hover:border-primary/50 transition-colors font-mono">
                                                                        <pre className="text-sm text-text-primary whitespace-pre-wrap leading-relaxed">
                                                                                {userPrompt || 'Your original prompt'}
                                                                        </pre>
                                                                </div>
                                                        </div>

                                                        {/* Enhanced Version */}
                                                        <div className="space-y-4">
                                                                <div className="flex items-center justify-between">
                                                                        <h3 className="text-lg font-semibold flex items-center gap-2">
                                                                                <Badge variant="dsa" className="px-3 py-1">✨ Enhanced Version</Badge>
                                                                        </h3>
                                                                        <div className="px-3 py-1 bg-success/10 border border-success/30 rounded-full text-xs font-semibold text-success">
                                                                                Optimized
                                                                        </div>
                                                                </div>
                                                                <div className="relative bg-gradient-to-br from-success/5 via-primary/5 to-accent-cyan/5 rounded-xl p-6 border-2 border-success/30 max-h-96 overflow-y-auto hover:border-success/60 transition-colors font-mono">
                                                                        <pre className="text-sm text-text-primary whitespace-pre-wrap leading-relaxed">
                                                                                {evaluation.improved_prompt || 'Enhanced version with optimizations applied.'}
                                                                        </pre>
                                                                </div>
                                                        </div>
                                                </div>
                                        </Card>

                                        {/* Feedback Cards */}
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
                                                {evaluation.issues_found && evaluation.issues_found.length > 0 && (
                                                        <Card className="p-6 animate-slide-up border-2 border-danger/30 hover:shadow-2xl hover:border-danger/50 transition-all duration-300" style={{ animationDelay: '0.1s' }}>
                                                                <div className="flex items-center gap-3 mb-5">
                                                                        <div className="w-12 h-12 bg-danger/10 border-2 border-danger/30 rounded-xl flex items-center justify-center">
                                                                                <span className="text-2xl">⚠</span>
                                                                        </div>
                                                                        <h3 className="text-xl font-bold text-danger">Issues Found</h3>
                                                                </div>
                                                                <ul className="space-y-3">
                                                                        {evaluation.issues_found.map((issue, idx) => (
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
                                                                        <h3 className="text-xl font-bold text-warning">Improvements</h3>
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
                                                        onClick={() => navigate('/technical-challenge-selector')}
                                                        className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-accent-cyan to-primary hover:from-accent-cyan-dark hover:to-primary-dark transition-all duration-300 transform hover:scale-105"
                                                >
                                                        <span className="text-2xl mr-2">🎯</span>
                                                        Try Another Challenge
                                                </Button>
                                                <Button
                                                        onClick={() => navigate('/dashboard')}
                                                        variant="secondary"
                                                        className="w-full h-14 text-lg font-semibold border-2 border-primary/30 hover:border-primary hover:bg-primary/10 transition-all duration-300 transform hover:scale-105"
                                                >
                                                        <span className="text-2xl mr-2">🏠</span>
                                                        Back to Dashboard
                                                </Button>
                                        </div>
                                </div>
                        </main>
                </div>
        );
}
