
export async function compressImage(file: File, maxWidth = 1800, maxHeight = 1920): Promise<File> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      return reject("compressImage só funciona no client.");
    }

    const img = new Image();
    const canvas = document.createElement("canvas");
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height *= maxWidth / width;
        width = maxWidth;
      }

      if (height > maxHeight) {
        width *= maxHeight / height;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Erro ao obter contexto do canvas.");

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject("Erro ao converter imagem.");
          resolve(new File([blob], file.name, { type: "image/jpeg" }));
        },
        "image/jpeg",
        0.7
      );
    };

    reader.readAsDataURL(file);
  });
}
