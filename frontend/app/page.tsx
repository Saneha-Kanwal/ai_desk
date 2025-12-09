'use client';

import { useState, useEffect, useCallback } from 'react';
import { newsApi, NewsItem } from '@/lib/api';
import NewsCard from '@/components/NewsCard';
import SearchBar from '@/components/SearchBar';
import ParticleBackground from '@/components/ParticleBackground';
import CategoryNavbar, { Category } from '@/components/CategoryNavbar';

export default function Home() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState<Category>('All');
  const [timePeriod, setTimePeriod] = useState<string>('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Reset page when category or time period changes
  useEffect(() => {
    setPage(1);
  }, [category, timePeriod]);

  const loadNews = useCallback(async (pageNum: number = 1, searchTerm: string = '', categoryFilter?: Category, timePeriodFilter?: string) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);
      
      const categoryParam = categoryFilter === 'All' ? undefined : categoryFilter;
      const response = await newsApi.getNews(pageNum, 20, searchTerm || undefined, categoryParam, timePeriodFilter);
      if (pageNum === 1) {
        setNews(response.items);
      } else {
        setNews((prev) => [...prev, ...response.items]);
      }
      setHasMore(response.has_more);
      setTotal(response.total);
    } catch (err: any) {
      console.error('Error loading news:', err);
      if (err.code === 'ECONNREFUSED' || err.message?.includes('ERR_CONNECTION_REFUSED')) {
        setError('Backend server is not running. Please start the backend server first.');
      } else if (err.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else {
        setError('Failed to load news. Please check your connection and try again.');
      }
      if (pageNum === 1) {
        setNews([]);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    loadNews(1, debouncedSearch, category, timePeriod || undefined);
  }, [debouncedSearch, category, timePeriod, loadNews]);

  const loadMore = () => {
    if (!loading && !loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadNews(nextPage, debouncedSearch, category, timePeriod || undefined);
    }
  };

  const handleCategoryChange = (newCategory: Category) => {
    setCategory(newCategory);
    setPage(1);
  };

  return (
    <>
      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'AI Desk - Latest AI News',
            description: 'Latest AI news articles with AI-generated summaries and explanations',
            url: 'http://localhost:3000',
            mainEntity: {
              '@type': 'ItemList',
              numberOfItems: total,
              itemListElement: news.slice(0, 10).map((item, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: {
                  '@type': 'Article',
                  headline: item.title,
                  description: item.summary,
                  datePublished: item.published_at,
                  author: {
                    '@type': 'Organization',
                    name: item.source,
                  },
                },
              })),
            },
          }),
        }}
      />

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-purple-950 dark:to-slate-900 relative overflow-hidden">
        <ParticleBackground />
        {/* Premium Hero Section */}
        <header className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 text-white">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 animate-pulse-slow" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '40px 40px',
            }}></div>
          </div>
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
          
          {/* Floating animated elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400/40 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400/40 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-400/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
          
          {/* Animated grid lines */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
              animation: 'gradientShift 10s ease infinite',
            }}></div>
          </div>

          <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
            <div className="max-w-4xl mx-auto text-center animate-fade-in">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-bold mb-6 tracking-tight animate-fade-in-down">
                <span className="bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent neon-glow animate-gradient-shift bg-[length:200%_auto]">
                  AI Desk
                </span>
              </h1>
              <p className="text-xl md:text-2xl lg:text-3xl text-cyan-100 mb-8 font-light animate-fade-in-up max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
                Your Gateway to the Latest AI News & Intelligent Explanations
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm md:text-base text-blue-200 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>AI-Powered Summaries</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Deep Explanations</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Video Recommendations</span>
                </div>
              </div>
            </div>
          </div>

          {/* Premium wave divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
              <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="currentColor" className="text-slate-50 dark:text-slate-950"/>
            </svg>
          </div>
        </header>

        {/* Premium Search Section */}
        <div className="container mx-auto px-4 py-12 -mt-16 relative z-20">
          <div className="max-w-4xl mx-auto animate-fade-in-up">
            <SearchBar value={search} onChange={setSearch} />
          </div>
        </div>

        {/* Category Navigation Bar */}
        <CategoryNavbar activeCategory={category} onCategoryChange={handleCategoryChange} />

        {/* Premium Time Period Filter */}
        <div className="container mx-auto px-4 py-6 -mt-4">
          <div className="max-w-4xl mx-auto">
            <div className="glass-strong rounded-2xl p-6 border border-purple-200/50 dark:border-purple-700/50 shadow-lg">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <label className="text-base font-bold text-slate-900 dark:text-white whitespace-nowrap">
                    Filter by Time:
                  </label>
                </div>
                <div className="relative flex-1 min-w-[200px]">
                  <select
                    value={timePeriod}
                    onChange={(e) => {
                      setTimePeriod(e.target.value);
                      setPage(1);
                    }}
                    className="w-full pl-5 pr-12 py-3.5 text-base font-medium rounded-xl border-2 border-purple-200 dark:border-purple-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:focus:border-purple-500 transition-all duration-300 hover:border-purple-400 dark:hover:border-purple-600 shadow-sm hover:shadow-md appearance-none cursor-pointer bg-gradient-to-r from-white to-purple-50/30 dark:from-slate-800 dark:to-purple-900/20"
                  >
                    <option value="">⏰ All Time</option>
                    <option value="20s">⚡ Last 20 seconds</option>
                    <option value="30m">🕐 Last 30 minutes</option>
                    <option value="6h">🕕 Last 6 hours</option>
                    <option value="1d">📅 Last 1 day</option>
                    <option value="4d">📆 Last 4 days</option>
                    <option value="older">📜 Older than 4 days</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-purple-600 dark:text-purple-400">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="container mx-auto px-4 mb-8 animate-slide-down">
            <div className="glass-strong border-l-4 border-red-500 text-red-700 dark:text-red-400 p-6 rounded-2xl shadow-xl">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Connection Error</h3>
                  <p className="text-sm mb-4">{error}</p>
                  <button
                    onClick={() => loadNews(1, debouncedSearch)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all transform hover:scale-105 text-sm font-medium"
                  >
                    Retry Connection
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="container mx-auto px-4 pb-20">
          {loading && news.length === 0 ? (
            <div className="text-center py-32 animate-fade-in">
              <div className="inline-block relative mb-8">
                <div className="w-20 h-20 border-4 border-primary-200 dark:border-primary-800 border-t-primary-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full animate-pulse"></div>
                </div>
              </div>
              <p className="text-xl text-slate-600 dark:text-slate-400 font-medium animate-pulse">
                Loading latest AI news...
              </p>
            </div>
          ) : error && news.length === 0 ? (
            <div className="text-center py-32 animate-fade-in">
              <div className="inline-block p-6 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-3xl mb-6 shadow-xl">
                <svg className="w-20 h-20 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Unable to Load News</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
                We couldn't connect to the server. Please check your connection and try again.
              </p>
              <button
                onClick={() => loadNews(1, debouncedSearch)}
                className="px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl hover:from-primary-700 hover:to-accent-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
              >
                Try Again
              </button>
            </div>
          ) : news.length === 0 ? (
            <div className="text-center py-32 animate-fade-in">
              <div className="inline-block p-6 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-3xl mb-6 shadow-xl">
                <svg className="w-20 h-20 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">No Articles Found</h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                Try adjusting your search terms or browse all articles.
              </p>
            </div>
          ) : (
            <>
              {/* Results Header */}
              <div className="mb-8 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                      Latest Articles
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">
                      <span className="font-semibold text-primary-600 dark:text-primary-400 text-lg">
                        {total}
                      </span>
                      {' '}articles found
                      {debouncedSearch && (
                        <span className="ml-2">for <span className="font-semibold">&quot;{debouncedSearch}&quot;</span></span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Premium News Grid - Wider Cards */}
              <div className="grid gap-8 mb-12 transition-all duration-500 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
                {news.map((item, index) => (
                  <div
                    key={item.id}
                    className="animate-fade-in-up transition-all duration-300"
                    style={{ animationDelay: `${Math.min(index * 50, 500)}ms` }}
                  >
                    <NewsCard 
                      item={item}
                    />
                  </div>
                ))}
              </div>
              
              {/* Load More Button */}
              {hasMore && (
                <div className="text-center mt-16 animate-fade-in">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="group px-10 py-5 bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600 text-white rounded-2xl hover:from-primary-700 hover:via-primary-800 hover:to-accent-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-primary-500/50 font-semibold text-lg relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      {loadingMore ? (
                        <>
                          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Loading More...
                        </>
                      ) : (
                        <>
                          Load More Articles
                          <svg className="w-5 h-5 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </>
  );
}
