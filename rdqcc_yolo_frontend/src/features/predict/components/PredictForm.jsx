import { useState, useRef } from 'react';

const PredictForm = ({
                         models,
                         defaultModels,
                         modelsFetched,
                         isLoading,
                         onSubmit,
                         onImageSelect,
                         isMobile = false
                     }) => {
    const [firstModelSelected, setFirstModelSelected] = useState('');
    const [secondModelSelected, setSecondModelSelected] = useState('');
    const [confidenceThreshold, setConfidenceThreshold] = useState(0.5);
    const [filterEnabled, setFilterEnabled] = useState(false);
    const [productCode, setProductCode] = useState('');

    const fileInputRef = useRef(null);
    const formRef = useRef(null);

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Create form data for API request
        const formData = new FormData();

        // Add the image file
        if (fileInputRef.current.files.length > 0) {
            formData.append('image', fileInputRef.current.files[0]);
        } else {
            return; // Don't submit if no file selected
        }

        // Add the rest of the form data
        if (firstModelSelected) formData.append('first_model_filename', firstModelSelected);
        if (secondModelSelected) formData.append('second_model_filename', secondModelSelected);
        formData.append('first_confidence', confidenceThreshold);
        formData.append('filter', filterEnabled ? 'true' : 'false');
        if (filterEnabled && productCode) formData.append('product_code', productCode);

        onSubmit(formData);
    };

    // Handle file selection
    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            onImageSelect(e.target.files[0]);
        } else {
            onImageSelect(null);
        }
    };

    return (
        <section>
            <h3 className="text-primary-blue text-xl font-medium mb-4 pb-2 border-b border-neutral-gray">
                Configuration
            </h3>

            <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* Submit button at the top */}
                <div className="pb-4 mb-2 border-b border-dashed border-neutral-gray flex flex-wrap justify-center gap-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-gradient-accent text-neutral-white px-7 py-3 rounded-full font-semibold
                     uppercase tracking-wide shadow-button hover:filter hover:brightness-110
                     active:transform active:scale-[0.97] active:shadow-button-active
                     disabled:bg-neutral-gray disabled:text-neutral-dark-gray disabled:cursor-not-allowed
                     disabled:grayscale-50 disabled:shadow-none"
                    >
                        Start Two-Stage Inference
                    </button>

                    {isLoading && (
                        <div className="inline-flex items-center gap-2 font-medium text-text-light">
                            <div className="w-7 h-7 border-4 border-neutral-gray border-l-accent-pink rounded-full animate-spin"></div>
                            <span>Processing...</span>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Image file input */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor={`image-file${isMobile ? '-mobile' : ''}`} className="font-medium text-text-light">
                            Select Image File:
                        </label>
                        <input
                            type="file"
                            id={`image-file${isMobile ? '-mobile' : ''}`}
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/png, image/jpeg, image/jpg, image/bmp, image/webp"
                            required
                            className="w-full p-2 border border-[#d8dde1] rounded-md bg-neutral-white text-text-default
                       file:bg-primary-blue file:text-neutral-white file:border-none
                       file:px-4 file:py-2 file:mr-4 file:rounded-md file:cursor-pointer
                       file:font-medium file:transition-colors file:hover:bg-primary-dark-blue"
                        />
                        <small className="text-sm text-neutral-dark-gray">
                            Supported formats: PNG, JPG, BMP, WEBP
                        </small>
                    </div>

                    {/* First stage model select */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor={`first-model-select${isMobile ? '-mobile' : ''}`} className="font-medium text-text-light">
                            First Stage Model:
                        </label>
                        <select
                            id={`first-model-select${isMobile ? '-mobile' : ''}`}
                            value={firstModelSelected}
                            onChange={(e) => setFirstModelSelected(e.target.value)}
                            className="w-full p-3 border border-[#d8dde1] rounded-md bg-neutral-white text-text-default
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
                        <small className="text-sm text-neutral-dark-gray">
                            Model for initial object detection
                        </small>
                    </div>

                    {/* Second stage model select */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor={`second-model-select${isMobile ? '-mobile' : ''}`} className="font-medium text-text-light">
                            Second Stage Model:
                        </label>
                        <select
                            id={`second-model-select${isMobile ? '-mobile' : ''}`}
                            value={secondModelSelected}
                            onChange={(e) => setSecondModelSelected(e.target.value)}
                            className="w-full p-3 border border-[#d8dde1] rounded-md bg-neutral-white text-text-default
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
                        <small className="text-sm text-neutral-dark-gray">
                            Model for detailed classification
                        </small>
                    </div>

                    {/* Confidence threshold */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor={`first-confidence${isMobile ? '-mobile' : ''}`} className="font-medium text-text-light">
                            First Stage Confidence:
                        </label>
                        <input
                            type="number"
                            id={`first-confidence${isMobile ? '-mobile' : ''}`}
                            value={confidenceThreshold}
                            onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
                            min="0.01"
                            max="1.0"
                            step="0.01"
                            className="w-full p-3 border border-[#d8dde1] rounded-md bg-neutral-white text-text-default
                       focus:border-primary-blue focus:outline-none focus:ring-3 focus:ring-primary-blue/25"
                        />
                        <small className="text-sm text-neutral-dark-gray">
                            (Range: 0.01 to 1.0, Default: 0.5)
                        </small>
                    </div>

                    {/* Filter checkbox */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor={`filter-enabled${isMobile ? '-mobile' : ''}`} className="font-medium text-text-light">
                            Enable Automatic Filtering:
                        </label>
                        <div className="flex items-center gap-3 mt-2">
                            <input
                                type="checkbox"
                                id={`filter-enabled${isMobile ? '-mobile' : ''}`}
                                checked={filterEnabled}
                                onChange={(e) => setFilterEnabled(e.target.checked)}
                                className="w-4 h-4 accent-accent-pink"
                            />
                            <span className="text-sm text-text-light">
                Automatically filter by detected product code
              </span>
                        </div>
                    </div>

                    {/* Product code input - hidden by default */}
                    {filterEnabled && (
                        <div className="flex flex-col gap-2">
                            <label htmlFor={`product-code${isMobile ? '-mobile' : ''}`} className="font-medium text-text-light">
                                Product Code:
                            </label>
                            <input
                                type="text"
                                id={`product-code${isMobile ? '-mobile' : ''}`}
                                value={productCode}
                                onChange={(e) => setProductCode(e.target.value)}
                                placeholder="e.g. ABC"
                                className="w-full p-3 border border-[#d8dde1] rounded-md bg-neutral-white text-text-default
                         focus:border-primary-blue focus:outline-none focus:ring-3 focus:ring-primary-blue/25"
                            />
                            <small className="text-sm text-neutral-dark-gray">
                                Only show detections matching this product code prefix
                            </small>
                        </div>
                    )}
                </div>
            </form>
        </section>
    );
};

export default PredictForm;