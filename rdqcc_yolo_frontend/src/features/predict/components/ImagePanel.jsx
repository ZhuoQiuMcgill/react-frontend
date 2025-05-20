/**
 * ImagePanel component for displaying detection results with tabs
 */
const ImagePanel = ({
                        activeTab,
                        setActiveTab,
                        resultImages,
                        currentImage,
                        handleImageClick,
                        handleFileInputClick
                    }) => {
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

            <div className="flex-grow overflow-hidden relative p-4 bg-neutral-white">
                {!hasImage ? (
                    <div
                        className="w-full h-full flex flex-col items-center justify-center bg-[#e0e0e0] border border-neutral-gray rounded-lg text-neutral-dark-gray p-8">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-neutral-dark-gray/50"
                             fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-center">
                            {activeTab === 'final-result'
                                ? 'Upload an image and start inference to see detection results'
                                : 'No product detection results available'}
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
                    <div
                        className="w-full h-full flex items-center justify-center bg-[#e0e0e0] border border-neutral-gray rounded-lg overflow-auto">
                        <img
                            src={imageSrc}
                            alt={activeTab === 'final-result' ? 'Defect detection results' : 'Product detection results'}
                            className="max-w-full max-h-full object-contain cursor-zoom-in hover:opacity-95 transition-opacity"
                            onClick={() => handleImageClick(imageSrc)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImagePanel;