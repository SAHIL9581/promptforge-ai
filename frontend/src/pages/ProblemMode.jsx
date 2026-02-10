import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getSystemProblem, getAIProblem, evaluatePrompt } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import { RefreshCw, Send } from 'lucide-react'

const ProblemMode = () => {
        const [searchParams] = useSearchParams()
        const navigate = useNavigate()
        const problemType = searchParams.get('type') || 'system'

        const [problem, setProblem] = useState(null)
        const [userPrompt, setUserPrompt] = useState('')
        const [loading, setLoading] = useState(true)
        const [evaluating, setEvaluating] = useState(false)
        const [error, setError] = useState('')

        const fetchProblem = async () => {
                setLoading(true)
                setError('')
                try {
                        const data = problemType === 'ai' ? await getAIProblem() : await getSystemProblem()
                        setProblem(data)
                } catch (err) {
                        setError('Failed to fetch problem. Please try again.')
                } finally {
                        setLoading(false)
                }
        }

        useEffect(() => {
                fetchProblem()
        }, [problemType])

        const handleEvaluate = async () => {
                if (!userPrompt.trim()) {
                        setError('Please write a prompt before evaluating')
                        return
                }

                setEvaluating(true)
                setError('')

                // Capture the prompt before async operation
                const promptToEvaluate = userPrompt

                try {
                        const result = await evaluatePrompt(problem.problem_text, problem.source, promptToEvaluate)

                        console.log('Navigating with prompt:', promptToEvaluate) // Debug

                        setTimeout(() => {
                                navigate('/evaluation', {
                                        state: {
                                                evaluation: result,
                                                problem: problem.problem_text,
                                                userPrompt: promptToEvaluate
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

        if (loading) {
                return (
                        <div className="min-h-screen flex items-center justify-center">
                                <LoadingSpinner />
                        </div>
                )
        }

        return (
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
                        >
                                <div className="flex justify-between items-center mb-6">
                                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                                {problemType === 'ai' ? 'AI Generated Problem' : 'Real-World Problem'}
                                        </h1>
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
                                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
                                                {error}
                                        </div>
                                )}

                                <div className="mb-8">
                                        <div className="flex items-center justify-between mb-4">
                                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Problem Statement</h2>
                                                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                                                        {problem?.source}
                                                </span>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                                        {problem?.problem_text}
                                                </p>
                                        </div>
                                </div>

                                <div className="mb-6">
                                        <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                                Write Your Prompt
                                        </label>
                                        <textarea
                                                value={userPrompt}
                                                onChange={(e) => setUserPrompt(e.target.value)}
                                                className="w-full h-64 px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-white resize-none"
                                                placeholder="Write a detailed prompt that addresses the problem above. Include role definition, clear tasks, constraints, output format, and evaluation criteria..."
                                        />
                                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                                {userPrompt.length} characters
                                        </p>
                                </div>

                                <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleEvaluate}
                                        disabled={evaluating || !userPrompt.trim()}
                                        className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-4 rounded-lg font-semibold hover:from-primary-600 hover:to-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                >
                                        {evaluating ? (
                                                <LoadingSpinner />
                                        ) : (
                                                <>
                                                        <Send className="h-5 w-5" />
                                                        <span>Evaluate My Prompt</span>
                                                </>
                                        )}
                                </motion.button>
                        </motion.div>
                </div>
        )
}

export default ProblemMode
