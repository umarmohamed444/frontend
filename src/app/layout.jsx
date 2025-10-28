import { Inter } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'CyberMinds - Job Portal',
  description: 'Find your next tech job or hire great talent',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="fixed top-0 left-0 right-0 bg-white z-40 shadow-sm">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-8">
                <Image 
                  src="/images/logo.svg" 
                  alt="CyberMinds" 
                  className="logo"
                  width={40}
                  height={40}
                  priority
                />
                <div className="flex items-center space-x-6">
                  <Link href="/" className="nav-link">Home</Link>
                  <Link href="/jobs" className="nav-link">Find Jobs</Link>
                  <Link href="/talents" className="nav-link">Find Talents</Link>
                  <Link href="/about" className="nav-link">About us</Link>
                  <Link href="/testimonials" className="nav-link">Testimonials</Link>
                </div>
              </div>
              <button className="create-job-btn">Create Jobs</button>
            </div>
          </div>
        </nav>
        <main className="container mx-auto px-4 pt-20">
          {children}
        </main>
      </body>
    </html>
  );
}