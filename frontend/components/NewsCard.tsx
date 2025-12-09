'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { NewsItem } from '@/lib/api';

interface NewsCardProps {
  item: NewsItem;
}

export default function NewsCard({ item }: NewsCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const publishedDate = new Date(item.published_at);
  const timeAgo = formatDistanceToNow(publishedDate, { addSuffix: true });

  return (
    <Link href={`/news/${item.id}`}>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 p-6 h-full flex flex-col cursor-pointer border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 transform hover:-translate-y-1"
      >
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {item.title}
          </h2>
          
          {item.summary && (
            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 leading-relaxed">
              {item.summary}
            </p>
          )}
          
          <div className="flex items-center justify-between mt-4 mb-4">
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <span className="font-medium">{item.source}</span>
              <span>•</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{timeAgo}</span>
            </div>
          </div>
          
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {item.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs rounded-full font-medium transition-all hover:bg-primary-200 dark:hover:bg-primary-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <span className="text-primary-600 dark:text-primary-400 font-medium text-sm">
            Read more
          </span>
          <svg
            className={`w-5 h-5 text-primary-600 dark:text-primary-400 transition-transform duration-300 ${
              isHovered ? 'translate-x-1' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

