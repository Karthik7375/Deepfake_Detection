import React from "react";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="w-64 bg-gray-800 text-white h-screen fixed p-4">
      <h3 className="text-2xl font-semibold mb-6">Navigation</h3>
      <ul className="space-y-4">
        <li><Link to="/" className="hover:text-blue-400">Home</Link></li>
        <li><Link to="/audio" className="hover:text-blue-400">Audio</Link></li>
        <li><Link to="/video" className="hover:text-blue-400">Video</Link></li>
        <li><Link to="/image" className="hover:text-blue-400">Image</Link></li>
      </ul>
    </div>
  );
}

export default Sidebar;