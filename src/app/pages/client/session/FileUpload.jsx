import React, { useState } from "react";

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setSuccess(false);
    setProgress(0);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setSuccess(false);
    setProgress(0);

    // Simulate upload progress
    for (let i = 1; i <= 10; i++) {
      await new Promise((res) => setTimeout(res, 100));
      setProgress(i * 10);
    }
    // Simulate upload complete
    setUploading(false);
    setSuccess(true);
    console.log("Uploaded file:", file);
  };

  return (
    <form onSubmit={handleUpload} className="flex flex-col gap-4">
      <input
        type="file"
        accept="audio/*,video/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="block"
      />
      <button
        type="submit"
        disabled={!file || uploading}
        className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
      {uploading && (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      {success && (
        <div className="text-green-600 font-medium">Upload successful!</div>
      )}
    </form>
  );
} 