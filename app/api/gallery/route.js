// app/api/gallery/route.js
import { NextResponse } from "next/server";
import { adminDb } from "@/app/lib/firebaseAdmin";

// GET: Retrieve images (Filter by category if provided in URL query)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    let queryRef = adminDb.collection("galleries");

    if (category) {
      queryRef = queryRef.where("category", "==", category);
    }

    const snapshot = await queryRef.get();
    let images = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Sort in JavaScript to avoid requiring a manual Firestore composite index
    images.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return NextResponse.json({ success: true, data: images });
  } catch (error) {
    console.error("Firestore fetch error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch images" },
      { status: 500 }
    );
  }
}

// POST: Save metadata to Firestore after successful upload
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, imageUrl, publicId, category } = body;

    if (!imageUrl || !publicId || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const docRef = await adminDb.collection("galleries").add({
      title: title || "",
      imageUrl,
      publicId,
      category,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error) {
    console.error("Firestore write detailed error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save record to Firestore" },
      { status: 500 }
    );
  }
}