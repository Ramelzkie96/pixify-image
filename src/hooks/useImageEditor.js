// src/hooks/useImageEditor.js
import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { removeBackground } from '../components/removeBackground';

export const useImageEditor = () => {
  const [filterImage, setFilterImage] = useState(null);
  const [filterPreview, setFilterPreview] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('');
  const [frameImage, setFrameImage] = useState(null);
  const canvasRef = useRef(null);

  const filters = [
    { name: 'None', value: 'none' },
    { name: 'Grayscale', value: 'grayscale(1)' },
    { name: 'Sepia', value: 'sepia(1)' },
    { name: 'Blur', value: 'blur(3px)' },
    { name: 'Blur More', value: 'blur(8px)' },
    { name: 'Brightness', value: 'brightness(1.5)' },
    { name: 'Brightness Down', value: 'brightness(0.5)' },
    { name: 'Contrast', value: 'contrast(2)' },
    { name: 'Contrast Light', value: 'contrast(1.25)' },
    { name: 'Hue Rotate', value: 'hue-rotate(90deg)' },
    { name: 'Hue Rotate More', value: 'hue-rotate(180deg)' },
    { name: 'Invert', value: 'invert(1)' },
    { name: 'Saturate', value: 'saturate(2)' },
    { name: 'Opacity 50%', value: 'opacity(0.5)' },
    { name: 'Drop Shadow', value: 'drop-shadow(8px 8px 10px gray)' },
    { name: 'Combo: Gray + Bright', value: 'grayscale(1) brightness(1.2)' },
  ];

  const handleFilterImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setFilterImage(file);
      setFilterPreview(URL.createObjectURL(file));
      setSelectedFilter('');
    } else {
      toast.error('Please upload a valid image file.');
    }
  };


  const applyFilterToCanvas = () => {
    if (!filterPreview || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = filterPreview;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.filter = selectedFilter || 'none';
      ctx.drawImage(img, 0, 0);

      if (frameImage) {
        const frame = new Image();
        frame.src = frameImage;
        frame.onload = () => {
          ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
        };
      }
    };
  };

  const downloadFilterImage = () => {
  if (!canvasRef.current || !filterPreview) return;

  // Re-apply the filter to make sure canvas is up-to-date
  const canvas = canvasRef.current;
  const ctx = canvas.getContext('2d');
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = filterPreview;

  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.filter = selectedFilter || 'none';
    ctx.drawImage(img, 0, 0);

    if (frameImage) {
      const frame = new Image();
      frame.src = frameImage;
      frame.onload = () => {
        ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);

        // Now trigger download after everything is rendered
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/jpeg');
        link.download = 'filtered-image.jpg';
        link.click();
      };
    } else {
      // No frame, just download
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/jpeg');
      link.download = 'filtered-image.jpg';
      link.click();
    }
  };
};


  const handleRemoveBackground = async () => {
    if (!filterImage) {
      toast.error('Please upload an image first.');
      return;
    }

    try {
      toast.loading('Removing background...');
      const transparentImageUrl = await removeBackground(filterImage);
      setFilterPreview(transparentImageUrl);
      toast.dismiss();
      toast.success('Background removed!');
    } catch (error) {
      toast.dismiss();
      toast.error(error.message || 'Failed to remove background.');
    }
  };

  useEffect(() => {
    applyFilterToCanvas();
  }, [filterPreview, selectedFilter, frameImage]);

  return {
    canvasRef,
    filters,
    filterPreview,
    selectedFilter,
    setSelectedFilter,
    handleFilterImageUpload,
    downloadFilterImage,
    handleRemoveBackground,
  };
};
