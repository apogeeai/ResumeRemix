import { useState } from 'react';
import { TextArea } from '../components/TextArea';
import Layout from '../components/Layout';

export default function CoverLetterPage() {
  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [errors, setErrors] = useState({ resume: '', jobDescription: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleGenerate = async () => {
    setErrors({ resume: '', jobDescription: '' });
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

    setIsLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, jobDescription, type: 'cover-letter' }),
      });

      if (!response.ok) {
        const errorText = await response.text();
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
    <Layout>
      <div className="max-w-7xl mx-auto p-4 sm:p-8 space-y-8">
        <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
          Generate Cover Letter
        </h2>
        <div className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-8">
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
            onClick={handleGenerate}
            disabled={isLoading}
            className={`modern-button w-full sm:w-auto ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Processing...' : 'Generate Cover Letter'}
          </button>
        </div>
        {isLoading && (
          <div className="text-center mt-8 text-gray-700 dark:text-gray-300">
            Generating your cover letter...
          </div>
        )}
        {result && (
          <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Your Cover Letter
            </h2>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {result}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
} 