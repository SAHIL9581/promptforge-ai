import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
                navigate('/login');
        };

        return (
                <aside className="fixed left-0 top-0 h-screen w-64 bg-bg-card/80 backdrop-blur-xl border-r border-border flex flex-col z-50">
                        {/* Logo */}
                        <div className="p-6 border-b border-border">
                                <h1 className="text-2xl font-extrabold bg-gradient-to-r from-primary to-accent-cyan bg-clip-text text-transparent">
                                        PromptForge
                                </h1>
                        </div>

                        {/* Menu */}
                        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                                {menuItems.map((item) => (
                                        <Link
                                                key={item.path}
                                                to={item.path}
                                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive(item.path)
                                                        ? 'bg-primary/15 text-primary border border-primary/30'
                                                        : 'text-text-secondary hover:bg-bg-input hover:text-text-primary'
                                                        }`}
                                        >
                                                <span className="text-xl">{item.icon}</span>
                                                <span className="font-medium">{item.label}</span>
                                        </Link>
                                ))}
                        </nav>

                        {/* Bottom Actions */}
                        <div className="p-4 border-t border-border space-y-2">
                                <button
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-text-secondary hover:bg-bg-input hover:text-text-primary transition-all"
                                >
                                        <span className="text-xl">⚙️</span>
                                        <span className="font-medium">Settings</span>
                                </button>
                                <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-danger hover:bg-danger/10 transition-all"
                                >
                                        <span className="text-xl">🚪</span>
                                        <span className="font-medium">Logout</span>
                                </button>
                        </div>
                </aside>
        );
}
