'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import CreateJobModal from './CreateJobModal';


export default function Header() {
  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false);

  return (
    <header className="sticky top-0 bg-white  z-40 ">
      <nav className="py-2 px-6">
        <div className="container flex items-center justify-between mx-auto max-w-5xl rounded-full border border-[#fcfcfc] shadow-sm px-8 py-6">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo.png"
              alt="CyberMinds"
              width={40}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Navigation Links */}
          <Link 
            href="/" 
            className="text-[#303030] hover:text-purple-600 font-medium cursor-pointer"
          >
            Home
          </Link>
          <Link 
            href="/jobs" 
            className="text-[#303030] hover:text-purple-600 font-medium cursor-pointer"
          >
            Find Jobs
          </Link>
          <Link 
            href="/talents" 
            className="text-[#303030] hover:text-purple-600 font-medium cursor-pointer"
          >
            Find Talents
          </Link>
          <Link 
            href="/about" 
            className="text-[#303030] hover:text-purple-600 font-medium cursor-pointer"
          >
            About us
          </Link>
          <Link 
            href="/testimonials" 
            className="text-[#303030] hover:text-purple-600 font-medium cursor-pointer"
          >
            Testimonials
          </Link>

          {/* Create Job Button */}
          <button
            onClick={() => setIsCreateJobOpen(true)}
            className="bg-gradient-to-t from-[#6100AD] to-[#A124FF] text-white px-6 py-2 rounded-full font-medium hover:opacity-90 transition-opacity cursor-pointer"
          >
            Create Jobs
          </button>
        </div>
      </nav>

      {/* Create Job Modal */}
      {/* Note: The onJobCreated prop name is updated for clarity */}
      <CreateJobModal 
        isOpen={isCreateJobOpen}
        onClose={() => setIsCreateJobOpen(false)}
        onJobCreated={() => {
          // You can trigger a refetch here if needed, but it's handled on the main page now
          // For now, we just close the modal.
          setIsCreateJobOpen(false);
        }}
      />
    </header>
  );
}