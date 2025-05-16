import { useRef } from 'react';

const ButtonContainer = ({
                             onImageSelect,
                             onStartInference,
                             onConfigClick,
                             isLoading
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
        <div className="button-container flex flex-col gap-4">
            {/* Hidden file input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/png, image/jpeg, image/jpg, image/bmp, image/webp"
                className="hidden"
            />

            {/* Upload image button */}
            <button
                onClick={handleUploadClick}
                className="w-full bg-gradient-primary text-neutral-white p-4 rounded-lg font-medium
                 shadow-button hover:filter hover:brightness-110
                 transition transform hover:-translate-y-0.5 hover:shadow-button-hover
                 flex items-center justify-center gap-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                Upload Image
            </button>

            {/* Start inference button */}
            <button
                onClick={onStartInference}
                disabled={isLoading}
                className="w-full bg-gradient-accent text-neutral-white p-4 rounded-lg font-medium
                 shadow-button hover:filter hover:brightness-110
                 transition transform hover:-translate-y-0.5 hover:shadow-button-hover
                 disabled:bg-neutral-gray disabled:text-neutral-dark-gray disabled:cursor-not-allowed
                 disabled:hover:transform-none disabled:hover:shadow-none disabled:grayscale
                 flex items-center justify-center gap-2"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                    </>
                ) : (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                        </svg>
                        Start Inference
                    </>
                )}
            </button>

            {/* Configuration button */}
            <button
                onClick={onConfigClick}
                className="w-full bg-neutral-white text-primary-dark-blue p-4 rounded-lg font-medium
                 border border-primary-light-blue shadow-card hover:bg-neutral-light-gray
                 transition transform hover:-translate-y-0.5
                 flex items-center justify-center gap-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                Configuration
            </button>
        </div>
    );
};

export default ButtonContainer;