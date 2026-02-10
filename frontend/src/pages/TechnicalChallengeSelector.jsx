import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Code2, Database, Network, ChevronRight, Zap, Target } from 'lucide-react'

const TechnicalChallengeSelector = () => {
        const navigate = useNavigate()
        const [selectedCategory, setSelectedCategory] = useState(null)
        const [selectedDifficulty, setSelectedDifficulty] = useState(null)
        const [wordLimit, setWordLimit] = useState(300)
        const [tokenLimit, setTokenLimit] = useState(400)

        const categories = [
                {
                        id: 'dsa',
                        name: 'Data Structures & Algorithms',
                        description: 'Array, String, Tree, Graph, DP, Sorting, Searching',
                        icon: Code2,
                        color: 'from-blue-500 to-cyan-500',
                        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
                        borderColor: 'border-blue-200 dark:border-blue-800'
                },
                {
                        id: 'dbms',
                        name: 'Database Management',
                        description: 'SQL, Schema Design, Query Optimization, Indexing',
                        icon: Database,
                        color: 'from-green-500 to-emerald-500',
                        bgColor: 'bg-green-50 dark:bg-green-900/20',
                        borderColor: 'border-green-200 dark:border-green-800'
                },
                {
                        id: 'daa',
                        name: 'Design & Analysis of Algorithms',
                        description: 'Greedy, Divide & Conquer, Backtracking, Graph Algorithms',
                        icon: Network,
                        color: 'from-purple-500 to-pink-500',
                        bgColor: 'bg-purple-50 dark:bg-purple-900/20',
                        borderColor: 'border-purple-200 dark:border-purple-800'
                }
        ]

        const difficulties = [
                { id: 'Easy', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30' },
                { id: 'Medium', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
                { id: 'Hard', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30' }
        ]

        const handleStart = () => {
                if (selectedCategory) {
                        navigate(`/technical-challenge/${selectedCategory}`, {
                                state: {
                                        difficulty: selectedDifficulty,
                                        constraints: {
                                                word_limit: wordLimit,
                                                token_limit: tokenLimit
                                        }
                                }
                        })
                }
        }

        return (
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
                                                transition={{ type: "spring", stiffness: 200 }}
                                                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-4"
                                        >
                                                <Target className="h-10 w-10 text-white" />
                                        </motion.div>
                                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                                                Technical Challenge Mode
                                        </h1>
                                        <p className="text-xl text-gray-600 dark:text-gray-400">
                                                Solve coding problems by crafting the perfect prompt
                                        </p>
                                </div>

                                {/* Category Selection */}
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                                Select Challenge Category
                                        </h2>
                                        <div className="grid md:grid-cols-3 gap-6">
                                                {categories.map((category) => (
                                                        <motion.button
                                                                key={category.id}
                                                                whileHover={{ scale: 1.02 }}
                                                                whileTap={{ scale: 0.98 }}
                                                                onClick={() => setSelectedCategory(category.id)}
                                                                className={`p-6 rounded-xl border-2 transition-all ${selectedCategory === category.id
                                                                                ? `${category.borderColor} ${category.bgColor}`
                                                                                : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900'
                                                                        }`}
                                                        >
                                                                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${category.color} mb-4`}>
                                                                        <category.icon className="h-8 w-8 text-white" />
                                                                </div>
                                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                                                        {category.name}
                                                                </h3>
                                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                        {category.description}
                                                                </p>
                                                        </motion.button>
                                                ))}
                                        </div>
                                </div>

                                {/* Difficulty Selection */}
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                                Select Difficulty (Optional)
                                        </h2>
                                        <div className="flex gap-4">
                                                <button
                                                        onClick={() => setSelectedDifficulty(null)}
                                                        className={`flex-1 py-4 px-6 rounded-lg font-semibold transition-all ${selectedDifficulty === null
                                                                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                                                                        : 'bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400'
                                                                }`}
                                                >
                                                        Random
                                                </button>
                                                {difficulties.map((diff) => (
                                                        <button
                                                                key={diff.id}
                                                                onClick={() => setSelectedDifficulty(diff.id)}
                                                                className={`flex-1 py-4 px-6 rounded-lg font-semibold transition-all ${selectedDifficulty === diff.id
                                                                                ? `${diff.bg} ${diff.color}`
                                                                                : 'bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400'
                                                                        }`}
                                                        >
                                                                {diff.id}
                                                        </button>
                                                ))}
                                        </div>
                                </div>

                                {/* Constraint Settings */}
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                                        <div className="flex items-center space-x-2 mb-6">
                                                <Zap className="h-6 w-6 text-yellow-500" />
                                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                                        Set Your Constraints
                                                </h2>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-6">
                                                {/* Word Limit */}
                                                <div>
                                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                                                Word Limit: {wordLimit} words
                                                        </label>
                                                        <input
                                                                type="range"
                                                                min="50"
                                                                max="500"
                                                                step="50"
                                                                value={wordLimit}
                                                                onChange={(e) => setWordLimit(Number(e.target.value))}
                                                                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
                                                        />
                                                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                                <span>50</span>
                                                                <span>500</span>
                                                        </div>
                                                </div>

                                                {/* Token Limit */}
                                                <div>
                                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                                                Token Limit: {tokenLimit} tokens
                                                        </label>
                                                        <input
                                                                type="range"
                                                                min="100"
                                                                max="1000"
                                                                step="50"
                                                                value={tokenLimit}
                                                                onChange={(e) => setTokenLimit(Number(e.target.value))}
                                                                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
                                                        />
                                                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                                <span>100</span>
                                                                <span>1000</span>
                                                        </div>
                                                </div>
                                        </div>

                                        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                                <p className="text-sm text-blue-800 dark:text-blue-300">
                                                        <strong>Challenge Mode:</strong> Your prompt must stay within these limits!
                                                        Going over will affect your score. Constraints make you think efficiently!
                                                </p>
                                        </div>
                                </div>

                                {/* Start Button */}
                                <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleStart}
                                        disabled={!selectedCategory}
                                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-6 rounded-xl font-bold text-xl hover:from-indigo-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 shadow-xl"
                                >
                                        <span>Start Challenge</span>
                                        <ChevronRight className="h-6 w-6" />
                                </motion.button>
                        </motion.div>
                </div>
        )
}

export default TechnicalChallengeSelector
