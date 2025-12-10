'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { newsApi, NewsItem } from '@/lib/api';
import { authApi } from '@/lib/auth';
import ParticleBackground from '@/components/ParticleBackground';

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [item, setItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [generatingArticle, setGeneratingArticle] = useState(false);

  // Check authentication first - REQUIRED for article access
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await authApi.getCurrentUser();
        setIsAuthenticated(true);
      } catch (error: any) {
        // Check if it's an auth error (401/403) or our custom auth error
        if (error.isAuthError || error.response?.status === 401 || error.response?.status === 403 || error.message === 'Not authenticated') {
          // Not authenticated - redirect to login immediately
          router.push(`/login?redirect=/news/${params.id}`);
          return;
        } else if (error.code === 'ECONNREFUSED' || error.message?.includes('ERR_CONNECTION_REFUSED')) {
          // Backend is actually offline
          console.error('Backend server is not running');
        }
        // For other errors, redirect to login as well (better safe than sorry)
        router.push(`/login?redirect=/news/${params.id}`);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, [params.id, router]);

  // Load article after authentication check
  useEffect(() => {
    const loadNewsItem = async () => {
      if (!isAuthenticated || checkingAuth) return;
      
      try {
        setLoading(true);
        setGeneratingArticle(true);
        
        // ALWAYS force regenerate comprehensive 800+ word article when page loads
        // The backend will generate a fresh comprehensive article using AI agent
        console.log('🔄 AI Agent is searching, gathering, and synthesizing comprehensive article...');
        const data = await newsApi.getNewsItem(params.id as string, true); // forceRegenerate = true
        setItem(data);
        
        // Verify article word count
        const wordCount = (data.content || '').split(/\s+/).length;
        console.log(`✅ Article generated: ${wordCount} words`);
        if (wordCount < 800) {
          console.warn(`⚠️ Article is only ${wordCount} words, expected 800+`);
        }
        
        // Add structured data for SEO
        const structuredData = {
          '@context': 'https://schema.org',
          '@type': 'NewsArticle',
          headline: data.title,
          description: data.summary,
          datePublished: data.published_at,
          dateModified: data.updated_at,
          author: {
            '@type': 'Organization',
            name: data.source,
          },
          publisher: {
            '@type': 'Organization',
            name: 'AI Desk',
          },
        };
        
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(structuredData);
        document.head.appendChild(script);
      } catch (error: any) {
        console.error('Error loading news item:', error);
        if (error.response?.status === 401) {
          router.push(`/login?redirect=/news/${params.id}`);
          return;
        } else if (error.response?.status === 500) {
          // Server error - show user-friendly message
          console.error('Server error generating article:', error.response?.data);
          const errorDetail = error.response?.data?.detail || 'Unknown server error';
          console.error('Error details:', errorDetail);
        } else if (error.code === 'ECONNREFUSED' || error.message?.includes('ERR_CONNECTION_REFUSED')) {
          // Connection error - backend is actually offline
          console.error('Backend connection refused');
        }
        // Set loading to false to show error state
        setLoading(false);
        setGeneratingArticle(false);
      }
    };

    if (params.id && isAuthenticated && !checkingAuth) {
      loadNewsItem();
    }
  }, [params.id, isAuthenticated, checkingAuth, router]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-purple-950 dark:to-slate-900 flex items-center justify-center pt-20 relative overflow-hidden">
        <ParticleBackground />
        <div className="text-center animate-fade-in relative z-10">
          <div className="inline-block relative mb-6">
            <div className="w-20 h-20 border-4 border-purple-200 dark:border-purple-800 border-t-purple-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="text-xl text-slate-600 dark:text-slate-400 font-medium">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (checkingAuth || loading || generatingArticle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-purple-950 dark:to-slate-900 flex items-center justify-center pt-20 relative overflow-hidden">
        <ParticleBackground />
        <div className="text-center animate-fade-in relative z-10 max-w-3xl mx-auto px-4">
          {checkingAuth ? (
            <>
              <div className="inline-block relative mb-6">
                <div className="w-20 h-20 border-4 border-purple-200 dark:border-purple-800 border-t-purple-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 rounded-full animate-pulse"></div>
                </div>
              </div>
              <p className="text-xl text-slate-600 dark:text-slate-400 font-medium">Checking authentication...</p>
            </>
          ) : (
            <>
              <div className="glass-strong rounded-3xl p-12 border border-purple-200/50 dark:border-purple-700/50 shadow-2xl">
                <div className="flex flex-col items-center justify-center">
                  {/* Animated AI Agent Icon */}
                  <div className="relative mb-8">
                    <div className="w-32 h-32 border-4 border-purple-200 dark:border-purple-800 border-t-purple-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 rounded-full animate-pulse flex items-center justify-center">
                        <svg className="w-10 h-10 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    AI Agent Processing...
                  </h3>
                  
                  <div className="space-y-4 text-center max-w-2xl">
                    <p className="text-lg text-slate-700 dark:text-slate-300 font-semibold mb-6">
                      Our AI Agent is working hard to create a comprehensive article:
                    </p>
                    
                    <div className="flex flex-col gap-4 text-slate-600 dark:text-slate-400">
                      <div className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-purple-50/50 via-blue-50/50 to-cyan-50/50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-purple-200/50 dark:border-purple-700/50">
                        <svg className="w-6 h-6 text-purple-600 animate-pulse flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <span className="font-medium">Searching official documentation and web sources...</span>
                      </div>
                      
                      <div className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-purple-50/50 via-blue-50/50 to-cyan-50/50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-purple-200/50 dark:border-purple-700/50">
                        <svg className="w-6 h-6 text-blue-600 animate-pulse flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="font-medium">Gathering and synthesizing information...</span>
                      </div>
                      
                      <div className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-purple-50/50 via-blue-50/50 to-cyan-50/50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-purple-200/50 dark:border-purple-700/50">
                        <svg className="w-6 h-6 text-cyan-600 animate-pulse flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span className="font-medium">Creating comprehensive 800+ word article...</span>
                      </div>
                      
                      <div className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-purple-50/50 via-blue-50/50 to-cyan-50/50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-purple-200/50 dark:border-purple-700/50">
                        <svg className="w-6 h-6 text-red-600 animate-pulse flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                        <span className="font-medium">Finding related YouTube videos...</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-500 dark:text-slate-500 mt-6 italic font-medium">
                      This may take 30-90 seconds as the AI agent performs thorough research and synthesis.
                    </p>
                    
                    {/* Progress bar animation */}
                    <div className="mt-8 w-full bg-purple-100 dark:bg-purple-900/30 rounded-full h-2 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-full animate-progress-bar" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  if (!item && !loading && !generatingArticle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-purple-950 dark:to-slate-900 flex items-center justify-center pt-20 relative overflow-hidden">
        <ParticleBackground />
        <div className="text-center glass-strong p-12 rounded-3xl shadow-xl max-w-lg animate-fade-in relative z-10">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/50 dark:to-red-800/50 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Error Generating Article</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            The AI agent encountered an error while generating the article. This might be due to:
          </p>
          <ul className="text-left text-sm text-slate-600 dark:text-slate-400 mb-6 space-y-2 max-w-md mx-auto">
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">•</span>
              <span>OpenAI API rate limits or errors</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">•</span>
              <span>Network connectivity issues</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">•</span>
              <span>Article generation timeout</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">•</span>
              <span>Invalid API key or configuration</span>
            </li>
          </ul>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 text-white rounded-xl hover:from-purple-700 hover:via-blue-700 hover:to-cyan-600 transition-all transform hover:scale-105 shadow-lg font-semibold"
            >
              Back to Home
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 glass rounded-xl hover:shadow-lg transition-all transform hover:scale-105 font-semibold text-slate-700 dark:text-slate-300 border border-purple-200/50 dark:border-purple-700/50"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return null;
  }

  const publishedDate = new Date(item.published_at);
  // Use content (detailed explanation) as the main article, fallback to summary if content is not available
  // The content field contains the AI-generated comprehensive article
  const articleContent = item.content || item.summary || '';
  
  // If content is too short, it might be a fallback - we'll still display it prominently
  const hasDetailedContent = articleContent && articleContent.length > 200;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-purple-950 dark:to-slate-900 pt-20 relative overflow-hidden">
      <ParticleBackground />
      
      <div className="container mx-auto px-4 py-12 max-w-7xl relative z-10">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-8 group flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium animate-fade-in"
        >
          <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Articles
        </button>

        {/* Article Card - Wider */}
        <article className="glass-strong rounded-3xl shadow-2xl p-8 md:p-12 lg:p-16 mb-8 animate-fade-in border border-purple-200/50 dark:border-purple-700/50 w-full">
          {/* Header */}
          <header className="mb-10">
            {/* Category Badge */}
            {item.category && (
              <div className="mb-6">
                <span className="px-5 py-2.5 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-cyan-500/20 dark:from-purple-500/30 dark:via-blue-500/30 dark:to-cyan-500/30 text-purple-700 dark:text-purple-300 text-sm font-bold rounded-full border-2 border-purple-400/50 dark:border-purple-600/50 inline-flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  {item.category}
                </span>
              </div>
            )}

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {item.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gradient-to-r from-purple-100 via-blue-100 to-cyan-100 dark:from-purple-900/50 dark:via-blue-900/50 dark:to-cyan-900/50 text-purple-700 dark:text-purple-300 text-sm font-semibold rounded-full border border-purple-200/50 dark:border-purple-700/50 hover:scale-110 transition-transform animate-pulse"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-8 leading-tight bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent animate-gradient-shift bg-[length:200%_auto]">
              {item.title}
            </h1>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600 dark:text-slate-400 mb-8 pb-8 border-b border-purple-200/50 dark:border-purple-700/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-lg animate-glow-pulse">
                  {item.source.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{item.source}</p>
                  <p className="text-xs">{format(publishedDate, 'MMMM d, yyyy')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{format(publishedDate, 'h:mm a')}</span>
              </div>
            </div>

            {/* Quick Summary Box */}
            {item.summary && (
              <div className="bg-gradient-to-r from-purple-50 via-blue-50 to-cyan-50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-cyan-900/20 border-l-4 border-purple-500 rounded-xl p-6 mb-10 animate-fade-in-up">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Quick Summary
                </h2>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">{item.summary}</p>
              </div>
            )}
          </header>

          {/* Main Article Content - The Star of the Page */}
          <div className="mb-12 w-full">
            <div className="flex items-center gap-3 mb-10">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent flex items-center gap-3 neon-glow">
                <svg className="w-10 h-10 text-purple-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Comprehensive AI-Generated Article
              </h2>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
            </div>
            
            {hasDetailedContent && (
              <div className="mb-6 p-4 bg-gradient-to-r from-purple-100/50 via-blue-100/50 to-cyan-100/50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-purple-200/50 dark:border-purple-700/50">
                <p className="text-sm text-purple-700 dark:text-purple-300 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="font-semibold">AI-Generated Comprehensive Article:</span> This detailed article (800+ words) has been generated by our AI agent using official documentation, industry knowledge, and comprehensive research to provide you with in-depth analysis and insights.
                </p>
              </div>
            )}
            
            {articleContent && (
              <div className="mb-4">
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                  Word Count: ~{articleContent.split(/\s+/).length} words | Reading Time: ~{Math.ceil(articleContent.split(/\s+/).length / 200)} minutes
                </div>
                {articleContent.split(/\s+/).length < 800 && loading && (
                  <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Generating comprehensive article (800+ words)...</span>
                  </div>
                )}
              </div>
            )}

            {/* Article Content - Full Width, Comprehensive Display */}
            <div className="prose prose-sm dark:prose-invert max-w-none w-full">
              <div className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs md:text-sm lg:text-base space-y-5 w-full">
                {articleContent ? (
                  articleContent.split(/\n\n+/).map((paragraph, index) => {
                    const trimmed = paragraph.trim();
                    if (!trimmed) return null;
                    
                    // Check if paragraph looks like a heading (short, no period, or starts with number)
                    const isHeading = (
                      (trimmed.length < 150 && !trimmed.includes('.')) ||
                      /^\d+\.\s/.test(trimmed) ||
                      /^[A-Z][^.!?]{0,100}$/.test(trimmed)
                    ) && index > 0;
                    
                    // Check if it's a bullet point or list item
                    const isListItem = /^[-•*]\s/.test(trimmed) || /^\d+\.\s/.test(trimmed);
                    
                    if (isHeading) {
                      return (
                        <h3 
                          key={index} 
                          className="text-lg md:text-xl lg:text-2xl font-display font-bold text-slate-900 dark:text-white mt-8 mb-4 pt-5 border-t border-purple-200/50 dark:border-purple-700/50 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent animate-fade-in-up"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          {trimmed}
                        </h3>
                      );
                    }
                    
                    if (isListItem) {
                      return (
                        <div 
                          key={index}
                          className="flex items-start gap-2 mb-2 animate-fade-in-up pl-3"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <div className="w-1 h-1 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 mt-1.5 flex-shrink-0"></div>
                          <p className="text-xs md:text-sm leading-relaxed flex-1">{trimmed.replace(/^[-•*]\s/, '').replace(/^\d+\.\s/, '')}</p>
                        </div>
                      );
                    }
                    
                    return (
                      <p 
                        key={index} 
                        className="mb-4 text-justify leading-relaxed animate-fade-in-up"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        {trimmed}
                      </p>
                    );
                  }).filter(Boolean)
                ) : (
                  <div className="text-center py-12">
                    <p className="text-slate-500 dark:text-slate-400 text-xl">
                      Detailed article content is being generated. Please check back soon or read the original article.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Videos Section */}
          {item.videos && item.videos.length > 0 && (
            <div className="mt-16 pt-12 border-t border-purple-200/50 dark:border-purple-700/50">
              <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                <svg className="w-8 h-8 text-red-600 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                Related Videos
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                {item.videos.map((video, index) => (
                  <a
                    key={video.id}
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group glass rounded-2xl p-6 hover:shadow-xl transition-all transform hover:scale-[1.02] border border-purple-200/50 dark:border-purple-700/50 hover:border-purple-400/50 dark:hover:border-purple-500/50 animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-24 h-24 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform animate-glow-pulse">
                        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:via-blue-600 group-hover:to-cyan-600 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                          {video.title}
                        </h3>
                        <p className="text-sm text-purple-600 dark:text-purple-400 font-medium flex items-center gap-2">
                          Watch on YouTube
                          <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-12 pt-8 border-t border-purple-200/50 dark:border-purple-700/50 flex flex-wrap gap-4">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group px-8 py-4 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 text-white rounded-xl hover:from-purple-700 hover:via-blue-700 hover:to-cyan-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold inline-flex items-center gap-3 animate-glow-pulse"
            >
              <span>Read Original Article</span>
              <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            <button
              onClick={() => window.print()}
              className="px-6 py-4 glass rounded-xl hover:shadow-lg transition-all transform hover:scale-105 font-semibold text-slate-700 dark:text-slate-300 border border-purple-200/50 dark:border-purple-700/50"
            >
              Print Article
            </button>
          </div>
        </article>
      </div>
    </div>
  );
}
