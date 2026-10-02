import { Geist, Geist_Mono } from "next/font/google";
import "izitoast/dist/css/iziToast.min.css";
import "overlayscrollbars/overlayscrollbars.css";
import "./globals.css";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import GlobalScrollbar from "@/components/globalScrollbar/globalScrollbar";
import AuthProvider from "@/components/AuthProvider/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <GlobalScrollbar>
          <TanStackProvider>
            <AuthProvider>{children}</AuthProvider>
          </TanStackProvider>
        </GlobalScrollbar>
      </body>
    </html>
  );
}
