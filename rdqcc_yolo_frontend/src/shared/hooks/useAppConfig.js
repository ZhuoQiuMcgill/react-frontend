import { useMemo } from 'react';

// Default configuration
const defaultConfig = {
    apiBaseUrl: 'http://localhost:5004', // Development URL by default
    isProduction: true
};

export const useAppConfig = () => {
    // In a real app, you might fetch this from context or environment variables
    // For now, keep it simple with direct values matching the original config.js
    const config = useMemo(() => {
        const IS_PRODUCTION = true; // CHANGE THIS FOR PRODUCTION
        const DEV_API_URL = 'http://localhost:5004';
        const PROD_API_URL = 'https://api.defect-ai.com';

        return {
            apiBaseUrl: IS_PRODUCTION ? PROD_API_URL : DEV_API_URL,
            isProduction: IS_PRODUCTION
        };
    }, []);

    return config;
};