'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function BackendStatus() {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        await axios.get(`${API_URL}/api/health`, { timeout: 2000 });
        setIsOnline(true);
      } catch {
        setIsOnline(false);
      } finally {
        setChecking(false);
      }
    };

    checkBackend();
    const interval = setInterval(checkBackend, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, []);

  if (checking || isOnline) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-red-600 text-white px-6 py-4 rounded-lg shadow-xl z-50 max-w-md animate-slide-up">
      <div className="flex items-start space-x-3">
        <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div className="flex-1">
          <h3 className="font-semibold mb-1">Backend Server Offline</h3>
          <p className="text-sm mb-2">The backend server is not running. Please start it to use the application.</p>
          <div className="text-xs bg-red-700 px-3 py-2 rounded font-mono">
            cd backend && ./start_backend.sh
          </div>
        </div>
        <button
          onClick={() => setIsOnline(null)}
          className="text-white hover:text-gray-200 ml-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

