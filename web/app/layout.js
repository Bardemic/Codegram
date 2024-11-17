"use client";

import localFont from "next/font/local";
import { current, call } from "@/lib/ws";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// export const metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      if (
        !current.user &&
        localStorage.getItem("username") &&
        localStorage.getItem("passwordHash")
      ) {
        const data = await call("login", {
          username: localStorage.getItem("username"),
          passwordHash: localStorage.getItem("passwordHash"),
        });
        current.user = data.user;
        console.info("logged in from local storage");
      }
    })();
  }, [router.events]);
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} dark`}>
        {children}
      </body>
    </html>
  );
}
