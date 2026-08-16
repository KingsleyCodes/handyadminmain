import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Handy Uche Admin",
  description: "Not visible to the public",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 5000,
            style: {
              background: "#1f2937",
              color: "#fff",
              borderRadius: "8px",
              fontSize: "14px",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}