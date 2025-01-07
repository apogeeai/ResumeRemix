import { useState } from 'react';
import { TextArea } from '../components/TextArea';
import Layout from '../components/Layout';

export default function ResumePage() {
  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [errors, setErrors] = useState({ resume: '', jobDescription: '' });
  const [isResumeLoading, setIsResumeLoading] = useState(false);
  const [isCoverLetterLoading, setIsCoverLetterLoading] = useState(false);
  const [resumeResult, setResumeResult] = useState('');
  const [coverLetterResult, setCoverLetterResult] = useState('');

  const handleMatch = async () => {
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

    setIsResumeLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, jobDescription, type: 'resume' }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${errorText}`);
      }

      const data = await response.json();
      setResumeResult(data.result);
    } catch (error: any) {
      console.error('Error:', error);
      setErrors({ resume: error.message, jobDescription: error.message });
    } finally {
      setIsResumeLoading(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
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

    setIsCoverLetterLoading(true);
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
      setCoverLetterResult(data.result);
    } catch (error: any) {
      console.error('Error:', error);
      setErrors({ resume: error.message, jobDescription: error.message });
    } finally {
      setIsCoverLetterLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto p-4 sm:p-8 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-500 to-indigo-600 text-transparent bg-clip-text">
              Transform Your Resume
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Optimize your resume and generate a matching cover letter using AI
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <div className="space-y-6">
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
            
            <div className="space-y-6">
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
          
          <div className="flex justify-center gap-6">
            <button
              onClick={handleMatch}
              disabled={isResumeLoading}
              className={`px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300 transform
                ${isResumeLoading 
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-105 hover:shadow-lg active:scale-95'
                }`}
            >
              <span className="flex items-center gap-2">
                {isResumeLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </>
                ) : 'Match Resume'}
              </span>
            </button>
            <button
              onClick={handleGenerateCoverLetter}
              disabled={isCoverLetterLoading}
              className={`px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300 transform
                ${isCoverLetterLoading 
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 hover:shadow-lg active:scale-95'
                }`}
            >
              <span className="flex items-center gap-2">
                {isCoverLetterLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </>
                ) : 'Generate Cover Letter'}
              </span>
            </button>
          </div>

          <div className="space-y-8">
            {resumeResult && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transform transition-all duration-500 hover:shadow-2xl">
                <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                  Optimized Resume Suggestions
                </h2>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {resumeResult}
                  </p>
                </div>
              </div>
            )}
            
            {coverLetterResult && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transform transition-all duration-500 hover:shadow-2xl">
                <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                  Your Cover Letter
                </h2>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {coverLetterResult}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
} 