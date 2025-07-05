import React, { useRef, useState } from "react";

export default function SessionRecorder({ onRecordingComplete }) {
  const [recording, setRecording] = useState(false);
  const [mediaUrl, setMediaUrl] = useState(null);
  const [mediaType, setMediaType] = useState("audio"); // or "video"
  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    const constraints = mediaType === "audio"
      ? { audio: true }
      : { audio: true, video: true };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    mediaStreamRef.current = stream;
    mediaRecorderRef.current = new MediaRecorder(stream);
    chunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mediaType === "audio" ? "audio/webm" : "video/webm" });
      const url = URL.createObjectURL(blob);
      setMediaUrl(url);
      if (onRecordingComplete) onRecordingComplete(blob);
      stream.getTracks().forEach(track => track.stop());
    };

    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  return (
    <div className="mb-4">
      <div className="flex gap-2 mb-2">
        <label>
          <input
            type="radio"
            name="mediaType"
            value="audio"
            checked={mediaType === "audio"}
            onChange={() => setMediaType("audio")}
            disabled={recording}
          /> Audio
        </label>
        <label>
          <input
            type="radio"
            name="mediaType"
            value="video"
            checked={mediaType === "video"}
            onChange={() => setMediaType("video")}
            disabled={recording}
          /> Video
        </label>
      </div>
      {!recording ? (
        <button
          onClick={startRecording}
          className="px-4 py-2 bg-green-600 text-white rounded-md"
        >
          Start Recording
        </button>
      ) : (
        <button
          onClick={stopRecording}
          className="px-4 py-2 bg-red-600 text-white rounded-md"
        >
          Stop Recording
        </button>
      )}
      {mediaUrl && (
        <div className="mt-4">
          {mediaType === "audio" ? (
            <audio controls src={mediaUrl} />
          ) : (
            <video controls src={mediaUrl} width={320} />
          )}
          <a
            href={mediaUrl}
            download={`session-recording.${mediaType === "audio" ? "webm" : "webm"}`}
            className="block mt-2 text-blue-600 underline"
          >
            Download Recording
          </a>
        </div>
      )}
    </div>
  );
} 