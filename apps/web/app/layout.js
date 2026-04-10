import "./globals.css";

export const metadata = {
  title: "EKO-ELSA - 인천서부지사",
  description: "인천서부지사 탄소중립 실천 앱",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#16a34a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className="bg-gray-100 flex justify-center items-center min-h-screen font-sans text-gray-800 antialiased">
        {children}
      </body>
    </html>
  );
}
