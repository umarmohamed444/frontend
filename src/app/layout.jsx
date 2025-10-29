import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import { Toaster } from 'sonner';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata = {
  title: 'CyberMinds - Job Portal',
  description: 'Find your next tech job or hire great talent',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="min-h-screen">
        <Toaster richColors position="top-center" />
        <Header />
        <main className="container pt-10 bg-white ">
          {children}
        </main>
      </body>
    </html>
  );
}