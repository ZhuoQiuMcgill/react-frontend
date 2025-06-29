import {useRef} from 'react';
import StatusMessage from './StatusMessage';

const ButtonContainer = ({
                             onImageSelect,
                             onStartInference,
                             onConfigClick,
                             isLoading,
                             statusMessage
                         }) => {
    const fileInputRef = useRef(null);

    // Handle file selection
    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            onImageSelect(e.target.files[0]);
        } else {
            onImageSelect(null);
        }
    };

    // Trigger file input click
    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="flex flex-col gap-6 mb-4">
            <div className="button-container grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Hidden file input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/png, image/jpeg, image/jpg, image/bmp, image/webp"
                    className="hidden"
                />

                {/* Upload image button - Modern glassmorphism style */}
                <button
                    onClick={handleUploadClick}
                    className="group relative overflow-hidden bg-gradient-to-br from-primary-blue via-primary-blue to-primary-dark-blue text-white p-6 rounded-3xl font-semibold text-sm shadow-2xl hover:shadow-primary-blue/25 transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 active:scale-95 flex flex-col items-center justify-center gap-3"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-primary-dark-blue/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <div className="relative z-10 p-3 bg-white/20 rounded-2xl backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd"
                                  d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                                  clipRule="evenodd"/>
                        </svg>
                    </div>
                    <span className="relative z-10 text-center">Upload Image</span>
                </button>

                {/* Start inference button - Modern accent style */}
                <button
                    onClick={onStartInference}
                    disabled={isLoading}
                    className="group relative overflow-hidden bg-gradient-to-br from-accent-pink via-accent-pink to-accent-dark-pink text-white p-6 rounded-3xl font-semibold text-sm shadow-2xl hover:shadow-accent-pink/25 transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none disabled:grayscale flex flex-col items-center justify-center gap-3"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-accent-dark-pink/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {isLoading ? (
                        <>
                            <div className="relative z-10 p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                                <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg"
                                     fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                            strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor"
                                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </div>
                            <span className="relative z-10 text-center">Processing...</span>
                        </>
                    ) : (
                        <>
                            <div className="relative z-10 p-3 bg-white/20 rounded-2xl backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 20 20"
                                     fill="currentColor">
                                    <path fillRule="evenodd"
                                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                                          clipRule="evenodd"/>
                                </svg>
                            </div>
                            <span className="relative z-10 text-center">Start Inference</span>
                        </>
                    )}
                </button>

                {/* Configuration button - Modern glass style */}
                <button
                    onClick={onConfigClick}
                    className="group relative overflow-hidden bg-white/80 backdrop-blur-lg text-primary-dark-blue p-6 rounded-3xl font-semibold text-sm border border-white/20 shadow-2xl hover:shadow-primary-blue/15 transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 active:scale-95 hover:bg-white/90 flex flex-col items-center justify-center gap-3"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-blue/5 via-transparent to-primary-dark-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <div className="relative z-10 p-3 bg-primary-blue/10 rounded-2xl backdrop-blur-sm group-hover:bg-primary-blue/20 transition-all duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd"
                                  d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                                  clipRule="evenodd"/>
                        </svg>
                    </div>
                    <span className="relative z-10 text-center">Configuration</span>
                </button>
            </div>

            {/* Status message */}
            {statusMessage && (
                <div className="flex justify-center sm:justify-start">
                    <StatusMessage type={statusMessage.type} message={statusMessage.message}/>
                </div>
            )}
        </div>
    );
};

export default ButtonContainer;