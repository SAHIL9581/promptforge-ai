import React from 'react'
import { motion } from 'framer-motion'

const ProgressBar = ({ current, max, label, color = "primary" }) => {
        const percentage = (current / max) * 100

        const colorClasses = {
                primary: 'bg-primary-600',
                green: 'bg-green-600',
                yellow: 'bg-yellow-600',
                purple: 'bg-purple-600'
        }

        return (
                <div className="w-full">
                        <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-700 dark:text-gray-300">{label}</span>
                                <span className="text-gray-600 dark:text-gray-400">{current}/{max}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                                <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${percentage}%` }}
                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                        className={`h-full ${colorClasses[color]} rounded-full`}
                                />
                        </div>
                </div>
        )
}

export default ProgressBar
