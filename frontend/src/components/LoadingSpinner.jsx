import React from 'react'
import { motion } from 'framer-motion'

const LoadingSpinner = () => {
        return (
                <div className="flex flex-col items-center justify-center space-y-4">
                        <motion.div
                                className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
                </div>
        )
}

export default LoadingSpinner
