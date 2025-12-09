'use client';

import { useState } from 'react';

export type Category = 'All' | 'AI-Related News' | 'Inventions' | 'Technologies' | 'Breakthroughs';

interface CategoryNavbarProps {
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
}

const categories: Category[] = ['All', 'AI-Related News', 'Inventions', 'Technologies', 'Breakthroughs'];

export default function CategoryNavbar({ activeCategory, onCategoryChange }: CategoryNavbarProps) {
  return (
    <nav className="sticky top-20 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-purple-200/50 dark:border-purple-700/50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-hide">
          {categories.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`
                  px-6 py-3 rounded-xl font-semibold text-sm md:text-base whitespace-nowrap
                  transition-all duration-300 transform hover:scale-105
                  ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 text-white shadow-lg shadow-purple-500/50 scale-105'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }
                `}
              >
                <span className="flex items-center gap-2">
                  {category === 'All' && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                  {category === 'AI-Related News' && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  )}
                  {category === 'Inventions' && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  )}
                  {category === 'Technologies' && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  )}
                  {category === 'Breakthroughs' && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )}
                  {category}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

