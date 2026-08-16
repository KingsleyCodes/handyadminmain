import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";

import cloudinary from "@/app/lib/cloudinary";
import { doc, getDoc, deleteDoc } from "firebase/firestore";

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Image ID is required" }, { status: 400 });
    }

    // 1. Fetch record from Firestore to get publicId
    const docRef = doc(db, "galleries", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ error: "Image record not found" }, { status: 404 });
    }

    const { publicId } = docSnap.data();

    // 2. Delete asset from Cloudinary
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }

    // 3. Delete document from Firestore
    await deleteDoc(docRef);

    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}