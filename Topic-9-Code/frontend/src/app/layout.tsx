import React from 'react';

export const metadata = {
  title: 'Topic 9: Full-Stack Integration',
  description: 'Next.js Frontend + Express Backend Authentication Integration',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', background: '#F3F4F6', color: '#1F2937', margin: 0, padding: '2rem' }}>
        {children}
      </body>
    </html>
  );
}
