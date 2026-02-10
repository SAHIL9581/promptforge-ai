import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import { Zap, Mail, Lock, User } from 'lucide-react'

const Signup = () => {
        const [name, setName] = useState('')
        const [email, setEmail] = useState('')
        const [password, setPassword] = useState('')
        const [error, setError] = useState('')
        const [loading, setLoading] = useState(false)
        const { signup } = useAuth()
        const navigate = useNavigate()

        const handleSubmit = async (e) => {
                e.preventDefault()
                setError('')
                setLoading(true)

                try {
                        await signup(name, email, password)
                        navigate('/login')
                } catch (err) {
                        setError(err.response?.data?.detail || 'Signup failed. Please try again.')
                } finally {
                        setLoading(false)
                }
        }

        return (
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 px-4">
                        <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8"
                        >
                                <div className="flex flex-col items-center mb-8">
                                        <Zap className="h-12 w-12 text-primary-500 mb-4" />
                                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Account</h1>
                                        <p className="text-gray-600 dark:text-gray-400 mt-2">Join PromptForge AI today</p>
                                </div>

                                {error && (
                                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-4">
                                                {error}
                                        </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">
                                        <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Full Name
                                                </label>
                                                <div className="relative">
                                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                        <input
                                                                type="text"
                                                                value={name}
                                                                onChange={(e) => setName(e.target.value)}
                                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-white"
                                                                placeholder="John Doe"
                                                                required
                                                        />
                                                </div>
                                        </div>

                                        <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Email
                                                </label>
                                                <div className="relative">
                                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                        <input
                                                                type="email"
                                                                value={email}
                                                                onChange={(e) => setEmail(e.target.value)}
                                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-white"
                                                                placeholder="you@example.com"
                                                                required
                                                        />
                                                </div>
                                        </div>

                                        <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Password
                                                </label>
                                                <div className="relative">
                                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                        <input
                                                                type="password"
                                                                value={password}
                                                                onChange={(e) => setPassword(e.target.value)}
                                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-white"
                                                                placeholder="••••••••"
                                                                required
                                                                minLength={6}
                                                        />
                                                </div>
                                        </div>

                                        <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                type="submit"
                                                disabled={loading}
                                                className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 rounded-lg font-semibold hover:from-primary-600 hover:to-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                                {loading ? 'Creating account...' : 'Sign Up'}
                                        </motion.button>
                                </form>

                                <div className="mt-6 text-center">
                                        <p className="text-gray-600 dark:text-gray-400">
                                                Already have an account?{' '}
                                                <Link to="/login" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
                                                        Sign in
                                                </Link>
                                        </p>
                                </div>
                        </motion.div>
                </div>
        )
}

export default Signup
