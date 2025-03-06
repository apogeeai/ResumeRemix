import { useState } from "react";
import { TextArea } from "../components/TextArea";
import Layout from "../components/Layout";

export default function CoverLetterPage() {
  const [resume, setResume] = useState(`ADAM M. CARFAGNA
Saugus, MA | adam.carfagna@gmail.com | 617-281-5533 | in/adamcarfagna/
SUMMARY
Results-driven and dynamic Demand Generation professional with 15+ years of experience driving business growth through data-driven marketing strategies, AI-powered predictive analytics, and technical expertise. Proven track record of increasing member engagement and retention, improving conversion rates, and accelerating pipeline velocity. Highly skilled at optimizing campaign and pipeline performance as well as using creative problem solving to drive demand generation strategies.
SKILLS
Demand Generation, Automation, Conversion A/B Testing, Full-Stack Marketing Strategy, Email Optimization, ROI/KPI Analysis, Email & Web Testing, Highly Motivated Team Player, Detail-oriented, Passion for Excellence
WORK EXPERIENCE
Demand Generation/Marketing Automation Manager – Metro Credit Union, Chelsea, MA 06/2020 – 12/2024
 Achieved Marketo certification and spearheaded a seamless transition from Documatix to Marketo, establishing an end-to-end marketing stack from the ground up that boosted credit union visibility, member engagement, and retention—contributing to $5.4M in 2023 net earnings in the CD segment alone, all while acting as the on-site Marketo expert.
 Developed comprehensive Marketo automated journey roadmap through targeted onboarding & operational strategies, increasing member engagement by 25%.
 Pioneered a custom coded implementation of AI-powered predictive analytics dashboard for real-time campaign insights, enabling rapid optimization of marketing strategies and demonstrating proven ability to leverage cutting-edge technology for business impact.
Marketing Content Specialist (Contract) – Nuance Communications (Microsoft), Burlington, MA 04/2020 - 09/2020
 Led marketing automation and technical operations, managing advanced implementations, attribution models, and CRM integrations for global marketing initiatives.
 Managed campaign strategy through A/B testing, optimizing pipeline velocity by 35%.
Digital Marketing Manager/Web Developer – Shorelight Education - Boston, MA 02/2014 - 03/2019
 Led demand generation strategy across 19+ university partner programs, establishing multi-channel acquisition funnels that combined SEO-optimized WordPress sites with targeted personalized email nurture campaigns, resulting in a 40% increase in qualified leads.
 Architected end-to-end marketing automation strategies in HubSpot and later Marketo, implementing dynamic content personalization and A/B testing across landing pages and email workflows that improved conversion rates by 25% and accelerated enrollment velocity using Tableau and PowerBI to report back to management.
Marketing Web Developer – Bullhorn, Boston, MA 02/2013 - 03/2014
 As the primary Drupal developer, directed multiple corporate CMS projects, demonstrating proficiency in creating robust and efficient web solutions for the Marketing team.
 Managed full customer lifecycle marketing initiatives, from designing and creating all email campaigns to overseeing detailed SEO and AdWords maintenance. Additionally, served as the onsite graphic designer, contributing to a wide array of marketing materials and providing UI/UX assistance to the core product.
Marketing Web Developer – AppNeta (Broadcom), Boston, MA 05/2010 - 01/2013
 Led comprehensive website architecture redesigns for a SaaS company in 2010 and 2013, employing CMS, HTML, CSS, PHP, jQuery, MySQL, SEO, and SMM, resulting in improved functionality and aesthetics, reducing bounce rate by 45%.
 Worked in Marketo and Salesforce to create targeted automated emails/landing pages for lead generation.
 Additionally, orchestrated detailed Google Ads (GAM) and Meta Ad campaigns, effectively directing traffic to keyword-specific landing pages.
Co-Founder and Project Manager – Ironworks Interactive , Boston, MA 05/2007 - 04/2010
 Created and maintained freelance websites for clients using skills such as: HTML, CSS, CMS, JavaScript, HubSpot, and Marketo.
 More recently studied the impact AI/Machine Learning can have on marketing funnel optimization and automation as a side project.
 Portfolio: https://ironworksinteractive.com/
TECHINCAL SKILLS
Growth & Demand Generation
Personalized customer lifecycle journey and lead nurture strategy (email, landing page, SMS, and ringless voicemail), multi-touch attribution, product-led growth (PLG), revenue operations (RevOps), marketing mixed model (MMM), account-based marketing (ABM), customer retention strategies, A/B testing, QA, CRO & experimentation, UI/UX enhancements, AI-driven predictive analytics, customer segmentation, lead scoring, PPC, GDPR/CCPA compliance, ROI/KPI analysis, webinar management, process documentation, pipeline velocity optimization, language localization
Marketing Technology
Marketo, HubSpot, Salesforce Marketing Cloud, Klaviyo, Braze, Pardot, Eloqua, Iterable, 6sense, SEMrush, Google Analytics 4, GTM, Optimizely, Google Optimize, Litmus, EoA, Browser Stack, WordPress, Drupal, Adobe Experience Manager, Salesforce, HubSpot CRM, Shopify, Meta, Google Ads, Adobe Creative Cloud, Canva, Figma
Technical & Web Development
HTML, CSS, JavaScript, TypeScript, Next.js, jQuery, PHP, Python, C++, Java, Velocity Script, MySQL, PostgreSQL, Apache, Nginx, Docker, Kubernetes, Node.js, AWS, Azure, Coolify, Vercel, GitHub, REST, SOAP, GraphQL, WebSocket, OAuth, Nintex RPA, Python Automation, Jenkins, Zapier, Make, N8n, Microsoft Power Automate, PowerBI/Tableau, Google Analytics, Excel
AI Tools
AI Agents, Claude Computer Use, Cursor, Bolt.new, v0.dev, GitHub Copilot, ChatGPT, Perplexity, Midjourney, ComfyUI, Jasper, Copy.ai, Writer.com, TensorFlow, PyTorch, CUDA, LangChain, Prompt Engineering
EDUCATION
Bachelor of Science in Electrical and Computer Systems Engineering, College of Engineering, University of Massachusetts Amherst, Activities and Societies: Talent Advancement Program, IEEE Adobe Certified Professional - Marketo Engage`);
  const [jobDescription, setJobDescription] = useState("");
  const [errors, setErrors] = useState({ resume: "", jobDescription: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleGenerate = async () => {
    setErrors({ resume: "", jobDescription: "" });
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
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, jobDescription, type: "cover-letter" }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${errorText}`);
      }

      const data = await response.json();
      setResult(data.result);
    } catch (error: any) {
      console.error("Error:", error);
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
                setErrors((prev) => ({ ...prev, resume: "" }));
              }}
              placeholder="Test..."
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
                setErrors((prev) => ({ ...prev, jobDescription: "" }));
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
            className={`modern-button w-full sm:w-auto ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isLoading ? "Processing..." : "Generate Cover Letter"}
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
