import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileText, Sparkles, Lightbulb, TrendingUp, Code2, Zap } from 'lucide-react'

const Dashboard = () => {
        const navigate = useNavigate()

        const modes = [
                {
                        id: 1,
                        title: 'Real-World Problem Mode',
                        description: 'Practice with problems fetched from real news and industry challenges',
                        icon: FileText,
                        color: 'from-blue-500 to-blue-600',
                        path: '/problem-mode?type=system'
                },
                {
                        id: 2,
                        title: 'AI Generated Problem Mode',
                        description: 'Get unique AI-generated problems tailored to current trends',
                        icon: Sparkles,
                        color: 'from-purple-500 to-purple-600',
                        path: '/problem-mode?type=ai'
                },
                {
                        id: 3,
                        title: 'Idea to Prompt Generator',
                        description: 'Transform your ideas into professional, optimized prompts',
                        icon: Lightbulb,
                        color: 'from-green-500 to-green-600',
                        path: '/idea-to-prompt'
                },
                {
                        id: 4,
                        title: 'Technical Challenge Mode',
                        description: 'Solve DSA, DBMS & DAA problems with constrained prompts',
                        icon: Code2,
                        color: 'from-indigo-500 to-purple-600',
                        path: '/technical-challenge-selector',
                        badge: 'NEW'
                }
        ]

        return (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center mb-12"
                        >
                                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                        Welcome to PromptForge AI
                                </h1>
                                <p className="text-xl text-gray-600 dark:text-gray-400">
                                        Master the art of prompt engineering through interactive learning
                                </p>
                        </motion.div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                                {modes.map((mode, index) => (
                                        <motion.div
                                                key={mode.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                whileHover={{ scale: 1.03 }}
                                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden cursor-pointer relative"
                                                onClick={() => navigate(mode.path)}
                                        >
                                                {mode.badge && (
                                                        <div className="absolute top-4 right-4 z-10">
                                                                <span className="px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-bold shadow-lg">
                                                                        {mode.badge}
                                                                </span>
                                                        </div>
                                                )}
                                                <div className={`h-2 bg-gradient-to-r ${mode.color}`} />
                                                <div className="p-6">
                                                        <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${mode.color} mb-4`}>
                                                                <mode.icon className="h-8 w-8 text-white" />
                                                        </div>
                                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                                                {mode.title}
                                                        </h3>
                                                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                                                                {mode.description}
                                                        </p>
                                                        {mode.id === 4 && (
                                                                <div className="mt-3 flex items-center space-x-2 text-xs text-indigo-600 dark:text-indigo-400">
                                                                        <Zap className="h-4 w-4" />
                                                                        <span>LeetCode-style • Constraints</span>
                                                                </div>
                                                        )}
                                                </div>
                                        </motion.div>
                                ))}
                        </div>

                        <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl shadow-xl p-8 text-white"
                        >
                                <div className="flex items-center justify-between">
                                        <div>
                                                <h2 className="text-2xl font-bold mb-2">Track Your Progress</h2>
                                                <p className="text-primary-100">
                                                        View your stats, badges, and improvement over time
                                                </p>
                                        </div>
                                        <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => navigate('/profile')}
                                                className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors flex items-center space-x-2"
                                        >
                                                <TrendingUp className="h-5 w-5" />
                                                <span>View Profile</span>
                                        </motion.button>
                                </div>
                        </motion.div>
                </div>
        )
}

export default Dashboard
