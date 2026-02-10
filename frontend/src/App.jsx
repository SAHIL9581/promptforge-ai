import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import ProblemMode from './pages/ProblemMode'
import IdeaToPrompt from './pages/IdeaToPrompt'
import EvaluationResult from './pages/EvaluationResult'
import Profile from './pages/Profile'
import ProtectedRoute from './components/ProtectedRoute'
import LoadingSpinner from './components/LoadingSpinner'
import TechnicalChallengeSelector from './pages/TechnicalChallengeSelector'
import TechnicalChallenge from './pages/TechnicalChallenge'
import TechnicalEvaluation from './pages/TechnicalEvaluation'

function App() {
        const { user, loading } = useAuth()

        if (loading) {
                return (
                        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                                <LoadingSpinner />
                        </div>
                )
        }

        return (
                <Router>
                        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
                                {user && <Navbar />}
                                <Routes>
                                        {/* Public Routes */}
                                        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
                                        <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/dashboard" />} />

                                        {/* Protected Routes - Dashboard */}
                                        <Route path="/dashboard" element={
                                                <ProtectedRoute>
                                                        <Dashboard />
                                                </ProtectedRoute>
                                        } />

                                        {/* Protected Routes - Problem Mode */}
                                        <Route path="/problem-mode" element={
                                                <ProtectedRoute>
                                                        <ProblemMode />
                                                </ProtectedRoute>
                                        } />

                                        {/* Protected Routes - Idea to Prompt */}
                                        <Route path="/idea-to-prompt" element={
                                                <ProtectedRoute>
                                                        <IdeaToPrompt />
                                                </ProtectedRoute>
                                        } />

                                        {/* Protected Routes - Evaluation */}
                                        <Route path="/evaluation" element={
                                                <ProtectedRoute>
                                                        <EvaluationResult />
                                                </ProtectedRoute>
                                        } />

                                        {/* Protected Routes - Technical Challenge */}
                                        <Route path="/technical-challenge-selector" element={
                                                <ProtectedRoute>
                                                        <TechnicalChallengeSelector />
                                                </ProtectedRoute>
                                        } />

                                        <Route path="/technical-challenge/:category" element={
                                                <ProtectedRoute>
                                                        <TechnicalChallenge />
                                                </ProtectedRoute>
                                        } />

                                        <Route path="/technical-evaluation" element={
                                                <ProtectedRoute>
                                                        <TechnicalEvaluation />
                                                </ProtectedRoute>
                                        } />

                                        {/* Protected Routes - Profile */}
                                        <Route path="/profile" element={
                                                <ProtectedRoute>
                                                        <Profile />
                                                </ProtectedRoute>
                                        } />

                                        {/* Default Route */}
                                        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
                                </Routes>
                        </div>
                </Router>
        )
}

export default App
