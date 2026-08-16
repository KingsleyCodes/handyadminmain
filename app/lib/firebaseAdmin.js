// app/lib/firebaseAdmin.js
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function getAdminDb() {
  if (getApps().length > 0) {
    return getFirestore(getApps()[0]);
  }

  const rawKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (!rawKey) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT_KEY environment variable is missing on Vercel."
    );
  }

  let serviceAccount;

  try {
    let jsonString = rawKey.trim();

    // If the key is Base64 encoded, decode it to UTF-8 text first
    if (!jsonString.startsWith("{")) {
      jsonString = Buffer.from(jsonString, "base64").toString("utf8");
    }

    serviceAccount = JSON.parse(jsonString);
  } catch (error) {
    console.error("Firebase Service Account parsing error:", error);
    throw new Error(`Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY: ${error.message}`);
  }

  // Ensure internal private_key format replaces escaped newlines
  if (serviceAccount.private_key) {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
  }

  const app = initializeApp({
    credential: cert(serviceAccount),
  });

  return getFirestore(app);
}

export { getAdminDb };