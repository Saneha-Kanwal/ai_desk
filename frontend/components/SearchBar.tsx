'use client';

import { useState } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = "Search AI news, articles, topics..." }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative group">
        {/* Glow effect on focus */}
        <div className={`absolute -inset-0.5 bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${isFocused ? 'opacity-30' : ''}`}></div>
        
        <div className="relative glass-strong rounded-2xl shadow-xl">
          <div className="flex items-center">
            {/* Search Icon */}
            <div className="pl-6 pr-4">
              <svg
                className={`w-6 h-6 transition-colors duration-300 ${
                  isFocused ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Input */}
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              className="flex-1 px-4 py-6 text-lg text-slate-900 dark:text-slate-100 bg-transparent border-0 focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium"
            />

            {/* Clear Button */}
            {value && (
              <button
                onClick={() => onChange('')}
                className="mr-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all transform hover:scale-110"
                aria-label="Clear search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}

            {/* Search Button */}
            <div className="pr-2">
              <button
                type="button"
                className="px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl hover:from-primary-700 hover:to-accent-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search suggestions hint */}
      {!value && !isFocused && (
        <div className="mt-4 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Try searching for: <span className="font-semibold text-primary-600 dark:text-primary-400">GPT-4</span>, <span className="font-semibold text-primary-600 dark:text-primary-400">Machine Learning</span>, <span className="font-semibold text-primary-600 dark:text-primary-400">AI Ethics</span>
          </p>
        </div>
      )}
    </div>
  );
}
