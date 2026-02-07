import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";
import { neobrutalism } from "@clerk/themes";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "Servd - AI Recipe Platform",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={{ baseTheme: neobrutalism }}>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.variable} font-sans antialiased`}>
          {/* Header */}
          <Header />

          {/* Main content */}
          <main className="min-h-screen">{children}</main>

          {/* Footer */}
          <footer className="py-8 px-4 border-t">
            <div className="max-w-6xl mx-auto flex justify-center items-center">
              <p className="text-stone-500 text-sm">Made by AJIL</p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
