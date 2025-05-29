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
            className="fixed bottom-2 right-2 z-50 opacity-5 hover:opacity-70 transition-all duration-700"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <button
                onClick={onToggle}
                className={`group relative overflow-hidden flex items-center gap-1 py-1 px-2 rounded-lg text-xs font-medium transition-all duration-700 backdrop-blur-sm border shadow-sm transform hover:scale-110
          ${isAdvancedMode
                    ? 'bg-gradient-to-r from-primary-blue to-primary-dark-blue text-white border-primary-blue/10 shadow-primary-blue/10'
                    : showClickProgress && clickCount > 0
                        ? 'bg-gradient-to-r from-accent-pink to-accent-dark-pink text-white border-accent-pink/10 shadow-accent-pink/10'
                        : 'bg-white/60 text-neutral-500 border-white/10 shadow-neutral-200/20'}`}
                aria-label={getAriaLabel()}
                title={getAriaLabel()}
            >
                <div
                    className={`absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                        isAdvancedMode
                            ? 'from-white/5 to-transparent'
                            : showClickProgress && clickCount > 0
                                ? 'from-white/5 to-transparent'
                                : 'from-primary-blue/3 to-transparent'
                    }`}></div>

                <div className={`relative z-10 p-1 rounded-md transition-all duration-300 ${
                    isAdvancedMode
                        ? 'bg-white/10'
                        : showClickProgress && clickCount > 0
                            ? 'bg-white/10'
                            : 'bg-primary-blue/5'
                }`}>
                    <svg xmlns="http://www.w3.org/2000/svg"
                         className="h-3 w-3 transition-transform duration-300 group-hover:scale-110" fill="none"
                         viewBox="0 0 24 24"
                         stroke="currentColor">
                        {isAdvancedMode ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M13 10V3L4 14h7v7l9-11h-7z"/>
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707M6.343 17.657l-.707.707"/>
                        )}
                    </svg>
                </div>

                {(isHovered || showClickProgress) && (
                    <span className={`relative z-10 whitespace-nowrap transition-all duration-300 text-xs ${
                        isAdvancedMode
                            ? 'text-white'
                            : showClickProgress && clickCount > 0
                                ? 'text-white'
                                : 'text-primary-dark-blue'
                    }`}>
                        {getDisplayText()}
                    </span>
                )}
            </button>

            {/* Click progress indicator */}
            {!isAdvancedMode && showClickProgress && clickCount > 0 && (
                <div
                    className="absolute bottom-full right-0 mb-1 bg-black/70 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap backdrop-blur-sm border border-white/5 shadow-sm animate-pulse">
                    <div className="flex items-center gap-1">
                        <div className="flex gap-px">
                            {Array.from({length: requiredClicks}).map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-1 h-1 rounded-full transition-all duration-200 ${
                                        i < clickCount ? 'bg-accent-pink' : 'bg-white/20'
                                    }`}
                                />
                            ))}
                        </div>
                        <span className="text-xs">{requiredClicks - clickCount}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ModeToggle;