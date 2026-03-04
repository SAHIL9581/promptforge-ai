import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/Button';
import Toast from '../components/Toast';
import { useAuth } from '../context/AuthContext';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

  .pfl * { box-sizing: border-box; }

  .pfl {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #040610;
    color: #e2e8f0;
    position: relative;
    overflow: hidden;
    padding: 24px;
  }

  .pfl::before {
    content: '';
    position: fixed; inset: 0;
    background-image:
      linear-gradient(rgba(0,229,255,.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,229,255,.04) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
  }

  .pfl-blob { position: fixed; border-radius: 50%; pointer-events: none; filter: blur(90px); }
  .pfl-b1 { width:500px;height:500px;top:-150px;left:-150px; background:radial-gradient(circle,rgba(0,229,255,.07),transparent 70%); }
  .pfl-b2 { width:400px;height:400px;bottom:-120px;right:-100px; background:radial-gradient(circle,rgba(124,58,237,.09),transparent 70%); }

  @keyframes pflUp {
    from { opacity:0; transform:translateY(24px); }
    to   { opacity:1; transform:translateY(0); }
  }

  .pfl-card {
    width: 100%; max-width: 420px;
    background: rgba(10,15,30,.75);
    border: 1px solid rgba(0,229,255,.13);
    border-radius: 20px;
    padding: 44px 40px;
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    position: relative; z-index: 1;
    animation: pflUp .7s ease both;
  }

  .pfl-logo {
    display: flex; align-items: center; justify-content: center;
    gap: 10px; margin-bottom: 32px;
  }
  .pfl-logo-icon {
    width: 40px; height: 40px; border-radius: 11px;
    background: linear-gradient(135deg, #00e5ff, #7c3aed);
    display: flex; align-items: center; justify-content: center; font-size: 20px;
    box-shadow: 0 0 24px rgba(0,229,255,.3);
  }
  .pfl-logo-text { font-family:'Orbitron',sans-serif; font-weight:700; font-size:20px; color:#fff; }
  .pfl-logo-text span { color: #00e5ff; }

  .pfl-title {
    font-family:'Orbitron',sans-serif; font-size:22px; font-weight:700;
    color:#fff; text-align:center; margin-bottom:6px;
    animation: pflUp .6s .15s both;
  }
  .pfl-sub {
    font-size:14px; color:#64748b; text-align:center; margin-bottom:32px;
    animation: pflUp .6s .25s both;
  }

  .pfl-field { margin-bottom: 18px; }
  .pfl-f1 { animation: pflUp .5s .30s both; }
  .pfl-f2 { animation: pflUp .5s .38s both; }
  .pfl-f3 { animation: pflUp .5s .46s both; }
  .pfl-f4 { animation: pflUp .5s .54s both; }
  .pfl-f5 { animation: pflUp .5s .62s both; }
  .pfl-f6 { animation: pflUp .5s .70s both; }

  .pfl-label {
    display:block; font-family:'Orbitron',sans-serif; font-size:10px; font-weight:700;
    color:#94a3b8; letter-spacing:1px; text-transform:uppercase; margin-bottom:8px;
  }
  .pfl-input-wrap { position: relative; }
  .pfl-input {
    width:100%; padding:12px 16px;
    background:rgba(0,0,0,.45); border:1px solid rgba(0,229,255,.14);
    border-radius:10px; color:#e2e8f0;
    font-family:'DM Sans',sans-serif; font-size:14px;
    outline:none; transition:border-color .2s, box-shadow .2s;
  }
  .pfl-input::placeholder { color:#475569; }
  .pfl-input:focus { border-color:rgba(0,229,255,.45); box-shadow:0 0 0 3px rgba(0,229,255,.07); }
  .pfl-input:disabled { opacity:.5; cursor:not-allowed; }
  .pfl-input-pr { padding-right: 58px; }

  .pfl-eye {
    position:absolute; right:12px; top:50%; transform:translateY(-50%);
    background:none; border:none; cursor:pointer;
    font-size:12px; font-weight:600; color:#64748b;
    font-family:'DM Sans',sans-serif; transition:color .2s; padding:4px;
  }
  .pfl-eye:hover { color:#00e5ff; }

  .pfl-error { font-size:12px; color:#f87171; margin-top:5px; }

  .pfl-meta {
    display:flex; align-items:center; justify-content:space-between;
    font-size:13px; color:#64748b; margin-bottom:24px;
  }
  .pfl-remember { display:flex; align-items:center; gap:7px; cursor:pointer; }
  .pfl-checkbox {
    width:14px; height:14px; border-radius:4px;
    border:1px solid rgba(0,229,255,.25); background:rgba(0,0,0,.4); accent-color:#00e5ff;
  }
  .pfl-forgot {
    background:none; border:none; cursor:pointer; padding:0;
    color:#00e5ff; font-size:13px; font-family:'DM Sans',sans-serif; transition:color .2s;
  }
  .pfl-forgot:hover { color:#00b8cc; }
  .pfl-forgot:disabled { opacity:.4; }

  .pfl-btn {
    width:100%; padding:13px;
    background:linear-gradient(135deg, #00e5ff, #00b8cc);
    color:#000; font-family:'DM Sans',sans-serif; font-weight:700;
    font-size:15px; border:none; border-radius:10px; cursor:pointer;
    box-shadow:0 0 20px rgba(0,229,255,.25);
    transition:transform .2s, box-shadow .2s;
  }
  .pfl-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 0 36px rgba(0,229,255,.45); }
  .pfl-btn:disabled { opacity:.6; cursor:not-allowed; }

  .pfl-divider { position:relative; text-align:center; margin:20px 0; }
  .pfl-divider::before {
    content:''; position:absolute; top:50%; left:0; right:0;
    height:1px; background:rgba(0,229,255,.1);
  }
  .pfl-divider span {
    position:relative; padding:0 12px;
    background:rgba(10,15,30,.9); font-size:12px; color:#64748b;
  }

  .pfl-social {
    width:100%; padding:11px;
    background:rgba(255,255,255,.03); border:1px solid rgba(0,229,255,.1);
    border-radius:10px; color:#e2e8f0; font-family:'DM Sans',sans-serif;
    font-size:14px; font-weight:500; cursor:pointer;
    display:flex; align-items:center; justify-content:center; gap:9px;
    transition:all .2s; margin-bottom:10px;
  }
  .pfl-social:hover:not(:disabled) { background:rgba(0,229,255,.05); border-color:rgba(0,229,255,.22); transform:translateY(-1px); }
  .pfl-social:disabled { opacity:.5; cursor:not-allowed; }

  .pfl-footer { text-align:center; font-size:13px; color:#64748b; margin-top:22px; }
  .pfl-footer a { color:#00e5ff; font-weight:600; text-decoration:none; transition:color .2s; }
  .pfl-footer a:hover { color:#00b8cc; }
`;

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
                setFormData(prev => ({ ...prev, [name]: value }));
                setErrors(prev => ({ ...prev, [name]: '' }));
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
                        let errorMessage = 'Login failed. Please check your credentials.';
                        if (err.response?.data?.detail) {
                                const detail = err.response.data.detail;
                                if (Array.isArray(detail)) {
                                        errorMessage = detail.map(e => (typeof e === 'object' && e.msg ? e.msg : String(e))).join(', ');
                                } else if (typeof detail === 'string') {
                                        errorMessage = detail;
                                } else {
                                        errorMessage = JSON.stringify(detail);
                                }
                        }
                        setToast({ message: errorMessage, type: 'error', visible: true });
                } finally {
                        setIsLoading(false);
                }
        };

        return (
                <>
                        <style>{styles}</style>
                        <div className="pfl">
                                <div className="pfl-blob pfl-b1" />
                                <div className="pfl-blob pfl-b2" />

                                <div className="pfl-card">
                                        <div className="pfl-logo">
                                                <div className="pfl-logo-icon">⚡</div>
                                                <div className="pfl-logo-text">Prompt<span>Forge</span></div>
                                        </div>

                                        <div className="pfl-title">Welcome back</div>
                                        <div className="pfl-sub">Sign in to your account</div>

                                        <form onSubmit={handleSubmit}>
                                                <div className="pfl-field pfl-f1">
                                                        <label className="pfl-label">Email</label>
                                                        <input type="email" name="email" className="pfl-input"
                                                                placeholder="you@example.com"
                                                                value={formData.email} onChange={handleChange} disabled={isLoading} />
                                                        {errors.email && <p className="pfl-error">{errors.email}</p>}
                                                </div>

                                                <div className="pfl-field pfl-f2">
                                                        <label className="pfl-label">Password</label>
                                                        <div className="pfl-input-wrap">
                                                                <input type={showPassword ? 'text' : 'password'} name="password"
                                                                        className="pfl-input pfl-input-pr"
                                                                        placeholder="••••••••"
                                                                        value={formData.password} onChange={handleChange} disabled={isLoading} />
                                                                <button type="button" className="pfl-eye"
                                                                        onClick={() => setShowPassword(v => !v)} disabled={isLoading}>
                                                                        {showPassword ? 'Hide' : 'Show'}
                                                                </button>
                                                        </div>
                                                        {errors.password && <p className="pfl-error">{errors.password}</p>}
                                                </div>

                                                <div className="pfl-f3">
                                                        <div className="pfl-meta">
                                                                <label className="pfl-remember">
                                                                        <input type="checkbox" className="pfl-checkbox" disabled={isLoading} />
                                                                        <span>Remember me</span>
                                                                </label>
                                                                <button type="button" className="pfl-forgot" disabled={isLoading}>
                                                                        Forgot password?
                                                                </button>
                                                        </div>
                                                </div>

                                                <div className="pfl-f4">
                                                        <button type="submit" className="pfl-btn" disabled={isLoading}>
                                                                {isLoading ? 'Signing in...' : 'Sign In →'}
                                                        </button>
                                                </div>

                                                <div className="pfl-divider pfl-f5"><span>Or continue with</span></div>

                                                <div className="pfl-f6">
                                                        <button type="button" className="pfl-social" disabled={isLoading}>
                                                                <span>🔐</span><span>Continue with Google</span>
                                                        </button>
                                                        <button type="button" className="pfl-social" disabled={isLoading}>
                                                                <span>🐙</span><span>Continue with GitHub</span>
                                                        </button>
                                                </div>

                                                <div className="pfl-footer">
                                                        Don't have an account?{' '}
                                                        <Link to="/signup">Sign up free</Link>
                                                </div>
                                        </form>
                                </div>

                                <Toast message={toast.message} type={toast.type}
                                        isVisible={toast.visible}
                                        onClose={() => setToast(t => ({ ...t, visible: false }))} />
                        </div>
                </>
        );
}