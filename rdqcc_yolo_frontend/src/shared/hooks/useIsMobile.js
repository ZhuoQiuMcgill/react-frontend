import { useState, useEffect } from 'react';

/**
 * Custom hook to detect if the current device is mobile
 * @returns {boolean} true if screen width is less than 1024px (lg breakpoint)
 */
export const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Function to check if the device is mobile based on screen width
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024); // lg breakpoint in Tailwind
        };

        // Check initially
        checkMobile();

        // Add event listener for window resize
        window.addEventListener('resize', checkMobile);

        // Cleanup
        return () => {
            window.removeEventListener('resize', checkMobile);
        };
    }, []);

    return isMobile;
};

export default useIsMobile;