import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';

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
      <body className="bg-[#FCFCFC] min-h-screen">
        <Header />
        <main className="container mx-auto max-w-8xl px-15 pt-20">
          {children}
        </main>
      </body>
    </html>
  );
}