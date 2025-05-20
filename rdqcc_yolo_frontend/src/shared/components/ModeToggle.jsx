import { useState, useEffect } from 'react';

/**
 * ModeToggle component - A subtle toggle between normal and advanced modes
 * Hidden in the corner to prevent accidental toggles by regular users
 */
const ModeToggle = ({ isAdvancedMode, onToggle }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="fixed bottom-4 right-4 z-50 opacity-30 hover:opacity-100 transition-opacity duration-300"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <button
                onClick={onToggle}
                className={`flex items-center gap-2 py-1 px-3 rounded-full text-xs font-medium transition-all duration-300
          ${isAdvancedMode
                    ? 'bg-primary-blue text-white'
                    : 'bg-neutral-gray text-text-light'}`}
                aria-label={isAdvancedMode ? "Switch to normal mode" : "Switch to advanced mode"}
            >
                {isHovered && (
                    <span className={`whitespace-nowrap ${isAdvancedMode ? 'text-white' : 'text-text-default'}`}>
            {isAdvancedMode ? 'Advanced Mode' : 'Normal Mode'}
          </span>
                )}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {isAdvancedMode ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707M6.343 17.657l-.707.707" />
                    )}
                </svg>
            </button>
        </div>
    );
};

export default ModeToggle;