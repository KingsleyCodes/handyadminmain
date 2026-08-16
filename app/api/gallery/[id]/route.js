import { NextResponse } from "next/server";
import { getAdminDb } from "@/app/lib/firebaseAdmin";
import cloudinary from "@/app/lib/cloudinary";

// Prevent static pre-rendering on Vercel
export const dynamic = "force-dynamic";

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Image ID is required" },
        { status: 400 }
      );
    }

    const adminDb = getAdminDb();
    const docRef = adminDb.collection("galleries").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json(
        { error: "Image record not found" },
        { status: 404 }
      );
    }

    const { publicId } = docSnap.data();

    // 1. Delete asset from Cloudinary if publicId exists
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudErr) {
        console.error("Cloudinary deletion error:", cloudErr);
      }
    }

    // 2. Delete document from Firestore via Admin SDK
    await docRef.delete();

    return NextResponse.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete image" },
      { status: 500 }
    );
  }
}