import { useRef } from 'react';

/**
 * ActionBar component displaying the main action buttons and status messages
 */
const ActionBar = ({
                       isLoading,
                       currentImage,
                       fileInputFile,
                       statusMessage,
                       onFileInputClick,
                       onStartInference
                   }) => {
    return (
        <div className="flex flex-col sm:flex-row w-full gap-4">
            <div className="flex flex-wrap gap-4">
                {/* Upload button */}
                <button
                    onClick={onFileInputClick}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-primary text-white rounded-full font-medium shadow-button hover:filter hover:brightness-110 transition transform hover:-translate-y-0.5"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd"
                              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                              clipRule="evenodd" />
                    </svg>
                    Upload Image
                </button>

                {/* Start inference button */}
                <button
                    onClick={onStartInference}
                    disabled={isLoading || !currentImage}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-accent text-white rounded-full font-medium shadow-button hover:filter hover:brightness-110 transition transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none"
                                 viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20"
                                 fill="currentColor">
                                <path fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                      clipRule="evenodd" />
                            </svg>
                            Start Inference
                        </>
                    )}
                </button>
            </div>

            {/* Status message and file info */}
            {statusMessage && (
                <div className={`flex items-center justify-center py-2 px-4 mt-2 sm:mt-0 sm:ml-auto rounded-full text-sm ${
                    statusMessage.type === 'success'
                        ? 'bg-[#e4f1e4] text-[#1b5e20]'
                        : statusMessage.type === 'error'
                            ? 'bg-[#fce4e4] text-[#b71c1c]'
                            : 'bg-[#e1f5fe] text-[#01579b]'
                }`}>
                    {statusMessage.type === 'success' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none"
                             viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                    {statusMessage.type === 'error' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none"
                             viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )}
                    <span>{statusMessage.message}</span>
                </div>
            )}

            {/* File info - only shown when there's no status message */}
            {!statusMessage && fileInputFile && (
                <div
                    className="flex items-center justify-center sm:justify-start py-2 px-4 mt-2 sm:mt-0 sm:ml-auto bg-neutral-light-gray rounded-full text-sm text-text-light">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20"
                         fill="currentColor">
                        <path fillRule="evenodd"
                              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                              clipRule="evenodd" />
                    </svg>
                    <span className="truncate max-w-xs">{fileInputFile.name}</span>
                </div>
            )}
        </div>
    );
};

export default ActionBar;