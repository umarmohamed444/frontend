'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { Search, MapPin, UserCircle, ChevronDown, Check } from 'lucide-react';
import * as Slider from '@radix-ui/react-slider';
import CreateJobModal from './CreateJobModal';

// Custom Dropdown Component
function Dropdown({ icon: Icon, placeholder, options, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const selected = options.find(opt => opt.value === value);
    setSelectedLabel(selected ? selected.label : '');
  }, [value, options]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full pl-10 pr-10 py-2.5 text-left focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 rounded-lg transition-all bg-white hover:bg-gray-50"
      >
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#686868] w-5 h-5 pointer-events-none" />
        )}
        <span className={selectedLabel ? 'text-gray-900' : 'text-[#686868]'}>
          {selectedLabel || placeholder}
        </span>
        <ChevronDown
          className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-transform pointer-events-none ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 max-h-60 overflow-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className="w-full px-4 py-2.5 text-left hover:bg-purple-50 transition-colors flex items-center justify-between group"
            >
              <span className={`${value === option.value ? 'text-purple-600 font-medium' : 'text-gray-700'}`}>
                {option.label}
              </span>
              {value === option.value && (
                <Check className="w-4 h-4 text-purple-600" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false);
  const [salaryRange, setSalaryRange] = useState([50, 80]);
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');

  const locationOptions = [
    { value: '', label: 'Preferred Location' },
    { value: 'chennai', label: 'Chennai' },
    { value: 'bangalore', label: 'Bangalore' },
    { value: 'hyderabad', label: 'Hyderabad' },
    { value: 'mumbai', label: 'Mumbai' },
    { value: 'delhi', label: 'Delhi' },
  ];

  const jobTypeOptions = [
    { value: '', label: 'Job type' },
    { value: 'fulltime', label: 'Full Time' },
    { value: 'parttime', label: 'Part Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' },
  ];

  return (
    <header>
      <nav className="fixed top-0 left-0 right-0 bg-white z-40 shadow-sm py-4 px-6">
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

        {/* Create Job Modal */}
        <CreateJobModal 
          isOpen={isCreateJobOpen}
          onClose={() => setIsCreateJobOpen(false)}
        />

        {/* Search Section */}
        <div className="container mx-auto px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            {/* Search Input */}
            <div className="relative border-r-2 border-gray-200">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#686868] w-5 h-5" />
              <input
                type="text"
                placeholder="Search By Job Title, Role"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg focus:border-purple-600 focus:outline-none text-[#686868]"
              />
            </div>

            {/* Location Dropdown */}
            <div className="border-r-2 border-gray-200">
              <Dropdown
                icon={MapPin}
                placeholder="Preferred Location"
                options={locationOptions}
                value={location}
                onChange={setLocation}
              />
            </div>

            {/* Job Type Dropdown */}
            <div className="border-r-2 border-gray-200">
              <Dropdown
                icon={UserCircle}
                placeholder="Job type"
                options={jobTypeOptions}
                value={jobType}
                onChange={setJobType}
              />
            </div>
            
            {/* Salary Range Slider */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <label className="text-gray-800">Salary Per Month</label>
                <span className="font-semibold text-gray-800">
                  ₹{salaryRange[0]}k - ₹{salaryRange[1]}k
                </span>
              </div>
              <Slider.Root
                className="relative flex items-center select-none touch-none w-full h-5"
                value={salaryRange}
                onValueChange={setSalaryRange}
                min={50}
                max={100}
                step={1}
              >
                <Slider.Track className="bg-neutral-200 relative grow rounded-full h-1">
                  <Slider.Range className="absolute bg-black rounded-full h-full" />
                </Slider.Track>
                <Slider.Thumb className="block w-4 h-4 bg-black rounded-full cursor-grab focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  </div>
                </Slider.Thumb>
                <Slider.Thumb className="block w-4 h-4 bg-black rounded-full cursor-grab focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  </div>
                </Slider.Thumb>
              </Slider.Root>
            </div>
          </div>
        </div>
      </nav>
      <div className="h-36"></div>
    </header>
  );
}