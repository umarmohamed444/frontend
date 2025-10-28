'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Search, MapPin, Briefcase } from 'lucide-react';

// Job Card Component
const JobCard = ({ job }) => (
  <div className="job-card">
    <div className="flex justify-between items-start mb-4">
      <Image 
        src={job.companyLogo} 
        alt={job.companyName} 
        className="company-logo"
        width={48}
        height={48}
      />
      <span className="time-badge">{job.postedTime}</span>
    </div>
    <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
    <div className="flex flex-wrap gap-4 mb-3">
      <span className="job-info-badge">
        <MapPin size={16} />
        {job.location}
      </span>
      <span className="job-info-badge">
        <Briefcase size={16} />
        {job.workMode}
      </span>
      <span className="job-info-badge">{job.experience}</span>
      <span className="job-info-badge">{job.salary}</span>
    </div>
    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
      {job.description}
    </p>
    <button className="apply-btn">Apply Now</button>
  </div>
);

// Search Filters Component
const SearchFilters = () => (
  <div className="search-container grid grid-cols-4 gap-4">
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder="Search By Job Title, Role"
        className="search-input"
      />
    </div>
    <div className="relative">
      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <select className="location-select">
        <option value="">Preferred Location</option>
        <option value="chennai">Chennai</option>
        <option value="bangalore">Bangalore</option>
        <option value="hyderabad">Hyderabad</option>
      </select>
    </div>
    <div className="relative">
      <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <select className="job-type-select">
        <option value="">Job type</option>
        <option value="fulltime">Full Time</option>
        <option value="parttime">Part Time</option>
        <option value="contract">Contract</option>
        <option value="internship">Internship</option>
      </select>
    </div>
    <div>
      <label className="salary-range-label">Salary Per Month</label>
      <div className="flex items-center space-x-2">
        <input type="text" placeholder="₹50k" className="form-input w-24" />
        <span>-</span>
        <input type="text" placeholder="₹80k" className="form-input w-24" />
      </div>
    </div>
  </div>
);

// Create Job Modal Component
const CreateJobModal = ({ onClose }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Create Job Opening</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <form className="grid grid-cols-2 gap-4" onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <label className="form-label">Job Title</label>
          <input type="text" className="form-input" placeholder="Full Stack Developer" />
        </div>
        <div className="form-group">
          <label className="form-label">Company Name</label>
          <input type="text" className="form-input" placeholder="Amazon" />
        </div>
        <div className="form-group">
          <label className="form-label">Location</label>
          <select className="form-select">
            <option value="">Select Location</option>
            <option value="chennai">Chennai</option>
            <option value="bangalore">Bangalore</option>
            <option value="hyderabad">Hyderabad</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Job Type</label>
          <select className="form-select">
            <option value="">Select Job Type</option>
            <option value="fulltime">Full Time</option>
            <option value="parttime">Part Time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
        </div>
        <div className="form-group col-span-2">
          <label className="form-label">Salary Range</label>
          <div className="flex items-center space-x-4">
            <input type="text" className="form-input" placeholder="₹0" />
            <span>to</span>
            <input type="text" className="form-input" placeholder="₹12,00,000" />
          </div>
        </div>
        <div className="form-group col-span-2">
          <label className="form-label">Job Description</label>
          <textarea 
            className="form-textarea"
            placeholder="Please share a description to let the candidate know"
          />
        </div>
        <div className="col-span-2 flex justify-end space-x-4 mt-4">
          <button type="button" className="draft-btn">
            Save Draft ↓
          </button>
          <button type="submit" className="publish-btn">
            Publish »
          </button>
        </div>
      </form>
    </div>
  </div>
);

// Sample job data
const SAMPLE_JOBS = [
  {
    id: 1,
    companyLogo: '/images/amazon-logo.png',
    companyName: 'Amazon',
    title: 'Full Stack Developer',
    location: 'Chennai',
    workMode: 'Onsite',
    experience: '1-3 yr Exp',
    salary: '12LPA',
    postedTime: '24h Ago',
    description: 'A user-friendly interface lets you browse stunning photos and videos. Filter destinations based on interests and travel style, and create personalized...'
  },
  // Add more sample jobs as needed
];

// Main Page Component
export default function Home() {
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [jobs, setJobs] = useState(SAMPLE_JOBS);

  return (
    <>
      <SearchFilters />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {jobs.map(job => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      {showCreateJob && (
        <CreateJobModal onClose={() => setShowCreateJob(false)} />
      )}
    </>
  );
}