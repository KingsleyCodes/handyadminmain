"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { 
  FaCloudUploadAlt, 
  FaImage, 
  FaTimes, 
  FaSpinner, 
  FaCheckCircle 
} from "react-icons/fa";

export default function ImageUploader({ category, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Formats "real-estate" -> "REAL ESTATE"
  const formattedCategory = category
    ? category.replace(/-/g, " ").toUpperCase()
    : "GALLERY";

  const processFile = (selectedFile) => {
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      toast.error("Please select a valid image file (PNG, JPG, WEBP).");
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) processFile(selectedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) processFile(droppedFile);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreview(null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      return toast.error("Please select an image file first.");
    }

    setLoading(true);
    const toastId = toast.loading("Uploading image to storage...");

    try {
      // 1. Upload File to Cloudinary via API
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", category);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        throw new Error(uploadData.error || "Failed to upload image to storage");
      }

      // 2. Save Metadata to Firestore via Gallery API
      const galleryRes = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          imageUrl: uploadData.imageUrl,
          publicId: uploadData.publicId,
          category,
        }),
      });

      const galleryData = await galleryRes.json();

      if (!galleryRes.ok) {
        throw new Error(galleryData.error || "Failed to save image record");
      }

      // Reset form states
      setFile(null);
      setPreview(null);
      setTitle("");

      // Custom Success Toast
      toast.success(
        <div>
          <p className="font-bold text-slate-800 m-0 flex items-center gap-1.5">
            <FaCheckCircle className="text-emerald-500" /> Upload Complete!
          </p>
          <p className="text-xs text-slate-600 m-0 mt-1">
            Your image is now live on the {formattedCategory} gallery.
          </p>
        </div>,
        { id: toastId, duration: 5000 }
      );

      if (onUploadSuccess) onUploadSuccess();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong during upload.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-8 mb-8 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            Upload New Photo
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Category: <span className="font-semibold text-[#0D5C3E]">{formattedCategory}</span>
          </p>
        </div>
        <div className="hidden sm:flex w-10 h-10 rounded-xl bg-[#0D5C3E]/10 text-[#0D5C3E] items-center justify-center font-bold">
          <FaImage />
        </div>
      </div>

      <form onSubmit={handleUpload} className="space-y-6">
        {/* Title Input */}
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
            Image Title / Caption <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Executive Office Transformation"
            disabled={loading}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D5C3E] focus:border-transparent transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Drag and Drop Zone */}
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
            Select Photo
          </label>

          {!preview ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-10 text-center transition-all cursor-pointer ${
                isDragging
                  ? "border-[#0D5C3E] bg-[#0D5C3E]/5 scale-[0.99]"
                  : "border-slate-300 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-400"
              }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={loading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-[#0D5C3E] text-xl">
                  <FaCloudUploadAlt />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Click to upload <span className="font-normal text-slate-500">or drag and drop</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    PNG, JPG, WEBP, or GIF (max 10MB)
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Preview Container */
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900/5 p-2 flex items-center justify-center min-h-[200px] max-h-[350px]">
              <img
                src={preview}
                alt="Upload Preview"
                className="max-h-[320px] w-auto object-contain rounded-xl shadow-sm"
              />
              
              <button
                type="button"
                onClick={handleRemoveFile}
                disabled={loading}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-900/80 hover:bg-red-600 text-white flex items-center justify-center text-xs transition-colors shadow-md z-20"
                title="Remove photo"
              >
                <FaTimes />
              </button>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={loading || !file}
          className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md transition-all duration-200 ${
            loading || !file
              ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
              : "bg-gradient-to-r from-[#0D5C3E] to-[#1A3C2E] text-white hover:opacity-95 active:scale-[0.99]"
          }`}
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin text-lg" />
              <span>Uploading to Cloudinary...</span>
            </>
          ) : (
            <>
              <FaCloudUploadAlt className="text-lg" />
              <span>Publish Image to Gallery</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}