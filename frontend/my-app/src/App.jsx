import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AudioPage from "./components/Audio";
import ImagesPage from "./components/Images";
import VideoPage from "./components/Video";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 bg-size-200 animate-gradient-move text-white text-xl font-bold">
        <Sidebar />
        <div className="ml-64 p-6 w-full">
          <Routes>
            <Route path="/" element={<h1 className="text-4xl justify-center items-center font-bold">Welcome to DeepFake Detection System</h1>} />
            <Route path="/audio" element={<AudioPage />} />
            <Route path="/video" element={<VideoPage />} />
            <Route path="/image" element={<ImagesPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;



