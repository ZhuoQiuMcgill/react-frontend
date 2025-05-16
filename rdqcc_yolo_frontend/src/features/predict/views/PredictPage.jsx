import { useState, useEffect, useRef } from 'react';
import ResultsList from '../components/ResultsList';
import StatusMessage from '../components/StatusMessage';
import ImageZoomModal from '../components/ImageZoomModal';
import { usePredictService } from '../services/predictService';
import { createImageWithBoxes, createStatusMessage } from '../utils/imageUtils';
import AIReport from '../components/AIReport';

const PredictPage = () => {
    // State for models
    const [models, setModels] = useState([]);
    const [defaultModels, setDefaultModels] = useState(null);
    const [modelsFetched, setModelsFetched] = useState(false);

    // Configuration state
    const [firstModelSelected, setFirstModelSelected] = useState('');
    const [secondModelSelected, setSecondModelSelected] = useState('');
    const [confidenceThreshold, setConfidenceThreshold] = useState(0.01);
    const [filterEnabled, setFilterEnabled] = useState(true);
    const [productCode, setProductCode] = useState('');

    // State for images and predictions
    const [currentImage, setCurrentImage] = useState(null);
    const [fileInputFile, setFileInputFile] = useState(null);
    const [predictions, setPredictions] = useState({
        firstStage: [],
        secondStage: [],
        finalDetections: []
    });

    // UI state
    const [statusMessage, setStatusMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('final-result');
    const [activeRightTab, setActiveRightTab] = useState('results');

    // Image zoom modal state
    const [zoomModalOpen, setZoomModalOpen] = useState(false);
    const [zoomedImage, setZoomedImage] = useState('');

    // State for result images
    const [resultImages, setResultImages] = useState({
        finalResult: '',
        firstStage: '',
    });

    const fileInputRef = useRef(null);
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
    const handleImageSelect = (file) => {
        if (!file) {
            setCurrentImage(null);
            setFileInputFile(null);
            resetPredictionUI(true);
            return;
        }

        setFileInputFile(file);
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

    // Handle file input click
    const handleFileInputClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // Handle file change
    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            handleImageSelect(e.target.files[0]);
        }
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
    const handleStartInference = async () => {
        if (!currentImage) {
            setStatusMessage({
                type: 'error',
                message: 'Please select and upload an image file first.'
            });
            return;
        }

        resetPredictionUI(false);
        setIsLoading(true);
        setActiveRightTab('results');

        try {
            // Create form data for API request
            const formData = new FormData();

            // Add the image file - if we have the File object use it, otherwise fetch from data URL
            if (fileInputFile) {
                formData.append('image', fileInputFile);
            } else {
                // Convert data URL to file
                const blob = await fetch(currentImage).then(r => r.blob());
                formData.append('image', blob, 'image.jpg');
            }

            // Add model configurations
            if (firstModelSelected) formData.append('first_model_filename', firstModelSelected);
            if (secondModelSelected) formData.append('second_model_filename', secondModelSelected);
            formData.append('first_confidence', confidenceThreshold);
            formData.append('filter', filterEnabled ? 'true' : 'false');
            if (filterEnabled && productCode) formData.append('product_code', productCode);

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
            let newResultImages = {...resultImages};

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

    // Render the configuration panel
    const renderConfigPanel = () => {
        return (
            <div className="p-4 h-full overflow-y-auto">
                <h3 className="text-primary-blue text-lg font-medium mb-4 pb-2 border-b border-neutral-gray">
                    Model Configuration
                </h3>

                <div className="space-y-6">
                    {/* First stage model select */}
                    <div className="space-y-2">
                        <label htmlFor="first-model-select" className="font-medium text-text-light">
                            First Stage Model:
                        </label>
                        <select
                            id="first-model-select"
                            value={firstModelSelected}
                            onChange={(e) => setFirstModelSelected(e.target.value)}
                            className="w-full p-3 border border-neutral-gray rounded-md bg-neutral-white text-text-default
                                focus:border-primary-blue focus:outline-none focus:ring-3 focus:ring-primary-blue/25"
                        >
                            <option value="">Use Default Model</option>
                            {!modelsFetched && <option disabled>Loading models...</option>}
                            {modelsFetched && models.length === 0 && (
                                <option disabled>No custom models found</option>
                            )}
                            {models.map(model => (
                                <option
                                    key={model}
                                    value={model}
                                >
                                    {model} {defaultModels && model === defaultModels.first_stage ? '(Default for First Stage)' : ''}
                                </option>
                            ))}
                        </select>
                        <div className="text-sm text-neutral-dark-gray">
                            Model for initial object detection
                        </div>
                    </div>

                    {/* Second stage model select */}
                    <div className="space-y-2">
                        <label htmlFor="second-model-select" className="font-medium text-text-light">
                            Second Stage Model:
                        </label>
                        <select
                            id="second-model-select"
                            value={secondModelSelected}
                            onChange={(e) => setSecondModelSelected(e.target.value)}
                            className="w-full p-3 border border-neutral-gray rounded-md bg-neutral-white text-text-default
                                focus:border-primary-blue focus:outline-none focus:ring-3 focus:ring-primary-blue/25"
                        >
                            <option value="">Use Default Model</option>
                            {!modelsFetched && <option disabled>Loading models...</option>}
                            {modelsFetched && models.length === 0 && (
                                <option disabled>No custom models found</option>
                            )}
                            {models.map(model => (
                                <option
                                    key={model}
                                    value={model}
                                >
                                    {model} {defaultModels && model === defaultModels.second_stage ? '(Default for Second Stage)' : ''}
                                </option>
                            ))}
                        </select>
                        <div className="text-sm text-neutral-dark-gray">
                            Model for detailed classification
                        </div>
                    </div>

                    {/* Confidence threshold */}
                    <div className="space-y-2">
                        <label htmlFor="confidence-threshold" className="font-medium text-text-light">
                            Confidence Threshold:
                        </label>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                id="confidence-threshold"
                                value={confidenceThreshold}
                                onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
                                min="0.01"
                                max="1"
                                step="0.01"
                                className="w-full h-2 bg-neutral-gray rounded-lg appearance-none cursor-pointer accent-primary-dark-blue"
                            />
                            <span className="text-sm font-medium bg-primary-blue text-white py-1 px-2 rounded w-16 text-center">
                                {confidenceThreshold.toFixed(2)}
                            </span>
                        </div>
                        <div className="text-sm text-neutral-dark-gray">
                            Minimum confidence score (0.01 - 1.0)
                        </div>
                    </div>

                    {/* Filter options */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="filter-enabled"
                                checked={filterEnabled}
                                onChange={(e) => setFilterEnabled(e.target.checked)}
                                className="w-4 h-4 accent-accent-pink"
                            />
                            <label htmlFor="filter-enabled" className="font-medium text-text-light">
                                Enable Automatic Filtering
                            </label>
                        </div>
                        <div className="text-sm text-neutral-dark-gray">
                            Automatically filter by detected product code
                        </div>
                    </div>

                    {/* Product code input - only shown when filtering is enabled */}
                    {filterEnabled && (
                        <div className="space-y-2">
                            <label htmlFor="product-code" className="font-medium text-text-light">
                                Product Code:
                            </label>
                            <input
                                type="text"
                                id="product-code"
                                value={productCode}
                                onChange={(e) => setProductCode(e.target.value)}
                                placeholder="e.g. ABC123"
                                className="w-full p-3 border border-neutral-gray rounded-md bg-neutral-white text-text-default
                                    focus:border-primary-blue focus:outline-none focus:ring-3 focus:ring-primary-blue/25"
                            />
                            <div className="text-sm text-neutral-dark-gray">
                                Only show detections matching this product code prefix
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Render the image display panel
    const renderImageDisplay = () => {
        const imageSrc = activeTab === 'final-result' ? resultImages.finalResult : resultImages.firstStage;
        const hasImage = !!imageSrc;

        return (
            <div className="w-full h-full flex flex-col overflow-hidden">
                <div className="image-tabs-header flex border-b border-neutral-gray bg-neutral-light-gray">
                    <button
                        className={`flex-grow py-3 px-8 bg-transparent border-none border-b-3 font-medium transition-all
                            ${activeTab === 'final-result'
                            ? 'border-b-accent-pink text-primary-dark-blue bg-neutral-white'
                            : 'border-b-transparent text-text-light hover:bg-black/[0.03] hover:text-primary-dark-blue'
                        }`}
                        onClick={() => setActiveTab('final-result')}
                    >
                        Final Result
                    </button>
                    <button
                        className={`flex-grow py-3 px-8 bg-transparent border-none border-b-3 font-medium transition-all
                            ${activeTab === 'first-stage'
                            ? 'border-b-accent-pink text-primary-dark-blue bg-neutral-white'
                            : 'border-b-transparent text-text-light hover:bg-black/[0.03] hover:text-primary-dark-blue'
                        }`}
                        onClick={() => setActiveTab('first-stage')}
                    >
                        First Stage
                    </button>
                </div>

                <div className="flex-grow overflow-hidden relative p-4 bg-neutral-white">
                    {!hasImage ? (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-[#e0e0e0] border border-neutral-gray rounded-lg text-neutral-dark-gray p-8">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-neutral-dark-gray/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-center">
                                {activeTab === 'final-result'
                                    ? 'Upload an image and start inference to see detection results'
                                    : 'No first stage detection results available'}
                            </p>
                            {activeTab === 'final-result' && !currentImage && (
                                <button
                                    onClick={handleFileInputClick}
                                    className="mt-4 px-6 py-2 bg-gradient-primary text-white rounded-full font-medium shadow-button hover:filter hover:brightness-110"
                                >
                                    Select Image
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#e0e0e0] border border-neutral-gray rounded-lg overflow-auto">
                            <img
                                src={imageSrc}
                                alt={activeTab === 'final-result' ? 'Final detection results' : 'First stage detections'}
                                className="max-w-full max-h-full object-contain cursor-zoom-in hover:opacity-95 transition-opacity"
                                onClick={() => handleImageClick(imageSrc)}
                            />
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="w-full max-w-full overflow-hidden">
            {/* Page header */}
            <div className="mb-6">
                <h2 className="text-primary-dark-blue text-2xl font-semibold pb-2 border-b-2 border-accent-pink mb-4">
                    Intelligent Defect Detection
                </h2>
                <p className="text-text-light mb-4">
                    Upload an image and use our AI models to detect and classify defects with precision.
                </p>

                {/* Status messages will be shown in the action bar, not here */}
            </div>

            {/* Main content area */}
            <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-240px)] min-h-[600px]">
                {/* Left section - Image display and controls (65%) */}
                <div className="lg:w-8/12 flex flex-col gap-6 h-full">
                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-4">
                        {/* Hidden file input */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/png, image/jpeg, image/jpg, image/bmp, image/webp"
                            className="hidden"
                        />

                        {/* Upload button */}
                        <button
                            onClick={handleFileInputClick}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-primary text-white rounded-full font-medium shadow-button hover:filter hover:brightness-110 transition transform hover:-translate-y-0.5"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                            Upload Image
                        </button>

                        {/* Start inference button */}
                        <button
                            onClick={handleStartInference}
                            disabled={isLoading || !currentImage}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-accent text-white rounded-full font-medium shadow-button hover:filter hover:brightness-110 transition transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                    </svg>
                                    Start Inference
                                </>
                            )}
                        </button>

                        {/* Status message and file info */}
                        {statusMessage ? (
                            <div className={`flex items-center ml-auto px-4 py-2 rounded-full text-sm ${
                                statusMessage.type === 'success'
                                    ? 'bg-[#e4f1e4] text-[#1b5e20]'
                                    : statusMessage.type === 'error'
                                        ? 'bg-[#fce4e4] text-[#b71c1c]'
                                        : 'bg-[#e1f5fe] text-[#01579b]'
                            }`}>
                                {statusMessage.type === 'success' && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                                {statusMessage.type === 'error' && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                )}
                                <span>{statusMessage.message}</span>
                            </div>
                        ) : fileInputFile && (
                            <div className="flex items-center ml-auto px-4 py-2 bg-neutral-light-gray rounded-full text-sm text-text-light">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                </svg>
                                <span className="truncate max-w-xs">{fileInputFile.name}</span>
                            </div>
                        )}
                    </div>

                    {/* Image display */}
                    <div className="flex-grow border border-neutral-gray rounded-lg shadow-card overflow-hidden">
                        {renderImageDisplay()}
                    </div>
                </div>

                {/* Right section - Tabs for Results, Config, and AI Report (35%) */}
                <div className="lg:w-4/12 border border-neutral-gray rounded-lg shadow-card overflow-hidden bg-neutral-white flex flex-col h-full">
                    {/* Tabs header */}
                    <div className="tabs-header flex border-b border-neutral-gray bg-neutral-light-gray">
                        <button
                            className={`flex-1 py-3 px-4 bg-transparent border-none border-b-3 font-medium transition-all
                                ${activeRightTab === 'results'
                                ? 'border-b-accent-pink text-primary-dark-blue bg-neutral-white'
                                : 'border-b-transparent text-text-light hover:bg-black/[0.03] hover:text-primary-dark-blue'
                            }`}
                            onClick={() => setActiveRightTab('results')}
                        >
                            Results
                        </button>
                        <button
                            className={`flex-1 py-3 px-4 bg-transparent border-none border-b-3 font-medium transition-all
                                ${activeRightTab === 'config'
                                ? 'border-b-accent-pink text-primary-dark-blue bg-neutral-white'
                                : 'border-b-transparent text-text-light hover:bg-black/[0.03] hover:text-primary-dark-blue'
                            }`}
                            onClick={() => setActiveRightTab('config')}
                        >
                            Configuration
                        </button>
                        <button
                            className={`flex-1 py-3 px-4 bg-transparent border-none border-b-3 font-medium transition-all
                                ${activeRightTab === 'report'
                                ? 'border-b-accent-pink text-primary-dark-blue bg-neutral-white'
                                : 'border-b-transparent text-text-light hover:bg-black/[0.03] hover:text-primary-dark-blue'
                            }`}
                            onClick={() => setActiveRightTab('report')}
                        >
                            AI Report
                        </button>
                    </div>

                    {/* Tab content */}
                    <div className="flex-grow overflow-hidden">
                        {/* Results tab */}
                        <div className={`h-full ${activeRightTab === 'results' ? 'block' : 'hidden'}`}>
                            <ResultsList
                                detections={predictions.finalDetections}
                                onVisibilityChange={handleDetectionVisibilityChange}
                                onAllVisibilityChange={handleAllDetectionsVisibilityChange}
                            />
                        </div>

                        {/* Configuration tab */}
                        <div className={`h-full ${activeRightTab === 'config' ? 'block' : 'hidden'}`}>
                            {renderConfigPanel()}
                        </div>

                        {/* AI Report tab */}
                        <div className={`h-full ${activeRightTab === 'report' ? 'block' : 'hidden'}`}>
                            <AIReport
                                currentImage={currentImage}
                                predictions={predictions}
                            />
                        </div>
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