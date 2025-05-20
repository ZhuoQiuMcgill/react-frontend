import {useState, useEffect} from 'react';

const AIReport = ({currentImage, predictions, reportContent}) => {
    const [error, setError] = useState(null);

    // Reset error when image or predictions change
    useEffect(() => {
        setError(null);
    }, [currentImage, predictions.finalDetections]);

    // Function to process a line with bold text formatting
    const processLineWithBoldText = (line) => {
        // Match bold text within the line
        const boldPattern = /\*\*(.*?)\*\*/g;
        const parts = line.split(boldPattern);

        return parts.map((part, i) => {
            // Even indices are normal text, odd indices are bold
            return i % 2 === 0 ?
                part :
                <strong key={`bold-${i}`}>{part}</strong>;
        });
    };

    // Function to render markdown content
    const renderMarkdown = (markdown) => {
        if (!markdown) return null;

        const lines = markdown.split('\n');
        return (
            <div className="markdown-content">
                {lines.map((line, index) => {
                    // Handle headings
                    if (line.startsWith('# ')) {
                        return <h1 key={index}
                                   className="text-2xl font-bold mt-4 mb-2">{processLineWithBoldText(line.substring(2))}</h1>;
                    } else if (line.startsWith('## ')) {
                        return <h2 key={index}
                                   className="text-xl font-semibold mt-3 mb-2">{processLineWithBoldText(line.substring(3))}</h2>;
                    } else if (line.startsWith('### ')) {
                        return <h3 key={index}
                                   className="text-lg font-medium mt-3 mb-1">{processLineWithBoldText(line.substring(4))}</h3>;
                    }
                    // Handle lists
                    else if (line.startsWith('* ') || line.startsWith('- ')) {
                        return <li key={index} className="ml-5 mb-1">{processLineWithBoldText(line.substring(2))}</li>;
                    }
                    // Handle numbered lists
                    else if (/^\d+\.\s/.test(line)) {
                        return (
                            <p key={index} className="ml-5 mb-1">
                                {processLineWithBoldText(line)}
                            </p>
                        );
                    }
                    // Handle paragraphs
                    else if (line.trim() !== '') {
                        return <p key={index} className="mb-2">{processLineWithBoldText(line)}</p>;
                    }
                    // Handle empty lines
                    return <br key={index}/>;
                })}
            </div>
        );
    };

    return (
        <div className="h-full flex flex-col overflow-hidden">
            {/* Content area - with responsive height adjustments */}
            <div className="p-6 flex-grow overflow-y-auto lg:max-h-[calc(100vh-250px)]">
                {!reportContent ? (
                    <div className="flex flex-col items-center justify-center h-full">
                        {error && (
                            <p className="text-error mb-4 text-center">{error}</p>
                        )}

                        <div className="text-center">
                            <svg xmlns="http://www.w3.org/2000/svg"
                                 className="h-16 w-16 mb-4 text-neutral-dark-gray/50 mx-auto" fill="none"
                                 viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                            </svg>
                            <p className="text-neutral-dark-gray text-sm">
                                {currentImage && predictions.finalDetections.length > 0
                                    ? "No AI report available for current detections."
                                    : "Process an image to view the AI analysis report"}
                            </p>
                            {(!currentImage || predictions.finalDetections.length === 0) && (
                                <p className="text-neutral-dark-gray mt-2 text-xs">
                                    Reports are automatically generated when defects are detected
                                </p>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="report-content">
                        {renderMarkdown(reportContent)}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIReport;