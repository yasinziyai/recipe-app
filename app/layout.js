import "./globals.css";
import localFont from "next/font/local";
const dana = localFont({
  src: [
    {
      path: "../public/DanaPro(10Wt)/Dana-family/Dana-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/DanaPro(10Wt)/Dana-family/Dana-ExtraBold.ttf",
      weight: "900",
      style: "normal",
    },
  ],
});
export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body className={dana.className}>{children}</body>
    </html>
  );
}