import React from 'react';
import { Toaster } from 'react-hot-toast';
import { useImageEditor } from '../hooks/useImageEditor';
import { useFrameEditor } from '../hooks/useFrameEditor';
import toast from 'react-hot-toast';
const Home = () => {
const {
  canvasRef: filterCanvasRef, // renamed to avoid conflict
  filters,
  filterPreview,
  selectedFilter,
  setSelectedFilter,
  handleFilterImageUpload,
  downloadFilterImage,
  handleRemoveBackground,
} = useImageEditor();


const {
  canvasRef: frameCanvasRef, // renamed to avoid conflict
  selectedFrame,
  applyFrame,
  removeFrame,
  uploadedImage,
  handleFrameUpload,
  frameList,
  downloadFramedImage,
} = useFrameEditor();

  return (
  <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-8 overflow-hidden">
    {/* Decorative blurred circles */}
    <div className="absolute top-[-80px] left-[-80px] w-96 h-96 bg-blue-300 opacity-30 rounded-full blur-3xl z-0"></div>
    <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-green-300 opacity-30 rounded-full blur-3xl z-0"></div>
    <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-purple-300 opacity-20 rounded-full blur-[120px] z-0 transform -translate-x-1/2 -translate-y-1/2"></div>
    <Toaster position="bottom-right" reverseOrder={false} />
    <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-pink-500 to-green-500 text-center mb-6 motion-safe:animate-fade-in">
      ✨ Enhance Your Images
    </h1>

    <p className="text-center text-xl text-gray-700 mb-12 max-w-2xl mx-auto motion-safe:animate-fade-in">
      Apply stylish filters and creative frames to your photos in just a few clicks. Upload your masterpiece and let the magic happen!
    </p>



      <div className="flex flex-col md:flex-row gap-12 max-w-6xl mx-auto">
        {/* Filters Section */}
        <div className="flex-1 bg-white p-6 rounded-xl shadow-lg border-4 border-dashed border-indigo-400">
          <h2 className="text-xl font-semibold mb-4">Image Filter (One Image, Many Filters)</h2>

          <input
            type="file"
            accept="image/*"
            onChange={handleFilterImageUpload}
            className="mb-6 block w-full text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full
            file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          {filterPreview && (
            <>
              <img
                src={filterPreview}
                alt="Filter Preview"
                style={{ filter: selectedFilter }}
                className="w-full rounded object-contain border border-gray-300 mb-4"
              />

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 mb-4">
                {filters.map((filter) => (
                  <div
                    key={filter.name}
                    className="text-center cursor-pointer"
                    onClick={() => setSelectedFilter(filter.value)}
                  >
                    <img
                      src={filterPreview}
                      alt={filter.name}
                      style={{ filter: filter.value }}
                      className="w-20 h-20 object-cover rounded border border-gray-300 mx-auto"
                    />
                    <p className="text-xs mt-1">{filter.name}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={downloadFilterImage}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                >
                  Download
                </button>
                
                <button
                  onClick={handleRemoveBackground}
                  className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                >
                  Remove Background
                </button>
              </div>
            </>
          )}
          <canvas ref={filterCanvasRef} style={{ display: 'none' }} />

        </div>

        {/* Frame Upload Section */}
        <div className="flex-1 bg-white p-6 rounded-xl shadow-lg border-4 border-dashed border-green-400">
        <h2 className="text-xl font-semibold mb-4">Image Frame (One Image, Many Frames)</h2>

        <input
          type="file"
          accept="image/*"
          onChange={handleFrameUpload}
          className="block w-full text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full cursor-pointer
          file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
        />

        {uploadedImage && (
  <>
    {/* Canvas preview (hidden or styled as needed) */}
    <canvas ref={frameCanvasRef} style={{ display: 'none' }} />


    {/* Preview of image with frame */}
    <div style={{ position: 'relative', width: 300, height: 300, marginTop: 20 }}>
      <img
        src={uploadedImage}
        alt="Uploaded"
        style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
      />
      {selectedFrame && (
        <img
          src={selectedFrame}
          alt="Frame"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            objectFit: 'contain',
          }}
        />
      )}
    </div>

    {/* Download Button */}
    <button
      onClick={downloadFramedImage}
      className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
    >
      Download Framed Image
    </button>
  </>
)}


        {/* Show frame options below the preview */}
        {uploadedImage && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 10,
              marginTop: 15,
              flexWrap: 'wrap',
            }}
          >
            {frameList.map((frame, index) => (
              <img
                key={index}
                src={frame}
                alt={`Frame ${index + 1}`}
                onClick={() => applyFrame(frame)}
                style={{
                  width: 60,
                  height: 60,
                  objectFit: 'contain',
                  cursor: 'pointer',
                  border: selectedFrame === frame ? '3px solid green' : '1px solid gray',
                  borderRadius: 6,
                }}
              />
            ))}
          </div>
        )}
      </div>

        
      </div>
    </div>
  );
};

export default Home;
