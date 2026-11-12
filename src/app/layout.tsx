import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bài tập của tôi | IELTS Master E-Learning',
  description: 'Hệ thống quản lý và theo dõi bài tập học viên - IELTS Master',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="antialiased selection:bg-brand-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}

