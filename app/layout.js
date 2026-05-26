import "./globals.css";

export const metadata = {
  title: "Sam Track",
  description: "Track. Improve. Dominate."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-body text-slate-900 antialiased dark:text-slate-50">{children}</body>
    </html>
  );
}
