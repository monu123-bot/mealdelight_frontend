import React, { useState } from "react";

function ThumbnailUploader({ uploadFile,thumbnailUrl, setThumbnailUrl }) {
  

  const handleThumbnailUpload = async (event) => {
    const file = event.target.files[0];

    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      try {
        const processedImage = await processImage(file);
        const s3Url = await uploadFile(processedImage);
        setThumbnailUrl(s3Url);
      } catch (error) {
        console.error("Error processing or uploading thumbnail:", error);
      }
    } else {
      alert("Please select a PNG or JPG image.");
    }
  };

  const processImage = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target.result;
      };

      img.onload = () => {
        const aspectRatioWidth = 800;
        const aspectRatioHeight = 500;
        const canvas = document.createElement("canvas");
        canvas.width = aspectRatioWidth;
        canvas.height = aspectRatioHeight;

        const ctx = canvas.getContext("2d");

        // Calculate scaling and cropping for correct aspect ratio
        const scale = Math.min(
          canvas.width / img.width,
          canvas.height / img.height
        );

        const xOffset = (canvas.width - img.width * scale) / 2;
        const yOffset = (canvas.height - img.height * scale) / 2;

        ctx.drawImage(
          img,
          0,
          0,
          img.width,
          img.height,
          xOffset,
          yOffset,
          img.width * scale,
          img.height * scale
        );

        canvas.toBlob((blob) => {
          resolve(new File([blob], file.name, { type: file.type }));
        }, file.type);
      };

      reader.readAsDataURL(file);
    });
  };

  return (
    <div>
      {thumbnailUrl && (
        <img
          src={thumbnailUrl}
          alt="Thumbnail Preview"
          style={{ width: "160px", height: "100px" }}
        />
      )}
      <br/>
      <input type="file" accept="image/png, image/jpeg" onChange={handleThumbnailUpload} />
    </div>
  );
}

export default ThumbnailUploader;
