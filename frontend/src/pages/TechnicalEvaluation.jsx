import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
        Award, TrendingUp, CheckCircle, AlertCircle, Code, Home,
        Play, Zap, Target, XCircle, Activity, FileCode, Lightbulb
} from 'lucide-react'

const TechnicalEvaluation = () => {
        const location = useLocation()
        const navigate = useNavigate()
        const { evaluation, problem, userPrompt, constraints } = location.state || {}

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

        const metrics = [
                { name: 'Problem Understanding', score: evaluation.problem_understanding, icon: Target },
                { name: 'Approach Clarity', score: evaluation.approach_clarity, icon: Code },
                { name: 'Implementation Details', score: evaluation.implementation_details, icon: FileCode },
                { name: 'Edge Case Handling', score: evaluation.edge_case_handling, icon: AlertCircle },
                { name: 'Complexity Analysis', score: evaluation.complexity_analysis, icon: Activity },
                { name: 'Code Structure', score: evaluation.code_structure, icon: FileCode },
                { name: 'Constraint Adherence', score: evaluation.constraint_adherence, icon: Zap },
                { name: 'Correctness', score: evaluation.correctness, icon: CheckCircle }
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
                                                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-4"
                                        >
                                                <Award className="h-10 w-10 text-white" />
                                        </motion.div>
                                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                                                Technical Challenge Results
                                        </h1>
                                        <p className="text-xl text-gray-600 dark:text-gray-400">
                                                Your prompt has been evaluated and tested
                                        </p>
                                </div>

                                {/* Overall Score & Test Results */}
                                <div className="grid md:grid-cols-3 gap-6">
                                        {/* Overall Score */}
                                        <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-2xl p-8 text-white"
                                        >
                                                <div className="text-center">
                                                        <div className="text-6xl font-bold mb-2">{evaluation.overall_score.toFixed(1)}</div>
                                                        <div className="text-xl opacity-90 mb-4">Overall Score</div>
                                                        <div className="text-lg font-semibold">{getScoreGrade(evaluation.overall_score)}</div>
                                                </div>
                                        </motion.div>

                                        {/* Test Execution Results */}
                                        <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.1 }}
                                                className={`rounded-2xl shadow-2xl p-8 ${evaluation.would_generate_working_code
                                                                ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                                                                : 'bg-gradient-to-br from-red-500 to-pink-600'
                                                        } text-white`}
                                        >
                                                <div className="text-center">
                                                        {evaluation.would_generate_working_code ? (
                                                                <CheckCircle className="h-16 w-16 mx-auto mb-4" />
                                                        ) : (
                                                                <XCircle className="h-16 w-16 mx-auto mb-4" />
                                                        )}
                                                        <div className="text-3xl font-bold mb-2">
                                                                {evaluation.passed_test_cases}/{evaluation.total_test_cases}
                                                        </div>
                                                        <div className="text-lg opacity-90">Test Cases Passed</div>
                                                        <div className="text-sm mt-2 opacity-80">
                                                                {evaluation.estimated_test_pass_rate.toFixed(0)}% Success Rate
                                                        </div>
                                                </div>
                                        </motion.div>

                                        {/* XP & Level */}
                                        <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.2 }}
                                                className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl shadow-2xl p-8 text-white"
                                        >
                                                <div className="text-center">
                                                        <div className="text-5xl font-bold mb-2">+{evaluation.xp_earned}</div>
                                                        <div className="text-xl opacity-90 mb-2">XP Earned</div>
                                                        <div className="text-lg font-semibold">Level: {evaluation.new_level}</div>
                                                        {evaluation.constraints_met && (
                                                                <div className="mt-3 flex items-center justify-center space-x-1 text-sm bg-white/20 rounded-full px-3 py-1">
                                                                        <CheckCircle className="h-4 w-4" />
                                                                        <span>Constraints Met!</span>
                                                                </div>
                                                        )}
                                                </div>
                                        </motion.div>
                                </div>

                                {/* Constraint Adherence */}
                                <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`rounded-2xl shadow-xl p-8 border-2 ${evaluation.constraints_met
                                                        ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                                                        : 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
                                                }`}
                                >
                                        <div className="flex items-center justify-between">
                                                <div>
                                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                                                Constraint Check
                                                        </h3>
                                                        <div className="flex items-center space-x-6 text-sm">
                                                                <div>
                                                                        <span className="text-gray-600 dark:text-gray-400">Words: </span>
                                                                        <span className={`font-bold ${evaluation.word_count > constraints.word_limit ? 'text-red-600' : 'text-green-600'}`}>
                                                                                {evaluation.word_count}/{constraints.word_limit}
                                                                        </span>
                                                                </div>
                                                                <div>
                                                                        <span className="text-gray-600 dark:text-gray-400">Tokens: </span>
                                                                        <span className={`font-bold ${evaluation.token_count > constraints.token_limit ? 'text-red-600' : 'text-green-600'}`}>
                                                                                {evaluation.token_count}/{constraints.token_limit}
                                                                        </span>
                                                                </div>
                                                        </div>
                                                        {evaluation.constraint_violations.length > 0 && (
                                                                <div className="mt-2 space-y-1">
                                                                        {evaluation.constraint_violations.map((violation, idx) => (
                                                                                <p key={idx} className="text-sm text-red-600 dark:text-red-400">⚠️ {violation}</p>
                                                                        ))}
                                                                </div>
                                                        )}
                                                </div>
                                                <div>
                                                        {evaluation.constraints_met ? (
                                                                <CheckCircle className="h-12 w-12 text-green-500" />
                                                        ) : (
                                                                <XCircle className="h-12 w-12 text-red-500" />
                                                        )}
                                                </div>
                                        </div>
                                </motion.div>

                                {/* Code Generation Quality */}
                                <div className="grid md:grid-cols-3 gap-6">
                                        <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-blue-500"
                                        >
                                                <div className="flex items-center justify-between mb-2">
                                                        <span className="text-gray-600 dark:text-gray-400 text-sm">Code Quality</span>
                                                        <Code className="h-5 w-5 text-blue-500" />
                                                </div>
                                                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                                        {evaluation.code_generation_quality}
                                                </div>
                                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                        <div
                                                                className="bg-blue-500 h-2 rounded-full"
                                                                style={{
                                                                        width: `${evaluation.code_generation_quality === 'Excellent' ? 100 :
                                                                                        evaluation.code_generation_quality === 'Good' ? 75 :
                                                                                                evaluation.code_generation_quality === 'Fair' ? 50 : 25
                                                                                }%`
                                                                }}
                                                        />
                                                </div>
                                        </motion.div>

                                        <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.1 }}
                                                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-green-500"
                                        >
                                                <div className="flex items-center justify-between mb-2">
                                                        <span className="text-gray-600 dark:text-gray-400 text-sm">Readability</span>
                                                        <FileCode className="h-5 w-5 text-green-500" />
                                                </div>
                                                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                                        {evaluation.readability_score.toFixed(0)}
                                                </div>
                                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${evaluation.readability_score}%` }} />
                                                </div>
                                        </motion.div>

                                        <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.2 }}
                                                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-purple-500"
                                        >
                                                <div className="flex items-center justify-between mb-2">
                                                        <span className="text-gray-600 dark:text-gray-400 text-sm">Completeness</span>
                                                        <Activity className="h-5 w-5 text-purple-500" />
                                                </div>
                                                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                                        {evaluation.completeness_score.toFixed(0)}
                                                </div>
                                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${evaluation.completeness_score}%` }} />
                                                </div>
                                        </motion.div>
                                </div>

                                {/* Detailed Metrics Grid */}
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                                Detailed Score Breakdown
                                        </h2>
                                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                {metrics.map((metric, idx) => (
                                                        <motion.div
                                                                key={idx}
                                                                initial={{ opacity: 0, scale: 0.9 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                transition={{ delay: idx * 0.05 }}
                                                                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                                                        >
                                                                <div className="flex items-center space-x-2 mb-2">
                                                                        <metric.icon className="h-5 w-5 text-primary-500" />
                                                                        <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                                                                                {metric.name}
                                                                        </span>
                                                                </div>
                                                                <div className={`text-2xl font-bold ${getScoreColor(metric.score)}`}>
                                                                        {metric.score.toFixed(0)}
                                                                </div>
                                                                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 mt-2">
                                                                        <div
                                                                                className={`h-1.5 rounded-full ${metric.score >= 80 ? 'bg-green-500' :
                                                                                                metric.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                                                                        }`}
                                                                                style={{ width: `${metric.score}%` }}
                                                                        />
                                                                </div>
                                                        </motion.div>
                                                ))}
                                        </div>
                                </div>

                                {/* Prompt Comparison */}
                                <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
                                >
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                                                <Code className="mr-2" /> Prompt Comparison
                                        </h2>
                                        <div className="grid md:grid-cols-2 gap-6">
                                                {/* User's Prompt */}
                                                <div className="space-y-3">
                                                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                                                                <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm mr-2">
                                                                        Your Prompt
                                                                </span>
                                                        </h3>
                                                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600 max-h-96 overflow-y-auto">
                                                                <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-mono">
                                                                        {userPrompt}
                                                                </pre>
                                                        </div>
                                                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                                                                <span>Words: {evaluation.word_count}</span>
                                                                <span>•</span>
                                                                <span>Tokens: ~{evaluation.token_count}</span>
                                                        </div>
                                                </div>

                                                {/* AI Improved */}
                                                <div className="space-y-3">
                                                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                                                                <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm mr-2">
                                                                        Enhanced Version
                                                                </span>
                                                        </h3>
                                                        <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-6 border-2 border-green-300 dark:border-green-700 max-h-96 overflow-y-auto">
                                                                <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-mono">
                                                                        {evaluation.improved_prompt}
                                                                </pre>
                                                        </div>
                                                        <div className="flex items-center space-x-2 text-sm">
                                                                <Lightbulb className="h-4 w-4 text-yellow-500" />
                                                                <span className="text-gray-600 dark:text-gray-400">
                                                                        Optimized for correctness and efficiency
                                                                </span>
                                                        </div>
                                                </div>
                                        </div>
                                </motion.div>

                                {/* Issues, Strengths, Suggestions */}
                                <div className="grid md:grid-cols-3 gap-6">
                                        {/* Issues */}
                                        <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
                                        >
                                                <div className="flex items-center space-x-2 mb-4">
                                                        <AlertCircle className="h-6 w-6 text-red-500" />
                                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Issues Found</h3>
                                                </div>
                                                <ul className="space-y-2">
                                                        {evaluation.issues_found.map((issue, idx) => (
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
                                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Improvements</h3>
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

                                {/* Actions */}
                                <div className="flex space-x-4">
                                        <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => navigate('/technical-challenge-selector')}
                                                className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all flex items-center justify-center space-x-2"
                                        >
                                                <Play className="h-5 w-5" />
                                                <span>Try Another Challenge</span>
                                        </motion.button>
                                        <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => navigate('/dashboard')}
                                                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white py-4 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all flex items-center justify-center space-x-2"
                                        >
                                                <Home className="h-5 w-5" />
                                                <span>Back to Dashboard</span>
                                        </motion.button>
                                </div>
                        </motion.div>
                </div>
        )
}

export default TechnicalEvaluation
