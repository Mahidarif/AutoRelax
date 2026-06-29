import React, { useState } from 'react';

export default function Button({ children, type = 'button', onClick, style: customStyle, ...props }) {
    const [isHovered, setIsHovered] = useState(false);

    // Hex colors
    const normalOrange = '#e67226'; // Left button color
    const hoverBlue = '#0f4265';   // Right button color

    const buttonStyle = {
        // Typography & Structure
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: '18px',
        fontWeight: '600',
        padding: '14px 32px',
        borderRadius: '16px',
        border: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        outline: 'none',

        // Smooth transition between colors
        transition: 'background-color 0.2s ease-in-out',

        // Dynamic color switching based on state
        backgroundColor: isHovered ? hoverBlue : normalOrange,
        color: '#ffffff',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            style={{ ...buttonStyle, ...customStyle }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            {...props}
        >
            {children}
        </button>
    );
}
