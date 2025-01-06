import Layout from '../components/Layout';
import Link from 'next/link';

export default function Home() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-4 sm:p-8 space-y-12">
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
            Welcome to ResumeRemix
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Your AI-powered career companion for crafting perfect resumes and cover letters
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-8 mt-12">
          <Link href="/resume" className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Resume Optimization
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Transform your resume with AI-powered suggestions tailored to specific job descriptions.
            </p>
          </Link>

          <Link href="/cover-letter" className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Cover Letter Generator
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Generate personalized cover letters that highlight your experience and match job requirements.
            </p>
          </Link>
        </div>
      </div>
    </Layout>
  );
}