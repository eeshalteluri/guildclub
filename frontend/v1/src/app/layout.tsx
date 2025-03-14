import type { Metadata } from "next";
import { Poppins } from "next/font/google"
import "./globals.css";
import { Toaster } from "react-hot-toast";


const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "CheckChe",
  description: "Be accountable at what you do",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
          <div className="h-full">
            {children}
          </div>
        <Toaster />
      </body>
    </html>
  );
}
