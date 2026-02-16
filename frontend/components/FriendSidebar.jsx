import React from "react";

/**
 * @typedef {Object} FriendSidebarProps
 * @property {boolean} isOpen
 * @property {Function} onClose
 * @property {Array} friends
 * @property {Function} onCallFriend
 * @property {Function} onRemoveFriend
 */

const FriendSidebar = ({ isOpen, onClose, friends, onCallFriend, onRemoveFriend }) => {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm transition-opacity duration-300 z-[60] ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-full max-w-sm bg-white dark:bg-[#0f0f12] border-r border-gray-100 dark:border-white/10 shadow-2xl z-[70] transition-transform duration-500 ease-out transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Friend List
              </h2>
              <p className="text-xs text-slate-500 dark:text-gray-500 mt-1">
                Directly call your favorite strangers
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
            >
              <svg
                className="w-6 h-6 text-slate-400 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
            {friends.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
                <svg
                  className="w-12 h-12 mb-4 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                <p className="text-sm font-medium">Your friend list is empty</p>
                <p className="text-xs mt-1">Add strangers during calls to see them here.</p>
              </div>
            ) : (
              friends.map((friend) => (
                <div
                  key={friend.id}
                  className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                        {friend.username.charAt(0)}
                      </div>
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-[#0f0f12] ${friend.isOnline ? "bg-green-500" : "bg-gray-400"}`}
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900 dark:text-white leading-none mb-1">
                        {friend.username}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-gray-500 uppercase tracking-widest font-bold">
                        {friend.flag} {friend.country}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {friend.isOnline && (
                      <button
                        onClick={() => onCallFriend(friend)}
                        className="p-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-lg shadow-green-500/20 transition-all active:scale-95"
                        title="Call Friend"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </button>
                    )}
                    <button
                      onClick={() => onRemoveFriend(friend.id)}
                      className="p-2.5 text-slate-400 hover:text-red-500 dark:hover:text-red-400 rounded-xl hover:bg-red-500/10 transition-colors"
                      title="Remove Friend"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-6 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-black/40">
            <p className="text-[10px] text-center text-slate-400 dark:text-gray-600 uppercase tracking-[0.2em] font-bold">
              Friends are saved locally
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default FriendSidebar;
