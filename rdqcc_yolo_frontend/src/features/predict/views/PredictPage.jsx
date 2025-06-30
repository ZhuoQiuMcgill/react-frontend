import {useState, useEffect, useRef} from 'react';
import ImageZoomModal from '../components/ImageZoomModal';
import {usePredictService} from '../services/predictService';
import {createImageWithBoxes} from '../utils/imageUtils';
import ActionBar from '../components/ActionBar';
import ImagePanel from '../components/ImagePanel';
import RightPanel from '../components/RightPanel';
import ModeToggle from '../../../shared/components/ModeToggle';

const PredictPage = () => {
    // Mode state (normal vs advanced)
    const [isAdvancedMode, setIsAdvancedMode] = useState(() => {
        // Check localStorage for saved preference
        const saved = localStorage.getItem('defect-ai-mode');
        return saved ? saved === 'advanced' : false; // Default to normal mode
    });

    // Click counter for advanced mode activation
    const [clickCount, setClickCount] = useState(0);
    const lastClickTimeRef = useRef(0);
    const CLICK_TIMEOUT = 2000; // 2 seconds timeout between clicks
    const REQUIRED_CLICKS = 7; // Number of clicks required to enter advanced mode

    // Save mode to localStorage when it changes
    useEffect(() => {
        localStorage.setItem('defect-ai-mode', isAdvancedMode ? 'advanced' : 'normal');
    }, [isAdvancedMode]);

    // Toggle between normal and advanced modes with click counter logic
    const toggleMode = () => {
        const currentTime = Date.now();

        if (isAdvancedMode) {
            // If already in advanced mode, single click exits
            setIsAdvancedMode(false);
            setClickCount(0);
            return;
        }

        // Check if enough time has passed since last click
        if (currentTime - lastClickTimeRef.current > CLICK_TIMEOUT) {
            // Reset counter if timeout exceeded
            setClickCount(1);
        } else {
            // Increment counter
            setClickCount(prev => prev + 1);
        }

        lastClickTimeRef.current = currentTime;

        // Enter advanced mode if required clicks reached
        if (clickCount + 1 >= REQUIRED_CLICKS) {
            setIsAdvancedMode(true);
            setClickCount(0);
        }
    };

    // State for models
    const [models, setModels] = useState([]);
    const [defaultModels, setDefaultModels] = useState(null);
    const [modelsFetched, setModelsFetched] = useState(false);

    // Configuration state
    const [firstModelSelected, setFirstModelSelected] = useState('');
    const [secondModelSelected, setSecondModelSelected] = useState('');
    const [confidenceThreshold, setConfidenceThreshold] = useState(0.01);
    const [filterEnabled, setFilterEnabled] = useState(true);

    // State for images and predictions
    const [currentImage, setCurrentImage] = useState(null);
    const [fileInputFile, setFileInputFile] = useState(null);
    const [fileSizeError, setFileSizeError] = useState(false);
    const [predictions, setPredictions] = useState({
        firstStage: [],
        secondStage: [],
        finalDetections: []
    });

    // State for AI report
    const [reportContent, setReportContent] = useState(null);

    // UI state
    const [statusMessage, setStatusMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('final-result');
    const [activeRightTab, setActiveRightTab] = useState(isAdvancedMode ? 'results' : 'report');

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

    // Reset active right tab when switching modes
    useEffect(() => {
        if (!isAdvancedMode) {
            setActiveRightTab('report');
        }
    }, [isAdvancedMode]);

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
        console.info('File selected:', file ? file.name : 'null', file ? `${(file.size / 1024 / 1024).toFixed(2)}MB` : '');

        if (!file) {
            setCurrentImage(null);
            setFileInputFile(null);
            setFileSizeError(false);
            setResultImages({
                finalResult: '',
                firstStage: '',
            });
            resetPredictionUI(true);
            return;
        }

        // Check file size (7MB limit)
        const maxSize = 7 * 1024 * 1024; // 7MB in bytes
        const fileSizeMB = (file.size / 1024 / 1024).toFixed(2);

        if (file.size > maxSize) {
            console.error(`File size ${fileSizeMB}MB exceeds 7MB limit`);

            // Clear everything immediately
            setCurrentImage(null);
            setFileInputFile(null);
            setFileSizeError(true);

            // Clear result images explicitly
            setResultImages({
                finalResult: '',
                firstStage: '',
            });

            // Clear predictions
            setPredictions({
                firstStage: [],
                secondStage: [],
                finalDetections: []
            });

            setStatusMessage({
                type: 'error',
                message: `Image size (${fileSizeMB}MB) must be less than 7MB. Please select a smaller image.`
            });

            console.info('File size error state set, image cleared');
            return;
        }

        console.info(`File size ${fileSizeMB}MB is acceptable, processing...`);

        // Reset error state and process valid file
        setFileSizeError(false);
        setFileInputFile(file);

        const reader = new FileReader();
        reader.onload = (e) => {
            console.info('File successfully loaded into memory');
            setCurrentImage(e.target.result);
            resetPredictionUI(true);
            setResultImages(prev => ({
                ...prev,
                finalResult: e.target.result
            }));
            setActiveTab('final-result');
        };

        reader.onerror = () => {
            console.error('Error reading file');
            setStatusMessage({
                type: 'error',
                message: 'Error reading file.'
            });
            setCurrentImage(null);
            setFileInputFile(null);
            setFileSizeError(false);
            setResultImages({
                finalResult: '',
                firstStage: '',
            });
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
        console.info('File input changed, files:', e.target.files.length);
        if (e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            console.info('Selected file:', selectedFile.name, `${(selectedFile.size / 1024 / 1024).toFixed(2)}MB`);
            handleImageSelect(selectedFile);
        } else {
            console.info('No file selected, clearing');
            handleImageSelect(null);
        }
    };

    // Reset the prediction UI elements
    const resetPredictionUI = (clearData = false) => {
        setStatusMessage(null);
        setReportContent(null);

        if (clearData) {
            // Only reset fileSizeError if we're not in an error state
            if (!fileSizeError) {
                setPredictions({
                    firstStage: [],
                    secondStage: [],
                    finalDetections: []
                });
                setResultImages({
                    finalResult: currentImage || '',
                    firstStage: '',
                });
            }
        } else {
            // Keep the current image in final result view only if no file size error
            if (!fileSizeError) {
                setResultImages(prev => ({
                    ...prev,
                    finalResult: currentImage || ''
                }));
            }
        }
    };

    // Handle form submission for prediction
    const handleStartInference = async () => {
        console.info('Start inference clicked', {
            hasCurrentImage: !!currentImage,
            fileSizeError,
            fileSize: fileInputFile ? `${(fileInputFile.size / 1024 / 1024).toFixed(2)}MB` : 'none'
        });

        if (!currentImage) {
            console.warn('No current image, showing error');
            setStatusMessage({
                type: 'error',
                message: 'Please select and upload an image file first.'
            });
            return;
        }

        // Check for file size error
        if (fileSizeError) {
            console.warn('File size error detected, showing error');
            setStatusMessage({
                type: 'error',
                message: 'Image size must be less than 7MB. Please select a smaller image.'
            });
            return;
        }

        // Double check file size before processing
        if (fileInputFile && fileInputFile.size > 7 * 1024 * 1024) {
            console.error('File size check failed in inference');
            setStatusMessage({
                type: 'error',
                message: 'Image size must be less than 7MB. Please select a smaller image.'
            });
            return;
        }

        console.info('All validations passed, starting inference...');

        resetPredictionUI(false);
        setIsLoading(true);

        // Set appropriate tab based on mode
        if (isAdvancedMode) {
            setActiveRightTab('results');
        } else {
            setActiveRightTab('report');
        }

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

            const result = await predictService.processPrediction(formData);

            if (result.success) {
                await processTwoStageResults(result.data);
                setStatusMessage({
                    type: 'success',
                    message: 'Two-stage inference successful!'
                });
                setActiveTab('final-result');

                // If AI report is available, switch to it in normal mode
                if (result.data.report_content && !isAdvancedMode) {
                    setActiveRightTab('report');
                }
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

        // Store the AI report content if available
        if (result.report_content) {
            setReportContent(result.report_content);
        } else {
            setReportContent(null);
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

    return (
        <div className="w-full max-w-full">
            {/* Page header */}
            <div className="mb-6">
                <h2 className="text-primary-dark-blue text-2xl font-semibold pb-2 border-b-2 border-accent-pink mb-4">
                    Intelligent Defect Detection
                </h2>
            </div>

            {/* Main content area - Updated for mobile flexibility */}
            <div className="flex flex-col lg:flex-row gap-6 lg:h-[calc(100vh-240px)] min-h-[300px] lg:min-h-[600px]">
                {/* Left section - Image display and controls */}
                <div className="lg:w-7/12 xl:w-8/12 flex flex-col gap-6 lg:h-full">
                    {/* Action buttons and status messages */}
                    <ActionBar
                        isLoading={isLoading}
                        currentImage={currentImage}
                        fileInputFile={fileInputFile}
                        statusMessage={statusMessage}
                        onFileInputClick={handleFileInputClick}
                        onStartInference={handleStartInference}
                        fileSizeError={fileSizeError}
                    />

                    {/* Hidden file input */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/png, image/jpeg, image/jpg, image/bmp, image/webp"
                        className="hidden"
                    />

                    {/* Image display */}
                    <div className="flex-grow border border-neutral-gray rounded-lg shadow-card overflow-hidden">
                        <ImagePanel
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            resultImages={resultImages}
                            currentImage={currentImage}
                            handleImageClick={handleImageClick}
                            handleFileInputClick={handleFileInputClick}
                            isAdvancedMode={isAdvancedMode}
                            fileSizeError={fileSizeError}
                        />
                    </div>
                </div>

                {/* Right section - Tabs (Results, Configuration, AI Report) */}
                <RightPanel
                    activeRightTab={activeRightTab}
                    setActiveRightTab={setActiveRightTab}
                    predictions={predictions}
                    models={models}
                    defaultModels={defaultModels}
                    modelsFetched={modelsFetched}
                    firstModelSelected={firstModelSelected}
                    setFirstModelSelected={setFirstModelSelected}
                    secondModelSelected={secondModelSelected}
                    setSecondModelSelected={setSecondModelSelected}
                    confidenceThreshold={confidenceThreshold}
                    setConfidenceThreshold={setConfidenceThreshold}
                    filterEnabled={filterEnabled}
                    setFilterEnabled={setFilterEnabled}
                    handleDetectionVisibilityChange={handleDetectionVisibilityChange}
                    handleAllDetectionsVisibilityChange={handleAllDetectionsVisibilityChange}
                    currentImage={currentImage}
                    reportContent={reportContent}
                    isAdvancedMode={isAdvancedMode}
                />
            </div>

            {/* Image Zoom Modal */}
            <ImageZoomModal
                isOpen={zoomModalOpen}
                imageUrl={zoomedImage}
                onClose={() => setZoomModalOpen(false)}
            />

            {/* Mode Toggle */}
            <ModeToggle
                isAdvancedMode={isAdvancedMode}
                onToggle={toggleMode}
                clickCount={clickCount}
                requiredClicks={REQUIRED_CLICKS}
            />
        </div>
    );
};

export default PredictPage;