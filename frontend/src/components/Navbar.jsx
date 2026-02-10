import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from './ThemeToggle'
import { LogOut, User, Home, Zap, Code2 } from 'lucide-react'
import { motion } from 'framer-motion'

const Navbar = () => {
        const { logout } = useAuth()
        const location = useLocation()

        const isActive = (path) => location.pathname === path || location.pathname.startsWith(path)

        return (
                <motion.nav
                        initial={{ y: -100 }}
                        animate={{ y: 0 }}
                        className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50"
                >
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="flex justify-between h-16">
                                        <div className="flex items-center">
                                                <Link to="/dashboard" className="flex items-center space-x-2">
                                                        <Zap className="h-8 w-8 text-primary-500" />
                                                        <span className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
                                                                PromptForge AI
                                                        </span>
                                                </Link>
                                        </div>

                                        <div className="flex items-center space-x-4">
                                                <Link
                                                        to="/dashboard"
                                                        className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/dashboard')
                                                                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                                                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                                }`}
                                                >
                                                        <Home className="h-4 w-4" />
                                                        <span>Dashboard</span>
                                                </Link>

                                                <Link
                                                        to="/technical-challenge-selector"
                                                        className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors relative ${isActive('/technical-challenge')
                                                                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                                                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                                }`}
                                                >
                                                        <Code2 className="h-4 w-4" />
                                                        <span>Tech Challenge</span>
                                                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                                                                <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                                                        </span>
                                                </Link>

                                                <Link
                                                        to="/profile"
                                                        className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/profile')
                                                                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                                                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                                }`}
                                                >
                                                        <User className="h-4 w-4" />
                                                        <span>Profile</span>
                                                </Link>

                                                <ThemeToggle />

                                                <button
                                                        onClick={logout}
                                                        className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                >
                                                        <LogOut className="h-4 w-4" />
                                                        <span>Logout</span>
                                                </button>
                                        </div>
                                </div>
                        </div>
                </motion.nav>
        )
}

export default Navbar
