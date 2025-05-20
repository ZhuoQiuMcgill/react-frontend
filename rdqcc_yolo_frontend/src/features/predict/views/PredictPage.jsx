import {useState, useEffect, useRef} from 'react';
import ImageZoomModal from '../components/ImageZoomModal';
import {usePredictService} from '../services/predictService';
import {createImageWithBoxes} from '../utils/imageUtils';
import ActionBar from '../components/ActionBar';
import ImagePanel from '../components/ImagePanel';
import RightPanel from '../components/RightPanel';

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

    // State for images and predictions
    const [currentImage, setCurrentImage] = useState(null);
    const [fileInputFile, setFileInputFile] = useState(null);
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
        setReportContent(null);

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

            const result = await predictService.processPrediction(formData);

            if (result.success) {
                await processTwoStageResults(result.data);
                setStatusMessage({
                    type: 'success',
                    message: 'Two-stage inference successful!'
                });
                setActiveTab('final-result');

                // If AI report is available, switch to it
                if (result.data.report_content) {
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
        <div className="w-full max-w-full overflow-hidden">
            {/* Page header */}
            <div className="mb-6">
                <h2 className="text-primary-dark-blue text-2xl font-semibold pb-2 border-b-2 border-accent-pink mb-4">
                    Intelligent Defect Detection
                </h2>
            </div>

            {/* Main content area */}
            <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-240px)] min-h-[600px]">
                {/* Left section - Image display and controls (65%) */}
                <div className="lg:w-8/12 flex flex-col gap-6 h-full">
                    {/* Action buttons and status messages */}
                    <ActionBar
                        isLoading={isLoading}
                        currentImage={currentImage}
                        fileInputFile={fileInputFile}
                        statusMessage={statusMessage}
                        onFileInputClick={handleFileInputClick}
                        onStartInference={handleStartInference}
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
                />
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