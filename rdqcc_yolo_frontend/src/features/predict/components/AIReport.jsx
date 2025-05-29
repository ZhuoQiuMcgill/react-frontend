import {useState, useEffect} from 'react';
import useIsMobile from '../../../shared/hooks/useIsMobile';

const AIReport = ({currentImage, predictions, reportContent}) => {
    const [error, setError] = useState(null);
    const isMobile = useIsMobile();

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
        const result = [];
        let inList = false;
        let listType = null;
        let listItems = [];
        let listKey = 0;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmedLine = line.trim();

            // Handle headings
            if (line.startsWith('# ')) {
                // If we were in a list, close it before adding the heading
                if (inList) {
                    result.push(listType === 'ul'
                        ? <ul key={`list-${listKey}`} className="list-disc pl-6 mb-4">{listItems}</ul>
                        : <ol key={`list-${listKey}`} className="list-decimal pl-6 mb-4">{listItems}</ol>
                    );
                    listItems = [];
                    inList = false;
                    listKey++;
                }

                result.push(
                    <h1 key={`heading-${i}`} className="text-2xl font-bold mt-4 mb-2">
                        {processLineWithBoldText(line.substring(2))}
                    </h1>
                );
            } else if (line.startsWith('## ')) {
                // If we were in a list, close it before adding the heading
                if (inList) {
                    result.push(listType === 'ul'
                        ? <ul key={`list-${listKey}`} className="list-disc pl-6 mb-4">{listItems}</ul>
                        : <ol key={`list-${listKey}`} className="list-decimal pl-6 mb-4">{listItems}</ol>
                    );
                    listItems = [];
                    inList = false;
                    listKey++;
                }

                result.push(
                    <h2 key={`heading-${i}`} className="text-xl font-semibold mt-3 mb-2">
                        {processLineWithBoldText(line.substring(3))}
                    </h2>
                );
            } else if (line.startsWith('### ')) {
                // If we were in a list, close it before adding the heading
                if (inList) {
                    result.push(listType === 'ul'
                        ? <ul key={`list-${listKey}`} className="list-disc pl-6 mb-4">{listItems}</ul>
                        : <ol key={`list-${listKey}`} className="list-decimal pl-6 mb-4">{listItems}</ol>
                    );
                    listItems = [];
                    inList = false;
                    listKey++;
                }

                result.push(
                    <h3 key={`heading-${i}`} className="text-lg font-medium mt-3 mb-1">
                        {processLineWithBoldText(line.substring(4))}
                    </h3>
                );
            }
            // Handle unordered lists
            else if (line.startsWith('* ') || line.startsWith('- ')) {
                if (!inList || listType !== 'ul') {
                    // If we were in a different type of list, close it
                    if (inList) {
                        result.push(
                            listType === 'ul'
                                ? <ul key={`list-${listKey}`} className="list-disc pl-6 mb-4">{listItems}</ul>
                                : <ol key={`list-${listKey}`} className="list-decimal pl-6 mb-4">{listItems}</ol>
                        );
                        listItems = [];
                        listKey++;
                    }
                    inList = true;
                    listType = 'ul';
                }

                listItems.push(
                    <li key={`item-${i}`} className="mb-1">
                        {processLineWithBoldText(line.substring(2))}
                    </li>
                );
            }
            // Handle ordered lists
            else if (/^\d+\.\s/.test(line)) {
                if (!inList || listType !== 'ol') {
                    // If we were in a different type of list, close it
                    if (inList) {
                        result.push(
                            listType === 'ul'
                                ? <ul key={`list-${listKey}`} className="list-disc pl-6 mb-4">{listItems}</ul>
                                : <ol key={`list-${listKey}`} className="list-decimal pl-6 mb-4">{listItems}</ol>
                        );
                        listItems = [];
                        listKey++;
                    }
                    inList = true;
                    listType = 'ol';
                }

                // Extract the content after the number and dot
                const content = line.replace(/^\d+\.\s/, '');

                listItems.push(
                    <li key={`item-${i}`} className="mb-1">
                        {processLineWithBoldText(content)}
                    </li>
                );
            }
            // Handle paragraphs and other content
            else if (trimmedLine !== '') {
                // If we were in a list, close it before adding the paragraph
                if (inList) {
                    result.push(
                        listType === 'ul'
                            ? <ul key={`list-${listKey}`} className="list-disc pl-6 mb-4">{listItems}</ul>
                            : <ol key={`list-${listKey}`} className="list-decimal pl-6 mb-4">{listItems}</ol>
                    );
                    listItems = [];
                    inList = false;
                    listKey++;
                }

                result.push(
                    <p key={`para-${i}`} className="mb-3">
                        {processLineWithBoldText(line)}
                    </p>
                );
            }
            // Handle empty lines - only add breaks if we're not in a list
            else if (trimmedLine === '' && !inList) {
                result.push(<br key={`br-${i}`}/>);
            }
        }

        // If we ended while still in a list, make sure to close it
        if (inList && listItems.length > 0) {
            result.push(
                listType === 'ul'
                    ? <ul key={`list-${listKey}`} className="list-disc pl-6 mb-4">{listItems}</ul>
                    : <ol key={`list-${listKey}`} className="list-decimal pl-6 mb-4">{listItems}</ol>
            );
        }

        return <div className="markdown-content">{result}</div>;
    };

    return (
        <div className={`${isMobile ? 'h-auto' : 'h-full'} flex flex-col ${isMobile ? '' : 'overflow-hidden'}`}>
            {/* Content area - Dynamic based on device type */}
            <div className={`p-6 ${isMobile ? '' : 'flex-grow overflow-y-auto'}`}>
                {!reportContent ? (
                    <div className={`flex flex-col items-center justify-center ${isMobile ? 'py-8' : 'h-full'}`}>
                        {error && (
                            <p className="text-error mb-4 text-center font-medium">{error}</p>
                        )}

                        <div className="text-center w-full max-w-md mx-auto px-4">
                            <svg xmlns="http://www.w3.org/2000/svg"
                                 className="h-16 w-16 mb-4 text-neutral-dark-gray/50 mx-auto" fill="none"
                                 viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                            </svg>
                            <p className="text-text-default font-medium mb-2">
                                {currentImage && predictions.finalDetections.length > 0
                                    ? "No AI risk assessment report available for current detections."
                                    : "Process an image to view the AI risk assessment report"}
                            </p>
                            {(!currentImage || predictions.finalDetections.length === 0) && (
                                <p className="text-neutral-dark-gray mt-2">
                                    Risk assessment reports are automatically generated when defects are detected
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