import React, { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getTechnicalChallenge, evaluateTechnicalPrompt } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import { RefreshCw, Send, Code, AlertCircle, CheckCircle, Zap, Target } from 'lucide-react'

const TechnicalChallenge = () => {
        const { category } = useParams()
        const location = useLocation()
        const navigate = useNavigate()

        const { difficulty, constraints } = location.state || {
                difficulty: null,
                constraints: { word_limit: 300, token_limit: 400 }
        }

        const [problem, setProblem] = useState(null)
        const [userPrompt, setUserPrompt] = useState('')
        const [loading, setLoading] = useState(true)
        const [evaluating, setEvaluating] = useState(false)
        const [error, setError] = useState('')

        // Real-time stats
        const wordCount = userPrompt.split(/\s+/).filter(w => w.length > 0).length
        const estimatedTokens = Math.round(wordCount * 1.3)
        const wordLimitExceeded = wordCount > constraints.word_limit
        const tokenLimitExceeded = estimatedTokens > constraints.token_limit

        const fetchProblem = async () => {
                setLoading(true)
                setError('')
                setUserPrompt('')
                try {
                        const data = await getTechnicalChallenge(category, difficulty)
                        setProblem(data)
                } catch (err) {
                        setError('Failed to fetch challenge. Please try again.')
                } finally {
                        setLoading(false)
                }
        }

        useEffect(() => {
                fetchProblem()
        }, [category])

        const handleEvaluate = async () => {
                if (!userPrompt.trim()) {
                        setError('Please write a prompt before evaluating')
                        return
                }

                setEvaluating(true)
                setError('')

                const promptToEvaluate = userPrompt

                try {
                        const result = await evaluateTechnicalPrompt(problem, promptToEvaluate, constraints)

                        setTimeout(() => {
                                navigate('/technical-evaluation', {
                                        state: {
                                                evaluation: result,
                                                problem: problem,
                                                userPrompt: promptToEvaluate,
                                                constraints: constraints
                                        },
                                        replace: false
                                })
                        }, 100)
                } catch (err) {
                        console.error('Evaluation error:', err)
                        setError('Evaluation failed. Please try again.')
                        setEvaluating(false)
                }
        }

        const getDifficultyColor = (diff) => {
                switch (diff) {
                        case 'Easy': return 'text-green-600 dark:text-green-400'
                        case 'Medium': return 'text-yellow-600 dark:text-yellow-400'
                        case 'Hard': return 'text-red-600 dark:text-red-400'
                        default: return 'text-gray-600 dark:text-gray-400'
                }
        }

        // Helper function to safely render input/output
        const renderValue = (value) => {
                if (typeof value === 'string') {
                        return value
                }
                if (typeof value === 'object' && value !== null) {
                        return JSON.stringify(value, null, 2)
                }
                return String(value)
        }

        if (loading) {
                return (
                        <div className="min-h-screen flex items-center justify-center">
                                <LoadingSpinner />
                        </div>
                )
        }

        return (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                        >
                                {/* Header */}
                                <div className="flex justify-between items-center">
                                        <div>
                                                <div className="flex items-center space-x-3 mb-2">
                                                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                                                {problem?.title}
                                                        </h1>
                                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(problem?.difficulty)}`}>
                                                                {problem?.difficulty}
                                                        </span>
                                                </div>
                                                <p className="text-gray-600 dark:text-gray-400">{problem?.category_name}</p>
                                        </div>
                                        <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={fetchProblem}
                                                className="flex items-center space-x-2 px-4 py-2 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
                                        >
                                                <RefreshCw className="h-4 w-4" />
                                                <span>New Problem</span>
                                        </motion.button>
                                </div>

                                {error && (
                                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg">
                                                {error}
                                        </div>
                                )}

                                <div className="grid lg:grid-cols-2 gap-6">
                                        {/* Problem Description */}
                                        <div className="space-y-6">
                                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                                                Problem Description
                                                        </h2>
                                                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                                                {problem?.description || problem?.scenario || problem?.problem_statement}
                                                        </p>
                                                </div>

                                                {/* Examples */}
                                                {problem?.examples && problem.examples.length > 0 && (
                                                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                                                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                                                        Examples
                                                                </h2>
                                                                <div className="space-y-4">
                                                                        {problem.examples.map((example, idx) => (
                                                                                <div key={idx} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                                                                                        <div className="mb-2">
                                                                                                <span className="font-semibold text-gray-700 dark:text-gray-300">Input:</span>
                                                                                                <code className="block mt-1 text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded whitespace-pre-wrap">
                                                                                                        {renderValue(example.input)}
                                                                                                </code>
                                                                                        </div>
                                                                                        <div className="mb-2">
                                                                                                <span className="font-semibold text-gray-700 dark:text-gray-300">Output:</span>
                                                                                                <code className="block mt-1 text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded whitespace-pre-wrap">
                                                                                                        {renderValue(example.output)}
                                                                                                </code>
                                                                                        </div>
                                                                                        {example.explanation && (
                                                                                                <div>
                                                                                                        <span className="font-semibold text-gray-700 dark:text-gray-300">Explanation:</span>
                                                                                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                                                                                {example.explanation}
                                                                                                        </p>
                                                                                                </div>
                                                                                        )}
                                                                                </div>
                                                                        ))}
                                                                </div>
                                                        </div>
                                                )}

                                                {/* Constraints */}
                                                {problem?.constraints && problem.constraints.length > 0 && (
                                                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                                                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                                                        Constraints
                                                                </h2>
                                                                <ul className="space-y-2">
                                                                        {problem.constraints.map((constraint, idx) => (
                                                                                <li key={idx} className="text-gray-700 dark:text-gray-300 flex items-start">
                                                                                        <span className="text-primary-500 mr-2">•</span>
                                                                                        <span>{constraint}</span>
                                                                                </li>
                                                                        ))}
                                                                </ul>
                                                        </div>
                                                )}
                                        </div>

                                        {/* Prompt Writing Area */}
                                        <div className="space-y-6">
                                                {/* Constraint Display */}
                                                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl shadow-lg p-6 border-2 border-yellow-300 dark:border-yellow-700">
                                                        <div className="flex items-center space-x-2 mb-4">
                                                                <Zap className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                                                        Challenge Constraints
                                                                </h3>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                                <div className={`p-4 rounded-lg ${wordLimitExceeded ? 'bg-red-100 dark:bg-red-900/30' : 'bg-white dark:bg-gray-800'}`}>
                                                                        <div className="text-2xl font-bold mb-1">
                                                                                {wordLimitExceeded ? (
                                                                                        <span className="text-red-600 dark:text-red-400">{wordCount}</span>
                                                                                ) : (
                                                                                        <span className="text-gray-900 dark:text-white">{wordCount}</span>
                                                                                )}
                                                                                <span className="text-sm text-gray-500 dark:text-gray-400"> / {constraints.word_limit}</span>
                                                                        </div>
                                                                        <div className="text-sm text-gray-600 dark:text-gray-400">Words</div>
                                                                        {wordLimitExceeded && (
                                                                                <div className="flex items-center space-x-1 mt-2 text-xs text-red-600 dark:text-red-400">
                                                                                        <AlertCircle className="h-3 w-3" />
                                                                                        <span>Over limit!</span>
                                                                                </div>
                                                                        )}
                                                                </div>
                                                                <div className={`p-4 rounded-lg ${tokenLimitExceeded ? 'bg-red-100 dark:bg-red-900/30' : 'bg-white dark:bg-gray-800'}`}>
                                                                        <div className="text-2xl font-bold mb-1">
                                                                                {tokenLimitExceeded ? (
                                                                                        <span className="text-red-600 dark:text-red-400">{estimatedTokens}</span>
                                                                                ) : (
                                                                                        <span className="text-gray-900 dark:text-white">{estimatedTokens}</span>
                                                                                )}
                                                                                <span className="text-sm text-gray-500 dark:text-gray-400"> / {constraints.token_limit}</span>
                                                                        </div>
                                                                        <div className="text-sm text-gray-600 dark:text-gray-400">Tokens</div>
                                                                        {tokenLimitExceeded && (
                                                                                <div className="flex items-center space-x-1 mt-2 text-xs text-red-600 dark:text-red-400">
                                                                                        <AlertCircle className="h-3 w-3" />
                                                                                        <span>Over limit!</span>
                                                                                </div>
                                                                        )}
                                                                </div>
                                                        </div>
                                                </div>

                                                {/* Prompt Input */}
                                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                                                        <div className="flex items-center space-x-2 mb-4">
                                                                <Code className="h-5 w-5 text-primary-500" />
                                                                <label className="text-lg font-bold text-gray-900 dark:text-white">
                                                                        Write Your Solution Prompt
                                                                </label>
                                                        </div>
                                                        <textarea
                                                                value={userPrompt}
                                                                onChange={(e) => setUserPrompt(e.target.value)}
                                                                className={`w-full h-96 px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-white resize-none font-mono text-sm ${wordLimitExceeded || tokenLimitExceeded
                                                                                ? 'border-red-300 dark:border-red-700'
                                                                                : 'border-gray-300 dark:border-gray-600'
                                                                        }`}
                                                                placeholder="Write a detailed prompt that would generate code to solve this problem...

Example structure:
- Explain the approach/algorithm
- Mention data structures to use
- Specify time/space complexity targets
- Handle edge cases
- Provide clear implementation steps"
                                                        />

                                                        {(wordLimitExceeded || tokenLimitExceeded) && (
                                                                <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                                                                        <p className="text-sm text-red-600 dark:text-red-400 font-semibold">
                                                                                ⚠️ You've exceeded the constraints! Your score will be penalized.
                                                                        </p>
                                                                </div>
                                                        )}
                                                </div>

                                                {/* Submit Button */}
                                                <motion.button
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={handleEvaluate}
                                                        disabled={evaluating || !userPrompt.trim()}
                                                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg"
                                                >
                                                        {evaluating ? (
                                                                <LoadingSpinner />
                                                        ) : (
                                                                <>
                                                                        <Target className="h-5 w-5" />
                                                                        <span>Evaluate & Run Tests</span>
                                                                </>
                                                        )}
                                                </motion.button>
                                        </div>
                                </div>
                        </motion.div>
                </div>
        )
}

export default TechnicalChallenge
