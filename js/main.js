// Get DOM elements
const uploadBtn = document.getElementById('upload-btn');
const uploadInput = document.getElementById('upload-input');
const cropperModal = document.getElementById('cropper-modal');
const cropperImg = document.getElementById('cropper-img');
const cropBtn = document.getElementById('crop-btn');
const closeCropper = document.getElementById('close-cropper');
const fullImg = document.getElementById('full-img');
const compositeCanvas = document.getElementById('composite-canvas');
const downloadBtn = document.getElementById('download-btn');

let cropper;

// Calculate responsive dimensions
function getResponsiveDimensions() {
    const frameWidth = fullImg.offsetWidth;
    const frameHeight = fullImg.offsetHeight;
    
    return {
        width: Math.round((340 / 500) * frameWidth),
        height: Math.round((267 / 500) * frameHeight),
        x: Math.round((80 / 500) * frameWidth),
        y: Math.round((78 / 500) * frameHeight)
    };
}

// Handle image upload button click
uploadBtn.addEventListener('click', () => uploadInput.click());

// Handle file selection
uploadInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            cropperImg.src = e.target.result;
            cropperModal.classList.remove('hidden');
            cropper = new Cropper(cropperImg, {
                aspectRatio: 4/3,
                viewMode: 1,
                responsive: true,
                restore: true
            });
        };
        reader.readAsDataURL(file);
    }
});

// Handle modal close
closeCropper.addEventListener('click', () => {
    cropperModal.classList.add('hidden');
    if (cropper) cropper.destroy();
});

// Handle image cropping
cropBtn.addEventListener('click', () => {
    const canvas = cropper.getCroppedCanvas();
    cropperModal.classList.add('hidden');
    if (cropper) cropper.destroy();

    const ctx = compositeCanvas.getContext('2d');
    compositeCanvas.width = fullImg.naturalWidth;
    compositeCanvas.height = fullImg.naturalHeight;
    
    // Draw the cropped image
    const dims = getResponsiveDimensions();
    const scaleFactor = fullImg.naturalWidth / fullImg.offsetWidth;
    ctx.drawImage(
        canvas,
        dims.x * scaleFactor,
        dims.y * scaleFactor,
        dims.width * scaleFactor,
        dims.height * scaleFactor
    );
    
    compositeCanvas.style.display = 'block';
    downloadBtn.style.display = 'block';
});

// Handle image download
downloadBtn.addEventListener('click', () => {
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = compositeCanvas.width;
    finalCanvas.height = compositeCanvas.height;
    const finalCtx = finalCanvas.getContext('2d');

    // Draw the cropped image
    finalCtx.drawImage(compositeCanvas, 0, 0);
    
    // Draw the frame on top
    const frameImg = new Image();
    frameImg.crossOrigin = "anonymous";
    frameImg.src = fullImg.src;
    frameImg.onload = () => {
        finalCtx.drawImage(frameImg, 0, 0, finalCanvas.width, finalCanvas.height);
        
        const link = document.createElement('a');
        link.download = 'composited-image.png';
        link.href = finalCanvas.toDataURL();
        link.click();
    };
});

// Handle window resize
window.addEventListener('resize', () => {
    if (cropper) {
        cropper.resize();
    }
});