/**
 * Client-side image upload utility
 * Compresses & resizes images to data URLs (base64) for JSON storage
 */

const MAX_WIDTH = 2000;
const MAX_SIZE_KB = 2000;
const QUALITY = 0.92;

export interface ImageUploadResult {
  dataUrl: string;
  sizeKB: number;
}

export class ImageUploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ImageUploadError";
  }
}

/**
 * Converts a File to a compressed base64 data URL
 * @param file - Image file from input
 * @returns Promise with data URL string
 * @throws ImageUploadError if file is too large or invalid
 */
export async function fileToDataUrl(file: File): Promise<string> {
  // Validate file type
  if (!file.type.startsWith("image/")) {
    throw new ImageUploadError("File harus berupa gambar (JPEG, PNG, WebP, dll)");
  }

  // Validate file size (pre-compression check: 5MB hard limit)
  if (file.size > 5 * 1024 * 1024) {
    throw new ImageUploadError("Ukuran file terlalu besar (max 5MB)");
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const result = compressImage(img, file.type);
          
          // Validate compressed size
          const sizeKB = Math.round((result.length * 3) / 4 / 1024);
          if (sizeKB > MAX_SIZE_KB) {
            reject(
              new ImageUploadError(
                `Gambar terlalu besar setelah kompresi (${sizeKB}KB, max ${MAX_SIZE_KB}KB). Coba gambar dengan resolusi lebih kecil.`
              )
            );
            return;
          }
          
          resolve(result);
        } catch (err) {
          reject(
            new ImageUploadError(
              err instanceof Error ? err.message : "Gagal memproses gambar"
            )
          );
        }
      };
      img.onerror = () => reject(new ImageUploadError("Gagal memuat gambar"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new ImageUploadError("Gagal membaca file"));
    reader.readAsDataURL(file);
  });
}

/**
 * Compress and resize image using canvas
 */
function compressImage(img: HTMLImageElement, mimeType: string): string {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context not available");

  // Calculate new dimensions (maintain aspect ratio)
  let { width, height } = img;
  if (width > MAX_WIDTH) {
    height = Math.round((height * MAX_WIDTH) / width);
    width = MAX_WIDTH;
  }

  canvas.width = width;
  canvas.height = height;

  // Draw and compress
  ctx.drawImage(img, 0, 0, width, height);

  // Convert to data URL with quality setting
  const outputType = mimeType === "image/png" ? "image/png" : "image/jpeg";
  return canvas.toDataURL(outputType, QUALITY);
}

/**
 * Validates if a string is a valid data URL
 */
export function isDataUrl(str: string): boolean {
  return /^data:image\/[a-z]+;base64,/.test(str);
}

/**
 * Estimates the size of a data URL in KB
 */
export function getDataUrlSizeKB(dataUrl: string): number {
  return Math.round((dataUrl.length * 3) / 4 / 1024);
}
