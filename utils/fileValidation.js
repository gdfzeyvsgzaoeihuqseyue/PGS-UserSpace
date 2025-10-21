export const validateImageFile = async (file) => {
  const errors = [];

  // Vérifier le type MIME
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    errors.push('Type de fichier non valide. Seuls JPG, PNG, GIF, WEBP sont autorisés.');
    return { valid: false, errors };
  }

  //  Vérifier la taille
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    errors.push(`Fichier trop volumineux (${(file.size / 1024 / 1024).toFixed(2)} Mo). Maximum: 5 Mo.`);
    return { valid: false, errors };
  }

  // Vérifier les dimensions
  try {
    const dimensions = await getImageDimensions(file);

    if (dimensions.width < 200 || dimensions.height < 200) {
      errors.push('Image trop petite. Dimensions minimales: 200x200 pixels.');
    }

    if (dimensions.width > 4000 || dimensions.height > 4000) {
      errors.push('Image trop grande. Dimensions maximales: 4000x4000 pixels.');
    }

    const aspectRatio = dimensions.width / dimensions.height;
    if (aspectRatio < 0.5 || aspectRatio > 2) {
      errors.push('Ratio d\'aspect non supporté. Utilisez une image plus carrée.');
    }

  } catch (err) {
    errors.push('Impossible de lire les dimensions de l\'image.');
    return { valid: false, errors };
  }

  return { valid: errors.length === 0, errors, dimensions };
};

const getImageDimensions = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
};

// Fonction de compression d'image
export const compressImage = async (file, maxWidth = 1200, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            resolve(new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            }));
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = reject;
      img.src = e.target.result;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
