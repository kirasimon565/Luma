"use client";

import { useEffect, useState } from "react";
import SplashScreen from "@/components/SplashScreen";

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Show splash screen for 2 seconds
    return () => clearTimeout(timer);
  }, []);

  return loading ? <SplashScreen /> : <>{children}</>;
};

export default ClientLayout;
