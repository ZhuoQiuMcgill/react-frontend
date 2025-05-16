import {useEffect, useRef} from 'react';

const ConfigurationModal = ({
                                isOpen,
                                onClose,
                                models,
                                defaultModels,
                                modelsFetched,
                                firstModelSelected,
                                setFirstModelSelected,
                                secondModelSelected,
                                setSecondModelSelected,
                                confidenceThreshold,
                                setConfidenceThreshold,
                                filterEnabled,
                                setFilterEnabled
                            }) => {
    const modalRef = useRef(null);

    // Close modal when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    // Prevent body scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <div
                ref={modalRef}
                className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-neutral-white rounded-lg shadow-xl p-6"
            >
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-neutral-gray">
                    <h3 className="text-primary-blue text-xl font-medium">Configuration Options</h3>
                    <button
                        onClick={onClose}
                        className="text-neutral-dark-gray hover:text-error text-2xl font-semibold"
                    >
                        &times;
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* First stage model select */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="first-model-select" className="font-medium text-text-light">
                            First Stage Model:
                        </label>
                        <select
                            id="first-model-select"
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
                        <label htmlFor="second-model-select" className="font-medium text-text-light">
                            Second Stage Model:
                        </label>
                        <select
                            id="second-model-select"
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
                        <label htmlFor="first-confidence" className="font-medium text-text-light">
                            First Stage Confidence:
                        </label>
                        <input
                            type="number"
                            id="first-confidence"
                            value={confidenceThreshold}
                            onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
                            min="0.01"
                            max="1.0"
                            step="0.01"
                            className="w-full p-3 border border-[#d8dde1] rounded-md bg-neutral-white text-text-default
                 focus:border-primary-blue focus:outline-none focus:ring-3 focus:ring-primary-blue/25"
                        />
                        <small className="text-sm text-neutral-dark-gray">
                            (Range: 0.01 to 1.0, Default: 0.01)
                        </small>
                    </div>

                    {/* Filter checkbox */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="filter-enabled" className="font-medium text-text-light">
                            Enable Automatic Filtering:
                        </label>
                        <div className="flex items-center gap-3 mt-2">
                            <input
                                type="checkbox"
                                id="filter-enabled"
                                checked={filterEnabled}
                                onChange={(e) => setFilterEnabled(e.target.checked)}
                                className="w-4 h-4 accent-accent-pink"
                            />
                            <span className="text-sm text-text-light">
                Automatically filter by detected product code
              </span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end mt-6">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gradient-accent text-white font-medium rounded-full
                     tracking-wide shadow-button hover:filter hover:brightness-110
                     transition transform hover:-translate-y-0.5"
                    >
                        Apply Configuration
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfigurationModal;