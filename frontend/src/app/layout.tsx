import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";
import ClientProvider from "@/components/providers/ClientProvider";
import ErrorBoundary from "@/components/ErrorBoundary";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dfoods - Pure Traditional Sweetness | Organic Jaggery",
  description: "Experience the authentic taste of traditional Indian jaggery with Dfoods. 40+ years of experience in organic jaggery production. Real jaggery, real taste!",
  keywords: "organic jaggery, traditional jaggery, pure jaggery, Indian jaggery, natural sweetener, farm fresh",
  openGraph: {
    title: "Dfoods - Pure Traditional Sweetness",
    description: "Experience the authentic taste of traditional Indian jaggery with Dfoods.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
        <script src="https://js.stripe.com/v3/"></script>
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-[#FDF6E3]`}
      >
        <ErrorBoundary>
          <ClientProvider>
            <Header />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
            <CartDrawer />
          </ClientProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}