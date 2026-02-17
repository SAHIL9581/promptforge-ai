export default function Badge({ children, variant = 'default', className = '' }) {
        const variants = {
                dsa: 'bg-primary/15 text-primary-light border-primary/30',
                dbms: 'bg-success/15 text-success border-success/30',
                daa: 'bg-accent-pink/15 text-accent-pink border-accent-pink/30',
                default: 'bg-text-secondary/15 text-text-secondary border-text-secondary/30',
        };

        return (
                <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide border ${variants[variant]} ${className}`}
                >
                        {children}
                </span>
        );
}
