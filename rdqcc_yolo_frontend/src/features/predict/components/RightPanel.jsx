import ResultsList from './ResultsList';
import AIReport from './AIReport';
import ConfigPanel from './ConfigPanel';

/**
 * RightPanel component managing tabs for results, configuration, and AI report
 */
const RightPanel = ({
                        activeRightTab,
                        setActiveRightTab,
                        predictions,
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
                        setFilterEnabled,
                        handleDetectionVisibilityChange,
                        handleAllDetectionsVisibilityChange,
                        currentImage,
                        reportContent
                    }) => {
    return (
        <div className="lg:w-4/12 border border-neutral-gray rounded-lg shadow-card overflow-hidden bg-neutral-white flex flex-col h-full">
            {/* Tabs header */}
            <div className="tabs-header flex border-b border-neutral-gray bg-neutral-light-gray">
                <button
                    className={`flex-1 py-3 px-4 bg-transparent border-none border-b-3 font-medium transition-all
            ${activeRightTab === 'results'
                        ? 'border-b-accent-pink text-primary-dark-blue bg-neutral-white'
                        : 'border-b-transparent text-text-light hover:bg-black/[0.03] hover:text-primary-dark-blue'
                    }`}
                    onClick={() => setActiveRightTab('results')}
                >
                    Results
                </button>
                <button
                    className={`flex-1 py-3 px-4 bg-transparent border-none border-b-3 font-medium transition-all
            ${activeRightTab === 'config'
                        ? 'border-b-accent-pink text-primary-dark-blue bg-neutral-white'
                        : 'border-b-transparent text-text-light hover:bg-black/[0.03] hover:text-primary-dark-blue'
                    }`}
                    onClick={() => setActiveRightTab('config')}
                >
                    Configuration
                </button>
                <button
                    className={`flex-1 py-3 px-4 bg-transparent border-none border-b-3 font-medium transition-all
            ${activeRightTab === 'report'
                        ? 'border-b-accent-pink text-primary-dark-blue bg-neutral-white'
                        : 'border-b-transparent text-text-light hover:bg-black/[0.03] hover:text-primary-dark-blue'
                    }`}
                    onClick={() => setActiveRightTab('report')}
                >
                    AI Report
                </button>
            </div>

            {/* Tab content */}
            <div className="flex-grow overflow-hidden">
                {/* Results tab */}
                <div className={`h-full ${activeRightTab === 'results' ? 'block' : 'hidden'}`}>
                    <ResultsList
                        detections={predictions.finalDetections}
                        onVisibilityChange={handleDetectionVisibilityChange}
                        onAllVisibilityChange={handleAllDetectionsVisibilityChange}
                    />
                </div>

                {/* Configuration tab */}
                <div className={`h-full ${activeRightTab === 'config' ? 'block' : 'hidden'}`}>
                    <ConfigPanel
                        models={models}
                        defaultModels={defaultModels}
                        modelsFetched={modelsFetched}
                        firstModelSelected={firstModelSelected}
                        setFirstModelSelected={setFirstModelSelected}
                        secondModelSelected={secondModelSelected}
                        setSecondModelSelected={setSecondModelSelected}
                        confidenceThreshold={confidenceThreshold}
                        setConfidenceThreshold={setConfidenceThreshold}
                        filterEnabled={filterEnabled}
                        setFilterEnabled={setFilterEnabled}
                    />
                </div>

                {/* AI Report tab */}
                <div className={`h-full ${activeRightTab === 'report' ? 'block' : 'hidden'}`}>
                    <AIReport
                        currentImage={currentImage}
                        predictions={predictions}
                        reportContent={reportContent}
                    />
                </div>
            </div>
        </div>
    );
};

export default RightPanel;