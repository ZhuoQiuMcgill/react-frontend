import { useState, useEffect, useCallback } from 'react';

const ImageZoomModal = ({ isOpen, imageUrl, onClose }) => {
    const [scale, setScale] = useState(1);
    const ZOOM_FACTOR = 1.1;
    const MIN_SCALE = 0.5;
    const MAX_SCALE = 8;

    // Reset scale when modal opens with new image
    useEffect(() => {
        if (isOpen) {
            setScale(1);
        }
    }, [isOpen, imageUrl]);

    // Handle wheel event for zooming
    const handleWheel = useCallback((e) => {
        e.preventDefault();

        // Determine zoom direction
        let newScale;
        if (e.deltaY < 0) {
            // Zoom in
            newScale = scale * ZOOM_FACTOR;
        } else {
            // Zoom out
            newScale = scale / ZOOM_FACTOR;
        }

        // Clamp the scale within min/max limits
        newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));
        setScale(newScale);
    }, [scale]);

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
        <div
            className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center cursor-zoom-out"
            onClick={onClose}
        >
      <span
          className="absolute top-5 right-9 text-white text-4xl font-bold cursor-pointer hover:text-gray-300 transition-colors z-[1001]"
          onClick={(e) => {
              e.stopPropagation();
              onClose();
          }}
      >
        &times;
      </span>

            <img
                src={imageUrl}
                alt="Zoomed"
                className="max-w-[90%] max-h-[90vh] object-contain animate-zoom cursor-default"
                style={{ transform: `scale(${scale})`, transformOrigin: 'center center', transition: 'transform 0.2s ease-out' }}
                onClick={(e) => e.stopPropagation()}
                onWheel={handleWheel}
            />
        </div>
    );
};

export default ImageZoomModal;