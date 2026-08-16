"use client";
import { useState, useEffect, useCallback } from "react";
import ImageUploader from "@/components/ImageUploader";
import GalleryGrid from "@/components/GalleryGrid";

const CATEGORY = "interior-design";

export default function InteriorDesignGalleryPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/gallery?category=${CATEGORY}`);
      const data = await res.json();
      if (data.success) {
        setImages(data.data);
      }
    } catch (error) {
      console.error("Failed to load gallery images:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return (
    <div style={{ padding: "32px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "8px", fontSize: "28px", fontWeight: "bold" }}>
        Interior Design Gallery
      </h1>
      <p style={{ color: "#666", marginBottom: "32px" }}>
        Upload and manage photos displayed on the public Interior Design page.
      </p>

      <ImageUploader category={CATEGORY} onUploadSuccess={fetchImages} />

      <h2 style={{ fontSize: "20px", marginBottom: "16px", marginTop: "40px" }}>
        Existing Photos
      </h2>

      {loading ? (
        <p>Loading gallery images...</p>
      ) : (
        <GalleryGrid images={images} onDeleteSuccess={fetchImages} />
      )}
    </div>
  );
}