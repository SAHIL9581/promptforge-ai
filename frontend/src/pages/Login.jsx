import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/Button';
import Toast from '../components/Toast';
import { useAuth } from '../context/AuthContext';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
        const navigate = useNavigate();
        const { login } = useAuth();
        const [formData, setFormData] = useState({ email: '', password: '' });
        const [errors, setErrors] = useState({});
        const [showPassword, setShowPassword] = useState(false);
        const [isLoading, setIsLoading] = useState(false);
        const [toast, setToast] = useState({ message: '', type: 'success', visible: false });

        const handleChange = (e) => {
                const { name, value } = e.target;
                setFormData((prev) => ({ ...prev, [name]: value }));
                setErrors((prev) => ({ ...prev, [name]: '' }));
        };

        const validate = () => {
                const newErrors = {};
                if (!formData.email) newErrors.email = 'Email is required';
                else if (!emailRegex.test(formData.email)) newErrors.email = 'Enter a valid email address';

                if (!formData.password) newErrors.password = 'Password is required';
                if (formData.password && formData.password.length < 6)
                        newErrors.password = 'Password should be at least 6 characters';

                setErrors(newErrors);
                return Object.keys(newErrors).length === 0;
        };

        const handleSubmit = async (e) => {
                e.preventDefault();
                if (!validate()) return;

                setIsLoading(true);
                try {
                        await login(formData.email, formData.password);
                        setToast({ message: 'Login successful! 🎉', type: 'success', visible: true });
                        setTimeout(() => navigate('/dashboard'), 800);
                } catch (err) {
                        console.error('Login error:', err);

                        // ✅ Handle validation errors properly
                        let errorMessage = 'Login failed. Please check your credentials.';

                        if (err.response?.data?.detail) {
                                const detail = err.response.data.detail;

                                // If it's an array of validation errors
                                if (Array.isArray(detail)) {
                                        errorMessage = detail.map(error => {
                                                if (typeof error === 'object' && error.msg) {
                                                        return error.msg;
                                                }
                                                return String(error);
                                        }).join(', ');
                                } else if (typeof detail === 'string') {
                                        errorMessage = detail;
                                } else {
                                        errorMessage = JSON.stringify(detail);
                                }
                        }

                        setToast({
                                message: errorMessage,
                                type: 'error',
                                visible: true,
                        });
                } finally {
                        setIsLoading(false);
                }
        };

        return (
                <div className="flex min-h-screen">
                        {/* Left: Branding */}
                        <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-primary/10 to-accent-cyan/10 overflow-hidden">
                                <div className="absolute inset-0">
                                        <div className="absolute w-96 h-96 bg-primary/30 rounded-full blur-3xl -top-24 -left-24 animate-float" />
                                        <div
                                                className="absolute w-80 h-80 bg-accent-cyan/25 rounded-full blur-3xl -bottom-24 -right-24 animate-float"
                                                style={{ animationDelay: '5s' }}
                                        />
                                        <div
                                                className="absolute w-72 h-72 bg-accent-pink/20 rounded-full blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-float"
                                                style={{ animationDelay: '10s' }}
                                        />
                                </div>

                                <div className="relative z-10 flex items-center justify-center h-full p-16">
                                        <div className="max-w-lg text-center">
                                                <h1 className="text-6xl font-extrabold bg-gradient-to-r from-primary to-accent-cyan bg-clip-text text-transparent mb-6 animate-fade-in">
                                                        PromptForge
                                                </h1>
                                                <p className="text-2xl text-text-secondary mb-12 animate-slide-up">
                                                        Master the art of prompt engineering through hands-on challenges.
                                                </p>

                                                <div className="space-y-6 text-left animate-slide-up" style={{ animationDelay: '0.2s' }}>
                                                        <div className="flex items-center gap-4">
                                                                <div className="w-12 h-12 bg-primary/15 border border-primary/30 rounded-xl flex items-center justify-center text-2xl">
                                                                        💻
                                                                </div>
                                                                <div>
                                                                        <h4 className="text-lg font-bold">Technical Challenges</h4>
                                                                        <p className="text-text-secondary text-sm">DSA, DBMS, and DAA problems with AI evaluation.</p>
                                                                </div>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                                <div className="w-12 h-12 bg-accent-cyan/15 border border-accent-cyan/30 rounded-xl flex items-center justify-center text-2xl">
                                                                        📊
                                                                </div>
                                                                <div>
                                                                        <h4 className="text-lg font-bold">Skill Analytics</h4>
                                                                        <p className="text-text-secondary text-sm">Track your scores and progress over time.</p>
                                                                </div>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                                <div className="w-12 h-12 bg-accent-pink/15 border border-accent-pink/30 rounded-xl flex items-center justify-center text-2xl">
                                                                        🎯
                                                                </div>
                                                                <div>
                                                                        <h4 className="text-lg font-bold">Prompt Mastery</h4>
                                                                        <p className="text-text-secondary text-sm">Learn to write precise, effective prompts.</p>
                                                                </div>
                                                        </div>
                                                </div>
                                        </div>
                                </div>
                        </div>

                        {/* Right: Form */}
                        <div className="w-full lg:w-[500px] bg-bg-card/70 backdrop-blur-xl border-l border-border p-10 flex items-center justify-center">
                                <div className="w-full max-w-md">
                                        <div className="mb-8">
                                                <h2 className="text-3xl font-bold mb-2">Welcome back</h2>
                                                <p className="text-text-secondary">Sign in to PromptForge AI</p>
                                        </div>

                                        <form className="space-y-5" onSubmit={handleSubmit}>
                                                <div>
                                                        <label className="block text-sm font-medium mb-2">Email</label>
                                                        <input
                                                                type="email"
                                                                name="email"
                                                                className="input-field"
                                                                placeholder="you@example.com"
                                                                value={formData.email}
                                                                onChange={handleChange}
                                                                disabled={isLoading}
                                                        />
                                                        {errors.email && <p className="mt-1.5 text-sm text-danger">{errors.email}</p>}
                                                </div>

                                                <div>
                                                        <label className="block text-sm font-medium mb-2">Password</label>
                                                        <div className="relative">
                                                                <input
                                                                        type={showPassword ? 'text' : 'password'}
                                                                        name="password"
                                                                        className="input-field pr-12"
                                                                        placeholder="••••••••"
                                                                        value={formData.password}
                                                                        onChange={handleChange}
                                                                        disabled={isLoading}
                                                                />
                                                                <button
                                                                        type="button"
                                                                        className="absolute inset-y-0 right-3 flex items-center text-sm text-text-secondary hover:text-primary transition-colors"
                                                                        onClick={() => setShowPassword((v) => !v)}
                                                                        disabled={isLoading}
                                                                >
                                                                        {showPassword ? 'Hide' : 'Show'}
                                                                </button>
                                                        </div>
                                                        {errors.password && <p className="mt-1.5 text-sm text-danger">{errors.password}</p>}
                                                </div>

                                                <div className="flex items-center justify-between text-sm">
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                                <input
                                                                        type="checkbox"
                                                                        className="w-4 h-4 rounded border-border bg-bg-input text-primary focus:ring-primary"
                                                                        disabled={isLoading}
                                                                />
                                                                <span>Remember me</span>
                                                        </label>
                                                        <button
                                                                type="button"
                                                                className="text-primary-light hover:text-primary transition-colors disabled:opacity-50"
                                                                disabled={isLoading}
                                                        >
                                                                Forgot password?
                                                        </button>
                                                </div>

                                                <Button type="submit" isLoading={isLoading} className="w-full">
                                                        {isLoading ? 'Signing in...' : 'Sign In'}
                                                </Button>

                                                <div className="relative my-6">
                                                        <div className="absolute inset-0 flex items-center">
                                                                <div className="w-full border-t border-border"></div>
                                                        </div>
                                                        <div className="relative flex justify-center text-sm">
                                                                <span className="px-2 bg-bg-card text-text-secondary">Or continue with</span>
                                                        </div>
                                                </div>

                                                <div className="space-y-3">
                                                        <button
                                                                type="button"
                                                                className="w-full btn-secondary flex items-center justify-center gap-2"
                                                                disabled={isLoading}
                                                        >
                                                                <span>🔐</span>
                                                                <span>Continue with Google</span>
                                                        </button>
                                                        <button
                                                                type="button"
                                                                className="w-full btn-secondary flex items-center justify-center gap-2"
                                                                disabled={isLoading}
                                                        >
                                                                <span>🐙</span>
                                                                <span>Continue with GitHub</span>
                                                        </button>
                                                </div>

                                                <p className="mt-6 text-center text-sm text-text-secondary">
                                                        Don&apos;t have an account?{' '}
                                                        <Link to="/signup" className="text-primary-light hover:text-primary font-semibold transition-colors">
                                                                Sign up
                                                        </Link>
                                                </p>
                                        </form>
                                </div>
                        </div>

                        <Toast
                                message={toast.message}
                                type={toast.type}
                                isVisible={toast.visible}
                                onClose={() => setToast((t) => ({ ...t, visible: false }))}
                        />
                </div>
        );
}
