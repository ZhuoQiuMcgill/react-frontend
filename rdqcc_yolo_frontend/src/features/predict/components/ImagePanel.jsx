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
                        isAdvancedMode
                    }) => {
    const imageSrc = activeTab === 'final-result' ? resultImages.finalResult : resultImages.firstStage;
    const hasImage = !!imageSrc;

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
                {!hasImage ? (
                    <div
                        className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200 border-2 border-dashed border-neutral-300 rounded-2xl text-neutral-dark-gray p-8 transition-all duration-300 hover:border-primary-blue/30 hover:bg-gradient-to-br hover:from-primary-blue/5 hover:to-neutral-100">
                        <div className="relative mb-6">
                            <div
                                className="absolute inset-0 bg-gradient-to-r from-primary-blue/20 to-accent-pink/20 rounded-full blur-xl animate-pulse"></div>
                            <div className="relative bg-white p-6 rounded-2xl shadow-lg border border-neutral-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-neutral-400 mx-auto"
                                     fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                </svg>
                            </div>
                        </div>
                        <p className="text-center text-lg font-medium mb-6 max-w-md">
                            {(!isAdvancedMode || activeTab === 'final-result')
                                ? 'Upload an image and start inference to see detection results'
                                : 'No product detection results available'}
                        </p>
                        {(!isAdvancedMode || activeTab === 'final-result') && !currentImage && (
                            <button
                                onClick={handleFileInputClick}
                                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-blue to-primary-dark-blue text-white rounded-2xl font-semibold shadow-xl hover:shadow-2xl hover:shadow-primary-blue/25 transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 active:scale-95 overflow-hidden"
                            >
                                <div
                                    className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div
                                    className="relative z-10 p-2 bg-white/20 rounded-xl backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                         className="h-5 w-5 transition-transform duration-300 group-hover:scale-110"
                                         viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd"
                                              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                                              clipRule="evenodd"/>
                                    </svg>
                                </div>
                                <span className="relative z-10">Select Image</span>
                            </button>
                        )}
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