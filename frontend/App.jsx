import React, { useState, useCallback, useEffect } from "react";
import { ChatStatus } from "./types.js";
import LandingPage from "./components/LandingPage.jsx";
import ChatInterface from "./components/ChatInterface.jsx";
import FilterSidebar from "./components/FilterSidebar.jsx";
import FriendSidebar from "./components/FriendSidebar.jsx";
import { Header } from "./components/Header.jsx";
import { generateUsername } from "./utils/usernameGenerator.js";

/**
 * @typedef {Object} UserProfile
 * @property {string} username
 * @property {string} avatarSeed
 */

const COUNTRIES = [
  { country: "United States", flag: "🇺🇸" },
  { country: "United Kingdom", flag: "🇬🇧" },
  { country: "Germany", flag: "🇩🇪" },
  { country: "France", flag: "🇫🇷" },
  { country: "Japan", flag: "🇯🇵" },
  { country: "Brazil", flag: "🇧🇷" },
  { country: "Canada", flag: "🇨🇦" },
  { country: "Australia", flag: "🇦🇺" },
  { country: "India", flag: "🇮🇳" },
  { country: "South Korea", flag: "🇰🇷" },
  { country: "Italy", flag: "🇮🇹" },
  { country: "Spain", flag: "🇪🇸" },
  { country: "Mexico", flag: "🇲🇽" },
  { country: "Netherlands", flag: "🇳🇱" },
  { country: "Sweden", flag: "🇸🇪" },
];

const App = () => {
  const [status, setStatus] = useState(ChatStatus.IDLE);
  const [onlineCount, setOnlineCount] = useState(0);
  const [user, setUser] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isFriendListOpen, setIsFriendListOpen] = useState(false);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [friends, setFriends] = useState(() => {
    const saved = localStorage.getItem("vox-friends");
    if (saved) return JSON.parse(saved);
    // Add a demo friend for initial testing
    return [
      {
        id: "demo-friend-1",
        username: "Global Voyager",
        country: "United Kingdom",
        flag: "🇬🇧",
        avatarSeed: "demo123",
        isOnline: true,
      },
    ];
  });
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("vox-theme") || "dark";
  });
  const [filters, setFilters] = useState({
    preferredCountries: [],
    excludedCountries: [],
  });

  // Sync theme with document class
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("vox-theme", theme);
  }, [theme]);

  // Sync friends to localStorage
  useEffect(() => {
    localStorage.setItem("vox-friends", JSON.stringify(friends));
  }, [friends]);

  // Simulate online statuses changing for testing
  useEffect(() => {
    const interval = setInterval(() => {
      setFriends((prev) =>
        prev.map((f) => ({
          ...f,
          isOnline: f.id === "demo-friend-1" ? true : Math.random() > 0.4,
        })),
      );
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Simulate online users
  useEffect(() => {
    const base = 1240;
    setOnlineCount(base + Math.floor(Math.random() * 100));
    const interval = setInterval(() => {
      setOnlineCount((prev) => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = useCallback(() => {
    const newUsername = generateUsername();
    setUser({
      username: newUsername,
      avatarSeed: Math.random().toString(36).substring(7),
    });
  }, []);

  const handleStartChat = useCallback(() => {
    setStatus(ChatStatus.SEARCHING);
    setIsMobileChatOpen(false);
    setUnreadCount(0);
    setSelectedFriend(null);
  }, []);

  const handleCallFriend = useCallback((friend) => {
    setSelectedFriend(friend);
    setStatus(ChatStatus.CALLING_FRIEND);
    setIsFriendListOpen(false);
    setIsMobileChatOpen(false);
  }, []);

  const handleEndChat = useCallback(() => {
    setStatus(ChatStatus.IDLE);
    setIsMobileChatOpen(false);
    setUnreadCount(0);
    setSelectedFriend(null);
  }, []);

  const handleAddFriend = useCallback((friendData) => {
    setFriends((prev) => {
      if (prev.find((f) => f.id === friendData.id)) return prev;
      return [...prev, { ...friendData, isOnline: true }];
    });
  }, []);

  const handleRemoveFriend = useCallback((id) => {
    setFriends((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const hasActiveFilters =
    filters.preferredCountries.length > 0 || filters.excludedCountries.length > 0;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white dark:bg-[#0a0a0c] transition-colors duration-300">
      <Header
        onlineCount={onlineCount}
        user={user}
        onOpenFilters={() => setIsFilterOpen(true)}
        onOpenFriends={() => setIsFriendListOpen(true)}
        hasActiveFilters={hasActiveFilters}
        theme={theme}
        onToggleTheme={toggleTheme}
        isChatActive={status === ChatStatus.CONNECTED || status === ChatStatus.CALLING_FRIEND}
        onToggleMobileChat={() => setIsMobileChatOpen((prev) => !prev)}
        unreadCount={unreadCount}
      />

      <main className="flex-1 relative overflow-y-auto scrollbar-thin">
        {status === ChatStatus.IDLE ? (
          <LandingPage
            onStart={handleStartChat}
            onLogin={handleLogin}
            onlineCount={onlineCount}
            user={user}
          />
        ) : (
          <ChatInterface
            status={status}
            setStatus={setStatus}
            onEnd={handleEndChat}
            currentUser={user}
            filters={filters}
            isMobileChatOpen={isMobileChatOpen}
            setIsMobileChatOpen={setIsMobileChatOpen}
            setGlobalUnreadCount={setUnreadCount}
            onAddFriend={handleAddFriend}
            friendList={friends}
            preselectedFriend={selectedFriend}
          />
        )}
      </main>

      <FilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        setFilters={setFilters}
        availableCountries={COUNTRIES}
      />

      <FriendSidebar
        isOpen={isFriendListOpen}
        onClose={() => setIsFriendListOpen(false)}
        friends={friends}
        onCallFriend={handleCallFriend}
        onRemoveFriend={handleRemoveFriend}
      />

      <footer className="py-4 text-center text-xs text-gray-500 border-t border-gray-100 dark:border-white/5 bg-white dark:bg-[#0a0a0c] z-40 relative transition-colors duration-300">
        VoxStrangers &copy; 2025 • Anonymous Real-Time Audio • Global Connectivity
      </footer>
    </div>
  );
};

export default App;
