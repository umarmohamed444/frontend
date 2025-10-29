"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Search, MapPin, Briefcase, UserPlus, User, Layers, UserCircle, ChevronDown, Check } from 'lucide-react';
import CreateJobModal from '../components/CreateJobModal';
import * as Slider from '@radix-ui/react-slider';


// A simple debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

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

// Job Card Component
const JobCard = ({ job }) => {
  const descriptionText = job.description || '';
  const descriptionPoints = descriptionText
    .split('.')
    .map(sentence => sentence.trim())
    .filter(sentence => sentence.length > 0);

  // Support both sample data shape and API shape
  const companyLogo = job.company?.logoUrl || job.companyLogo || '/images/amazon.png';
  const companyName = job.company?.name || job.companyName || 'Company';
  const formatPostedTime = (date) => {
  const diffMs = Date.now() - new Date(date).getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHrs / 24);

  if (diffHrs < 1) return 'Just now';
  if (diffHrs < 24) return `${diffHrs}h ago`;
  return `${diffDays}d ago`;
};

const postedTime = job.postedAt
  ? formatPostedTime(job.postedAt)
  : job.postedTime || '';

  const experience = job.minExperience && job.maxExperience ? `${job.minExperience}-${job.maxExperience} yr Exp` : job.experience || '';
  // const salary = job.minSalary && job.maxSalary ? `${formatSalary(job.minSalary)} - ${formatSalary(job.maxSalary)}LPA` : job.salary || '';
  const salary = job.maxSalary
  ? `${formatSalary(job.maxSalary)} LPA`
  : job.salary || '';

  return (
    <div className="job-card min-h-[420px] flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
  <div className='bg-gray-100 p-2 rounded-lg'>
          <Image 
            src={companyLogo}
            alt={companyName}
            className="company-logo"
            width={50}
            height={50}
          />
        </div>
        <span className="time-badge">{postedTime}</span>
      </div>
      <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
      <div className="flex items-center justify-between  mb-3">
        <span className="job-info-badge"><UserPlus size={16} />{experience}</span>
        <span className="job-info-badge">
          <Briefcase size={16} />
          {job.workMode}
        </span>
        <span className="job-info-badge"><Layers size={16} />{salary}</span>
      </div>
      <ul className="text-gray-600 text-sm mt-2 mb-4 space-y-2">
        {descriptionPoints.slice(0, 3).map((point, index) => (
          <li key={index} className="flex gap-2 leading-relaxed">
            <span className="text-gray-400 mt-1.5">•</span>
            <span className="flex-1">{point}</span>
          </li>
        ))}
      </ul>

      <button className="apply-btn">Apply Now</button>
    </div>
  );
}

function formatSalary(value) {
  if (!value && value !== 0) return '';
  // show rounded LPA if value is in absolute rupees
  if (value >= 100000) return `${Math.round(value / 100000)}`;
  return `₹${value}`;
}


// Main Page Component
export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Filter states
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [salaryRange, setSalaryRange] = useState([0, 100]); // Represents 0k to 100k

  // Debounce title search to avoid excessive API calls
  const debouncedTitle = useDebounce(title, 500);

  const locationOptions = [
    { value: '', label: 'All Locations' },
    { value: 'chennai', label: 'Chennai' },
    { value: 'bangalore', label: 'Bangalore' },
    { value: 'hyderabad', label: 'Hyderabad' },
    { value: 'mumbai', label: 'Mumbai' },
    { value: 'delhi', label: 'Delhi' },
  ];

  const jobTypeOptions = [
    { value: '', label: 'All Job Types' },
    { value: 'full time', label: 'Full Time' },
    { value: 'part time', label: 'Part Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' },
  ];

  // Memoize fetchJobs to prevent re-creation on every render
  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (debouncedTitle) params.append('title', debouncedTitle);
      if (location) params.append('location', location);
      if (jobType) params.append('jobType', jobType);
      
      // Convert salary from [0, 100] k to actual values
      if (salaryRange[0] > 0) params.append('minSalary', salaryRange[0] * 1000); // e.g., 50k -> 50000
      if (salaryRange[1] < 100) params.append('maxSalary', salaryRange[1] * 100000); // e.g., 80 -> 8000000

      const res = await fetch(`/api/jobs?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data?.error || 'Failed to fetch jobs');
      setJobs(data.jobs || []);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  }, [debouncedTitle, location, jobType, salaryRange]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return (
    <div className='max-w-8xl'>
      {/* Search Section moved from Header to here */}
      <div className="container  px-16 py-4 bg-white border-b-[#fcfcfc] shadow-md max-w-8xl -mt-12 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Search Input */}
          <div className="relative md:border-r-2 md:border-gray-200">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#686868] w-5 h-5" />
            <input
              type="text"
              placeholder="Search By Job Title, Role"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg focus:border-purple-600 focus:outline-none text-[#686868]"
            />
          </div>

          {/* Location Dropdown */}
          <div className="md:border-r-2 md:border-gray-200">
            <Dropdown
              icon={MapPin}
              placeholder="Preferred Location"
              options={locationOptions}
              value={location}
              onChange={setLocation}
            />
          </div>

          {/* Job Type Dropdown */}
          <div className="md:border-r-2 md:border-gray-200">
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
              <label className="text-gray-800">Salary Per Annum</label>
              <span className="font-semibold text-gray-800">
                {salaryRange[0]}L - {salaryRange[1]}L
              </span>
            </div>
            <Slider.Root
              className="relative flex items-center select-none touch-none w-full h-5"
              value={salaryRange}
              onValueChange={setSalaryRange}
              min={0}
              max={100}
              step={1}
            >
              <Slider.Track className="bg-neutral-200 relative grow rounded-full h-1">
                <Slider.Range className="absolute bg-black rounded-full h-full" />
              </Slider.Track>
              <Slider.Thumb className="block w-4 h-4 bg-black rounded-full cursor-grab focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2" />
              <Slider.Thumb className="block w-4 h-4 bg-black rounded-full cursor-grab focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2" />
            </Slider.Root>
          </div>
        </div>
      </div>
      
      {loading && <div className="text-center py-10">Loading jobs...</div>}
      {error && <div className="text-red-600 text-center py-10">{error}</div>}

      {!loading && !error && jobs.length === 0 && (
        <div className="text-center py-10 text-gray-500">No jobs found. Try adjusting your filters.</div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {jobs.map(job => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
      
      {/* Pass fetchJobs to the modal to trigger a refetch on creation */}
      <CreateJobModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onJobCreated={fetchJobs} />
    </div>
  );
}