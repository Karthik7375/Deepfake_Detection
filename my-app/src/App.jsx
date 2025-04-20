import React, { useState } from "react";
import axios from "axios";

function App() {
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);

  const [imageResult, setImageResult] = useState(null);
  const [videoResult, setVideoResult] = useState(null);
  const [audioResult, setAudioResult] = useState(null);

  const handleUpload = async (file, type) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      console.log(`http://localhost:8080/api/${type}`)
      const res = await axios.post(`http://localhost:8080/api/${type}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(`Response for ${type}:`, res.data);
      if (type === "image") setImageResult(res.data);
      if (type === "videos") setVideoResult(res.data);
      if (type === "audio") setAudioResult(res.data);

    } catch (err) {
      console.error(`Error uploading ${type}:`, err);
    }
  };

  return (
    <div className= "min-h-screen text-gray-900 p-10 space-y-12 bg-gradient-to-r from-purple-400 via-blue-500 to-indigo-500 bg-[length:300%_300%] animate-gradient">
      <h1 className="text-4xl font-bold text-center mb-10 text-blue-700">DeepFake Detection System</h1>

      {/* IMAGE Upload */}
      <div className="flex items-start gap-10">
        <div className="w-1/2 space-y-2">
          <h2 className="text-2xl font-semibold">Upload Image</h2>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="p-2 border rounded w-full"
          />
          <button
            onClick={() => handleUpload(imageFile, "image")}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Submit Image
          </button>
          {imageFile && <p className="text-sm mt-1">📁 {imageFile.name}</p>}
        </div>

        <div className="w-1/2 bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Image Result</h3>
          {imageResult ? (
            <>
              <p>Prediction: <strong>{imageResult.prediction}</strong></p>
              <p>Confidence: <strong>{imageResult.confidence}</strong></p>
            </>
          ) : <p className="text-gray-500">No result yet.</p>}
        </div>
      </div>

      {/* VIDEO Upload */}
      <div className="flex items-start gap-10">
        <div className="w-1/2 space-y-2">
          <h2 className="text-2xl font-semibold">Upload Video</h2>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files[0])}
            className="p-2 border rounded w-full"
          />
          <button
            onClick={() => handleUpload(videoFile, "videos")}
            className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Submit Video
          </button>
          {videoFile && <p className="text-sm mt-1">📁 {videoFile.name}</p>}
        </div>

        <div className="w-1/2 bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Video Result</h3>
          {videoResult ? (
            <>
              <p>Audio Prediction: <strong>{videoResult.audioLabel}%</strong></p>
              <p>Audio Confidence: <strong>{videoResult.audioConfidence*100}</strong></p>
              <p>Video Prediction: <strong>{videoResult.videoLabel}</strong></p>
              <p>Video Confidence: <strong>{videoResult.videoConfidence*100}%</strong></p>
            </>
          ) : <p className="text-gray-500">No result yet.</p>}
        </div>
      </div>

      {/* AUDIO Upload */}
      <div className="flex items-start gap-10">
        <div className="w-1/2 space-y-2">
          <h2 className="text-2xl font-semibold">Upload Audio</h2>
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setAudioFile(e.target.files[0])}
            className="p-2 border rounded w-full"
          />
          <button
            onClick={() => handleUpload(audioFile, "audio")}
            className="mt-2 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Submit Audio
          </button>
          {audioFile && <p className="text-sm mt-1">📁 {audioFile.name}</p>}
        </div>

        <div className="w-1/2 bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Audio Result</h3>
          {audioResult ? (
            <>
              <p>Prediction: <strong>{audioResult.prediction.toUpperCase()}</strong></p>
              <p>Confidence: <strong>{audioResult.confidence * 100}%</strong></p>
            </>
          ) : <p className="text-gray-500">No result yet.</p>}
        </div>
      </div>
    </div>
  );
}

export default App;
