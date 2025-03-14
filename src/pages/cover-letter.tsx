import { useState } from "react";
import { TextArea } from "../components/TextArea";
import Layout from "../components/Layout";

export default function CoverLetterPage() {
  const [resume, setResume] = useState(`ADAM M. CARFAGNA
Saugus, MA | adam.carfagna@gmail.com | 617-281-5533 | in/adamcarfagna/
SUMMARY
Results-driven and dynamic Demand Generation professional with 15+ years of experience driving business growth through data-driven marketing strategies, AI-powered predictive analytics, and technical expertise. Proven track record of increasing member engagement and retention, improving conversion rates, and accelerating pipeline velocity. Highly skilled at optimizing campaign and pipeline performance as well as using creative problem solving to drive demand generation strategies.`);
  const [jobDescription, setJobDescription] = useState("");
  const [errors, setErrors] = useState({ resume: "", jobDescription: "", url: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingJob, setIsFetchingJob] = useState(false);
  const [result, setResult] = useState<{analysis: string, coverLetter: string} | null>(null);
  const [resultType, setResultType] = useState<"both" | null>(null);
  const [jobUrl, setJobUrl] = useState("");

  const handleFetchJobDescription = async () => {
    if (!jobUrl.trim()) {
      setErrors(prev => ({ ...prev, url: "URL is required" }));
      return;
    }

    setIsFetchingJob(true);
    setErrors(prev => ({ ...prev, url: "", jobDescription: "" }));

    try {
      const response = await fetch("/api/scrape-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: jobUrl }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || "Failed to fetch job description");
      }

      const data = await response.json();
      setJobDescription(data.jobDescription);
    } catch (error: any) {
      setErrors(prev => ({ ...prev, url: error.message }));
    } finally {
      setIsFetchingJob(false);
    }
  };

  const handleGenerate = async (type: "cover-letter" | "resume") => {
    setErrors({ resume: "", jobDescription: "", url: "" });
    let hasErrors = false;
    if (!resume.trim()) {
      setErrors((prev) => ({ ...prev, resume: "Resume is required" }));
      hasErrors = true;
    }
    if (!jobDescription.trim()) {
      setErrors((prev) => ({
        ...prev,
        jobDescription: "Job description is required",
      }));
      hasErrors = true;
    }

    if (hasErrors) return;

    setIsLoading(true);
    setResultType(type);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, jobDescription, type }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${errorText}`);
      }

      const data = await response.json();
      setResult(data.result);
    } catch (error: any) {
      console.error("Error:", error);
      setErrors(prev => ({
        ...prev,
        resume: error.message,
        jobDescription: error.message,
        url: error.message
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadWord = () => {
    if (!result) return;
    
    const formattedContent = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<?mso-application progid="Word.Document"?>
<w:wordDocument xmlns:w="http://schemas.microsoft.com/office/word/2003/wordml">
  <w:body>
    <w:p>
      <w:pPr>
        <w:spacing w:before="0" w:after="200"/>
        <w:jc w:val="left"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Calibri" w:h-ansi="Calibri"/>
          <w:sz w:val="22"/>
        </w:rPr>
        <w:t>${result.split('\n').join('</w:t></w:r></w:p><w:p><w:pPr><w:spacing w:before="0" w:after="200"/><w:jc w:val="left"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Calibri" w:h-ansi="Calibri"/><w:sz w:val="22"/></w:rPr><w:t>')}</w:t>
      </w:r>
    </w:p>
  </w:body>
</w:wordDocument>`;
    
    const blob = new Blob([formattedContent], { type: 'application/msword' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cover-letter.doc';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const formatResumeRecommendations = (text: string) => {
    if (!text) return text;

    const sections = text.split(/\n(?=\d+\.|Keywords|Skills|ATS Score|Recommendations)/g);
    
    return sections.map((section, index) => {
      const title = section.split('\n')[0];
      const content = section.split('\n').slice(1).join('\n');
      
      return (
        <div key={index} className="mb-8 last:mb-0">
          <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            {title}
          </h3>
          <div className="space-y-2">
            {content.split('\n').filter(Boolean).map((item, i) => (
              <p key={i} className="text-gray-700 dark:text-gray-300">
                {item.startsWith('•') ? (
                  <span className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>{item.substring(1).trim()}</span>
                  </span>
                ) : item}
              </p>
            ))}
          </div>
        </div>
      );
    });
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-4 sm:p-8 space-y-8">
        <h1>Cover Letter Generator</h1>
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Enhance Resume
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Optimize your resume for ATS and create a tailored cover letter in seconds
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-8">
          <div className="w-full">
            <TextArea
              label="Your Resume"
              value={resume}
              onChange={(value) => {
                setResume(value);
                setErrors((prev) => ({ ...prev, resume: "" }));
              }}
              placeholder="Paste your resume here..."
              className="rounded-[6px] border-gray-200/20 dark:border-[#2a2a2a]/50 bg-gray-50/50 dark:bg-[#1a1a1a]/50 backdrop-blur-sm shadow-sm"
            />
            {errors.resume && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.resume}
              </p>
            )}
          </div>

          <div className="w-full space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Job Description
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={jobUrl}
                  onChange={(e) => {
                    setJobUrl(e.target.value);
                    setErrors(prev => ({ ...prev, url: "" }));
                  }}
                  placeholder="Paste job posting URL here..."
                  className="flex-1 px-4 py-2.5 border border-gray-200/20 dark:border-[#2a2a2a]/50 rounded-[6px] shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 bg-gray-50/50 dark:bg-[#1a1a1a]/50 backdrop-blur-sm text-gray-900 dark:text-white transition-all duration-200"
                />
                <button
                  onClick={handleFetchJobDescription}
                  disabled={isFetchingJob}
                  className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-[6px] shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {isFetchingJob ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Fetching...
                    </span>
                  ) : "Fetch"}
                </button>
              </div>
              {errors.url && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.url}
                </p>
              )}
            </div>
            <TextArea
              label=""
              value={jobDescription}
              onChange={(value) => {
                setJobDescription(value);
                setErrors((prev) => ({ ...prev, jobDescription: "" }));
              }}
              placeholder="Job description will appear here, or paste it manually..."
              className="rounded-[6px] border-gray-200/20 dark:border-[#2a2a2a]/50 bg-gray-50/50 dark:bg-[#1a1a1a]/50 backdrop-blur-sm shadow-sm"
            />
            {errors.jobDescription && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.jobDescription}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-center mt-12">
          <button
            onClick={async () => {
              setIsLoading(true);
              try {
                const [analysisRes, coverLetterRes] = await Promise.all([
                  fetch("/api/generate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ resume, jobDescription, type: "resume" }),
                  }),
                  fetch("/api/generate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ resume, jobDescription, type: "cover-letter" }),
                  })
                ]);
                
                const [analysisData, coverLetterData] = await Promise.all([
                  analysisRes.json(),
                  coverLetterRes.json()
                ]);
                
                setResult({
                  analysis: analysisData.result,
                  coverLetter: coverLetterData.result
                });
                setResultType("both");
              } catch (error) {
                console.error("Error:", error);
              } finally {
                setIsLoading(false);
              }
            }}
            disabled={isLoading}
            className={`px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 hover:from-blue-700 hover:via-purple-700 hover:to-green-700 text-white rounded-[6px] shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-200 font-medium ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Analyzing & Generating...
              </span>
            ) : "Analyze & Generate"}
          </button>
        </div>

        {isLoading && (
          <div className="text-center mt-8 text-gray-600 dark:text-gray-400">
            <div className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Generating your {resultType === "cover-letter" ? "cover letter" : "resume recommendations"}...
            </div>
          </div>
        )}

        {result && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-gray-50/50 dark:bg-[#1a1a1a]/50 backdrop-blur-sm rounded-[6px] shadow-xl dark:shadow-black/10 border border-gray-200/20 dark:border-[#2a2a2a]/50">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                  Your Cover Letter
                </h2>
                <button
                  onClick={handleDownloadWord}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-[6px] shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-200 font-medium flex items-center gap-2 backdrop-blur-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download as Word
                </button>
              </div>
              <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed space-y-6">
                {result.coverLetter?.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-6 last:mb-0">{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="p-8 bg-gray-50/50 dark:bg-[#1a1a1a]/50 backdrop-blur-sm rounded-[6px] shadow-xl dark:shadow-black/10 border border-gray-200/20 dark:border-[#2a2a2a]/50">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                  Resume Analysis
                </h2>
              </div>
              <div className="text-gray-700 dark:text-gray-300 prose prose-blue max-w-none dark:prose-invert">
                {formatResumeRecommendations(result.analysis)}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}