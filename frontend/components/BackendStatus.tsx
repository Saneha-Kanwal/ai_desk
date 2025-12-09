'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function BackendStatus() {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const checkBackend = async () => {
      // Skip check if dismissed
      if (dismissed) return;
      
      try {
        const response = await axios.get(`${API_URL}/api/health`, { 
          timeout: 5000,
          validateStatus: () => true, // Accept ALL status codes as "online" (even errors)
        });
        // Got ANY response = backend is running
        setIsOnline(true);
        setChecking(false);
      } catch (err: any) {
        // Check if it's a REAL connection error (no response at all)
        // If we got a response object, backend IS running (even if error)
        const hasResponse = err.response !== undefined;
        const hasRequest = err.request !== undefined;
        
        // Only show offline if:
        // 1. No response AND no request (complete failure to connect)
        // 2. OR specific connection error codes
        const isConnectionError = (
          (!hasResponse && !hasRequest) || // Complete failure
          err.code === 'ECONNREFUSED' || 
          err.code === 'ETIMEDOUT' ||
          err.code === 'ERR_NETWORK' ||
          (err.message?.includes('ERR_CONNECTION_REFUSED') && !hasResponse) ||
          (err.message?.includes('ERR_NETWORK') && !hasResponse)
        );
        
        if (isConnectionError && !hasResponse) {
          // Only set offline if we truly got no response
          setIsOnline(false);
        } else {
          // Got a response (even error) = backend is running
          setIsOnline(true);
        }
        setChecking(false);
      }
    };

    // Initial check
    checkBackend();
    
    // Check every 30 seconds (less frequent to avoid interference)
    const interval = setInterval(checkBackend, 30000);

    return () => clearInterval(interval);
  }, [dismissed]);

  // Don't show if checking, online, or dismissed
  if (checking || isOnline || dismissed) return null;

  return (
    <div className="fixed bottom-6 right-6 glass-strong border-l-4 border-red-500 text-red-700 dark:text-red-400 px-6 py-5 rounded-2xl shadow-2xl z-50 max-w-md animate-slide-up backdrop-blur-xl">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-2">Backend Server Offline</h3>
          <p className="text-sm mb-4 text-slate-600 dark:text-slate-400">The backend server is not running. Please start it to use the application.</p>
          <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 rounded-xl font-mono text-xs text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
            cd backend && ./start_backend.sh
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors flex-shrink-0"
          aria-label="Dismiss"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
