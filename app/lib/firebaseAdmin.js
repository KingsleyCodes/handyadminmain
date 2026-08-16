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
      "FIREBASE_SERVICE_ACCOUNT_KEY is missing in environment variables."
    );
  }

  let serviceAccount;

  try {
    // 1. Try decoding as Base64 first
    const decodedKey = Buffer.from(rawKey, "base64").toString("utf8");
    serviceAccount = JSON.parse(decodedKey);
  } catch {
    try {
      // 2. Fallback to direct JSON parse if not Base64
      serviceAccount = typeof rawKey === "string" ? JSON.parse(rawKey) : rawKey;
    } catch {
      // 3. Fallback for raw strings with escaped newlines
      const sanitizedKey = rawKey.replace(/\\n/g, "\n");
      serviceAccount = JSON.parse(sanitizedKey);
    }
  }

  if (serviceAccount.private_key) {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
  }

  const app = initializeApp({
    credential: cert(serviceAccount),
  });

  return getFirestore(app);
}

export { getAdminDb };