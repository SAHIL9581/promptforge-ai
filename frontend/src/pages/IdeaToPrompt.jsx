import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { generatePrompt, evaluatePrompt } from '../services/api'
import { useNavigate } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner'
import { Wand2, Edit3, Send } from 'lucide-react'

const IdeaToPrompt = () => {
        const navigate = useNavigate()
        const [idea, setIdea] = useState('')
        const [generatedPrompt, setGeneratedPrompt] = useState('')
        const [loading, setLoading] = useState(false)
        const [evaluating, setEvaluating] = useState(false)
        const [error, setError] = useState('')
        const [isEditing, setIsEditing] = useState(false)

        const handleGenerate = async () => {
                if (!idea.trim()) {
                        setError('Please enter your idea')
                        return
                }

                setLoading(true)
                setError('')

                try {
                        const result = await generatePrompt(idea)
                        setGeneratedPrompt(result.generated_prompt)
                        setIsEditing(true)
                } catch (err) {
                        setError('Failed to generate prompt. Please try again.')
                } finally {
                        setLoading(false)
                }
        }

        const handleEvaluate = async () => {
                if (!generatedPrompt.trim()) {
                        setError('No prompt to evaluate')
                        return
                }

                setEvaluating(true)
                setError('')

                try {
                        const result = await evaluatePrompt(
                                `User's original idea: ${idea}`,
                                'Idea to Prompt Generator',
                                generatedPrompt
                        )
                        navigate('/evaluation', { state: { evaluation: result, problem: idea } })
                } catch (err) {
                        setError('Evaluation failed. Please try again.')
                } finally {
                        setEvaluating(false)
                }
        }

        return (
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
                        >
                                <div className="text-center mb-8">
                                        <Wand2 className="h-12 w-12 text-primary-500 mx-auto mb-4" />
                                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                                Idea to Prompt Generator
                                        </h1>
                                        <p className="text-gray-600 dark:text-gray-400">
                                                Transform your ideas into professional, optimized AI prompts
                                        </p>
                                </div>

                                {error && (
                                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
                                                {error}
                                        </div>
                                )}

                                <div className="mb-8">
                                        <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                                Describe Your Idea
                                        </label>
                                        <textarea
                                                value={idea}
                                                onChange={(e) => setIdea(e.target.value)}
                                                className="w-full h-32 px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-white resize-none"
                                                placeholder="Example: AI system to detect fake news on social media platforms"
                                                disabled={loading || evaluating}
                                        />
                                </div>

                                {!generatedPrompt && (
                                        <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={handleGenerate}
                                                disabled={loading || !idea.trim()}
                                                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                        >
                                                {loading ? (
                                                        <LoadingSpinner />
                                                ) : (
                                                        <>
                                                                <Wand2 className="h-5 w-5" />
                                                                <span>Generate Professional Prompt</span>
                                                        </>
                                                )}
                                        </motion.button>
                                )}

                                {generatedPrompt && (
                                        <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="space-y-6"
                                        >
                                                <div>
                                                        <div className="flex items-center justify-between mb-4">
                                                                <label className="block text-lg font-semibold text-gray-900 dark:text-white">
                                                                        Generated Prompt
                                                                </label>
                                                                <button
                                                                        onClick={() => setIsEditing(!isEditing)}
                                                                        className="flex items-center space-x-2 px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
                                                                >
                                                                        <Edit3 className="h-4 w-4" />
                                                                        <span>{isEditing ? 'Lock' : 'Edit'}</span>
                                                                </button>
                                                        </div>
                                                        <textarea
                                                                value={generatedPrompt}
                                                                onChange={(e) => setGeneratedPrompt(e.target.value)}
                                                                disabled={!isEditing}
                                                                className="w-full h-96 px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-white resize-none disabled:opacity-75"
                                                        />
                                                </div>

                                                <div className="flex space-x-4">
                                                        <motion.button
                                                                whileHover={{ scale: 1.02 }}
                                                                whileTap={{ scale: 0.98 }}
                                                                onClick={() => {
                                                                        setGeneratedPrompt('')
                                                                        setIsEditing(false)
                                                                }}
                                                                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                                        >
                                                                Generate New
                                                        </motion.button>
                                                        <motion.button
                                                                whileHover={{ scale: 1.02 }}
                                                                whileTap={{ scale: 0.98 }}
                                                                onClick={handleEvaluate}
                                                                disabled={evaluating}
                                                                className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 rounded-lg font-semibold hover:from-primary-600 hover:to-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                                        >
                                                                {evaluating ? (
                                                                        <LoadingSpinner />
                                                                ) : (
                                                                        <>
                                                                                <Send className="h-5 w-5" />
                                                                                <span>Evaluate Prompt</span>
                                                                        </>
                                                                )}
                                                        </motion.button>
                                                </div>
                                        </motion.div>
                                )}
                        </motion.div>
                </div>
        )
}

export default IdeaToPrompt
