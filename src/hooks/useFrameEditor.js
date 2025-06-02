import { useRef, useState, useEffect } from 'react';
import frame1 from '../assets/frame1.png';
import frame2 from '../assets/frame2.png';
import frame3 from '../assets/frame3.png';
import frame5 from '../assets/frame5.png';
import frame6 from '../assets/frame6.png';
import frame7 from '../assets/frame7.png';
import frame8 from '../assets/frame8.png';

const frameList = [frame1, frame2, frame3, frame5, frame6, frame7, frame8];

export const useFrameEditor = () => {
  const [selectedFrame, setSelectedFrame] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const canvasRef = useRef(null);

  const handleFrameUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedImage(event.target.result);
      setSelectedFrame('');
    };
    reader.readAsDataURL(file);
  };

  const applyFrame = (frame) => {
    setSelectedFrame(frame);
  };

  const removeFrame = () => {
    setSelectedFrame('');
  };

  const renderToCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !uploadedImage) return;

    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.src = uploadedImage;
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      if (selectedFrame) {
        const frameImg = new Image();
        frameImg.src = selectedFrame;
        frameImg.crossOrigin = 'anonymous';
        frameImg.onload = () => {
          ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
        };
      }
    };
  };

  // Re-render to canvas when image or frame changes
  useEffect(() => {
    renderToCanvas();
  }, [uploadedImage, selectedFrame]);

  const downloadFramedImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'framed-image.jpg';
    link.href = canvas.toDataURL('image/jpeg');
    link.click();
  };

  return {
    selectedFrame,
    applyFrame,
    removeFrame,
    uploadedImage,
    handleFrameUpload,
    frameList,
    canvasRef,
    downloadFramedImage,
  };
};
