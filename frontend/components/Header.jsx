import React from "react";

/**
 * @typedef {Object} UserProfile
 * @property {string} username
 * @property {string} avatarSeed
 */

/**
 * @typedef {Object} HeaderProps
 * @property {number} onlineCount
 * @property {UserProfile|null} user
 * @property {Function} onOpenFilters
 * @property {Function} onOpenFriends
 * @property {boolean} hasActiveFilters
 * @property {string} theme
 * @property {Function} onToggleTheme
 * @property {boolean} [isChatActive]
 * @property {Function} [onToggleMobileChat]
 * @property {number} [unreadCount]
 */

export const Header = ({
  onlineCount,
  user,
  onOpenFilters,
  onOpenFriends,
  hasActiveFilters,
  theme,
  onToggleTheme,
  isChatActive,
  onToggleMobileChat,
  unreadCount = 0,
}) => {
  return (
    <header className="px-4 sm:px-6 py-4 flex items-center justify-between border-b border-gray-100 dark:border-white/5 bg-white/80 dark:bg-[#0a0a0c]/80 backdrop-blur-xl sticky top-0 z-50 transition-colors duration-300">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-base sm:text-lg leading-none tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent transition-all">
            VoxStrangers
          </span>
          <span className="text-[9px] sm:text-[10px] text-indigo-500 dark:text-indigo-400 font-bold uppercase tracking-widest mt-0.5">
            Voice Chat
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-4">
        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 dark:text-gray-400 bg-gray-50 dark:bg-white/5 px-3 py-1.5 rounded-full border border-gray-100 dark:border-white/5 transition-colors">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="font-medium whitespace-nowrap">
            {onlineCount.toLocaleString()} online
          </span>
        </div>

        {/* Mobile Chat Toggle Button with Notification Badge */}
        {isChatActive && (
          <button
            onClick={onToggleMobileChat}
            className="md:hidden relative p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 border border-indigo-100 dark:border-indigo-500/20 transition-all active:scale-95 text-indigo-600 dark:text-indigo-400"
            title="Toggle Text Chat"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>

            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white dark:border-[#0a0a0c] animate-in zoom-in duration-300">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
        )}

        <button
          onClick={onToggleTheme}
          className="p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-100 dark:border-white/5 transition-all active:scale-95 text-slate-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-white"
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === "dark" ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 9H3m3.343-5.657l.707.707m12.728 12.728l.707.707M6.343 17.657l-.707.707M17.657 6.343l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          )}
        </button>

        <button
          onClick={onOpenFriends}
          className="relative group p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-100 dark:border-white/5 transition-all active:scale-95"
          title="Friend List"
        >
          <svg
            className="w-5 h-5 text-slate-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        </button>

        <button
          onClick={onOpenFilters}
          className="relative group p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-100 dark:border-white/5 transition-all active:scale-95"
          title="Match Filters"
        >
          <svg
            className="w-5 h-5 text-slate-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
          {hasActiveFilters && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white dark:border-[#0a0a0c]" />
          )}
        </button>

        {user && (
          <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-gray-200 dark:border-white/10 transition-colors">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-tighter">
                Verified
              </span>
              <span className="text-sm text-slate-900 dark:text-white font-bold">
                {user.username}
              </span>
            </div>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center border border-white/20 shadow-inner shrink-0">
              <span className="text-xs font-bold text-white">{user.username.charAt(0)}</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
