import { useState } from 'react';
import { TextArea } from '../components/TextArea';
import { ThemeToggle } from '../components/ThemeToggle';

export default function Home() {
  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [errors, setErrors] = useState({ resume: '', jobDescription: '' });

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleMatch = async () => {
    // Reset errors
    setErrors({ resume: '', jobDescription: '' });
    
    // Validate inputs
    let hasErrors = false;
    if (!resume.trim()) {
      setErrors(prev => ({ ...prev, resume: 'Resume is required' }));
      hasErrors = true;
    }
    if (!jobDescription.trim()) {
      setErrors(prev => ({ ...prev, jobDescription: 'Job description is required' }));
      hasErrors = true;
    }

    if (hasErrors) return;

    console.log('Sending data:', { resume, jobDescription });

    setIsLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, jobDescription }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error response:', errorText);
        throw new Error(`Server error: ${errorText}`);
      }

      const data = await response.json();
      setResult(data.result);
    } catch (error: any) {
      console.error('Error:', error);
      setErrors({ resume: error.message, jobDescription: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="h-[50px] bg-white dark:bg-gray-800 shadow-md flex items-center justify-between px-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Resume<span className="text-blue-600">Remix</span>
        </h1>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Login
          </button>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto p-4 sm:p-8">
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8">
          <div className="w-full">
            <TextArea
              label="Your Resume"
              value={resume}
              onChange={(value) => {
                setResume(value);
                setErrors(prev => ({ ...prev, resume: '' }));
              }}
              placeholder="Paste your resume here..."
            />
            {errors.resume && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.resume}
              </p>
            )}
          </div>
          
          <div className="w-full">
            <TextArea
              label="Job Description"
              value={jobDescription}
              onChange={(value) => {
                setJobDescription(value);
                setErrors(prev => ({ ...prev, jobDescription: '' }));
              }}
              placeholder="Paste the job description here..."
            />
            {errors.jobDescription && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.jobDescription}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex justify-center mt-8">
          <button
            onClick={handleMatch}
            disabled={isLoading}
            className={`w-full sm:w-auto px-4 sm:px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg
                     transition-colors duration-200 font-semibold ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Processing...' : 'Match Resume'}
          </button>
        </div>
        {isLoading && (
          <div className="text-center mt-8 text-gray-700 dark:text-gray-300">
            Generating hybrid description...
          </div>
        )}
        {result && (
          <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Hybrid Job Description
            </h2>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {result}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}