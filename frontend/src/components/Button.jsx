import Spinner from './spinner';

export default function Button({
        children,
        variant = 'primary',
        isLoading = false,
        className = '',
        ...props
}) {
        const base =
                'px-8 py-3.5 font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed';
        const variants = {
                primary:
                        'bg-gradient-to-br from-primary to-primary-dark text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/40',
                secondary:
                        'bg-bg-input text-text-primary border border-border hover:border-primary hover:bg-primary/10',
        };

        return (
                <button
                        className={`${base} ${variants[variant]} ${className}`}
                        disabled={isLoading || props.disabled}
                        {...props}
                >
                        {isLoading && <Spinner />}
                        {children}
                </button>
        );
}
