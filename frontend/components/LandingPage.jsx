import React, { useState } from "react";

/**
 * @typedef {Object} UserProfile
 * @property {string} username
 * @property {string} avatarSeed
 */

/**
 * @typedef {Object} LandingPageProps
 * @property {Function} onStart
 * @property {Function} onLogin
 * @property {number} onlineCount
 * @property {UserProfile|null} user
 */

const LandingPage = ({ onStart, onLogin, onlineCount, user }) => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleGoogleLogin = () => {
    setIsLoggingIn(true);
    // Simulate API call delay
    setTimeout(() => {
      onLogin();
      setIsLoggingIn(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full py-12 px-6 text-center bg-white dark:bg-[#0a0a0c] transition-colors duration-300">
      <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-slate-900 dark:text-white">
          Talk to <span className="text-indigo-600 dark:text-indigo-500">strangers</span>,<br />
          voice to voice.
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-gray-400 mb-10 max-w-lg mx-auto leading-relaxed">
          The simple, anonymous way to have real conversations with people around the world. Secure
          Google authentication, instant anonymity.
        </p>

        <div className="flex flex-col items-center gap-4">
          {!user ? (
            <button
              onClick={handleGoogleLogin}
              disabled={isLoggingIn}
              className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white dark:text-gray-900 transition-all duration-300 bg-slate-900 dark:bg-white rounded-full hover:bg-slate-800 dark:hover:bg-gray-100 active:scale-95 shadow-xl disabled:opacity-70"
            >
              {isLoggingIn ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  <span>Authenticating...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </div>
              )}
            </button>
          ) : (
            <button
              onClick={onStart}
              className="group relative inline-flex items-center justify-center px-10 py-5 font-bold text-white transition-all duration-300 bg-indigo-600 rounded-full hover:bg-indigo-700 active:scale-95 shadow-2xl shadow-indigo-600/20"
            >
              <span className="absolute inset-0 w-full h-full rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity"></span>
              <span className="mr-3 text-lg">Start Talking Now</span>
              <svg
                className="w-6 h-6 transform transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
          )}

          <p className="text-xs text-slate-500 dark:text-gray-500 mt-2">
            {!user ? "Login required to match with verified users" : `Ready as ${user.username}`}
          </p>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-slate-400 dark:text-gray-500 uppercase tracking-widest font-semibold">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
            High Quality Audio
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            Encrypted Streams
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
