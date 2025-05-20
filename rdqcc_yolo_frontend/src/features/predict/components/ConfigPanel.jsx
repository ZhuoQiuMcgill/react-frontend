/**
 * ConfigPanel component for model configuration settings
 */
const ConfigPanel = ({
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
    return (
        <div className="p-4 h-full overflow-y-auto">
            <h3 className="text-primary-blue text-lg font-medium mb-4 pb-2 border-b border-neutral-gray">
                Model Configuration
            </h3>

            <div className="space-y-6">
                {/* First stage model select */}
                <div className="space-y-2">
                    <label htmlFor="first-model-select" className="font-medium text-text-light">
                        First Stage Model:
                    </label>
                    <select
                        id="first-model-select"
                        value={firstModelSelected}
                        onChange={(e) => setFirstModelSelected(e.target.value)}
                        className="w-full p-3 border border-neutral-gray rounded-md bg-neutral-white text-text-default
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
                    <div className="text-sm text-neutral-dark-gray">
                        Model for initial object detection
                    </div>
                </div>

                {/* Second stage model select */}
                <div className="space-y-2">
                    <label htmlFor="second-model-select" className="font-medium text-text-light">
                        Second Stage Model:
                    </label>
                    <select
                        id="second-model-select"
                        value={secondModelSelected}
                        onChange={(e) => setSecondModelSelected(e.target.value)}
                        className="w-full p-3 border border-neutral-gray rounded-md bg-neutral-white text-text-default
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
                    <div className="text-sm text-neutral-dark-gray">
                        Model for detailed classification
                    </div>
                </div>

                {/* Confidence threshold */}
                <div className="space-y-2">
                    <label htmlFor="confidence-threshold" className="font-medium text-text-light">
                        Confidence Threshold:
                    </label>
                    <div className="flex items-center gap-4">
                        <input
                            type="range"
                            id="confidence-threshold"
                            value={confidenceThreshold}
                            onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
                            min="0.01"
                            max="1"
                            step="0.01"
                            className="w-full h-2 bg-neutral-gray rounded-lg appearance-none cursor-pointer accent-primary-dark-blue"
                        />
                        <span
                            className="text-sm font-medium bg-primary-blue text-white py-1 px-2 rounded w-16 text-center">
              {confidenceThreshold.toFixed(2)}
            </span>
                    </div>
                    <div className="text-sm text-neutral-dark-gray">
                        Minimum confidence score (0.01 - 1.0)
                    </div>
                </div>

                {/* Filter options */}
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="filter-enabled"
                            checked={filterEnabled}
                            onChange={(e) => setFilterEnabled(e.target.checked)}
                            className="w-4 h-4 accent-accent-pink"
                        />
                        <label htmlFor="filter-enabled" className="font-medium text-text-light">
                            Enable Automatic Filtering
                        </label>
                    </div>
                    <div className="text-sm text-neutral-dark-gray">
                        Automatically filter by detected product code
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfigPanel;