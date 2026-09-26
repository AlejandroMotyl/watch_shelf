export const processImageForPreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const size = 512;
      const canvas = document.createElement("canvas");

      canvas.width = size;
      canvas.height = size;

      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Could not create canvas context"));
        return;
      }

      const scale = Math.max(
        size / image.naturalWidth,
        size / image.naturalHeight,
      );

      const width = image.naturalWidth * scale;
      const height = image.naturalHeight * scale;

      const x = (size - width) / 2;
      const y = (size - height) / 2;

      ctx.drawImage(image, x, y, width, height);

      resolve(canvas.toDataURL("image/webp", 0.85));
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Invalid image"));
    };

    image.src = objectUrl;
  });
};
