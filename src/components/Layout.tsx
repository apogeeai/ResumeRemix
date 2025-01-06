import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="h-[70px] glass-panel sticky top-0 z-50 flex items-center justify-between px-6 mx-4 mt-4">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            <Link href="/">
              Resume<span className="text-blue-600">Remix</span>
            </Link>
          </h1>
          <nav className="flex gap-6">
            <Link href="/resume" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Resume
            </Link>
            <Link href="/cover-letter" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Cover Letter
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Login
          </button>
        </div>
      </header>
      <main className="max-w-site mx-auto">
        {children}
      </main>
    </div>
  );
} 