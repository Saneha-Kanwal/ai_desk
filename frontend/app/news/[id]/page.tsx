'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { newsApi, NewsItem } from '@/lib/api';

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [item, setItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [translating, setTranslating] = useState(false);
  const [translatedContent, setTranslatedContent] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');

  const languages = [
    { code: 'Spanish', name: 'Español' },
    { code: 'French', name: 'Français' },
    { code: 'German', name: 'Deutsch' },
    { code: 'Italian', name: 'Italiano' },
    { code: 'Portuguese', name: 'Português' },
    { code: 'Chinese', name: '中文' },
    { code: 'Japanese', name: '日本語' },
    { code: 'Korean', name: '한국어' },
  ];

  useEffect(() => {
    const loadNewsItem = async () => {
      try {
        const data = await newsApi.getNewsItem(params.id as string);
        setItem(data);
      } catch (error) {
        console.error('Error loading news item:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      loadNewsItem();
    }
  }, [params.id]);

  const handleTranslate = async (language: string) => {
    if (!item) return;
    
    setTranslating(true);
    setSelectedLanguage(language);
    try {
      const response = await newsApi.translateNewsItem(item.id, language);
      setTranslatedContent(response.translated_content);
    } catch (error) {
      console.error('Error translating:', error);
      alert('Translation failed. Please try again.');
    } finally {
      setTranslating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            News item not found
          </h1>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const publishedDate = new Date(item.published_at);
  const displayContent = translatedContent || item.content || item.summary || '';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to News
        </button>

        {/* Article Header */}
        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {item.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600 dark:text-gray-400">
            <span>{item.source}</span>
            <span>•</span>
            <time dateTime={item.published_at}>
              {format(publishedDate, 'MMMM d, yyyy')}
            </time>
            {item.tags && item.tags.length > 0 && (
              <>
                <span>•</span>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Summary */}
          {item.summary && (
            <div className="mb-6 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border-l-4 border-primary-500">
              <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Summary</p>
              <p className="text-gray-700 dark:text-gray-300">{item.summary}</p>
            </div>
          )}

          {/* Translate Dropdown */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Translate Content
            </label>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleTranslate(lang.code)}
                  disabled={translating}
                  className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
                >
                  {lang.name}
                </button>
              ))}
            </div>
            {translating && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Translating...</p>
            )}
          </div>

          {/* Content */}
          <div className="prose dark:prose-invert max-w-none mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {translatedContent ? `Explanation (${selectedLanguage})` : 'Detailed Explanation'}
            </h2>
            <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
              {displayContent}
            </div>
          </div>

          {/* Videos */}
          {item.videos && item.videos.length > 0 && (
            <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Related Videos
              </h2>
              <div className="space-y-4">
                {item.videos.map((video) => (
                  <a
                    key={video.id}
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-4">
                        <div className="w-16 h-16 bg-red-600 rounded flex items-center justify-center">
                          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {video.title}
                        </h3>
                        <p className="text-sm text-primary-600 dark:text-primary-400 mt-1">
                          Watch on YouTube →
                        </p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-4">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center"
            >
              Open Official Source
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </article>
      </div>
    </div>
  );
}

