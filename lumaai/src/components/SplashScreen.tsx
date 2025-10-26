"use client";

const SplashScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-dark-bg overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-dark-bg to-secondary opacity-50 animate-gradient-xy"></div>
      <div className="relative">
        <div className="absolute -inset-2 bg-gradient-to-r from-primary to-secondary rounded-full blur-xl opacity-75 animate-pulse"></div>
        <div className="relative w-32 h-32 bg-dark-bg rounded-full flex items-center justify-center">
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full"></div>
        </div>
      </div>
      <h1 className="mt-8 text-4xl font-display text-dark-text animate-fade-in-up">LumaAI</h1>
      <p className="mt-2 text-lg text-dark-text opacity-80 animate-fade-in-up animation-delay-300">
        Where imagination remembers.
      </p>
    </div>
  );
};

export default SplashScreen;
