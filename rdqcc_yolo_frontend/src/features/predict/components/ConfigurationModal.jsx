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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div
                ref={modalRef}
                className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 animate-in zoom-in-95 duration-300"
            >
                {/* Header */}
                <div className="flex justify-between items-center p-8 pb-6 border-b border-neutral-200/50">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-primary-blue to-primary-dark-blue rounded-2xl shadow-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-primary-blue text-2xl font-bold">Configuration Options</h3>
                            <p className="text-neutral-600 text-sm mt-1">Customize your AI model settings</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all duration-200 hover:scale-110"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* First stage model select */}
                        <div className="space-y-3">
                            <label htmlFor="first-model-select" className="block font-semibold text-text-light text-sm uppercase tracking-wide">
                                First Stage Model
                            </label>
                            <div className="relative">
                                <select
                                    id="first-model-select"
                                    value={firstModelSelected}
                                    onChange={(e) => setFirstModelSelected(e.target.value)}
                                    className="w-full p-4 pr-12 border border-neutral-200 rounded-2xl bg-white/80 backdrop-blur-sm text-text-default shadow-lg focus:border-primary-blue focus:outline-none focus:ring-4 focus:ring-primary-blue/20 transition-all duration-200 appearance-none"
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
                                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                    <svg className="h-5 w-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-xs text-neutral-500 bg-neutral-50 p-3 rounded-xl">
                                Model for initial object detection
                            </p>
                        </div>

                        {/* Second stage model select */}
                        <div className="space-y-3">
                            <label htmlFor="second-model-select" className="block font-semibold text-text-light text-sm uppercase tracking-wide">
                                Second Stage Model
                            </label>
                            <div className="relative">
                                <select
                                    id="second-model-select"
                                    value={secondModelSelected}
                                    onChange={(e) => setSecondModelSelected(e.target.value)}
                                    className="w-full p-4 pr-12 border border-neutral-200 rounded-2xl bg-white/80 backdrop-blur-sm text-text-default shadow-lg focus:border-primary-blue focus:outline-none focus:ring-4 focus:ring-primary-blue/20 transition-all duration-200 appearance-none"
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
                                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                    <svg className="h-5 w-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-xs text-neutral-500 bg-neutral-50 p-3 rounded-xl">
                                Model for detailed classification
                            </p>
                        </div>

                        {/* Confidence threshold */}
                        <div className="space-y-3">
                            <label htmlFor="first-confidence" className="block font-semibold text-text-light text-sm uppercase tracking-wide">
                                First Stage Confidence
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    id="first-confidence"
                                    value={confidenceThreshold}
                                    onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
                                    min="0.01"
                                    max="1.0"
                                    step="0.01"
                                    className="w-full p-4 border border-neutral-200 rounded-2xl bg-white/80 backdrop-blur-sm text-text-default shadow-lg focus:border-primary-blue focus:outline-none focus:ring-4 focus:ring-primary-blue/20 transition-all duration-200"
                                />
                            </div>
                            <p className="text-xs text-neutral-500 bg-neutral-50 p-3 rounded-xl">
                                Range: 0.01 to 1.0, Default: 0.01
                            </p>
                        </div>

                        {/* Filter checkbox */}
                        <div className="space-y-3">
                            <label className="block font-semibold text-text-light text-sm uppercase tracking-wide">
                                Enable Automatic Filtering
                            </label>
                            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-neutral-200 shadow-lg">
                                <div className="flex items-center gap-4">
                                    <input
                                        type="checkbox"
                                        id="filter-enabled"
                                        checked={filterEnabled}
                                        onChange={(e) => setFilterEnabled(e.target.checked)}
                                        className="w-5 h-5 accent-accent-pink rounded focus:ring-2 focus:ring-accent-pink"
                                    />
                                    <label htmlFor="filter-enabled" className="text-sm text-text-light cursor-pointer">
                                        Automatically filter by detected product code
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-4 p-8 pt-0">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-2xl font-medium transition-all duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onClose}
                        className="group relative overflow-hidden px-8 py-3 bg-gradient-to-r from-accent-pink to-accent-dark-pink text-white font-semibold rounded-2xl shadow-lg hover:shadow-accent-pink/25 transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <span className="relative z-10">Apply Configuration</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfigurationModal;