import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/Button';
import Toast from '../components/Toast';
import { useAuth } from '../context/AuthContext';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

  .pfs * { box-sizing: border-box; }

  .pfs {
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

  .pfs::before {
    content: '';
    position: fixed; inset: 0;
    background-image:
      linear-gradient(rgba(0,229,255,.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,229,255,.04) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
  }

  .pfs-blob { position:fixed; border-radius:50%; pointer-events:none; filter:blur(90px); }
  .pfs-b1 { width:500px;height:500px;top:-150px;right:-150px; background:radial-gradient(circle,rgba(124,58,237,.08),transparent 70%); }
  .pfs-b2 { width:400px;height:400px;bottom:-120px;left:-100px; background:radial-gradient(circle,rgba(0,229,255,.07),transparent 70%); }

  @keyframes pfsUp {
    from { opacity:0; transform:translateY(24px); }
    to   { opacity:1; transform:translateY(0); }
  }

  .pfs-card {
    width:100%; max-width:440px;
    background:rgba(10,15,30,.75);
    border:1px solid rgba(0,229,255,.13);
    border-radius:20px;
    padding:40px;
    backdrop-filter:blur(16px);
    -webkit-backdrop-filter:blur(16px);
    position:relative; z-index:1;
    animation:pfsUp .7s ease both;
  }

  .pfs-logo {
    display:flex; align-items:center; justify-content:center;
    gap:10px; margin-bottom:28px;
  }
  .pfs-logo-icon {
    width:40px; height:40px; border-radius:11px;
    background:linear-gradient(135deg,#7c3aed,#00e5ff);
    display:flex; align-items:center; justify-content:center; font-size:20px;
    box-shadow:0 0 24px rgba(124,58,237,.35);
  }
  .pfs-logo-text { font-family:'Orbitron',sans-serif; font-weight:700; font-size:20px; color:#fff; }
  .pfs-logo-text span { color:#a855f7; }

  .pfs-title {
    font-family:'Orbitron',sans-serif; font-size:22px; font-weight:700;
    color:#fff; text-align:center; margin-bottom:6px;
    animation:pfsUp .6s .15s both;
  }
  .pfs-sub {
    font-size:14px; color:#64748b; text-align:center; margin-bottom:28px;
    animation:pfsUp .6s .25s both;
  }

  .pfs-field { margin-bottom:16px; }
  .pf1 { animation:pfsUp .5s .30s both; }
  .pf2 { animation:pfsUp .5s .37s both; }
  .pf3 { animation:pfsUp .5s .44s both; }
  .pf4 { animation:pfsUp .5s .51s both; }
  .pf5 { animation:pfsUp .5s .58s both; }
  .pf6 { animation:pfsUp .5s .65s both; }
  .pf7 { animation:pfsUp .5s .72s both; }
  .pf8 { animation:pfsUp .5s .79s both; }

  .pfs-label {
    display:block; font-family:'Orbitron',sans-serif; font-size:10px; font-weight:700;
    color:#94a3b8; letter-spacing:1px; text-transform:uppercase; margin-bottom:7px;
  }
  .pfs-input-wrap { position:relative; }
  .pfs-input {
    width:100%; padding:12px 16px;
    background:rgba(0,0,0,.45); border:1px solid rgba(0,229,255,.14);
    border-radius:10px; color:#e2e8f0;
    font-family:'DM Sans',sans-serif; font-size:14px;
    outline:none; transition:border-color .2s, box-shadow .2s;
  }
  .pfs-input::placeholder { color:#475569; }
  .pfs-input:focus { border-color:rgba(0,229,255,.45); box-shadow:0 0 0 3px rgba(0,229,255,.07); }
  .pfs-input:disabled { opacity:.5; cursor:not-allowed; }
  .pfs-input-pr { padding-right:58px; }

  .pfs-eye {
    position:absolute; right:12px; top:50%; transform:translateY(-50%);
    background:none; border:none; cursor:pointer;
    font-size:12px; font-weight:600; color:#64748b;
    font-family:'DM Sans',sans-serif; transition:color .2s; padding:4px;
  }
  .pfs-eye:hover { color:#00e5ff; }

  .pfs-error { font-size:12px; color:#f87171; margin-top:5px; }
  .pfs-hint  { font-size:11px; color:#64748b; margin-top:4px; }

  /* password strength */
  .pfs-strength { display:flex; gap:4px; margin-top:8px; }
  .pfs-seg {
    flex:1; height:3px; border-radius:3px;
    background:rgba(255,255,255,.06); transition:background .3s;
  }
  .pfs-strength-label { font-size:11px; margin-top:4px; }

  /* terms */
  .pfs-terms { display:flex; align-items:flex-start; gap:9px; font-size:13px; color:#64748b; cursor:pointer; }
  .pfs-checkbox {
    width:14px; height:14px; margin-top:2px; border-radius:4px; flex-shrink:0;
    border:1px solid rgba(0,229,255,.25); background:rgba(0,0,0,.4); accent-color:#00e5ff;
  }
  .pfs-terms-link {
    background:none; border:none; cursor:pointer; padding:0;
    color:#00e5ff; font-size:13px; font-family:'DM Sans',sans-serif; transition:color .2s;
  }
  .pfs-terms-link:hover { color:#00b8cc; }

  /* submit */
  .pfs-btn {
    width:100%; padding:13px;
    background:linear-gradient(135deg,#00e5ff,#00b8cc);
    color:#000; font-family:'DM Sans',sans-serif; font-weight:700;
    font-size:15px; border:none; border-radius:10px; cursor:pointer;
    box-shadow:0 0 20px rgba(0,229,255,.25);
    transition:transform .2s, box-shadow .2s;
  }
  .pfs-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 0 36px rgba(0,229,255,.45); }
  .pfs-btn:disabled { opacity:.6; cursor:not-allowed; }

  .pfs-divider { position:relative; text-align:center; margin:18px 0; }
  .pfs-divider::before {
    content:''; position:absolute; top:50%; left:0; right:0;
    height:1px; background:rgba(0,229,255,.1);
  }
  .pfs-divider span {
    position:relative; padding:0 12px;
    background:rgba(10,15,30,.9); font-size:12px; color:#64748b;
  }

  .pfs-social {
    width:100%; padding:11px;
    background:rgba(255,255,255,.03); border:1px solid rgba(0,229,255,.1);
    border-radius:10px; color:#e2e8f0; font-family:'DM Sans',sans-serif;
    font-size:14px; font-weight:500; cursor:pointer;
    display:flex; align-items:center; justify-content:center; gap:9px;
    transition:all .2s; margin-bottom:10px;
  }
  .pfs-social:hover:not(:disabled) { background:rgba(0,229,255,.05); border-color:rgba(0,229,255,.22); transform:translateY(-1px); }
  .pfs-social:disabled { opacity:.5; cursor:not-allowed; }

  .pfs-footer { text-align:center; font-size:13px; color:#64748b; margin-top:20px; }
  .pfs-footer a { color:#00e5ff; font-weight:600; text-decoration:none; transition:color .2s; }
  .pfs-footer a:hover { color:#00b8cc; }
`;

function getStrength(pwd) {
        if (!pwd) return 0;
        let s = 0;
        if (pwd.length >= 8) s++;
        if (/[A-Z]/.test(pwd)) s++;
        if (/[0-9]/.test(pwd)) s++;
        if (/[^a-zA-Z0-9]/.test(pwd)) s++;
        return s;
}
const SC = ['', '#ef4444', '#f59e0b', '#22c55e', '#00e5ff'];
const SL = ['', 'Weak', 'Fair', 'Good', 'Strong'];

export default function Signup() {
        const navigate = useNavigate();
        const { signup } = useAuth();
        const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
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
                if (!formData.name.trim()) newErrors.name = 'Name is required';
                else if (formData.name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters';
                if (!formData.email.trim()) newErrors.email = 'Email is required';
                else if (!emailRegex.test(formData.email.trim())) newErrors.email = 'Enter a valid email address';
                if (!formData.password) newErrors.password = 'Password is required';
                else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
                if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
                else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
                setErrors(newErrors);
                return Object.keys(newErrors).length === 0;
        };

        const handleSubmit = async (e) => {
                e.preventDefault();
                if (!validate()) return;
                setIsLoading(true);
                try {
                        const response = await signup(formData.name.trim(), formData.email.trim(), formData.password);
                        console.log('Signup successful:', response);
                        setToast({ message: 'Account created successfully! 🎉', type: 'success', visible: true });
                        if (response.access_token) {
                                localStorage.setItem('token', response.access_token);
                        }
                        setTimeout(() => navigate('/dashboard'), 800);
                } catch (err) {
                        console.error('Signup error:', err);
                        console.log('Error response:', err.response?.data);
                        let errorMessage = 'Signup failed. Please try again.';
                        if (err.response?.data?.detail) {
                                const detail = err.response.data.detail;
                                if (Array.isArray(detail)) {
                                        errorMessage = detail.map(e => (typeof e === 'object' && e.msg ? e.msg : String(e))).join('. ');
                                } else if (typeof detail === 'string') {
                                        errorMessage = detail;
                                }
                        }
                        setToast({ message: errorMessage, type: 'error', visible: true });
                } finally {
                        setIsLoading(false);
                }
        };

        const strength = getStrength(formData.password);

        return (
                <>
                        <style>{styles}</style>
                        <div className="pfs">
                                <div className="pfs-blob pfs-b1" />
                                <div className="pfs-blob pfs-b2" />

                                <div className="pfs-card">
                                        <div className="pfs-logo">
                                                <div className="pfs-logo-icon">⚡</div>
                                                <div className="pfs-logo-text">Prompt<span>Forge</span></div>
                                        </div>

                                        <div className="pfs-title">Create your account</div>
                                        <div className="pfs-sub">Start your prompt engineering journey — free forever</div>

                                        <form onSubmit={handleSubmit}>
                                                {/* Name */}
                                                <div className="pfs-field pf1">
                                                        <label className="pfs-label">Full Name</label>
                                                        <input type="text" name="name" className="pfs-input"
                                                                placeholder="John Doe"
                                                                value={formData.name} onChange={handleChange} disabled={isLoading} />
                                                        {errors.name && <p className="pfs-error">{errors.name}</p>}
                                                </div>

                                                {/* Email */}
                                                <div className="pfs-field pf2">
                                                        <label className="pfs-label">Email</label>
                                                        <input type="email" name="email" className="pfs-input"
                                                                placeholder="you@example.com"
                                                                value={formData.email} onChange={handleChange} disabled={isLoading} />
                                                        {errors.email && <p className="pfs-error">{errors.email}</p>}
                                                </div>

                                                {/* Password */}
                                                <div className="pfs-field pf3">
                                                        <label className="pfs-label">Password</label>
                                                        <div className="pfs-input-wrap">
                                                                <input type={showPassword ? 'text' : 'password'} name="password"
                                                                        className="pfs-input pfs-input-pr"
                                                                        placeholder="••••••••"
                                                                        value={formData.password} onChange={handleChange} disabled={isLoading} />
                                                                <button type="button" className="pfs-eye"
                                                                        onClick={() => setShowPassword(v => !v)} disabled={isLoading}>
                                                                        {showPassword ? 'Hide' : 'Show'}
                                                                </button>
                                                        </div>
                                                        {formData.password && (
                                                                <>
                                                                        <div className="pfs-strength">
                                                                                {[1, 2, 3, 4].map(i => (
                                                                                        <div key={i} className="pfs-seg"
                                                                                                style={{ background: i <= strength ? SC[strength] : undefined }} />
                                                                                ))}
                                                                        </div>
                                                                        <div className="pfs-strength-label" style={{ color: SC[strength] }}>{SL[strength]}</div>
                                                                </>
                                                        )}
                                                        {errors.password && <p className="pfs-error">{errors.password}</p>}
                                                        {!errors.password && <p className="pfs-hint">At least 8 characters</p>}
                                                </div>

                                                {/* Confirm Password */}
                                                <div className="pfs-field pf4">
                                                        <label className="pfs-label">Confirm Password</label>
                                                        <input type={showPassword ? 'text' : 'password'} name="confirmPassword"
                                                                className="pfs-input"
                                                                placeholder="••••••••"
                                                                value={formData.confirmPassword} onChange={handleChange} disabled={isLoading} />
                                                        {errors.confirmPassword && <p className="pfs-error">{errors.confirmPassword}</p>}
                                                </div>

                                                {/* Terms */}
                                                <div className="pfs-field pf5">
                                                        <label className="pfs-terms">
                                                                <input type="checkbox" className="pfs-checkbox" required disabled={isLoading} />
                                                                <span>
                                                                        I agree to the{' '}
                                                                        <button type="button" className="pfs-terms-link" disabled={isLoading}>Terms of Service</button>
                                                                        {' '}and{' '}
                                                                        <button type="button" className="pfs-terms-link" disabled={isLoading}>Privacy Policy</button>
                                                                </span>
                                                        </label>
                                                </div>

                                                {/* Submit */}
                                                <div className="pf6">
                                                        <button type="submit" className="pfs-btn" disabled={isLoading}>
                                                                {isLoading ? 'Creating account...' : 'Create Account →'}
                                                        </button>
                                                </div>

                                                <div className="pfs-divider pf7"><span>Or sign up with</span></div>

                                                <div className="pf8">
                                                        <button type="button" className="pfs-social" disabled={isLoading}>
                                                                <span>🔐</span><span>Sign up with Google</span>
                                                        </button>
                                                        <button type="button" className="pfs-social" disabled={isLoading}>
                                                                <span>🐙</span><span>Sign up with GitHub</span>
                                                        </button>
                                                </div>

                                                <div className="pfs-footer">
                                                        Already have an account?{' '}
                                                        <Link to="/login">Sign in</Link>
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