import React from 'react';
import PropTypes from 'prop-types';

const AIReport = ({ reportData }) => {
    if (!reportData || Object.keys(reportData).length === 0) {
        return <p className="text-gray-500 dark:text-gray-400 p-4">No report data available to display.</p>;
    }

    // Recursive function to render nested objects/arrays
    const renderContent = (data, level = 0) => {
        if (typeof data === 'string' || typeof data === 'number' || typeof data === 'boolean') {
            return <p className="text-sm text-gray-700 dark:text-gray-300 break-words leading-relaxed">{String(data)}</p>;
        }

        if (Array.isArray(data)) {
            return (
                <ul className={`list-disc ml-${level * 4} pl-4`}>
                    {data.map((item, index) => (
                        <li key={index} className="mb-1">{renderContent(item, level + 1)}</li>
                    ))}
                </ul>
            );
        }

        if (typeof data === 'object' && data !== null) {
            return (
                <div className={`ml-${level * 2} mt-2`}>
                    {Object.entries(data).map(([key, value]) => (
                        <div key={key} className="mb-2">
                            <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 capitalize">
                                {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                            </h4>
                            {renderContent(value, level + 1)}
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        // AIReport main container:
        // - w-full: Takes full width of its parent.
        // - h-full: Takes full height of its parent (the flex-grow div in RightPanel).
        // - overflow-y-auto: Enables vertical scrolling if content exceeds its height.
        // - prose classes for typography, max-w-none to allow full width.
        // - custom-scrollbar for themed scrollbars (styles in index.css).
        <div className="prose prose-sm sm:prose dark:prose-invert max-w-none w-full h-full overflow-y-auto custom-scrollbar p-3 md:p-4 rounded">
            {Object.entries(reportData).map(([key, value]) => (
                <div key={key} className="mb-4 pb-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize mb-2">
                        {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </h3>
                    {renderContent(value)}
                </div>
            ))}
        </div>
    );
};

AIReport.propTypes = {
    reportData: PropTypes.object.isRequired,
};

export default AIReport;
