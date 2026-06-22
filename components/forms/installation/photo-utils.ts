export async function compressImage(file: File): Promise<{ data: string; type: string }> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const MAX = 1400;
        const scale = Math.min(1, MAX / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        const data = canvas.toDataURL("image/jpeg", 0.78);
        resolve({ data, type: "image/jpeg" });
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
