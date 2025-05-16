import { useState, useEffect } from 'react';
import PredictForm from '../components/PredictForm';
import ImageDisplay from '../components/ImageDisplay';
import ResultsList from '../components/ResultsList';
import StatusMessage from '../components/StatusMessage';
import ImageZoomModal from '../components/ImageZoomModal';
import { usePredictService } from '../services/predictService';
import { createImageWithBoxes } from '../utils/imageUtils';

const PredictPage = () => {
    // State for models
    const [models, setModels] = useState([]);
    const [defaultModels, setDefaultModels] = useState(null);
    const [modelsFetched, setModelsFetched] = useState(false);

    // State for images and predictions
    const [currentImage, setCurrentImage] = useState(null);
    const [predictions, setPredictions] = useState({
        firstStage: [],
        secondStage: [],
        finalDetections: []
    });

    // UI state
    const [statusMessage, setStatusMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('final-result');

    // Image zoom modal state
    const [zoomModalOpen, setZoomModalOpen] = useState(false);
    const [zoomedImage, setZoomedImage] = useState('');

    // State for result images
    const [resultImages, setResultImages] = useState({
        finalResult: '',
        firstStage: '',
        cropped: '',
        processed: ''
    });

    const predictService = usePredictService();

    // Fetch models on component mount
    useEffect(() => {
        const fetchModels = async () => {
            const result = await predictService.fetchTwoStageModels();
            if (result.success) {
                setModels(result.models);
                setDefaultModels(result.defaults);
            } else {
                setStatusMessage({
                    type: 'error',
                    message: result.error || 'Failed to load models'
                });
            }
            setModelsFetched(true);
        };

        fetchModels();
    }, []);

    // Handle image preview when a file is selected
    const handleImagePreview = (file) => {
        if (!file) {
            setCurrentImage(null);
            resetPredictionUI(true);
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            setCurrentImage(e.target.result);
            resetPredictionUI(true);
            setResultImages(prev => ({
                ...prev,
                finalResult: e.target.result
            }));
            setActiveTab('final-result');
        };

        reader.onerror = () => {
            setStatusMessage({
                type: 'error',
                message: 'Error reading file.'
            });
            setCurrentImage(null);
            resetPredictionUI(true);
        };

        reader.readAsDataURL(file);
    };

    // Reset the prediction UI elements
    const resetPredictionUI = (clearData = false) => {
        setStatusMessage(null);

        if (clearData) {
            setPredictions({
                firstStage: [],
                secondStage: [],
                finalDetections: []
            });
            setResultImages({
                finalResult: currentImage || '',
                firstStage: '',
                cropped: '',
                processed: ''
            });
        } else {
            // Keep the current image in final result view
            setResultImages(prev => ({
                ...prev,
                finalResult: currentImage || ''
            }));
        }
    };

    // Handle form submission for prediction
    const handlePredictFormSubmit = async (formData) => {
        if (!currentImage) {
            setStatusMessage({
                type: 'error',
                message: 'Please select and upload an image file first.'
            });
            return;
        }

        resetPredictionUI(false);
        setIsLoading(true);

        try {
            const result = await predictService.processPrediction(formData);

            if (result.success) {
                await processTwoStageResults(result.data);
                setStatusMessage({
                    type: 'success',
                    message: 'Two-stage inference successful!'
                });
                setActiveTab('final-result');
            } else {
                throw new Error(result.error || 'Inference failed');
            }
        } catch (error) {
            console.error('Error during prediction:', error);
            setStatusMessage({
                type: 'error',
                message: `Inference Error: ${error.message}`
            });
            resetPredictionUI(false);
        } finally {
            setIsLoading(false);
        }
    };

    // Process the results from two-stage prediction
    const processTwoStageResults = async (result) => {
        // Update state with first stage results
        const firstStageResults = Array.isArray(result.first_stage)
            ? result.first_stage.map(p => ({...p, visible: true}))
            : [];

        let finalDetections = [];

        // Check if final_detections has content
        if (Array.isArray(result.final_detections) && result.final_detections.length > 0) {
            finalDetections = result.final_detections.map(p => ({...p, visible: true}));
        } else if (Array.isArray(result.second_stage) && result.second_stage.length > 0 &&
            Array.isArray(result.second_stage[0].second_detections) &&
            result.second_stage[0].second_detections.length > 0) {

            // Get the first second_stage result which has the detections
            const secondStageResult = result.second_stage[0];
            const scalingInfo = secondStageResult.scaling_info || {};

            // Process each second_detection and add to finalDetections
            secondStageResult.second_detections.forEach(detection => {
                // Check if we need to apply scaling/transformation
                let box = [...detection.box]; // Clone the box array

                // Apply scaling if available
                if (scalingInfo.scale_x && scalingInfo.scale_y &&
                    scalingInfo.pad_left !== undefined && scalingInfo.pad_top !== undefined) {

                    const [x1, y1, x2, y2] = box;

                    // Apply scaling and padding to transform back to original coordinates
                    box = [
                        Math.round(x1 / scalingInfo.scale_x + secondStageResult.crop_box[0] - scalingInfo.pad_left),
                        Math.round(y1 / scalingInfo.scale_y + secondStageResult.crop_box[1] - scalingInfo.pad_top),
                        Math.round(x2 / scalingInfo.scale_x + secondStageResult.crop_box[0] - scalingInfo.pad_left),
                        Math.round(y2 / scalingInfo.scale_y + secondStageResult.crop_box[1] - scalingInfo.pad_top)
                    ];
                }

                // Add to final detections with transformed box
                finalDetections.push({
                    ...detection,
                    box: box,
                    visible: true
                });
            });
        }

        // Update the state with the processed results
        setPredictions({
            firstStage: firstStageResults,
            secondStage: result.second_stage || [],
            finalDetections
        });

        try {
            // Create images with boxes
            let newResultImages = { ...resultImages };

            // Final result image
            if (currentImage) {
                try {
                    const finalResultWithBoxes = await createImageWithBoxes(currentImage, finalDetections);
                    newResultImages.finalResult = finalResultWithBoxes;
                } catch (error) {
                    console.error("Error creating final result image:", error);
                    newResultImages.finalResult = currentImage;
                }
            }

            // First stage image
            if (currentImage && firstStageResults.length > 0) {
                try {
                    const firstStageDataURL = await createImageWithBoxes(currentImage, firstStageResults);
                    newResultImages.firstStage = firstStageDataURL;
                } catch (error) {
                    console.error("Error creating first stage image:", error);
                    newResultImages.firstStage = '';
                }
            } else {
                newResultImages.firstStage = '';
            }

            // Second stage images (Cropped/Processed)
            if (Array.isArray(result.second_stage) && result.second_stage.length > 0) {
                const firstResult = result.second_stage[0];

                // Load cropped image if base64 data exists
                const croppedSrc = firstResult?.cropped_image_base64
                    ? `data:image/jpeg;base64,${firstResult.cropped_image_base64}`
                    : '';
                newResultImages.cropped = croppedSrc;

                // Load processed image if base64 data exists
                const processedSrc = firstResult?.processed_image_base64
                    ? `data:image/jpeg;base64,${firstResult.processed_image_base64}`
                    : '';
                newResultImages.processed = processedSrc;
            } else {
                newResultImages.cropped = '';
                newResultImages.processed = '';
            }

            // Update the result images state
            setResultImages(newResultImages);

        } catch (error) {
            console.error("Error processing prediction results:", error);
        }
    };

    // Handle when a detection's visibility is toggled
    const handleDetectionVisibilityChange = async (index, isVisible) => {
        // Update the predictions state
        setPredictions(prev => {
            const updatedDetections = [...prev.finalDetections];
            if (updatedDetections[index]) {
                updatedDetections[index] = {
                    ...updatedDetections[index],
                    visible: isVisible
                };
            }
            return {
                ...prev,
                finalDetections: updatedDetections
            };
        });

        // Update the final result image with the new visibility settings
        if (currentImage) {
            try {
                const updatedDetections = [...predictions.finalDetections];
                if (updatedDetections[index]) {
                    updatedDetections[index].visible = isVisible;
                }

                const updatedImage = await createImageWithBoxes(currentImage, updatedDetections);
                setResultImages(prev => ({
                    ...prev,
                    finalResult: updatedImage
                }));
            } catch (error) {
                console.error("Error updating image after visibility change:", error);
            }
        }
    };

    // Handle all detections visibility toggle
    const handleAllDetectionsVisibilityChange = async (isVisible) => {
        // Update all predictions with the new visibility
        setPredictions(prev => {
            const updatedDetections = prev.finalDetections.map(detection => ({
                ...detection,
                visible: isVisible
            }));

            return {
                ...prev,
                finalDetections: updatedDetections
            };
        });

        // Update the final result image
        if (currentImage) {
            try {
                const updatedDetections = predictions.finalDetections.map(detection => ({
                    ...detection,
                    visible: isVisible
                }));

                const updatedImage = await createImageWithBoxes(currentImage, updatedDetections);
                setResultImages(prev => ({
                    ...prev,
                    finalResult: updatedImage
                }));
            } catch (error) {
                console.error("Error updating all detections visibility:", error);
            }
        }
    };

    // Handle image click for zoom
    const handleImageClick = (imageURL) => {
        if (imageURL) {
            setZoomedImage(imageURL);
            setZoomModalOpen(true);
        }
    };

    return (
        <div className="w-full">
            <h2 className="text-primary-dark-blue text-2xl font-semibold pb-2 mb-8 border-b-2 border-accent-pink">
                Two-Stage Image Inference
            </h2>

            {statusMessage && (
                <div className="mb-6">
                    <StatusMessage type={statusMessage.type} message={statusMessage.message} />
                </div>
            )}

            {/* Desktop layout for large screens */}
            <div className="hidden lg:flex gap-6 h-[calc(100vh-230px)] min-h-[600px]">
                {/* Left column - Configuration */}
                <div className="w-[22%] min-w-[250px] overflow-y-auto border border-neutral-gray border-l-4 border-l-primary-light-blue rounded-lg p-6 shadow-card bg-neutral-white">
                    <PredictForm
                        models={models}
                        defaultModels={defaultModels}
                        modelsFetched={modelsFetched}
                        isLoading={isLoading}
                        onSubmit={handlePredictFormSubmit}
                        onImageSelect={handleImagePreview}
                    />
                </div>

                {/* Middle column - Image Display */}
                <div className="w-1/2 flex-grow border border-neutral-gray border-l-4 border-l-accent-pink rounded-lg p-6 shadow-card bg-neutral-white flex flex-col overflow-hidden">
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-neutral-gray">
                        <h3 className="text-primary-blue text-xl font-medium">Image Visualization</h3>
                        {statusMessage && statusMessage.type === 'success' && (
                            <div className="inline-block px-4 py-2 text-sm rounded bg-[#e4f1e4] text-[#1b5e20] border border-[#a5d6a7]">
                                {statusMessage.message}
                            </div>
                        )}
                    </div>

                    <ImageDisplay
                        images={resultImages}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        onImageClick={handleImageClick}
                    />
                </div>

                {/* Right column - Results */}
                <div className="w-[24%] min-w-[250px] border border-neutral-gray border-l-4 border-l-success rounded-lg p-6 shadow-card bg-neutral-white flex flex-col overflow-hidden">
                    <h3 className="text-primary-blue text-xl font-medium mb-4 pb-2 border-b border-neutral-gray">
                        Detection Results
                    </h3>

                    <div className="flex-grow overflow-hidden">
                        <ResultsList
                            detections={predictions.finalDetections}
                            onVisibilityChange={handleDetectionVisibilityChange}
                            onAllVisibilityChange={handleAllDetectionsVisibilityChange}
                        />
                    </div>
                </div>
            </div>

            {/* Mobile layout for smaller screens */}
            <div className="lg:hidden flex flex-col gap-6">
                {/* Configuration Section */}
                <div className="border border-neutral-gray border-l-4 border-l-primary-light-blue rounded-lg p-6 shadow-card bg-neutral-white">
                    <PredictForm
                        models={models}
                        defaultModels={defaultModels}
                        modelsFetched={modelsFetched}
                        isLoading={isLoading}
                        onSubmit={handlePredictFormSubmit}
                        onImageSelect={handleImagePreview}
                        isMobile={true}
                    />
                </div>

                {/* Results Section */}
                <div className="border border-neutral-gray border-l-4 border-l-accent-pink rounded-lg p-6 shadow-card bg-neutral-white">
                    <h3 className="text-primary-blue text-xl font-medium mb-4 pb-2 border-b border-neutral-gray">
                        Inference Results
                    </h3>

                    <ImageDisplay
                        images={resultImages}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        onImageClick={handleImageClick}
                    />

                    <div className="mt-6">
                        <ResultsList
                            detections={predictions.finalDetections}
                            onVisibilityChange={handleDetectionVisibilityChange}
                            onAllVisibilityChange={handleAllDetectionsVisibilityChange}
                        />
                    </div>
                </div>
            </div>

            {/* Image Zoom Modal */}
            <ImageZoomModal
                isOpen={zoomModalOpen}
                imageUrl={zoomedImage}
                onClose={() => setZoomModalOpen(false)}
            />
        </div>
    );
};

export default PredictPage;