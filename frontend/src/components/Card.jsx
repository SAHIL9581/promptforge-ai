import React, { forwardRef } from 'react';

const Card = forwardRef(({
        children,
        className = '',
        hasTopBorder = false,
        borderColor = '',
        onClick,
        ...props
}, ref) => {
        return (
                <div
                        ref={ref}
                        className={`card relative ${className}`}
                        onClick={onClick}
                        {...props}
                >
                        {hasTopBorder && (
                                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${borderColor}`} />
                        )}
                        {children}
                </div>
        );
});

// Add display name for debugging
Card.displayName = 'Card';

export default Card;
