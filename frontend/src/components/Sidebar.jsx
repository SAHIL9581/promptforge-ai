import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

  .pf-sidebar {
    position: fixed; left: 0; top: 0;
    height: 100vh; width: 240px;
    background: rgba(10,15,30,.85);
    border-right: 1px solid rgba(0,229,255,.1);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    display: flex; flex-direction: column;
    z-index: 50; font-family: 'DM Sans', sans-serif;
  }

  /* subtle grid bg on sidebar */
  .pf-sidebar::before {
    content: '';
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(0,229,255,.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,229,255,.025) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
  }

  /* top glow accent line */
  .pf-sidebar::after {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(0,229,255,.4), transparent);
    pointer-events: none;
  }

  /* ── LOGO ── */
  .pf-sb-logo {
    padding: 22px 20px 20px;
    border-bottom: 1px solid rgba(0,229,255,.08);
    display: flex; align-items: center; gap: 10px;
    position: relative; z-index: 1; flex-shrink: 0;
  }
  .pf-sb-logo-icon {
    width: 36px; height: 36px; border-radius: 10px;
    background: linear-gradient(135deg, #00e5ff, #7c3aed);
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; flex-shrink: 0;
    box-shadow: 0 0 16px rgba(0,229,255,.3);
  }
  .pf-sb-logo-text {
    font-family: 'Orbitron', sans-serif; font-weight: 700; font-size: 17px; color: #fff;
  }
  .pf-sb-logo-text span { color: #00e5ff; }

  /* ── NAV ── */
  .pf-sb-nav {
    flex: 1; padding: 16px 12px;
    overflow-y: auto; position: relative; z-index: 1;
  }
  .pf-sb-nav::-webkit-scrollbar { width: 3px; }
  .pf-sb-nav::-webkit-scrollbar-track { background: transparent; }
  .pf-sb-nav::-webkit-scrollbar-thumb { background: rgba(0,229,255,.2); border-radius: 3px; }

  .pf-sb-label {
    font-family: 'Orbitron', sans-serif; font-size: 9px; font-weight: 700;
    color: #334155; letter-spacing: 1.5px; text-transform: uppercase;
    padding: 0 8px; margin: 8px 0 6px;
  }

  .pf-sb-link {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 12px; border-radius: 10px;
    text-decoration: none; color: #64748b;
    font-size: 14px; font-weight: 500;
    transition: all .2s; margin-bottom: 2px;
    border: 1px solid transparent;
    position: relative; overflow: hidden;
  }
  .pf-sb-link:hover {
    color: #e2e8f0;
    background: rgba(0,229,255,.05);
    border-color: rgba(0,229,255,.1);
  }
  .pf-sb-link.active {
    color: #00e5ff;
    background: rgba(0,229,255,.08);
    border-color: rgba(0,229,255,.2);
    box-shadow: 0 0 20px rgba(0,229,255,.06);
  }
  /* active left bar */
  .pf-sb-link.active::before {
    content: '';
    position: absolute; left: 0; top: 20%; bottom: 20%;
    width: 2px; border-radius: 2px;
    background: linear-gradient(180deg, #00e5ff, #7c3aed);
  }

  .pf-sb-icon {
    width: 32px; height: 32px; border-radius: 8px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center; font-size: 16px;
    background: rgba(255,255,255,.04);
    transition: background .2s;
  }
  .pf-sb-link.active .pf-sb-icon {
    background: rgba(0,229,255,.1);
  }
  .pf-sb-link:hover .pf-sb-icon {
    background: rgba(0,229,255,.07);
  }

  /* ── BOTTOM ── */
  .pf-sb-bottom {
    padding: 12px; border-top: 1px solid rgba(0,229,255,.08);
    position: relative; z-index: 1; flex-shrink: 0;
  }

  .pf-sb-btn {
    width: 100%; display: flex; align-items: center; gap: 12px;
    padding: 10px 12px; border-radius: 10px;
    background: none; border: 1px solid transparent;
    color: #64748b; font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 500; cursor: pointer;
    transition: all .2s; margin-bottom: 2px;
  }
  .pf-sb-btn:hover {
    color: #e2e8f0;
    background: rgba(0,229,255,.05);
    border-color: rgba(0,229,255,.1);
  }

  .pf-sb-btn-danger {
    color: #64748b;
  }
  .pf-sb-btn-danger:hover {
    color: #f87171;
    background: rgba(239,68,68,.07);
    border-color: rgba(239,68,68,.2);
  }

  .pf-sb-btn-icon {
    width: 32px; height: 32px; border-radius: 8px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center; font-size: 16px;
    background: rgba(255,255,255,.04); transition: background .2s;
  }
`;

export default function Sidebar() {
        const location = useLocation();
        const navigate = useNavigate();
        const { logout } = useAuth();

        const isActive = (path) => location.pathname === path;

        const menuItems = [
                { icon: '📊', label: 'Dashboard', path: '/dashboard' },
                { icon: '💻', label: 'Technical Challenge', path: '/technical-challenge' },
                { icon: '🎯', label: 'Problem Mode', path: '/problem-mode' },
                { icon: '💡', label: 'Idea → Prompt', path: '/idea-to-prompt' },
                { icon: '👤', label: 'Profile', path: '/profile' },
        ];

        const handleLogout = () => {
                logout();
                navigate('/');
        };

        return (
                <>
                        <style>{styles}</style>
                        <aside className="pf-sidebar">
                                {/* Logo */}
                                <div className="pf-sb-logo">
                                        <div className="pf-sb-logo-icon">⚡</div>
                                        <div className="pf-sb-logo-text">Prompt<span>Forge</span></div>
                                </div>

                                {/* Nav */}
                                <nav className="pf-sb-nav">
                                        <div className="pf-sb-label">Menu</div>
                                        {menuItems.map(item => (
                                                <Link
                                                        key={item.path}
                                                        to={item.path}
                                                        className={`pf-sb-link${isActive(item.path) ? ' active' : ''}`}
                                                >
                                                        <div className="pf-sb-icon">{item.icon}</div>
                                                        <span>{item.label}</span>
                                                </Link>
                                        ))}
                                </nav>

                                {/* Bottom */}
                                <div className="pf-sb-bottom">
                                        <button className="pf-sb-btn">
                                                <div className="pf-sb-btn-icon">⚙️</div>
                                                <span>Settings</span>
                                        </button>
                                        <button className="pf-sb-btn pf-sb-btn-danger" onClick={handleLogout}>
                                                <div className="pf-sb-btn-icon">🚪</div>
                                                <span>Logout</span>
                                        </button>
                                </div>
                        </aside>
                </>
        );
}