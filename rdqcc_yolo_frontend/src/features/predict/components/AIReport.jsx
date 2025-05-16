import {useState} from 'react';

const AIReport = ({currentImage, predictions}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [report, setReport] = useState(null);
    const [error, setError] = useState(null);

    const generateReport = async () => {
        if (!currentImage || !predictions.finalDetections.length) {
            setError("No image or detections available to generate report");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // This is where you would make an API call to the backend
            // For now, we'll simulate a response after a delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Placeholder for actual implementation
            // const response = await fetch('/api/generate-report', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({
            //     detections: predictions.finalDetections,
            //     totalObjects: predictions.finalDetections.length
            //   })
            // });

            // if (!response.ok) throw new Error('Failed to generate report');
            // const data = await response.json();
            // setReport(data.report);

            // Simulated response
            setReport(`# Detection Analysis Report\n\n## Summary\n\n* Total objects detected: ${predictions.finalDetections.length}\n* Main categories detected: ${getCategorySummary(predictions.finalDetections)}\n\n## Detailed Findings\n\n${getDetailedFindings(predictions.finalDetections)}\n\n## Recommendations\n\nBased on the detection results, we recommend further inspection of detected objects with confidence below 70%.`);

        } catch (error) {
            console.error("Error generating report:", error);
            setError(error.message || "Failed to generate AI report");
        } finally {
            setIsLoading(false);
        }
    };

    // Helper function to get category summary
    const getCategorySummary = (detections) => {
        const categories = {};
        detections.forEach(detection => {
            const category = detection.class_name;
            if (categories[category]) {
                categories[category]++;
            } else {
                categories[category] = 1;
            }
        });

        return Object.entries(categories)
            .map(([name, count]) => `${name} (${count})`)
            .join(', ');
    };

    // Helper function to generate detailed findings
    const getDetailedFindings = (detections) => {
        return detections.map((detection, index) => {
            const confidence = (detection.confidence * 100).toFixed(1);
            return `${index + 1}. **${detection.class_name}** detected with ${confidence}% confidence`;
        }).join('\n');
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
                        return <h1 key={index} className="text-2xl font-bold mt-4 mb-2">{line.substring(2)}</h1>;
                    } else if (line.startsWith('## ')) {
                        return <h2 key={index} className="text-xl font-semibold mt-3 mb-2">{line.substring(3)}</h2>;
                    } else if (line.startsWith('### ')) {
                        return <h3 key={index} className="text-lg font-medium mt-3 mb-1">{line.substring(4)}</h3>;
                    }
                    // Handle lists
                    else if (line.startsWith('* ')) {
                        return <li key={index} className="ml-5 mb-1">{line.substring(2)}</li>;
                    }
                    // Handle numbered lists
                    else if (/^\d+\.\s/.test(line)) {
                        // Match bold text within the line
                        const boldPattern = /\*\*(.*?)\*\*/g;
                        const parts = line.split(boldPattern);

                        return (
                            <p key={index} className="ml-5 mb-1">
                                {parts.map((part, i) => {
                                    // Even indices are normal text, odd indices are bold
                                    return i % 2 === 0 ?
                                        part :
                                        <strong key={`bold-${i}`}>{part}</strong>;
                                })}
                            </p>
                        );
                    }
                    // Handle paragraphs
                    else if (line.trim() !== '') {
                        return <p key={index} className="mb-2">{line}</p>;
                    }
                    // Handle empty lines
                    return <br key={index}/>;
                })}
            </div>
        );
    };

    return (
        <div className="h-full border border-neutral-gray rounded-lg bg-neutral-white shadow-card flex flex-col">
            <div
                className="ai-report-header flex justify-between items-center p-4 border-b border-neutral-gray bg-neutral-light-gray sticky top-0 z-10">
                <h4 className="m-0 text-primary-dark-blue font-semibold">AI Report</h4>
            </div>

            <div className="p-6 flex-grow overflow-y-auto">
                {!report ? (
                    <div className="flex flex-col items-center justify-center h-full">
                        {error && (
                            <p className="text-error mb-4 text-center">{error}</p>
                        )}
                        <button
                            onClick={generateReport}
                            disabled={isLoading || !currentImage}
                            className="px-6 py-3 bg-gradient-primary text-neutral-white font-medium rounded-full
                       tracking-wide shadow-button hover:filter hover:brightness-110
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:filter-none
                       transition transform hover:-translate-y-0.5"
                        >
                            {isLoading ? (
                                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                       fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                            strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Report...
                </span>
                            ) : "Generate AI Report"}
                        </button>
                        {!currentImage && (
                            <p className="text-neutral-dark-gray mt-4 text-sm text-center">
                                Upload and process an image first to generate a report
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="report-content">
                        {renderMarkdown(report)}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIReport;