import { useState } from 'react';
import { TextArea } from '../components/TextArea';
import { ThemeToggle } from '../components/ThemeToggle';

export default function Home() {
  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  const handleMatch = () => {
    // Here you would implement the matching logic
    const keywords = jobDescription.toLowerCase().split(' ');
    const resumeText = resume.toLowerCase();
    const matches = keywords.filter(word => resumeText.includes(word));
    alert(`Found ${matches.length} matching keywords!`);
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
      </div>
    </div>
  );
}