import { useAppConfig } from '../../../shared/hooks/useAppConfig';

/**
 * Custom hook for predict API services
 */
export const usePredictService = () => {
    const { apiBaseUrl } = useAppConfig();

    /**
     * Fetches two-stage models from the API
     */
    const fetchTwoStageModels = async () => {
        try {
            const response = await fetch(`${apiBaseUrl}/api/yolo/models/two-stage`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            if (data.status === 'success') {
                return { success: true, models: data.models, defaults: data.defaults };
            } else {
                throw new Error(data.message || 'Failed to load models');
            }
        } catch (error) {
            console.error('Error fetching two-stage models:', error);

            // Fallback to regular models endpoint
            try {
                const fallbackResponse = await fetch(`${apiBaseUrl}/api/yolo/models`);
                if (fallbackResponse.ok) {
                    const fallbackData = await fallbackResponse.json();
                    if (fallbackData.status === 'success' && Array.isArray(fallbackData.models)) {
                        return { success: true, models: fallbackData.models, defaults: null };
                    }
                }
            } catch (fallbackError) {
                console.error('Error fetching fallback models:', fallbackError);
            }

            return {
                success: false,
                error: error.message || 'Failed to load models',
                models: [],
                defaults: null
            };
        }
    };

    /**
     * Process prediction with the API
     */
    const processPrediction = async (formData) => {
        try {
            const response = await fetch(`${apiBaseUrl}/api/yolo/predict/two-stage`, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.ok && result.status === 'success') {
                return { success: true, data: result };
            } else {
                throw new Error(result.message || `Inference failed (HTTP ${response.status})`);
            }
        } catch (error) {
            console.error('Error during prediction:', error);
            return {
                success: false,
                error: error.message || 'An unknown error occurred during inference'
            };
        }
    };

    return {
        fetchTwoStageModels,
        processPrediction
    };
};