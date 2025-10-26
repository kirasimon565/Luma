"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

const HomePage = () => {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();

  useEffect(() => {
    if (isLoggedIn()) {
      router.replace('/characters');
    } else {
      router.replace('/login');
    }
  }, [isLoggedIn, router]);

  // Render a loading state or null while redirecting
  return (
    <div className="flex items-center justify-center h-screen bg-dark-bg text-dark-text">
        <p>Loading...</p>
    </div>
  );
};

export default HomePage;
