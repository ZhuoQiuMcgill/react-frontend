import React from 'react';
import PropTypes from 'prop-types';
import AIReport from './AIReport';
import StatusMessage from './StatusMessage'; // Assuming this component is for loading/error/empty states

const RightPanel = ({ report, isLoading, error }) => {
    if (isLoading) {
        return (
            <div className="w-full h-full flex items-center justify-center p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
                <StatusMessage message="Generating AI Report..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-full flex items-center justify-center p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
                <StatusMessage message={`Error: ${error}`} isError={true} />
            </div>
        );
    }

    if (!report || Object.keys(report).length === 0) {
        return (
            <div className="w-full h-full flex items-center justify-center p-6 text-center bg-white dark:bg-gray-800 shadow-lg rounded-lg">
                <StatusMessage message="Upload an image and click 'Predict' to see the AI report here." />
            </div>
        );
    }

    return (
        // Main container for RightPanel:
        // - Takes full width and height of its parent (the flex-1 container in PredictPage)
        // - Flex column layout: Title at the top, AIReport container takes remaining space
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-4 sm:p-6 w-full h-full flex flex-col">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-white border-b pb-2 dark:border-gray-700">
                AI Report Analysis
            </h2>
            {/* Container for AIReport:
          - flex-grow: Allows this div to expand and fill available vertical space
          - overflow-hidden: Prevents this container from scrolling; AIReport will handle its own scroll
      */}
            <div className="flex-grow overflow-hidden relative"> {/* Added relative for potential absolute positioned elements inside AIReport if any */}
                <AIReport reportData={report} />
            </div>
        </div>
    );
};

RightPanel.propTypes = {
    report: PropTypes.object,
    isLoading: PropTypes.bool,
    error: PropTypes.string,
};

export default RightPanel;
