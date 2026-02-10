import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getProfile } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import BadgeCard from '../components/BadgeCard'
import ProgressBar from '../components/ProgressBar'
import ScoreCard from '../components/ScoreCard'
import { User, Award, TrendingUp, Target, Calendar } from 'lucide-react'

const Profile = () => {
        const [profile, setProfile] = useState(null)
        const [loading, setLoading] = useState(true)
        const [error, setError] = useState('')

        useEffect(() => {
                fetchProfile()
        }, [])

        const fetchProfile = async () => {
                try {
                        const data = await getProfile()
                        setProfile(data)
                } catch (err) {
                        setError('Failed to load profile')
                } finally {
                        setLoading(false)
                }
        }

        if (loading) {
                return (
                        <div className="min-h-screen flex items-center justify-center">
                                <LoadingSpinner />
                        </div>
                )
        }

        if (error || !profile) {
                return (
                        <div className="min-h-screen flex items-center justify-center">
                                <div className="text-red-600 dark:text-red-400">{error || 'Profile not found'}</div>
                        </div>
                )
        }

        const getLevelProgress = (xp) => {
                if (xp < 100) return { current: xp, max: 100, next: 'Intermediate' }
                if (xp < 500) return { current: xp - 100, max: 400, next: 'Advanced' }
                if (xp < 1500) return { current: xp - 500, max: 1000, next: 'Expert' }
                return { current: xp - 1500, max: xp - 1500, next: 'Master' }
        }

        const levelProgress = getLevelProgress(profile.user.xp)

        return (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-8"
                        >
                                <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl shadow-xl p-8 text-white">
                                        <div className="flex items-center space-x-6">
                                                <div className="bg-white/20 p-4 rounded-full">
                                                        <User className="h-16 w-16" />
                                                </div>
                                                <div className="flex-1">
                                                        <h1 className="text-3xl font-bold mb-2">{profile.user.name}</h1>
                                                        <p className="text-primary-100 mb-4">{profile.user.email}</p>
                                                        <div className="flex items-center space-x-4">
                                                                <span className="px-4 py-2 bg-white/20 rounded-lg font-semibold">
                                                                        Level: {profile.user.level}
                                                                </span>
                                                                <span className="px-4 py-2 bg-white/20 rounded-lg font-semibold">
                                                                        {profile.user.xp} XP
                                                                </span>
                                                                <span className="px-4 py-2 bg-white/20 rounded-lg font-semibold">
                                                                        {profile.user.total_attempts} Attempts
                                                                </span>
                                                        </div>
                                                </div>
                                        </div>
                                </div>

                                <div className="grid md:grid-cols-3 gap-6">
                                        <ScoreCard
                                                title="Average Score"
                                                score={profile.average_score.toFixed(1)}
                                                icon={TrendingUp}
                                                color="blue"
                                        />
                                        <ScoreCard
                                                title="Best Score"
                                                score={profile.best_score.toFixed(1)}
                                                icon={Target}
                                                color="green"
                                        />
                                        <ScoreCard
                                                title="Total Badges"
                                                score={profile.badges.length}
                                                icon={Award}
                                                color="purple"
                                        />
                                </div>

                                <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
                                >
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Level Progress</h2>
                                        <ProgressBar
                                                current={levelProgress.current}
                                                max={levelProgress.max}
                                                label={`Progress to ${levelProgress.next}`}
                                                color="primary"
                                        />
                                </motion.div>

                                <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
                                >
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Badges</h2>
                                        {profile.badges.length > 0 ? (
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                        {profile.badges.map((badge) => (
                                                                <BadgeCard key={badge.id} badge={badge} earned={true} />
                                                        ))}
                                                </div>
                                        ) : (
                                                <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                                                        No badges earned yet. Complete more challenges to earn badges!
                                                </p>
                                        )}
                                </motion.div>

                                <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
                                >
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Recent Attempts</h2>
                                        {profile.attempts.length > 0 ? (
                                                <div className="space-y-4">
                                                        {profile.attempts.map((attempt) => (
                                                                <div
                                                                        key={attempt.id}
                                                                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                                                                >
                                                                        <div className="flex-1">
                                                                                <p className="text-gray-900 dark:text-white font-medium mb-1">
                                                                                        {attempt.problem_text}
                                                                                </p>
                                                                                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                                                                                        <span className="flex items-center space-x-1">
                                                                                                <Calendar className="h-4 w-4" />
                                                                                                <span>{new Date(attempt.created_at).toLocaleDateString()}</span>
                                                                                        </span>
                                                                                        <span>+{attempt.xp_earned} XP</span>
                                                                                </div>
                                                                        </div>
                                                                        <div className="text-right">
                                                                                <div className={`text-2xl font-bold ${attempt.overall_score >= 80 ? 'text-green-600 dark:text-green-400' :
                                                                                                attempt.overall_score >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                                                                                                        'text-red-600 dark:text-red-400'
                                                                                        }`}>
                                                                                        {attempt.overall_score.toFixed(1)}
                                                                                </div>
                                                                        </div>
                                                                </div>
                                                        ))}
                                                </div>
                                        ) : (
                                                <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                                                        No attempts yet. Start solving problems to see your history!
                                                </p>
                                        )}
                                </motion.div>
                        </motion.div>
                </div>
        )
}

export default Profile
