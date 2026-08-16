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
    serviceAccount = typeof rawKey === "string" ? JSON.parse(rawKey) : rawKey;
  } catch (parseError) {
    // Fallback for double-escaped strings or special characters on Vercel
    const sanitizedKey = rawKey.replace(/\\n/g, "\n");
    serviceAccount = JSON.parse(sanitizedKey);
  }

  if (serviceAccount.private_key) {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
  }

  const app = initializeApp({
    credential: cert(serviceAccount),
  });

  return getFirestore(app);
}

// Export dynamic getter function instead of evaluating globally at build time
export { getAdminDb };