/**
 * Creates an image with detection boxes drawn on it
 * @param {Image|string} imgSrc - The source image or URL
 * @param {Array} detections - The detection objects with box coordinates
 * @returns {Promise<string>} - Promise resolving to data URL of the image with boxes
 */
export const createImageWithBoxes = (imgSrc, detections) => {
    return new Promise((resolve, reject) => {
        const img = imgSrc instanceof Image ? imgSrc : new Image();

        const processImage = () => {
            // Add a small delay to ensure dimensions are stable in DOM
            setTimeout(() => {
                if (!img.naturalWidth || !img.naturalHeight) {
                    console.warn("Image has zero dimensions after short delay, rejecting.");
                    // Resolve with the original image source if drawing fails
                    // This prevents breaking the chain if the base image is valid but drawing context fails
                    if (typeof imgSrc === 'string' && imgSrc.startsWith('data:image')) {
                        resolve(imgSrc);
                    } else {
                        reject(new Error("Image has zero dimensions"));
                    }
                    return;
                }
                const canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                const ctx = canvas.getContext('2d');

                ctx.drawImage(img, 0, 0);

                const maxDimension = Math.max(img.naturalWidth, img.naturalHeight);
                const scaleFactor = Math.max(0.001, maxDimension / 1000);

                // Gracefully handle empty or invalid detections array
                if (detections && Array.isArray(detections) && detections.length > 0) {
                    const colors = ['#dfbee8', '#7ec3ed', '#616ca8', '#8180b4', '#c8a2c8', '#a0d2eb', '#d43f3a', '#46b8da', '#F0AD4E', '#4cae4c'];
                    let colorIndex = 0;

                    detections.forEach((pred) => {
                        // Ensure only visible boxes are drawn if visibility flag exists
                        if (!pred || pred.visible === false) return;

                        const {class_name, confidence, box} = pred;

                        if (!box || !Array.isArray(box) || box.length !== 4 || box.some(coord => isNaN(coord) || coord === null)) {
                            console.warn("Skipping invalid box data:", box);
                            return;
                        }

                        const [x1, y1, x2, y2] = box.map(Number);
                        const width = x2 - x1;
                        const height = y2 - y1;

                        if (width <= 0 || height <= 0) {
                            console.warn("Skipping box with zero area:", box);
                            return;
                        }

                        const score = (confidence * 100).toFixed(1);
                        const color = colors[colorIndex % colors.length];
                        colorIndex++;

                        const lineWidth = Math.max(2, Math.round(4 * scaleFactor));
                        ctx.strokeStyle = color;
                        ctx.lineWidth = lineWidth;
                        ctx.strokeRect(x1, y1, width, height);

                        // Reduce font size for smaller boxes to avoid text overflow
                        const boxSizeRatio = Math.min(1, Math.sqrt((width * height) / (canvas.width * canvas.height)) * 10);
                        const fontSize = Math.max(10, Math.round(20 * scaleFactor * boxSizeRatio));

                        // Truncate class name if it's too long
                        const truncatedClass = class_name.length > 20 ? class_name.substring(0, 18) + '...' : class_name;
                        const text = `${truncatedClass} ${score}%`;

                        ctx.font = `bold ${fontSize}px 'Segoe UI', sans-serif`;

                        const textMetrics = ctx.measureText(text);
                        const textWidth = textMetrics.width;
                        const textHeight = fontSize * 1.2;

                        const padding = Math.max(4, Math.round(8 * scaleFactor));
                        const rectX = x1;
                        const rectY = Math.max(0, y1 - textHeight);
                        const rectHeight = textHeight;
                        const rectWidth = textWidth + padding;

                        ctx.fillStyle = color;
                        ctx.fillRect(rectX, rectY, rectWidth, rectHeight);

                        const xOffset = Math.max(2, Math.round(4 * scaleFactor));
                        ctx.fillStyle = '#ffffff';
                        ctx.fillText(text, rectX + xOffset, rectY + fontSize);
                    });
                } // End if detections exist

                resolve(canvas.toDataURL('image/jpeg'));
            }, 50); // 50ms delay
        };

        if (!(imgSrc instanceof Image)) {
            img.onload = processImage;
            img.onerror = (err) => {
                console.error(`Failed to load image source: ${typeof imgSrc === 'string' ? imgSrc.substring(0, 100) : '[Image Object]'}...`);
                reject(new Error(`Failed to load image source. Error: ${err}`));
            };
            img.src = imgSrc;
        } else {
            if (img.complete && img.naturalWidth > 0) {
                processImage();
            } else if (img.naturalWidth === 0 && img.complete) {
                reject(new Error("Provided image object has zero width"));
            } else {
                img.onload = processImage;
                img.onerror = (err) => {
                    console.error(`Provided image object failed to load.`);
                    reject(new Error(`Provided image object failed to load. Error: ${err}`));
                };
            }
        }
    });
};

/**
 * Shows a status message.
 * @param {string} message - The message text.
 * @param {'success' | 'error' | 'info'} type - The type of message.
 * @returns {Object} - The message object
 */
export const createStatusMessage = (message, type) => {
    return {
        message,
        type
    };
};