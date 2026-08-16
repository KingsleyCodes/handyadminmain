// app/lib/firebaseAdmin.js
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function getAdminApp() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (!serviceAccount) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY is missing in environment variables.");
  }

  // Parse JSON and fix escaped newline characters in private_key
  const parsedKey = typeof serviceAccount === "string" 
    ? JSON.parse(serviceAccount) 
    : serviceAccount;

  if (parsedKey.private_key) {
    parsedKey.private_key = parsedKey.private_key.replace(/\\n/g, "\n");
  }

  return initializeApp({
    credential: cert(parsedKey),
  });
}

const adminApp = getAdminApp();
export const adminDb = getFirestore(adminApp);