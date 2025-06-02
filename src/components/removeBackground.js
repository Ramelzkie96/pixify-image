export const removeBackground = async (imageFile) => {
  const apiKey = import.meta.env.VITE_REMOVE_BG_API_KEY;

  if (!apiKey) {
    throw new Error('Remove.bg API key not found.');
  }

  // ❌ Reject unsupported formats like .avif
  if (imageFile.type === 'image/avif') {
    throw new Error('AVIF images are not supported for background removal. Please upload a JPG or PNG.');
  }

  const formData = new FormData();
  formData.append('image_file', imageFile);
  formData.append('size', 'auto');

  try {
    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();

      // Look for known error messages
      if (errorText.includes('Invalid API key')) {
        throw new Error('Invalid or expired Remove.bg API key. Please update your .env file.');
      } else if (errorText.includes('insufficient credits')) {
        throw new Error('You have exceeded the free limit for Remove.bg. Please upgrade or wait to reset.');
      } else {
        throw new Error(`Remove.bg API Error: ${errorText}`);
      }
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (err) {
    throw new Error(err.message || 'An error occurred while removing the background.');
  }
};
