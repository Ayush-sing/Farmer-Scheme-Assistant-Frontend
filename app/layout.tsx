import "./globals.css";

export const metadata = {
  title: "Farmer Scheme Assistant",
  description: "AI chatbot for government schemes with official sources",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
