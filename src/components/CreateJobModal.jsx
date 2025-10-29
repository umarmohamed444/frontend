'use client';
import { ChevronsDown, ChevronsRight, ChevronUp, ChevronDown, ChevronLeft, Calendar } from "lucide-react";
import { useState } from "react";

export default function CreateJobModal({ isOpen, onClose, onCreate }) {
  if (!isOpen) return null;

  // State for dropdowns and calendar
  const [jobTypeOpen, setJobTypeOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  
  // State for API calls and errors
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Controlled form fields
  const [title, setTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [selectedJobType, setSelectedJobType] = useState('Full Time');
  const [selectedLocation, setSelectedLocation] = useState('Chennai');
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [description, setDescription] = useState('');

  const locations = ["Chennai", "Bangalore", "Hyderabad", "Mumbai", "Delhi"];
  const jobTypes = ["Internship", "Full Time", "Part Time", "Contract"];

  const handleJobTypeSelect = (jobType) => {
    setSelectedJobType(jobType);
    setJobTypeOpen(false);
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setLocationOpen(false);
  };

  const handleDateSelect = (day) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newDate);
    setCalendarOpen(false);
  };

  const renderCalendar = () => {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];

    // Add empty divs for days before the start of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Render all days in the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = selectedDate &&
        day === selectedDate.getDate() &&
        month === selectedDate.getMonth() &&
        year === selectedDate.getFullYear();
        
      days.push(
        <div 
          key={day} 
          className={`p-2 text-center cursor-pointer rounded-full ${isSelected ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
          onClick={() => handleDateSelect(day)}
        >
          {day}
        </div>
      );
    }
    return days;
  };

  const changeMonth = (offset) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  };

  const resetForm = () => {
    setTitle('');
    setCompanyName('');
    setSelectedJobType('Full Time');
    setSelectedLocation('Chennai');
    setSelectedDate(null);
    setMinSalary('');
    setMaxSalary('');
    setDescription('');
    setError(null);
  };

  const handleSubmit = async (status) => {
    setError(null);
    setLoading(true);

    // Automatically generate the company logo URL using the Clearbit API
    const companyDomain = companyName ? `${companyName.toLowerCase().replace(/\s+/g, '')}.com` : null;
    const companyLogoUrl = companyDomain ? `https://logo.clearbit.com/${companyDomain}` : '';

    try {
      const payload = {
        companyName: companyName || 'Unknown Company',
        companyLogoUrl,
        title,
        location: selectedLocation,
        description,
        minExperience: 1, // Default value
        maxExperience: 3, // Default value
        minSalary: parseFloat(minSalary) || 0,
        maxSalary: parseFloat(maxSalary) || 0,
        jobType: selectedJobType.toUpperCase().replace(" ", "_"),
        workMode: 'ONSITE', // Default value
        applicationDeadline: selectedDate ? selectedDate.toISOString() : null,
        status,
      };

      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to create job');

      if (onCreate && data.job) {
        onCreate(data.job);
      }

      resetForm();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl w-full max-w-2xl min-h-[87%] p-6 m-3 overflow-y-auto">
        <div className="mb-4 text-center">
          <h2 className="text-2xl font-semibold">Create Job Opening</h2>
        </div>
        <form className="grid grid-cols-2 gap-x-6 gap-y-3" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label className="form-label">Job Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" className="form-input" placeholder="Full Stack Developer" />
          </div>
          <div className="form-group">
            <label className="form-label">Company Name</label>
            <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} type="text" className="form-input" placeholder="e.g., Google" />
          </div>
          
          {/* Custom Location Dropdown */}
          <div className="form-group relative">
            <label className="form-label">Location</label>
            <button 
              type="button" 
              className="form-input w-full text-left text-gray-700 flex justify-between items-center"
              onClick={() => setLocationOpen(!locationOpen)}
            >
              {selectedLocation || "Choose Location"}
              {locationOpen ? <ChevronUp className="w-5 h-5 text-black" /> : <ChevronDown className="w-5 h-5 text-black" />}
            </button>
            {locationOpen && (
              <ul className="absolute z-10 w-full bg-white border rounded-lg mt-1 shadow-lg">
                {locations.map((location) => (
                  <li key={location} className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleLocationSelect(location)}>
                    {location}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Custom Job Type Dropdown */}
          <div className="form-group relative">
            <label className="form-label">Job Type</label>
            <button 
              type="button" 
              className="form-input w-full text-left text-gray-700 flex justify-between items-center"
              onClick={() => setJobTypeOpen(!jobTypeOpen)}
            >
              {selectedJobType || "Select Job Type"}
              {jobTypeOpen ? <ChevronUp className="w-5 h-5 text-black" /> : <ChevronDown className="w-5 h-5 text-black" />}
            </button>
            {jobTypeOpen && (
              <ul className="absolute z-10 w-full bg-white border rounded-lg mt-1 shadow-lg">
                {jobTypes.map((jobType) => (
                  <li key={jobType} className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleJobTypeSelect(jobType)}>
                    {jobType}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Salary Range (LPA)</label>
            <div className="flex items-center space-x-2">
              <input value={minSalary} onChange={(e) => setMinSalary(e.target.value)} type="number" className="form-input" placeholder="e.g., 500000" />
              <input value={maxSalary} onChange={(e) => setMaxSalary(e.target.value)} type="number" className="form-input" placeholder="e.g., 1200000" />
            </div>
          </div>

          {/* Custom Calendar for Application Deadline */}
          <div className="form-group relative">
            <label className="form-label">Application Deadline</label>
            <button
              type="button"
              className="form-input w-full text-left text-gray-700 flex justify-between items-center"
              onClick={() => setCalendarOpen(!calendarOpen)}
            >
              <span className={!selectedDate ? 'text-gray-400' : ''}>
                {selectedDate ? selectedDate.toLocaleDateString() : "Select a Date"}
              </span>
              <Calendar className="w-5 h-5 text-black" />
            </button>
            {calendarOpen && (
              <div className="absolute z-20 w-full bg-white border rounded-lg mt-1 shadow-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <button type="button" onClick={() => changeMonth(-1)}><ChevronLeft className="w-5 h-5" /></button>
                  <div className="font-semibold">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</div>
                  <button type="button" onClick={() => changeMonth(1)}><ChevronsRight className="w-5 h-5" /></button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-500">
                  <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
                </div>
                <div className="grid grid-cols-7 gap-1 mt-2 text-sm">
                  {renderCalendar()}
                </div>
              </div>
            )}
          </div>
          
          <div className="form-group col-span-2">
            <label className="form-label">Job Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea"
              placeholder="Let candidates know more about the role..."
              rows={4}
            />
          </div>
        </form>

        {error && <div className="text-red-600 mt-4 text-center">{error}</div>}

        <div className="flex justify-between items-center mt-6">
            <button type="button" disabled={loading} onClick={() => handleSubmit('DRAFT')} className="border-2 border-gray-300 rounded-lg px-5 py-3 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50">
              {loading ? 'Saving...' : 'Save Draft'}
            </button>
            <button type="button" disabled={loading} onClick={() => handleSubmit('PUBLISHED')} className="publish-btn bg-blue-600 text-white rounded-lg px-5 py-3 font-medium hover:bg-blue-700 flex items-center disabled:opacity-50">
              {loading ? 'Publishing...' : 'Publish'} <ChevronsRight className="inline-block w-5 h-5 ml-1" />
            </button>
          </div>
      </div>
    </div>
  );
}