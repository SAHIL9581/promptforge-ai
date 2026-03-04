import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ProblemMode from './pages/ProblemMode';
import IdeaToPrompt from './pages/IdeaToPrompt';
import EvaluationResult from './pages/EvaluationResult';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';
import TechnicalChallengeSelector from './pages/TechnicalChallengeSelector';
import TechnicalChallenge from './pages/TechnicalChallenge';
import TechnicalEvaluation from './pages/TechnicalEvaluation';
import AttemptDetail from './pages/AttemptDetail';
import LandingPage from './pages/LandingPage';

function App() {
        const { user, loading } = useAuth();

        if (loading) {
                return (
                        <div className="min-h-screen flex items-center justify-center bg-bg-dark">
                                <div className="text-center">
                                        <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                                        <p className="text-text-secondary">Loading PromptForge...</p>
                                </div>
                        </div>
                );
        }

        return (
                <Router>
                        <div className="min-h-screen bg-bg-dark transition-colors duration-200">
                                <Routes>
                                        {/* Landing Page - always public */}
                                        <Route
                                                path="/"
                                                element={<LandingPage />}
                                        />

                                        {/* Public Routes */}
                                        <Route
                                                path="/login"
                                                element={!user ? <Login /> : <Navigate to="/dashboard" />}
                                        />
                                        <Route
                                                path="/signup"
                                                element={!user ? <Signup /> : <Navigate to="/dashboard" />}
                                        />

                                        {/* Protected Routes - Dashboard */}
                                        <Route
                                                path="/dashboard"
                                                element={
                                                        <ProtectedRoute>
                                                                <Dashboard />
                                                        </ProtectedRoute>
                                                }
                                        />

                                        {/* Protected Routes - Problem Mode */}
                                        <Route
                                                path="/problem-mode"
                                                element={
                                                        <ProtectedRoute>
                                                                <ProblemMode />
                                                        </ProtectedRoute>
                                                }
                                        />

                                        <Route
                                                path="/attempt/:id"
                                                element={
                                                        <ProtectedRoute>
                                                                <AttemptDetail />
                                                        </ProtectedRoute>
                                                }
                                        />

                                        {/* Protected Routes - Idea to Prompt */}
                                        <Route
                                                path="/idea-to-prompt"
                                                element={
                                                        <ProtectedRoute>
                                                                <IdeaToPrompt />
                                                        </ProtectedRoute>
                                                }
                                        />

                                        {/* Protected Routes - Evaluation */}
                                        <Route
                                                path="/evaluation-result"
                                                element={
                                                        <ProtectedRoute>
                                                                <EvaluationResult />
                                                        </ProtectedRoute>
                                                }
                                        />

                                        {/* Protected Routes - Technical Challenge */}
                                        <Route
                                                path="/technical-challenge-selector"
                                                element={
                                                        <ProtectedRoute>
                                                                <TechnicalChallengeSelector />
                                                        </ProtectedRoute>
                                                }
                                        />

                                        <Route
                                                path="/technical-challenge"
                                                element={
                                                        <ProtectedRoute>
                                                                <TechnicalChallenge />
                                                        </ProtectedRoute>
                                                }
                                        />

                                        <Route
                                                path="/technical-evaluation"
                                                element={
                                                        <ProtectedRoute>
                                                                <TechnicalEvaluation />
                                                        </ProtectedRoute>
                                                }
                                        />

                                        {/* Protected Routes - Profile */}
                                        <Route
                                                path="/profile"
                                                element={
                                                        <ProtectedRoute>
                                                                <Profile />
                                                        </ProtectedRoute>
                                                }
                                        />

                                        {/* Catch all - redirect */}
                                        <Route
                                                path="*"
                                                element={<Navigate to={user ? '/dashboard' : '/'} replace />}
                                        />
                                </Routes>
                        </div>
                </Router>
        );
}

export default App;