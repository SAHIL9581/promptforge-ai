export default function Button({
        children,
        variant = 'primary',
        onClick,
        disabled = false,
        className = '',
        type = 'button',
        isLoading = false  // Add loading prop
}) {
        const baseStyles = 'px-6 py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2';

        const variants = {
                primary: 'bg-gradient-to-r from-primary to-accent-cyan text-white hover:shadow-lg hover:scale-105 active:scale-95',
                secondary: 'bg-bg-input border-2 border-border text-text-primary hover:border-primary hover:bg-bg-card',
                danger: 'bg-gradient-to-r from-danger to-red-400 text-white hover:shadow-lg hover:scale-105',
                success: 'bg-gradient-to-r from-success to-green-400 text-white hover:shadow-lg hover:scale-105',
                dsa: 'bg-gradient-to-r from-accent-pink to-primary text-white hover:shadow-lg hover:scale-105',
        };

        return (
                <button
                        type={type}
                        onClick={onClick}
                        disabled={disabled || isLoading}
                        className={`${baseStyles} ${variants[variant]} ${className}`}
                >
                        {isLoading ? (
                                <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Loading...</span>
                                </>
                        ) : (
                                children
                        )}
                </button>
        );
}
