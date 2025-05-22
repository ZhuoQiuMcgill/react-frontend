import {useState, useEffect} from 'react';

/**
 * ModeToggle component - A subtle toggle between normal and advanced modes
 * Hidden in the corner to prevent accidental toggles by regular users
 * Requires 7 consecutive clicks to enter advanced mode, single click to exit
 */
const ModeToggle = ({isAdvancedMode, onToggle, clickCount = 0, requiredClicks = 7}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [showClickProgress, setShowClickProgress] = useState(false);

    // Show click progress when user starts clicking in normal mode
    useEffect(() => {
        if (!isAdvancedMode && clickCount > 0) {
            setShowClickProgress(true);
            // Hide progress after 3 seconds of no interaction
            const timer = setTimeout(() => {
                setShowClickProgress(false);
            }, 3000);
            return () => clearTimeout(timer);
        } else {
            setShowClickProgress(false);
        }
    }, [clickCount, isAdvancedMode]);

    const getDisplayText = () => {
        if (isAdvancedMode) {
            return 'Advanced Mode';
        } else if (showClickProgress && clickCount > 0) {
            return `${clickCount}/${requiredClicks}`;
        } else {
            return 'Normal Mode';
        }
    };

    const getAriaLabel = () => {
        if (isAdvancedMode) {
            return "Click to switch to normal mode";
        } else {
            return `Click ${requiredClicks} times quickly to switch to advanced mode`;
        }
    };

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
                    : showClickProgress && clickCount > 0
                        ? 'bg-accent-pink text-white'
                        : 'bg-neutral-gray text-text-light'}`}
                aria-label={getAriaLabel()}
                title={getAriaLabel()}
            >
                {(isHovered || showClickProgress) && (
                    <span className={`whitespace-nowrap ${
                        isAdvancedMode
                            ? 'text-white'
                            : showClickProgress && clickCount > 0
                                ? 'text-white'
                                : 'text-text-default'
                    }`}>
                        {getDisplayText()}
                    </span>
                )}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor">
                    {isAdvancedMode ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707M6.343 17.657l-.707.707"/>
                    )}
                </svg>
            </button>

            {/* Click progress indicator */}
            {!isAdvancedMode && showClickProgress && clickCount > 0 && (
                <div
                    className="absolute bottom-full right-0 mb-2 bg-black/75 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    {requiredClicks - clickCount} more clicks for advanced mode
                </div>
            )}
        </div>
    );
};

export default ModeToggle;