/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
// Helper function to load an image and return it as an HTMLImageElement
function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        // Setting crossOrigin is good practice for canvas operations, even with data URLs
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(new Error(`Failed to load image: ${src.substring(0, 50)}...`));
        img.src = src;
    });
}

/**
 * Applies a subtle watermark to an image.
 * @param imageDataUrl The data URL of the image to watermark.
 * @returns A promise that resolves to a new data URL for the watermarked image.
 */
export async function applyWatermark(imageDataUrl: string): Promise<string> {
    const img = await loadImage(imageDataUrl);
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context for watermarking');

    // Draw the original image
    ctx.drawImage(img, 0, 0);

    // Set watermark style
    ctx.font = `bold ${Math.max(24, canvas.width * 0.02)}px 'Cairo', sans-serif`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    
    // Draw the watermark in the bottom-right corner
    ctx.fillText('ehabgm.online', canvas.width - 15, canvas.height - 15);

    return canvas.toDataURL('image/jpeg', 0.9);
}


interface AlbumTranslations {
    header: string;
    subheader: string;
}

/**
 * Creates a single "photo album" page image from a collection of decade images.
 * @param imageData A record mapping decade strings to their image data URLs.
 * @param translations An object containing the translated text for the album header.
 * @returns A promise that resolves to a data URL of the generated album page (JPEG format).
 */
export async function createAlbumPage(imageData: Record<string, string>, translations: AlbumTranslations): Promise<string> {
    const canvas = document.createElement('canvas');
    // High-resolution canvas for good quality (A4-like ratio)
    const canvasWidth = 2480;
    const canvasHeight = 3508;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('Could not get 2D canvas context');
    }

    // 1. Draw the album page background
    ctx.fillStyle = '#fdf5e6'; // A warm, parchment-like color
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // 2. Draw the title
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';

    ctx.font = `bold 100px 'Cairo', 'Caveat', cursive`;
    ctx.fillText(translations.header, canvasWidth / 2, 150);

    ctx.font = `50px 'Cairo', 'Roboto', sans-serif`;
    ctx.fillStyle = '#555';
    ctx.fillText(translations.subheader, canvasWidth / 2, 220);

    // 3. Load all the polaroid images concurrently
    const decades = Object.keys(imageData);
    const loadedImages = await Promise.all(
        Object.values(imageData).map(url => loadImage(url))
    );

    const imagesWithDecades = decades.map((decade, index) => ({
        decade,
        img: loadedImages[index],
    }));

    // 4. Define grid layout and draw each polaroid
    const grid = { cols: 2, rows: 3, padding: 100 };
    const contentTopMargin = 300; // Space for the header
    const contentHeight = canvasHeight - contentTopMargin;
    const cellWidth = (canvasWidth - grid.padding * (grid.cols + 1)) / grid.cols;
    const cellHeight = (contentHeight - grid.padding * (grid.rows + 1)) / grid.rows;

    const polaroidAspectRatio = 1.2; 
    const maxPolaroidWidth = cellWidth * 0.9;
    const maxPolaroidHeight = cellHeight * 0.9;

    let polaroidWidth = maxPolaroidWidth;
    let polaroidHeight = polaroidWidth * polaroidAspectRatio;

    if (polaroidHeight > maxPolaroidHeight) {
        polaroidHeight = maxPolaroidHeight;
        polaroidWidth = polaroidHeight / polaroidAspectRatio;
    }

    const imageContainerWidth = polaroidWidth * 0.9;
    const imageContainerHeight = imageContainerWidth; 

    const reversedImages = [...imagesWithDecades].reverse();
    reversedImages.forEach(({ decade, img }, reversedIndex) => {
        const index = imagesWithDecades.length - 1 - reversedIndex;

        const row = Math.floor(index / grid.cols);
        const col = index % grid.cols;

        const x = grid.padding * (col + 1) + cellWidth * col + (cellWidth - polaroidWidth) / 2;
        const y = contentTopMargin + grid.padding * (row + 1) + cellHeight * row + (cellHeight - polaroidHeight) / 2;
        
        ctx.save();
        
        ctx.translate(x + polaroidWidth / 2, y + polaroidHeight / 2);
        
        const rotation = (Math.random() - 0.5) * 0.1; 
        ctx.rotate(rotation);
        
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 35;
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 10;
        
        ctx.fillStyle = '#fff';
        ctx.fillRect(-polaroidWidth / 2, -polaroidHeight / 2, polaroidWidth, polaroidHeight);
        
        ctx.shadowColor = 'transparent';
        
        const aspectRatio = img.naturalWidth / img.naturalHeight;
        let drawWidth = imageContainerWidth;
        let drawHeight = drawWidth / aspectRatio;

        if (drawHeight > imageContainerHeight) {
            drawHeight = imageContainerHeight;
            drawWidth = drawHeight * aspectRatio;
        }

        const imageAreaTopMargin = (polaroidWidth - imageContainerWidth) / 2;
        const imageContainerY = -polaroidHeight / 2 + imageAreaTopMargin;
        
        const imgX = -drawWidth / 2;
        const imgY = imageContainerY + (imageContainerHeight - drawHeight) / 2;
        
        ctx.drawImage(img, imgX, imgY, drawWidth, drawHeight);
        
        ctx.fillStyle = '#222';
        ctx.font = `60px 'Cairo', 'Permanent Marker', cursive`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const captionAreaTop = imageContainerY + imageContainerHeight;
        const captionAreaBottom = polaroidHeight / 2;
        const captionY = captionAreaTop + (captionAreaBottom - captionAreaTop) / 2;

        ctx.fillText(decade, 0, captionY);
        
        ctx.restore();
    });

    // Add a final watermark to the entire album page
    ctx.font = `40px 'Cairo', sans-serif`;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillText('ehabgm.online', canvasWidth - 50, canvasHeight - 50);

    return canvas.toDataURL('image/jpeg', 0.9);
}