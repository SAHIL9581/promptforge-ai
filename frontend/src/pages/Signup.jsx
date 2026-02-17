import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/Button';
import Toast from '../components/Toast';
import { useAuth } from '../context/AuthContext';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Signup() {
        const navigate = useNavigate();
        const { signup } = useAuth();
        const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
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
                else if (!emailRegex.test(formData.email)) newErrors.email = 'Enter a valid email';

                if (!formData.password) newErrors.password = 'Password is required';
                else if (formData.password.length < 8)
                        newErrors.password = 'Password must be at least 8 characters';
                else if (!/[A-Z]/.test(formData.password))
                        newErrors.password = 'Password must contain at least one uppercase letter';
                else if (!/[0-9]/.test(formData.password))
                        newErrors.password = 'Password must contain at least one number';

                if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
                else if (formData.password !== formData.confirmPassword)
                        newErrors.confirmPassword = 'Passwords do not match';

                setErrors(newErrors);
                return Object.keys(newErrors).length === 0;
        };

        const handleSubmit = async (e) => {
                e.preventDefault();
                if (!validate()) return;

                setIsLoading(true);
                try {
                        await signup(formData.email, formData.password);
                        setToast({ message: 'Account created successfully! 🎉', type: 'success', visible: true });
                        setTimeout(() => navigate('/dashboard'), 800);
                } catch (err) {
                        setToast({
                                message: err?.response?.data?.detail || 'Signup failed. Please try again.',
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
                                                        Join thousands mastering prompt engineering.
                                                </p>

                                                <div className="space-y-6 text-left animate-slide-up" style={{ animationDelay: '0.2s' }}>
                                                        <div className="flex items-center gap-4">
                                                                <div className="w-12 h-12 bg-primary/15 border border-primary/30 rounded-xl flex items-center justify-center text-2xl">
                                                                        🚀
                                                                </div>
                                                                <div>
                                                                        <h4 className="text-lg font-bold">Start Learning Today</h4>
                                                                        <p className="text-text-secondary text-sm">Free forever with unlimited challenges.</p>
                                                                </div>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                                <div className="w-12 h-12 bg-success/15 border border-success/30 rounded-xl flex items-center justify-center text-2xl">
                                                                        📈
                                                                </div>
                                                                <div>
                                                                        <h4 className="text-lg font-bold">Track Your Progress</h4>
                                                                        <p className="text-text-secondary text-sm">Real-time analytics and skill improvement.</p>
                                                                </div>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                                <div className="w-12 h-12 bg-accent-cyan/15 border border-accent-cyan/30 rounded-xl flex items-center justify-center text-2xl">
                                                                        🏆
                                                                </div>
                                                                <div>
                                                                        <h4 className="text-lg font-bold">Earn Badges</h4>
                                                                        <p className="text-text-secondary text-sm">Unlock achievements as you improve.</p>
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
                                                <h2 className="text-3xl font-bold mb-2">Create your account</h2>
                                                <p className="text-text-secondary">Start your prompt engineering journey</p>
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
                                                                />
                                                                <button
                                                                        type="button"
                                                                        className="absolute inset-y-0 right-3 flex items-center text-sm text-text-secondary hover:text-primary transition-colors"
                                                                        onClick={() => setShowPassword((v) => !v)}
                                                                >
                                                                        {showPassword ? 'Hide' : 'Show'}
                                                                </button>
                                                        </div>
                                                        {errors.password && <p className="mt-1.5 text-sm text-danger">{errors.password}</p>}
                                                </div>

                                                <div>
                                                        <label className="block text-sm font-medium mb-2">Confirm Password</label>
                                                        <input
                                                                type={showPassword ? 'text' : 'password'}
                                                                name="confirmPassword"
                                                                className="input-field"
                                                                placeholder="••••••••"
                                                                value={formData.confirmPassword}
                                                                onChange={handleChange}
                                                        />
                                                        {errors.confirmPassword && <p className="mt-1.5 text-sm text-danger">{errors.confirmPassword}</p>}
                                                </div>

                                                <div className="text-sm">
                                                        <label className="flex items-start gap-2 cursor-pointer">
                                                                <input type="checkbox" className="w-4 h-4 mt-0.5 rounded border-border bg-bg-input text-primary focus:ring-primary" required />
                                                                <span className="text-text-secondary">
                                                                        I agree to the{' '}
                                                                        <button type="button" className="text-primary-light hover:text-primary">
                                                                                Terms of Service
                                                                        </button>{' '}
                                                                        and{' '}
                                                                        <button type="button" className="text-primary-light hover:text-primary">
                                                                                Privacy Policy
                                                                        </button>
                                                                </span>
                                                        </label>
                                                </div>

                                                <Button type="submit" isLoading={isLoading} className="w-full">
                                                        {isLoading ? 'Creating account...' : 'Create Account'}
                                                </Button>

                                                <div className="relative my-6">
                                                        <div className="absolute inset-0 flex items-center">
                                                                <div className="w-full border-t border-border"></div>
                                                        </div>
                                                        <div className="relative flex justify-center text-sm">
                                                                <span className="px-2 bg-bg-card text-text-secondary">Or sign up with</span>
                                                        </div>
                                                </div>

                                                <div className="space-y-3">
                                                        <button type="button" className="w-full btn-secondary flex items-center justify-center gap-2">
                                                                <span>🔐</span>
                                                                <span>Sign up with Google</span>
                                                        </button>
                                                        <button type="button" className="w-full btn-secondary flex items-center justify-center gap-2">
                                                                <span>🐙</span>
                                                                <span>Sign up with GitHub</span>
                                                        </button>
                                                </div>

                                                <p className="mt-6 text-center text-sm text-text-secondary">
                                                        Already have an account?{' '}
                                                        <Link to="/login" className="text-primary-light hover:text-primary font-semibold transition-colors">
                                                                Sign in
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
