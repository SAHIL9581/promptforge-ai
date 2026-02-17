import React from 'react'
import { motion } from 'framer-motion'

const BadgeCard = ({ badge, earned = false }) => {
        return (
                <motion.div
                        whileHover={{ scale: 1.05 }}
                        className={`p-4 rounded-lg border-2 transition-all ${earned
                                ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-400'
                                : 'bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 opacity-60'
                                }`}
                >
                        <div className="flex flex-col items-center text-center space-y-2">
                                <div className="text-4xl">{badge.icon}</div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">{badge.name}</h3>
                                <p className="text-xs text-gray-600 dark:text-gray-400">{badge.description}</p>
                                {earned && badge.earned_at && (
                                        <p className="text-xs text-yellow-600 dark:text-yellow-400">
                                                Earned: {new Date(badge.earned_at).toLocaleDateString()}
                                        </p>
                                )}
                        </div>
                </motion.div>
        )
}

export default BadgeCard
