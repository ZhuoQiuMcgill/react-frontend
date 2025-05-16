import {useState, useEffect} from 'react';

const ImageDisplay = ({images, activeTab, setActiveTab, onImageClick}) => {
    // Tabs configuration
    const tabs = [
        {id: 'final-result', label: 'Final Result', imageKey: 'finalResult', title: 'Final Detection Result:'},
        {id: 'first-stage', label: 'First Stage', imageKey: 'firstStage', title: 'First Stage Detections:'},
        {id: 'cropped-image', label: 'Cropped Image', imageKey: 'cropped', title: 'Cropped Region:'},
        {id: 'processed-image', label: 'Processed Image', imageKey: 'processed', title: 'Processed Detection:'}
    ];

    // Handle tab click
    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
    };

    return (
        <div className="flex-grow flex flex-col overflow-hidden">
            <div
                className="image-tabs flex-grow border border-neutral-gray rounded-lg overflow-hidden bg-neutral-white shadow-card flex flex-col">
                {/* Tabs header */}
                <div className="tabs-header flex bg-neutral-light-gray border-b border-neutral-gray overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`py-3 px-6 bg-transparent border-none border-b-3 font-medium transition-all flex-shrink-0
                ${activeTab === tab.id
                                ? 'border-b-accent-pink text-primary-dark-blue bg-neutral-white'
                                : 'border-b-transparent text-text-light hover:bg-black/[0.03] hover:text-primary-dark-blue'
                            }`}
                            onClick={() => handleTabClick(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tabs content */}
                <div className="tabs-content flex-grow overflow-hidden relative">
                    {tabs.map((tab) => (
                        <div
                            key={tab.id}
                            className={`tab-content p-4 h-full flex flex-col ${activeTab === tab.id ? 'block' : 'hidden'}`}
                        >
                            <div className="image-display-container h-full flex flex-col">
                                <h4 className="text-left mb-4 text-primary-dark-blue font-semibold">
                                    {tab.title}
                                </h4>
                                <div
                                    className="image-container flex-grow flex items-center justify-center bg-[#e0e0e0] border border-neutral-gray rounded relative overflow-hidden">
                                    {images[tab.imageKey] ? (
                                        <img
                                            src={images[tab.imageKey]}
                                            alt={tab.title}
                                            className="max-w-full max-h-full object-contain cursor-zoom-in transition-opacity duration-300"
                                            onClick={() => onImageClick(images[tab.imageKey])}
                                        />
                                    ) : (
                                        <div
                                            className="image-placeholder absolute inset-0 flex items-center justify-center text-neutral-dark-gray italic bg-[#e0e0e0]">
                                            No {tab.label.toLowerCase()} available.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ImageDisplay;