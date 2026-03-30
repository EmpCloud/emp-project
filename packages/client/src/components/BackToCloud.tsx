import { useState, useEffect } from 'react';
import { HiArrowLeft } from 'react-icons/hi';

/**
 * Subtle "EMP Cloud" link shown only when the user arrived via SSO.
 * Reads empcloud_return_url from localStorage (set by sso.ts).
 * Uses useEffect to avoid SSR hydration mismatch.
 */
export default function BackToCloud() {
  const [returnUrl, setReturnUrl] = useState<string | null>(null);

  useEffect(() => {
    setReturnUrl(localStorage.getItem('empcloud_return_url'));
  }, []);

  if (!returnUrl) return null;

  return (
    <a
      href={returnUrl}
      className="flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors dark:border-gray-600 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
    >
      <HiArrowLeft className="h-3 w-3" />
      <span>EMP Cloud</span>
    </a>
  );
}
