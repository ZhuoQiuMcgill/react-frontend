import React, { useState, useCallback } from 'react';
import ConfigPanel from '../components/ConfigPanel';
import ImagePanel from '../components/ImagePanel';
import RightPanel from '../components/RightPanel';
import ConfigurationModal from '../components/ConfigurationModal';
import ImageZoomModal from '../components/ImageZoomModal';
import { predictImage } from '../services/predictService';
import { compressImage } from '../utils/imageUtils';
import { useAppConfig } from '../../../shared/hooks/useAppConfig'; // Corrected path

const PredictPage = () => {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [report, setReport] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
    const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);

    const { appConfig, setAppConfig } = useAppConfig();

    const handleImageChange = useCallback((e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
            setReport(null); // Clear previous report
            setError(null); // Clear previous error
        }
    }, []);

    const handlePredict = useCallback(async () => {
        if (!image) {
            setError('Please upload an image first.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setReport(null);

        try {
            const compressedImage = await compressImage(image);
            const reader = new FileReader();
            reader.readAsDataURL(compressedImage);
            reader.onloadend = async () => {
                const base64Image = reader.result.split(',')[1];
                const prediction = await predictImage(base64Image, appConfig.apiKey, appConfig.modelEndpoint);
                setReport(prediction);
            };
            reader.onerror = () => {
                setError('Failed to read image file.');
                setIsLoading(false);
            };
        } catch (err) {
            setError(err.message || 'Prediction failed.');
        } finally {
            // setIsLoading(false); // Moved inside onloadend or onerror for FileReader
        }
    }, [image, appConfig.apiKey, appConfig.modelEndpoint]);

    // Effect to revoke object URL
    React.useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);


    return (
        // Main container:
        // - Full screen height
        // - Flex column for mobile (default), flex row for medium screens and up
        // - overflow-hidden to prevent page scroll, children manage their own scroll
        <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-gray-100 dark:bg-gray-950">
            {/* Left Panel: Contains ConfigPanel and ImagePanel */}
            {/* - Full width on mobile, fixed width on md+ screens */}
            {/* - Vertical scrolling if content overflows */}
            {/* - Flex column to stack ConfigPanel and ImagePanel */}
            <div className="w-full md:w-[400px] lg:w-[450px] p-3 md:p-4 bg-white dark:bg-gray-900 shadow-md md:shadow-lg flex flex-col overflow-y-auto custom-scrollbar">
                <ConfigPanel
                    onPredict={handlePredict}
                    onImageChange={handleImageChange}
                    isLoading={isLoading}
                    imageSelected={!!image}
                    onOpenConfig={() => setIsConfigModalOpen(true)}
                />
                {/* ImagePanel container: flex-grow allows it to take available space in the left column */}
                <div className="mt-3 md:mt-4 flex-1 flex flex-col min-h-[200px]"> {/* Added min-h and flex-1 flex flex-col */}
                    <ImagePanel
                        preview={preview}
                        onZoom={() => setIsZoomModalOpen(true)}
                        error={error} // Pass error to ImagePanel to display image-related errors
                    />
                </div>
            </div>

            {/* Right Panel Container: Holds the AIReport */}
            {/* - flex-1: Takes up remaining horizontal space on md+ screens */}
            {/* - Full width on mobile (due to parent flex-col) */}
            {/* - Flex column to allow RightPanel to fill height */}
            {/* - overflow-y-auto: Fallback scroll for this container, though RightPanel/AIReport should manage primary scroll */}
            <div className="flex-1 p-3 md:p-4 flex flex-col overflow-y-auto custom-scrollbar">
                <RightPanel
                    report={report}
                    isLoading={isLoading}
                    error={!preview && error} // Pass error only if it's not an image loading error shown in ImagePanel
                />
            </div>

            {isConfigModalOpen && (
                <ConfigurationModal
                    isOpen={isConfigModalOpen}
                    onClose={() => setIsConfigModalOpen(false)}
                    currentConfig={appConfig}
                    onSave={(newConfig) => {
                        setAppConfig(newConfig);
                        setIsConfigModalOpen(false);
                    }}
                />
            )}
            {isZoomModalOpen && preview && (
                <ImageZoomModal
                    isOpen={isZoomModalOpen}
                    onClose={() => setIsZoomModalOpen(false)}
                    imageSrc={preview}
                />
            )}
        </div>
    );
};

export default PredictPage;
