import React from 'react'
import { motion } from 'framer-motion'

const ScoreCard = ({ title, score, icon: Icon, color = "blue" }) => {
        const colorClasses = {
                blue: 'from-blue-500 to-blue-600',
                green: 'from-green-500 to-green-600',
                purple: 'from-purple-500 to-purple-600',
                orange: 'from-orange-500 to-orange-600',
                pink: 'from-pink-500 to-pink-600',
                indigo: 'from-indigo-500 to-indigo-600'
        }

        return (
                <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700"
                >
                        <div className="flex items-center justify-between">
                                <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
                                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{score}</p>
                                </div>
                                <div className={`p-3 rounded-full bg-gradient-to-br ${colorClasses[color]}`}>
                                        <Icon className="h-6 w-6 text-white" />
                                </div>
                        </div>
                </motion.div>
        )
}

export default ScoreCard
