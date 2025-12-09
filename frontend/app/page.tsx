'use client';

import { useState, useEffect, useCallback } from 'react';
import { newsApi, NewsItem } from '@/lib/api';
import NewsCard from '@/components/NewsCard';
import SearchBar from '@/components/SearchBar';

export default function Home() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to first page on new search
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const loadNews = useCallback(async (pageNum: number = 1, searchTerm: string = '') => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);
      
      const response = await newsApi.getNews(pageNum, 20, searchTerm || undefined);
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
    loadNews(1, debouncedSearch);
  }, [debouncedSearch, loadNews]);

  const loadMore = () => {
    if (!loading && !loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadNews(nextPage, debouncedSearch);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Header with Animation */}
      <header className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-center animate-slide-down">
              AI Desk
            </h1>
            <p className="text-xl md:text-2xl text-center text-primary-100 animate-slide-up">
              Latest AI News & Explainers
            </p>
          </div>
        </div>
        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="currentColor" className="text-gray-50 dark:text-gray-900"/>
          </svg>
        </div>
      </header>

      {/* Search Bar with Animation */}
      <div className="container mx-auto px-4 py-8 -mt-8 relative z-20">
        <div className="animate-fade-in-delay">
          <SearchBar value={search} onChange={setSearch} />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="container mx-auto px-4 mb-6 animate-slide-down">
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-4 rounded-lg shadow-lg">
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold">Connection Error</p>
                <p className="text-sm mt-1">{error}</p>
                <button
                  onClick={() => loadNews(1, debouncedSearch)}
                  className="mt-2 text-sm underline hover:no-underline"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* News Grid */}
      <main className="container mx-auto px-4 pb-12">
        {loading && news.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="inline-block relative">
              <div className="w-16 h-16 border-4 border-primary-200 dark:border-primary-800 border-t-primary-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-primary-600 rounded-full animate-pulse"></div>
              </div>
            </div>
            <p className="mt-6 text-gray-600 dark:text-gray-400 text-lg font-medium animate-pulse">
              Loading latest AI news...
            </p>
          </div>
        ) : error && news.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="inline-block p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
              Unable to load news
            </p>
            <button
              onClick={() => loadNews(1, debouncedSearch)}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Try Again
            </button>
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="inline-block p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No news items found. Try adjusting your search.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 text-gray-600 dark:text-gray-400 animate-fade-in">
              <span className="font-semibold text-primary-600 dark:text-primary-400">
                {total}
              </span> articles found
              {debouncedSearch && (
                <span className="ml-2">for &quot;{debouncedSearch}&quot;</span>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item, index) => (
                <div
                  key={item.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <NewsCard item={item} />
                </div>
              ))}
            </div>
            
            {hasMore && (
              <div className="text-center mt-12 animate-fade-in">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="px-8 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl font-medium"
                >
                  {loadingMore ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading...
                    </span>
                  ) : (
                    'Load More Articles'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

