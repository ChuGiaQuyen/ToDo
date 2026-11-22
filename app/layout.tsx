import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Inkwell — a calm place for your tasks",
  description:
    "Inkwell is a calm, focused to-do app. Capture what's on your mind, make steady progress, and enjoy the small satisfaction of checking things off.",
  applicationName: "Inkwell",
};

// Set the theme before paint to avoid a flash of the wrong palette.
const themeScript = `
(function () {
  try {
    var stored = localStorage.getItem('inkwell-theme');
    var theme = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${sora.variable} ${inter.variable}`}>
        <div className="app-bg" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}