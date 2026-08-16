import { NextResponse } from "next/server";

import cloudinary from "@/app/lib/cloudinary";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const category = formData.get("category"); // 'interior-design', 'real-estate', etc.

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!category) {
      return NextResponse.json({ error: "Category is required" }, { status: 400 });
    }

    // Convert file buffer to base64 for Cloudinary
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64File = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Upload to Cloudinary under a specific folder per category
    const uploadResult = await cloudinary.uploader.upload(base64File, {
      folder: `company_website/${category}`,
    });

    return NextResponse.json({
      success: true,
      imageUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
  }
}