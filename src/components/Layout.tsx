import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import Head from 'next/head';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-white to-gray-50 dark:from-[#333333] dark:via-[#343434] dark:to-[#3a3a3a] transition-colors duration-300">
      <Head>
        <title>Resume Remix</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#121212" />
      </Head>

      {/* Grid overlay */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDE1IEwgNjAgMTUgTSAxNSAwIEwgMTUgNjAgTSAwIDMwIEwgNjAgMzAgTSAzMCAwIEwgMzAgNjAgTSAwIDQ1IEwgNjAgNDUgTSA0NSAwIEwgNDUgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBvcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-10 dark:opacity-[0.03] pointer-events-none" />

      {/* Background gradients */}
      <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-gradient-to-br from-gray-100/40 via-gray-200/40 to-gray-300/40 dark:from-[#1a1a1a]/30 dark:via-[#202020]/20 dark:to-[#252525]/10 blur-3xl rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[500px] bg-gradient-to-tr from-gray-100/40 via-gray-200/40 to-gray-300/40 dark:from-[#1a1a1a]/30 dark:via-[#202020]/20 dark:to-[#252525]/10 blur-3xl rounded-full -z-10" />
      
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-[#121212]/80 border-b border-gray-200/20 dark:border-[#2a2a2a]/50 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between px-6 h-16">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold">
                <Link 
                  href="/" 
                  className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
                >
                  Resume<span className="text-blue-600 dark:text-blue-400">Remix</span>
                </Link>
              </h1>
              <nav className="hidden md:flex gap-8">
                <Link 
                  href="/cover-letter" 
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                >
                  Enhance Resume
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-6">
              <ThemeToggle />
              <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-[6px] shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-200 font-medium">
                Login
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="py-8 text-center text-gray-600 dark:text-gray-400 border-t border-gray-200/20 dark:border-[#2a2a2a]/50 backdrop-blur-sm bg-white/30 dark:bg-[#121212]/30">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-sm">© 2025 ResumeRemix. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} 