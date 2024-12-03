export const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const MAX_WIDTH = 800;
const MAX_HEIGHT = 600;

export const validateImage = (file: File): string | null => {
  if (file.size > MAX_FILE_SIZE) {
    return `파일 '${file.name}'이(가) 20MB 용량 제한을 초과했습니다.`;
  }
  return null;
};

export const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // 이미지 크기 조정
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        // 압축된 이미지를 base64로 변환
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
        resolve(compressedBase64);
      };

      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

// 마커용 이미지 처리 (base64 반환)
export const processMarkerImage = async (
  file: File
): Promise<{
  errorMessage: string | null;
  compressedImage?: string;
}> => {
  const error = validateImage(file);
  if (error) {
    return { errorMessage: error };
  }

  try {
    const compressed = await compressImage(file);
    return { errorMessage: null, compressedImage: compressed };
  } catch (err) {
    console.error("Image compression error:", err);
    return { errorMessage: "이미지 처리 중 오류가 발생했습니다." };
  }
};

// 포스트용 이미지 처리 (File 객체 반환)
export const processPostImages = async (
  files: File[]
): Promise<{
  validFiles: File[];
  errorMessage: string | null;
}> => {
  const validFiles: File[] = [];
  let errorMessage: string | null = null;

  for (const file of files) {
    const error = validateImage(file);
    if (error) {
      errorMessage = error;
      continue;
    }
    validFiles.push(file);
  }

  return { validFiles, errorMessage };
};
