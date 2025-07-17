import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { CartProvider } from "@/context/cart-context";
import { WishlistProvider } from "@/context/wishlist-context";
import { ComparisonProvider } from "@/context/comparison-context";
import { AuthProvider } from "@/context/auth-context";
import { VariantsProvider } from "@/context/variants-context";
import { ToastProvider, ToastViewport } from "@/components/ui/toast";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  weight: "variable",
  style: "normal",
});

export const metadata: Metadata = {
  title: "ShopEase - Your One-Stop Shopping Destination",
  description: "Discover amazing deals and products at ShopEase",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} antialiased`}>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <ComparisonProvider>
                <VariantsProvider>
                  <Header />
                  <main className="min-h-screen flex-1">{children}</main>
                  <Footer />
                  <ToastProvider>
                    <ToastViewport />
                  </ToastProvider>
                </VariantsProvider>
              </ComparisonProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
