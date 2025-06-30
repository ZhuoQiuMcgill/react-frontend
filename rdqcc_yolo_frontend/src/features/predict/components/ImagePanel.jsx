/**
 * ImagePanel component for displaying detection results with tabs
 */
const ImagePanel = ({
                        activeTab,
                        setActiveTab,
                        resultImages,
                        currentImage,
                        handleImageClick,
                        handleFileInputClick,
                        isAdvancedMode,
                        fileSizeError
                    }) => {
    const imageSrc = activeTab === 'final-result' ? resultImages.finalResult : resultImages.firstStage;
    const hasImage = !!imageSrc && !fileSizeError; // Don't show image if there's a file size error

    console.info('ImagePanel render:', {
        activeTab,
        hasImage,
        fileSizeError,
        imageSrc: imageSrc ? 'present' : 'none',
        currentImage: currentImage ? 'present' : 'none',
        resultImages: {
            finalResult: resultImages.finalResult ? 'present' : 'none',
            firstStage: resultImages.firstStage ? 'present' : 'none'
        }
    });

    return (
        <div className="w-full h-full flex flex-col overflow-hidden">
            {/* Only show tabs in advanced mode */}
            {isAdvancedMode ? (
                <div className="image-tabs-header flex border-b border-neutral-gray bg-neutral-light-gray">
                    <button
                        className={`flex-grow py-3 px-8 bg-transparent border-none border-b-3 font-medium transition-all
                ${activeTab === 'final-result'
                            ? 'border-b-accent-pink text-primary-dark-blue bg-neutral-white'
                            : 'border-b-transparent text-text-light hover:bg-black/[0.03] hover:text-primary-dark-blue'
                        }`}
                        onClick={() => setActiveTab('final-result')}
                    >
                        Defect
                    </button>
                    <button
                        className={`flex-grow py-3 px-8 bg-transparent border-none border-b-3 font-medium transition-all
                ${activeTab === 'first-stage'
                            ? 'border-b-accent-pink text-primary-dark-blue bg-neutral-white'
                            : 'border-b-transparent text-text-light hover:bg-black/[0.03] hover:text-primary-dark-blue'
                        }`}
                        onClick={() => setActiveTab('first-stage')}
                    >
                        Product
                    </button>
                </div>
            ) : (
                /* Simple header for normal mode */
                <div className="image-header flex border-b border-neutral-gray bg-neutral-light-gray py-3 px-6">
                    <h3 className="text-primary-dark-blue font-medium m-0">Defect Detection</h3>
                </div>
            )}

            <div className="flex-grow overflow-hidden relative p-4 bg-neutral-white">
                {fileSizeError || !hasImage ? (
                    <div
                        className={`w-full h-full flex flex-col items-center justify-center border-2 border-dashed rounded-2xl text-neutral-dark-gray p-8 transition-all duration-300 ${
                            fileSizeError
                                ? 'bg-gradient-to-br from-red-50 to-red-100 border-red-300 text-red-600'
                                : 'bg-gradient-to-br from-neutral-100 to-neutral-200 border-neutral-300'
                        }`}>
                        <div className="relative mb-6">
                            <div
                                className={`absolute inset-0 rounded-full blur-xl animate-pulse ${
                                    fileSizeError
                                        ? 'bg-gradient-to-r from-red-300/30 to-red-400/30'
                                        : 'bg-gradient-to-r from-primary-blue/20 to-accent-pink/20'
                                }`}></div>
                            <div className={`relative p-6 rounded-2xl shadow-lg border ${
                                fileSizeError
                                    ? 'bg-red-100 border-red-200'
                                    : 'bg-white border-neutral-200'
                            }`}>
                                {fileSizeError ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto"
                                         fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-neutral-400 mx-auto"
                                         fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                    </svg>
                                )}
                            </div>
                        </div>
                        <p className="text-center text-lg font-medium mb-6 max-w-md">
                            {fileSizeError
                                ? 'Image size must be less than 7MB. Please select a smaller image.'
                                : (!isAdvancedMode || activeTab === 'final-result')
                                    ? 'Upload an image using the button above to see detection results'
                                    : 'No product detection results available'
                            }
                        </p>
                    </div>
                ) : (
                    <div
                        className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 border border-neutral-200 rounded-2xl overflow-auto shadow-inner">
                        <img
                            src={isAdvancedMode ? imageSrc : resultImages.finalResult}
                            alt={isAdvancedMode && activeTab === 'first-stage' ? 'Product detection results' : 'Defect detection results'}
                            className="max-w-full max-h-full object-contain cursor-zoom-in hover:opacity-95 transition-all duration-300 rounded-lg shadow-lg"
                            onClick={() => handleImageClick(isAdvancedMode ? imageSrc : resultImages.finalResult)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImagePanel;