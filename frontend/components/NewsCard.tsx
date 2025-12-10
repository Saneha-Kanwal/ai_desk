'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { NewsItem } from '@/lib/api';

interface NewsCardProps {
  item: NewsItem;
}

export default function NewsCard({ item }: NewsCardProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const publishedDate = new Date(item.published_at);
  const timeAgo = formatDistanceToNow(publishedDate, { addSuffix: true });

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Always navigate to article detail page
    router.push(`/news/${item.id}`);
  };

  return (
    <div onClick={handleClick} className="block h-full group cursor-pointer animate-fade-in-up">
      <article
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="glass-strong rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-8 md:p-10 h-full flex flex-col cursor-pointer border border-purple-200/50 dark:border-purple-700/50 hover:border-purple-400/50 dark:hover:border-purple-500/50 transform hover:-translate-y-2 hover:scale-[1.02] relative overflow-hidden group-hover:neon-border"
      >
        {/* Animated gradient overlay on hover */}
        <div className={`absolute inset-0 bg-gradient-to-br from-purple-500/0 via-blue-500/0 to-cyan-500/0 transition-opacity duration-500 ${isHovered ? 'opacity-10' : 'opacity-0'}`}></div>
        
        {/* Shimmer effect */}
        <div className={`absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
        
        {/* Animated border glow */}
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10`}></div>

        <div className="relative z-10 flex-1 flex flex-col">
          {/* Thumbnail Image */}
          {item.thumbnail && (
            <div className="mb-4 rounded-xl overflow-hidden aspect-video bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 relative">
              <Image 
                src={item.thumbnail} 
                alt={item.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Category Badge */}
          {item.category && (
            <div className="mb-3">
              <span className="px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-blue-500/20 dark:from-purple-500/30 dark:to-blue-500/30 text-purple-700 dark:text-purple-300 text-xs font-bold rounded-full border border-purple-300/50 dark:border-purple-600/50">
                {item.category}
              </span>
            </div>
          )}

          {/* Tags at top */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {item.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-gradient-to-r from-primary-100 to-accent-100 dark:from-primary-900/50 dark:to-accent-900/50 text-primary-700 dark:text-primary-300 text-xs font-semibold rounded-full border border-primary-200/50 dark:border-primary-700/50 transition-all hover:scale-110"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 line-clamp-2 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:via-blue-600 group-hover:to-cyan-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 leading-tight">
            {item.title}
          </h2>
          
          {/* Summary */}
          {item.summary && (
            <p className="text-slate-600 dark:text-slate-300 mb-6 line-clamp-4 leading-relaxed text-base md:text-lg flex-grow">
              {item.summary}
            </p>
          )}
          
          {/* Metadata */}
          <div className="mt-auto pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xs animate-glow-pulse shadow-lg">
                    {item.source.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{item.source}</span>
                </div>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{timeAgo}</span>
                </div>
              </div>
            </div>
            
            {/* CTA */}
            <div className="flex items-center justify-between pt-4">
              <span className="font-semibold text-sm group-hover:gap-3 transition-all flex items-center gap-2 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Read Article
                <svg
                  className={`w-5 h-5 transition-transform duration-300 ${isHovered ? 'translate-x-2 scale-110' : 'translate-x-0'} animate-pulse`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 animate-glow-pulse shadow-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
