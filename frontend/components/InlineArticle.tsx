'use client';

import { NewsItem } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';

interface InlineArticleProps {
  article: NewsItem;
  onClose: () => void;
}

export default function InlineArticle({ article, onClose }: InlineArticleProps) {
  const publishedDate = new Date(article.published_at);
  const timeAgo = formatDistanceToNow(publishedDate, { addSuffix: true });
  const articleContent = article.content || article.summary || '';
  const wordCount = articleContent.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  // Format article content with proper paragraph breaks
  const formatContent = (content: string) => {
    return content.split(/\n\n+/).map((paragraph, index) => {
      const trimmed = paragraph.trim();
      if (!trimmed) return null;
      
      // Check if paragraph looks like a heading
      const isHeading = (
        (trimmed.length < 150 && !trimmed.includes('.')) ||
        /^\d+\.\s/.test(trimmed) ||
        /^[A-Z][^.!?]{0,100}$/.test(trimmed)
      ) && index > 0;
      
      // Check if it's a list item
      const isListItem = /^[-•*]\s/.test(trimmed) || /^\d+\.\s/.test(trimmed);
      
      if (isHeading) {
        return (
          <h3 
            key={index} 
            className="text-xl md:text-2xl lg:text-3xl font-display font-bold text-slate-900 dark:text-white mt-10 mb-6 pt-6 border-t border-purple-200/50 dark:border-purple-700/50 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent animate-fade-in-up"
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
            className="flex items-start gap-3 mb-3 animate-fade-in-up pl-4"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 mt-2 flex-shrink-0"></div>
            <p className="text-sm md:text-base leading-relaxed flex-1">{trimmed.replace(/^[-•*]\s/, '').replace(/^\d+\.\s/, '')}</p>
          </div>
        );
      }
      
      return (
        <p 
          key={index} 
          className="mb-5 text-justify leading-relaxed animate-fade-in-up"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {trimmed}
        </p>
      );
    }).filter(Boolean);
  };

  return (
    <article className="glass-strong rounded-3xl shadow-2xl border border-purple-200/50 dark:border-purple-700/50 overflow-hidden animate-fade-in-up">
      {/* Premium Header */}
      <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 p-8 md:p-12 relative overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 animate-pulse-slow" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}></div>
        </div>
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white transition-all transform hover:scale-110 hover:rotate-90 z-10"
          aria-label="Close article"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="relative z-10">
          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {article.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-full border border-white/30"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-6 leading-tight">
            {article.title}
          </h1>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold">
                {article.source.charAt(0).toUpperCase()}
              </div>
              <span className="font-semibold">{article.source}</span>
            </div>
            <span className="text-white/60">•</span>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{timeAgo}</span>
            </div>
            <span className="text-white/60">•</span>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>{wordCount} words</span>
            </div>
            <span className="text-white/60">•</span>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{readingTime} min read</span>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="p-8 md:p-12 lg:p-16">
        {articleContent ? (
          <div className="prose prose-sm dark:prose-invert max-w-none w-full">
            <div className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs md:text-sm lg:text-base space-y-5 w-full">
              {formatContent(articleContent)}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400 text-xl">
              Article content is being generated. Please check back soon.
            </p>
          </div>
        )}

        {/* Videos Section */}
        {article.videos && article.videos.length > 0 && (
          <div className="mt-16 pt-12 border-t border-purple-200/50 dark:border-purple-700/50">
            <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
              <svg className="w-8 h-8 text-red-600 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              Related Videos
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {article.videos.map((video, index) => (
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
            href={article.url}
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
            onClick={onClose}
            className="px-6 py-4 glass rounded-xl hover:shadow-lg transition-all transform hover:scale-105 font-semibold text-slate-700 dark:text-slate-300 border border-purple-200/50 dark:border-purple-700/50"
          >
            Close Article
          </button>
        </div>
      </div>
    </article>
  );
}

