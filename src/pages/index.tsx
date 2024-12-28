import { useState } from 'react';
import { TextArea } from '../components/TextArea';
import { ThemeToggle } from '../components/ThemeToggle';

export default function Home() {
  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleMatch = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, jobDescription }),
      });
      
      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      console.error('Error:', error);
      const errorData = await response.json();
      alert(`Error: ${errorData.details || errorData.error}`);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <ThemeToggle />
      
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          Resume<span className="text-blue-600">Remix</span>
        </h1>
        
        <div className="flex justify-center gap-8">
          <TextArea
            label="Your Resume"
            value={resume}
            onChange={setResume}
            placeholder="Paste your resume here..."
          />
          
          <TextArea
            label="Job Description"
            value={jobDescription}
            onChange={setJobDescription}
            placeholder="Paste the job description here..."
          />
        </div>
        
        <div className="flex justify-center mt-8">
          <button
            onClick={handleMatch}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg
                     transition-colors duration-200 font-semibold"
          >
            Match Resume
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