import {useState, useEffect} from 'react';

const ResultsList = ({detections, onVisibilityChange, onAllVisibilityChange}) => {
    const [masterChecked, setMasterChecked] = useState(true);
    const [masterIndeterminate, setMasterIndeterminate] = useState(false);

    // Update master checkbox state when detections change
    useEffect(() => {
        if (detections.length === 0) {
            setMasterChecked(false);
            setMasterIndeterminate(false);
            return;
        }

        const checkedCount = detections.filter(detection => detection.visible).length;

        if (checkedCount === 0) {
            setMasterChecked(false);
            setMasterIndeterminate(false);
        } else if (checkedCount === detections.length) {
            setMasterChecked(true);
            setMasterIndeterminate(false);
        } else {
            setMasterChecked(false);
            setMasterIndeterminate(true);
        }
    }, [detections]);

    // Handle master checkbox change
    const handleMasterCheckboxChange = (e) => {
        const isChecked = e.target.checked;
        setMasterChecked(isChecked);
        setMasterIndeterminate(false);
        onAllVisibilityChange(isChecked);
    };

    // Handle individual checkbox change
    const handleCheckboxChange = (index, isChecked) => {
        onVisibilityChange(index, isChecked);
    };

    return (
        <div className="h-full border border-neutral-gray rounded-lg bg-neutral-white shadow-card flex flex-col">
            <div
                className="object-list-header flex justify-between items-center p-4 border-b border-neutral-gray bg-neutral-light-gray sticky top-0 z-10">
                <h4 className="m-0 text-primary-dark-blue font-semibold flex items-baseline gap-2">
                    Detected Objects: <span className="text-sm font-medium text-text-light">({detections.length})</span>
                </h4>
                <div className="master-checkbox-container flex items-center gap-2">
                    <label htmlFor="master-checkbox" className="text-sm font-medium text-text-light cursor-pointer">
                        Show All
                    </label>
                    <input
                        type="checkbox"
                        id="master-checkbox"
                        checked={masterChecked}
                        ref={el => {
                            if (el) {
                                el.indeterminate = masterIndeterminate;
                            }
                        }}
                        onChange={handleMasterCheckboxChange}
                        disabled={detections.length === 0}
                        className="w-4 h-4 accent-accent-pink cursor-pointer"
                        title="Show/Hide All Boxes"
                    />
                </div>
            </div>

            <ul id="object-list" className="list-none p-6 pt-2 m-0 flex-grow overflow-y-auto">
                {detections.length === 0 ? (
                    <li className="bg-transparent border-none justify-center p-8 italic text-neutral-dark-gray">
                        No objects detected yet.
                    </li>
                ) : (
                    detections.map((detection, index) => {
                        const {class_name, confidence, visible} = detection;
                        const score = (confidence * 100).toFixed(1);

                        return (
                            <li
                                key={index}
                                className="bg-neutral-white border border-neutral-gray p-3 mb-2 rounded-md text-sm flex items-center transition-colors hover:bg-[#f8f9fa]"
                            >
                                <div
                                    className="item-details flex items-center flex-grow gap-2 overflow-hidden">
                                  <span
                                      className="stage-indicator final-result inline-block px-2 py-0.5 text-xs font-semibold rounded text-white bg-success">
                                    FINAL
                                  </span>
                                    <span
                                        className="font-medium text-primary-dark-blue overflow-hidden text-ellipsis"
                                        title={class_name}>
                                    {index + 1}. {class_name}
                                  </span>
                                    <span
                                        className="text-sm text-text-light bg-neutral-light-gray py-0.5 px-2 rounded border border-neutral-gray whitespace-nowrap ml-auto flex-shrink-0">
                                    {score}%
                                  </span>
                                </div>
                                <div className="item-checkbox-wrapper ml-auto pl-3 flex-shrink-0 flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={visible}
                                        onChange={(e) => handleCheckboxChange(index, e.target.checked)}
                                        data-index={index}
                                        className="w-4 h-4 accent-accent-pink cursor-pointer"
                                    />
                                </div>
                            </li>
                        );
                    })
                )}
            </ul>
        </div>
    );
};

export default ResultsList;