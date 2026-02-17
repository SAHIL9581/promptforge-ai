import { useEffect } from 'react';

export default function Toast({ message, type = 'success', isVisible, onClose }) {
        useEffect(() => {
                if (isVisible) {
                        const timer = setTimeout(onClose, 3000);
                        return () => clearTimeout(timer);
                }
        }, [isVisible, onClose]);

        if (!message) return null;

        return (
                <div
                        className={`fixed top-8 right-8 bg-bg-card border border-border rounded-xl p-4 flex items-center gap-3 shadow-2xl transition-transform duration-300 ${isVisible ? 'translate-x-0' : 'translate-x-[400px]'
                                } ${type === 'success'
                                        ? 'border-l-4 border-l-success'
                                        : 'border-l-4 border-l-danger'
                                }`}
                >
                        <span className="text-xl">{type === 'success' ? '✓' : '✕'}</span>
                        <span>{message}</span>
                </div>
        );
}
