import React, { useState } from "react";

function ImagesPage() {
  const [file, setFile] = useState(null);

  const handleFileUpload = (event) => {
    setFile(event.target.files[0]);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Images Upload</h2>
      <input
        type="file"
        accept="audio/*"
        onChange={handleFileUpload}
        className="border p-2"
      />
      {file && <p className="mt-4">Uploaded File: <span className="font-semibold">{file.name}</span></p>}
    </div>
  );
}

export default ImagesPage;