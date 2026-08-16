"use client";
import { useState } from "react";
import toast from "react-hot-toast";

export default function GalleryGrid({ images, onDeleteSuccess }) {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    if (
      !confirm(
        "Are you sure you want to delete this photo from your gallery?"
      )
    ) {
      return;
    }

    setDeletingId(id);
    const toastId = toast.loading("Removing image from gallery...");

    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete image");
      }

      // Deletion Success Toast
      toast.success(
        <div>
          <p style={{ margin: "0 0 4px 0", fontWeight: "bold" }}>
            Image Removed 🗑️
          </p>
          <p style={{ margin: 0, fontSize: "13px", color: "#d1d5db" }}>
            The photo has been removed from your gallery and public website.
          </p>
        </div>,
        { id: toastId, duration: 5000 }
      );

      if (onDeleteSuccess) onDeleteSuccess();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Deletion failed.", { id: toastId });
    } finally {
      setDeletingId(null);
    }
  };

  if (!images || images.length === 0) {
    return (
      <p style={{ color: "#666" }}>
        No images uploaded yet for this gallery category.
      </p>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: "20px",
      }}
    >
      {images.map((img) => (
        <div
          key={img.id}
          style={{
            border: "1px solid #eaeaea",
            borderRadius: "8px",
            overflow: "hidden",
            backgroundColor: "#fff",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              height: "180px",
              width: "100%",
              overflow: "hidden",
              backgroundColor: "#f0f0f0",
            }}
          >
            <img
              src={img.imageUrl}
              alt={img.title || "Gallery Image"}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div style={{ padding: "12px" }}>
            <h4
              style={{
                margin: "0 0 8px 0",
                fontSize: "16px",
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              {img.title || "Untitled Image"}
            </h4>
            <p
              style={{
                margin: "0 0 12px 0",
                fontSize: "12px",
                color: "#888",
              }}
            >
              Added: {new Date(img.createdAt).toLocaleDateString()}
            </p>
            <button
              onClick={() => handleDelete(img.id)}
              disabled={deletingId === img.id}
              style={{
                width: "100%",
                padding: "8px",
                backgroundColor: deletingId === img.id ? "#ccc" : "#e53e3e",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: deletingId === img.id ? "not-allowed" : "pointer",
                fontWeight: "bold",
              }}
            >
              {deletingId === img.id ? "Deleting..." : "Delete Image"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}