import {useRef} from 'react';

/**
 * ActionBar component displaying the main action buttons and status messages
 */
const ActionBar = ({
                       isLoading,
                       currentImage,
                       fileInputFile,
                       statusMessage,
                       onFileInputClick,
                       onStartInference,
                       fileSizeError
                   }) => {
    // Check if start button should be disabled
    const isStartDisabled = () => {
        const disabled = isLoading || !currentImage || fileSizeError || (fileInputFile && fileInputFile.size > 7 * 1024 * 1024);
        console.info('Start button disabled check:', {
            isLoading,
            hasCurrentImage: !!currentImage,
            fileSizeError,
            fileSize: fileInputFile ? `${(fileInputFile.size / 1024 / 1024).toFixed(2)}MB` : 'none',
            disabled
        });
        return disabled;
    };
    return (
        <div className="flex flex-col gap-4 w-full">
            {/* Buttons row - always side by side */}
            <div className="flex gap-4">
                {/* Upload button - Modern glassmorphism style */}
                <button
                    onClick={onFileInputClick}
                    className="group relative flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-blue to-primary-dark-blue text-white rounded-2xl font-semibold text-sm uppercase tracking-wider overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 active:scale-95 flex-1 justify-center"
                >
                    <div
                        className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <svg xmlns="http://www.w3.org/2000/svg"
                         className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 20 20"
                         fill="currentColor">
                        <path fillRule="evenodd"
                              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                              clipRule="evenodd"/>
                    </svg>
                    <span className="relative z-10">Upload Image</span>
                </button>

                {/* Start inference button - Modern accent style */}
                <button
                    onClick={onStartInference}
                    disabled={isStartDisabled()}
                    className="group relative flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-accent-pink to-accent-dark-pink text-white rounded-2xl font-semibold text-sm uppercase tracking-wider overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-md flex-1 justify-center"
                >
                    <div
                        className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {isLoading ? (
                        <>
                            <div className="relative z-10">
                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none"
                                     viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                            strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor"
                                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </div>
                            <span className="relative z-10">Processing...</span>
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg"
                                 className="h-5 w-5 relative z-10 transition-transform duration-300 group-hover:scale-110"
                                 viewBox="0 0 20 20"
                                 fill="currentColor">
                                <path fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                      clipRule="evenodd"/>
                            </svg>
                            <span className="relative z-10">Start Inference</span>
                        </>
                    )}
                </button>
            </div>

            {/* Status message or file info row - full width below buttons */}
            {(statusMessage || fileInputFile) && (
                <div className="w-full">
                    {statusMessage ? (
                        <div
                            className={`w-full py-3 px-6 rounded-2xl text-sm font-medium backdrop-blur-sm border transition-all duration-300 text-center ${
                                statusMessage.type === 'success'
                                    ? 'bg-green-100/80 text-green-800 border-green-200 shadow-green-100'
                                    : statusMessage.type === 'error'
                                        ? 'bg-red-100/80 text-red-800 border-red-200 shadow-red-100'
                                        : 'bg-blue-100/80 text-blue-800 border-blue-200 shadow-blue-100'
                            } shadow-lg`}>
                            <div className="flex items-center justify-center gap-2">
                                {statusMessage.type === 'success' && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                                         viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M5 13l4 4L19 7"/>
                                    </svg>
                                )}
                                {statusMessage.type === 'error' && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                                         viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                )}
                                <span>{statusMessage.message}</span>
                            </div>
                        </div>
                    ) : fileInputFile && (
                        <div
                            className="w-full py-3 px-6 bg-neutral-100/80 backdrop-blur-sm rounded-2xl text-sm text-text-light border border-neutral-200 shadow-lg transition-all duration-300 text-center">
                            <div className="flex items-center justify-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20"
                                     fill="currentColor">
                                    <path fillRule="evenodd"
                                          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                                          clipRule="evenodd"/>
                                </svg>
                                <span className="truncate">{fileInputFile.name}</span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ActionBar;