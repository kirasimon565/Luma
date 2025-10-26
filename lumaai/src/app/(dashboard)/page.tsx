"use client";

import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";

const DashboardPage = () => {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-dark-bg">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-dark-text">
          Welcome, {user?.email}
        </h1>
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 text-white bg-error rounded-md hover:bg-error/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-error"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
