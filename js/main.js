document.addEventListener("DOMContentLoaded", () => {
  const uploadBtn = document.getElementById("upload-btn");
  const uploadInput = document.getElementById("upload-input");
  const fullImg = document.getElementById("full-img");
  const frameImg = document.getElementById("frame-img");
  const downloadBtn = document.getElementById("download-btn");

  let cropper = null;

  // Trigger file input when clicking the upload button
  uploadBtn.addEventListener("click", () => uploadInput.click());

  // Handle image upload
  uploadInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        frameImg.src = e.target.result; // Set uploaded image in preview
        frameImg.style.display = "block"; // Ensure it's visible

        // Destroy previous cropper instance if exists
        if (cropper) {
          cropper.destroy();
        }

        // Initialize Cropper.js
        cropper = new Cropper(frameImg, {
          viewMode: 1,
          movable: true,
          scalable: true,
          zoomable: true,
          autoCropArea: 1,
        });

        // Hide upload button and show download button
        uploadBtn.style.display = "none";
        downloadBtn.style.display = "inline-block";
      };
      reader.readAsDataURL(file);
    }
  });

  // Handle download button click
  downloadBtn.addEventListener("click", () => {
    if (!cropper) return;

    // Get the cropped image
    const croppedCanvas = cropper.getCroppedCanvas();

    // Create a canvas to combine the frame and cropped image
    const combinedCanvas = document.createElement("canvas");
    combinedCanvas.width = fullImg.naturalWidth;
    combinedCanvas.height = fullImg.naturalHeight;
    const ctx = combinedCanvas.getContext("2d");

    // Draw the frame (background)
    ctx.drawImage(fullImg, 0, 0, combinedCanvas.width, combinedCanvas.height);

    // Calculate the position and size for the uploaded image
    const squareX = combinedCanvas.width * 0.15; // Adjust to align with your frame
    const squareY = combinedCanvas.height * 0.3; // Adjust to align with your frame
    const squareWidth = combinedCanvas.width * 0.7; // Adjust based on frame proportions
    const squareHeight = combinedCanvas.height * 0.4;

    // Draw the cropped image in the specified area
    ctx.drawImage(croppedCanvas, squareX, squareY, squareWidth, squareHeight);

    // Trigger download
    const link = document.createElement("a");
    link.download = "combined-image.png";
    link.href = combinedCanvas.toDataURL("image/png");
    link.click();
  });
});
