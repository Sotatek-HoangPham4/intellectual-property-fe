"use client";

import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { persistor, store } from "@/store";
import { PersistGate } from "redux-persist/integration/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.variable} suppressHydrationWarning>
      <body className="font-sans">
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Toaster
              position="top-center"
              reverseOrder={false}
              toastOptions={{
                duration: 1000,
                style: {
                  fontSize: 13,
                  background: "#222",
                  color: "#fff",
                  borderRadius: "10px",
                  padding: "8px 16px",
                },
              }}
            />
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
