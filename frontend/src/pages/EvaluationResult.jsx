import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Radar, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts'
import { Award, TrendingUp, CheckCircle, AlertCircle, Lightbulb, Home, Zap, Target, Shield, FileText, Code } from 'lucide-react'

const EvaluationResult = () => {
        const location = useLocation()
        const navigate = useNavigate()
        const { evaluation, problem, userPrompt } = location.state || {}

        useEffect(() => {
                if (!evaluation) {
                        navigate('/dashboard')
                }
        }, [evaluation, navigate])

        if (!evaluation) {
                return null
        }

        const getScoreColor = (score) => {
                if (score >= 80) return 'text-green-600 dark:text-green-400'
                if (score >= 60) return 'text-yellow-600 dark:text-yellow-400'
                return 'text-red-600 dark:text-red-400'
        }

        const getScoreGrade = (score) => {
                if (score >= 90) return 'Excellent'
                if (score >= 80) return 'Great'
                if (score >= 70) return 'Good'
                if (score >= 60) return 'Fair'
                return 'Needs Improvement'
        }

        // Radar Chart Data - 6 Main Metrics
        const radarData = [
                { metric: 'Clarity', score: evaluation.clarity_score, fullMark: 100 },
                { metric: 'Specificity', score: evaluation.specificity_score, fullMark: 100 },
                { metric: 'Effectiveness', score: evaluation.effectiveness_score, fullMark: 100 },
                { metric: 'Best Practices', score: evaluation.best_practices_score, fullMark: 100 },
                { metric: 'Efficiency', score: evaluation.efficiency_score, fullMark: 100 },
                { metric: 'Safety', score: evaluation.safety_score, fullMark: 100 }
        ]

        // Bar Chart Data
        const barData = [
                { name: 'Clarity', score: evaluation.clarity_score },
                { name: 'Specificity', score: evaluation.specificity_score },
                { name: 'Effectiveness', score: evaluation.effectiveness_score },
                { name: 'Best Practices', score: evaluation.best_practices_score },
                { name: 'Efficiency', score: evaluation.efficiency_score },
                { name: 'Safety', score: evaluation.safety_score }
        ]

        // Pie Chart Data - Token Efficiency
        const pieData = [
                { name: 'Useful Tokens', value: evaluation.useful_tokens_percentage, color: '#10b981' },
                { name: 'Redundant Tokens', value: evaluation.redundant_tokens_percentage, color: '#ef4444' }
        ]

        // Improvement Potential Data
        const improvementData = [
                { name: 'Current', score: evaluation.overall_score, fill: '#3b82f6' },
                { name: 'Potential', score: evaluation.improvement_potential_score, fill: '#10b981' }
        ]

        // Component Checklist
        const components = [
                { name: 'Role Definition', present: evaluation.has_role_definition, icon: '👤' },
                { name: 'Clear Task', present: evaluation.has_clear_task, icon: '🎯' },
                { name: 'Output Format', present: evaluation.has_output_format, icon: '📄' },
                { name: 'Constraints', present: evaluation.has_constraints, icon: '⚠️' },
                { name: 'Examples', present: evaluation.has_examples, icon: '💡' },
                { name: 'Step-by-Step', present: evaluation.has_step_by_step, icon: '📋' }
        ]

        return (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-8"
                        >
                                {/* Header */}
                                <div className="text-center">
                                        <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full mb-4"
                                        >
                                                <Award className="h-10 w-10 text-white" />
                                        </motion.div>
                                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                                                Comprehensive Evaluation Complete!
                                        </h1>
                                        <p className="text-xl text-gray-600 dark:text-gray-400">
                                                Detailed analysis of your prompt engineering skills
                                        </p>
                                </div>

                                {/* Overall Score Card */}
                                <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-2xl p-8 text-white"
                                >
                                        <div className="grid md:grid-cols-3 gap-6">
                                                <div className="text-center">
                                                        <div className="text-6xl font-bold mb-2">{evaluation.overall_score.toFixed(1)}</div>
                                                        <div className="text-xl opacity-90">Overall Score</div>
                                                        <div className="text-lg mt-2">{getScoreGrade(evaluation.overall_score)}</div>
                                                </div>
                                                <div className="text-center border-l border-r border-primary-400 px-4">
                                                        <div className="text-4xl font-bold mb-2">+{evaluation.xp_earned} XP</div>
                                                        <div className="text-lg opacity-90">Experience Earned</div>
                                                        <div className="text-md mt-2">Level: {evaluation.new_level}</div>
                                                </div>
                                                <div className="text-center">
                                                        <div className="text-4xl font-bold mb-2">{evaluation.improvement_potential_score.toFixed(0)}</div>
                                                        <div className="text-lg opacity-90">Potential Score</div>
                                                        <div className="text-md mt-2">+{(evaluation.improvement_potential_score - evaluation.overall_score).toFixed(0)} points possible</div>
                                                </div>
                                        </div>
                                </motion.div>

                                {/* Main Charts Grid */}
                                <div className="grid md:grid-cols-2 gap-8">
                                        {/* Radar Chart */}
                                        <motion.div
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
                                        >
                                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                                                        <Target className="mr-2" /> Performance Radar
                                                </h2>
                                                <ResponsiveContainer width="100%" height={350}>
                                                        <RechartsRadar data={radarData}>
                                                                <PolarGrid stroke="#4b5563" />
                                                                <PolarAngleAxis dataKey="metric" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                                                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#9ca3af' }} />
                                                                <Radar name="Scores" dataKey="score" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.6} />
                                                        </RechartsRadar>
                                                </ResponsiveContainer>
                                        </motion.div>

                                        {/* Bar Chart */}
                                        <motion.div
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
                                        >
                                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                                                        <TrendingUp className="mr-2" /> Score Breakdown
                                                </h2>
                                                <ResponsiveContainer width="100%" height={350}>
                                                        <BarChart data={barData}>
                                                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                                                <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 11 }} angle={-45} textAnchor="end" height={80} />
                                                                <YAxis tick={{ fill: '#9ca3af' }} domain={[0, 100]} />
                                                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                                                                <Bar dataKey="score" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
                                                        </BarChart>
                                                </ResponsiveContainer>
                                        </motion.div>
                                </div>

                                {/* Secondary Charts Grid */}
                                <div className="grid md:grid-cols-3 gap-6">
                                        {/* Token Efficiency Pie Chart */}
                                        <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
                                        >
                                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                                                        <Zap className="mr-2 h-5 w-5" /> Token Efficiency
                                                </h3>
                                                <ResponsiveContainer width="100%" height={200}>
                                                        <PieChart>
                                                                <Pie
                                                                        data={pieData}
                                                                        cx="50%"
                                                                        cy="50%"
                                                                        innerRadius={50}
                                                                        outerRadius={80}
                                                                        paddingAngle={5}
                                                                        dataKey="value"
                                                                >
                                                                        {pieData.map((entry, index) => (
                                                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                                                        ))}
                                                                </Pie>
                                                                <Tooltip />
                                                        </PieChart>
                                                </ResponsiveContainer>
                                                <div className="mt-4 space-y-2">
                                                        <div className="flex justify-between text-sm">
                                                                <span className="text-gray-600 dark:text-gray-400">Useful:</span>
                                                                <span className="font-semibold text-green-600">{evaluation.useful_tokens_percentage.toFixed(0)}%</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                                <span className="text-gray-600 dark:text-gray-400">Redundant:</span>
                                                                <span className="font-semibold text-red-600">{evaluation.redundant_tokens_percentage.toFixed(0)}%</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm pt-2 border-t border-gray-200 dark:border-gray-700">
                                                                <span className="text-gray-600 dark:text-gray-400">Estimated Tokens:</span>
                                                                <span className="font-semibold">{Math.round(evaluation.estimated_tokens)}</span>
                                                        </div>
                                                </div>
                                        </motion.div>

                                        {/* Improvement Potential */}
                                        <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.1 }}
                                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
                                        >
                                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                                                        <TrendingUp className="mr-2 h-5 w-5" /> Improvement Potential
                                                </h3>
                                                <ResponsiveContainer width="100%" height={200}>
                                                        <BarChart data={improvementData}>
                                                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                                                <XAxis dataKey="name" tick={{ fill: '#9ca3af' }} />
                                                                <YAxis domain={[0, 100]} tick={{ fill: '#9ca3af' }} />
                                                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                                                                <Bar dataKey="score" radius={[8, 8, 0, 0]} />
                                                        </BarChart>
                                                </ResponsiveContainer>
                                        </motion.div>

                                        {/* Component Checklist */}
                                        <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.2 }}
                                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
                                        >
                                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                                                        <FileText className="mr-2 h-5 w-5" /> Prompt Components
                                                </h3>
                                                <div className="space-y-3">
                                                        {components.map((component, idx) => (
                                                                <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                                        <div className="flex items-center space-x-2">
                                                                                <span className="text-xl">{component.icon}</span>
                                                                                <span className="text-sm text-gray-700 dark:text-gray-300">{component.name}</span>
                                                                        </div>
                                                                        <div>
                                                                                {component.present ? (
                                                                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                                                                ) : (
                                                                                        <AlertCircle className="h-5 w-5 text-red-500" />
                                                                                )}
                                                                        </div>
                                                                </div>
                                                        ))}
                                                </div>
                                        </motion.div>
                                </div>

                                {/* Detailed Metrics Grid */}
                                <div className="grid md:grid-cols-3 gap-6">
                                        <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-white dark:bg-gray-800 rounded-xl p-6 border-l-4 border-blue-500"
                                        >
                                                <div className="flex justify-between items-center mb-2">
                                                        <span className="text-gray-600 dark:text-gray-400">Grammar</span>
                                                        <span className={`text-2xl font-bold ${getScoreColor(evaluation.grammar_score)}`}>
                                                                {evaluation.grammar_score.toFixed(0)}
                                                        </span>
                                                </div>
                                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${evaluation.grammar_score}%` }} />
                                                </div>
                                        </motion.div>

                                        <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.1 }}
                                                className="bg-white dark:bg-gray-800 rounded-xl p-6 border-l-4 border-green-500"
                                        >
                                                <div className="flex justify-between items-center mb-2">
                                                        <span className="text-gray-600 dark:text-gray-400">Readability</span>
                                                        <span className={`text-2xl font-bold ${getScoreColor(evaluation.readability_score)}`}>
                                                                {evaluation.readability_score.toFixed(0)}
                                                        </span>
                                                </div>
                                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${evaluation.readability_score}%` }} />
                                                </div>
                                        </motion.div>

                                        <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.2 }}
                                                className="bg-white dark:bg-gray-800 rounded-xl p-6 border-l-4 border-purple-500"
                                        >
                                                <div className="flex justify-between items-center mb-2">
                                                        <span className="text-gray-600 dark:text-gray-400">Ambiguity</span>
                                                        <span className={`text-2xl font-bold ${evaluation.ambiguity_score < 30 ? 'text-green-600 dark:text-green-400' : evaluation.ambiguity_score < 50 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
                                                                {evaluation.ambiguity_score.toFixed(0)}
                                                        </span>
                                                </div>
                                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${evaluation.ambiguity_score}%` }} />
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Lower is better</p>
                                        </motion.div>
                                </div>

                                {/* Prompt Comparison Section */}
                                <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
                                >
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                                                <Code className="mr-2" /> Prompt Comparison
                                        </h2>
                                        <div className="grid md:grid-cols-2 gap-6">
                                                {/* User's Original Prompt */}
                                                <div className="space-y-3">
                                                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                                                                <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm mr-2">Your Prompt</span>
                                                        </h3>
                                                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600 max-h-96 overflow-y-auto">
                                                                <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-mono">
                                                                        {userPrompt || "Your original prompt"}
                                                                </pre>
                                                        </div>
                                                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                                                                <span>Characters: {(userPrompt || "").length}</span>
                                                                <span>•</span>
                                                                <span>Words: {(userPrompt || "").split(/\s+/).length}</span>
                                                                <span>•</span>
                                                                <span>Tokens: ~{Math.round(evaluation.estimated_tokens)}</span>
                                                        </div>
                                                </div>

                                                {/* AI Improved Prompt */}
                                                <div className="space-y-3">
                                                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                                                                <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm mr-2">AI Enhanced Version</span>
                                                        </h3>
                                                        <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-6 border-2 border-green-300 dark:border-green-700 max-h-96 overflow-y-auto">
                                                                <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-mono">
                                                                        {evaluation.ai_improved_prompt}
                                                                </pre>
                                                        </div>
                                                        <div className="flex items-center space-x-2 text-sm">
                                                                <Lightbulb className="h-4 w-4 text-yellow-500" />
                                                                <span className="text-gray-600 dark:text-gray-400">This version incorporates all best practices</span>
                                                        </div>
                                                </div>
                                        </div>
                                </motion.div>

                                {/* Feedback Sections */}
                                <div className="grid md:grid-cols-3 gap-6">
                                        {/* Issues Detected */}
                                        <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
                                        >
                                                <div className="flex items-center space-x-2 mb-4">
                                                        <AlertCircle className="h-6 w-6 text-red-500" />
                                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Issues Detected</h3>
                                                </div>
                                                <ul className="space-y-2">
                                                        {evaluation.issues_detected.map((issue, idx) => (
                                                                <li key={idx} className="text-gray-700 dark:text-gray-300 flex items-start p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                                                        <span className="text-red-500 mr-2">⚠</span>
                                                                        <span className="text-sm">{issue}</span>
                                                                </li>
                                                        ))}
                                                </ul>
                                        </motion.div>

                                        {/* Strengths */}
                                        <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.1 }}
                                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
                                        >
                                                <div className="flex items-center space-x-2 mb-4">
                                                        <CheckCircle className="h-6 w-6 text-green-500" />
                                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Strengths</h3>
                                                </div>
                                                <ul className="space-y-2">
                                                        {evaluation.strengths.map((strength, idx) => (
                                                                <li key={idx} className="text-gray-700 dark:text-gray-300 flex items-start p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                                                        <span className="text-green-500 mr-2">✓</span>
                                                                        <span className="text-sm">{strength}</span>
                                                                </li>
                                                        ))}
                                                </ul>
                                        </motion.div>

                                        {/* Suggestions */}
                                        <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.2 }}
                                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
                                        >
                                                <div className="flex items-center space-x-2 mb-4">
                                                        <Lightbulb className="h-6 w-6 text-yellow-500" />
                                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Actionable Tips</h3>
                                                </div>
                                                <ul className="space-y-2">
                                                        {evaluation.suggestions.map((suggestion, idx) => (
                                                                <li key={idx} className="text-gray-700 dark:text-gray-300 flex items-start p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                                                        <span className="text-yellow-500 mr-2">💡</span>
                                                                        <span className="text-sm">{suggestion}</span>
                                                                </li>
                                                        ))}
                                                </ul>
                                        </motion.div>
                                </div>

                                {/* Badges */}
                                {evaluation.badges_earned && evaluation.badges_earned.length > 0 && (
                                        <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl shadow-xl p-8 border-2 border-yellow-300 dark:border-yellow-700"
                                        >
                                                <div className="flex items-center justify-center space-x-3 mb-4">
                                                        <Award className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">New Badges Earned!</h2>
                                                </div>
                                                <div className="flex flex-wrap justify-center gap-4">
                                                        {evaluation.badges_earned.map((badge, idx) => (
                                                                <motion.div
                                                                        key={idx}
                                                                        initial={{ scale: 0, rotate: -180 }}
                                                                        animate={{ scale: 1, rotate: 0 }}
                                                                        transition={{ delay: idx * 0.1, type: 'spring' }}
                                                                        className="bg-white dark:bg-gray-800 px-6 py-3 rounded-full shadow-lg border-2 border-yellow-400 dark:border-yellow-600"
                                                                >
                                                                        <span className="text-lg font-semibold text-yellow-700 dark:text-yellow-300">🏆 {badge}</span>
                                                                </motion.div>
                                                        ))}
                                                </div>
                                        </motion.div>
                                )}

                                {/* Back Button */}
                                <div className="flex space-x-4">
                                        <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => navigate('/dashboard')}
                                                className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 text-white py-4 rounded-lg font-semibold hover:from-primary-600 hover:to-primary-700 transition-all flex items-center justify-center space-x-2"
                                        >
                                                <Home className="h-5 w-5" />
                                                <span>Back to Dashboard</span>
                                        </motion.button>
                                </div>
                        </motion.div>
                </div>
        )
}

export default EvaluationResult
