// src/features/predict/utils/imageUtils.js

/**
 * Compresses an image file.
 * This function attempts to resize the image if it exceeds maxWidthOrHeight
 * and then compresses it to a JPEG format with a specified quality.
 *
 * @param {File} imageFile The image file to compress.
 * @param {object} options Compression options.
 * @param {number} [options.maxSizeMB=1] - The target maximum size in megabytes. (Note: current basic implementation doesn't strictly enforce this by re-compressing)
 * @param {number} [options.maxWidthOrHeight=1920] - The maximum width or height for the image.
 * @param {number} [options.quality=0.7] - The JPEG compression quality (0 to 1).
 * @returns {Promise<File>} A promise that resolves with the compressed image file.
 */
export const compressImage = async (imageFile, options = {}) => {
    console.log('Original image:', imageFile.name, 'Size:', imageFile.size / 1024 / 1024, 'MB');
    // Default options
    const { maxSizeMB = 1, maxWidthOrHeight = 1920, quality = 0.7 } = options;

    return new Promise((resolve, reject) => {
        const image = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
            if (typeof e.target.result !== 'string') {
                return reject(new Error('FileReader did not return a string result.'));
            }
            image.src = e.target.result;
        };

        reader.onerror = (err) => {
            console.error('FileReader error:', err);
            reject(new Error('FileReader failed to read the image.'));
        };

        image.onload = () => {
            let { width, height } = image;
            let scaleFactor = 1;

            // Calculate scaling factor to fit within maxWidthOrHeight
            if (width > maxWidthOrHeight || height > maxWidthOrHeight) {
                if (width > height) {
                    scaleFactor = maxWidthOrHeight / width;
                } else {
                    scaleFactor = maxWidthOrHeight / height;
                }
                width = Math.round(width * scaleFactor);
                height = Math.round(height * scaleFactor);
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                return reject(new Error('Failed to get 2D context from canvas.'));
            }
            ctx.drawImage(image, 0, 0, width, height);

            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        console.log('Compressed image type:', blob.type, 'New size:', blob.size / 1024 / 1024, 'MB');
                        if (blob.size / 1024 / 1024 > maxSizeMB) {
                            console.warn(
                                `Image compression resulted in ${blob.size / 1024 / 1024}MB, which is larger than the target ${maxSizeMB}MB. ` +
                                `Consider using a more advanced compression library or adjusting quality/dimensions further if strict size limits are required.`
                            );
                        }
                        const compressedFile = new File([blob], imageFile.name, {
                            type: 'image/jpeg', // Output as JPEG for compression
                            lastModified: Date.now(),
                        });
                        resolve(compressedFile);
                    } else {
                        console.error('Canvas toBlob conversion failed, blob is null.');
                        reject(new Error('Canvas to Blob conversion failed.'));
                    }
                },
                'image/jpeg', // Specify JPEG for compression
                quality       // Compression quality (0 to 1)
            );
        };

        image.onerror = (errEvent) => {
            // errEvent might not be a standard Error object, so stringify or pick properties
            let errorMessage = 'Image loading failed.';
            if (typeof errEvent === 'string') {
                errorMessage += ` Details: ${errEvent}`;
            } else if (errEvent && typeof errEvent === 'object' && errEvent.type) {
                errorMessage += ` Event type: ${errEvent.type}`;
            }
            console.error(errorMessage, errEvent);
            reject(new Error(errorMessage));
        };

        // Start the process by reading the image file
        reader.readAsDataURL(imageFile);
    });
};

// You can add other image utility functions here and export them as needed.
// For example:
// export const anotherImageUtil = (imageData) => {
//   // ... implementation ...
//   return processedData;
// };

// export const yetAnotherUtil = () => {
//   // ...
// };
