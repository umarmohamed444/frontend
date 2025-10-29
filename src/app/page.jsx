"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Search, MapPin, Briefcase, UserPlus, User, Layers } from 'lucide-react';
import CreateJobModal from '../components/CreateJobModal';

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

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/jobs');
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || 'Failed to fetch jobs');
        setJobs(data.jobs || []);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Failed to fetch jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleCreate = (createdJob) => {
    // Prepend created published job to list
    setJobs(prev => [createdJob, ...prev]);
  };

  return (
    <div>
      

      {loading && <div>Loading jobs...</div>}
      {error && <div className="text-red-600">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {jobs.map(job => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      <CreateJobModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onCreate={handleCreate} />
    </div>
  );
}