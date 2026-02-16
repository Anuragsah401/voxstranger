import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChatStatus } from "../types.js";
import AudioVisualizer from "./AudioVisualizer.jsx";
import { generateUsername } from "../utils/usernameGenerator.js";

/**
 * @typedef {Object} UserProfile
 * @property {string} username
 * @property {string} avatarSeed
 */

/**
 * @typedef {Object} ChatInterfaceProps
 * @property {string} status
 * @property {Function} setStatus
 * @property {Function} onEnd
 * @property {UserProfile|null} currentUser
 * @property {Object} filters
 * @property {boolean} [isMobileChatOpen]
 * @property {Function} [setIsMobileChatOpen]
 * @property {Function} [setGlobalUnreadCount]
 * @property {Function} onAddFriend
 * @property {Array} friendList
 * @property {Object|null} [preselectedFriend]
 */

/**
 * @typedef {Object} StrangerInfo
 * @property {string} id
 * @property {string} username
 * @property {string} country
 * @property {string} flag
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

const STRANGER_RESPONSES = [
  "Hey there!",
  "Nice to meet you.",
  "How's it going?",
  "The audio quality is great!",
  "Where are you from?",
  "Haha that's interesting.",
  "Wow!",
  "I'm just chilling here.",
];

const ChatInterface = ({
  status,
  setStatus,
  onEnd,
  currentUser,
  filters,
  isMobileChatOpen = false,
  setIsMobileChatOpen,
  setGlobalUnreadCount,
  onAddFriend,
  friendList,
  preselectedFriend,
}) => {
  const [localStream, setLocalStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);
  const [matchId, setMatchId] = useState(null);
  const [strangerInfo, setStrangerInfo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isStrangerTyping, setIsStrangerTyping] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const scrollToBottom = (behavior = "smooth") => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior });
    }
    setUnreadCount(0);
    setShowScrollButton(false);
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;

    setShowScrollButton(!isAtBottom);
    if (isAtBottom) {
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // Sync scroll on message update
  useEffect(() => {
    if (messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];
    if (lastMessage.sender === "stranger") {
      if (showScrollButton) {
        setUnreadCount((prev) => prev + 1);
      }
      if (!isMobileChatOpen) {
        setGlobalUnreadCount?.((prev) => prev + 1);
      }
    }

    if (!showScrollButton) {
      scrollToBottom("smooth");
    }
  }, [messages]);

  useEffect(() => {
    if (isStrangerTyping && !showScrollButton) {
      scrollToBottom("smooth");
    }
  }, [isStrangerTyping]);

  useEffect(() => {
    if (isMobileChatOpen) {
      setGlobalUnreadCount?.(0);
    }
  }, [isMobileChatOpen, setGlobalUnreadCount]);

  // Initialize Microphone
  useEffect(() => {
    const initMic = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setLocalStream(stream);
      } catch (err) {
        console.error("Mic access denied", err);
        setStatus(ChatStatus.ERROR);
      }
    };
    initMic();

    return () => {
      localStream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  // Connection Simulation Logic
  useEffect(() => {
    if (status === ChatStatus.SEARCHING || status === ChatStatus.CALLING_FRIEND) {
      setMatchId(null);
      setStrangerInfo(null);
      setMessages([]);
      setUnreadCount(0);
      setGlobalUnreadCount?.(0);

      const delay = status === ChatStatus.CALLING_FRIEND ? 1200 : 2000 + Math.random() * 2000;

      const timer = setTimeout(() => {
        if (status === ChatStatus.CALLING_FRIEND && preselectedFriend) {
          setStatus(ChatStatus.CONNECTED);
          setMatchId(`call_${preselectedFriend.id}_${Date.now()}`);
          setStrangerInfo({
            id: preselectedFriend.id,
            username: preselectedFriend.username,
            country: preselectedFriend.country,
            flag: preselectedFriend.flag,
            avatarSeed: preselectedFriend.avatarSeed,
          });

          // Initial greeting for friend call
          setTimeout(() => {
            setMessages([
              {
                id: "init-1",
                sender: "stranger",
                text: `Connecting with ${preselectedFriend.username}...`,
                timestamp: Date.now(),
              },
            ]);
          }, 500);
        } else {
          setStatus(ChatStatus.MATCHING);
          setTimeout(() => {
            setStatus(ChatStatus.CONNECTED);
            const id = Math.random().toString(36).substr(2, 9);
            setMatchId(id);

            let pool = COUNTRIES;
            if (filters.excludedCountries.length > 0) {
              pool = pool.filter((c) => !filters.excludedCountries.includes(c.country));
            }
            if (filters.preferredCountries.length > 0) {
              const preferredPool = pool.filter((c) =>
                filters.preferredCountries.includes(c.country),
              );
              if (preferredPool.length > 0) pool = preferredPool;
            }
            if (pool.length === 0) pool = COUNTRIES;

            const randomCountry = pool[Math.floor(Math.random() * pool.length)];
            const strangerName = generateUsername();

            setStrangerInfo({
              id,
              username: strangerName,
              country: randomCountry.country,
              flag: randomCountry.flag,
              avatarSeed: Math.random().toString(36).substr(2, 7),
            });

            setTimeout(() => {
              setIsStrangerTyping(true);
              setTimeout(() => {
                setIsStrangerTyping(false);
                setMessages([
                  {
                    id: Date.now().toString(),
                    sender: "stranger",
                    text: `Hey! Connected from ${randomCountry.country} ${randomCountry.flag}. I'm ${strangerName}.`,
                    timestamp: Date.now(),
                  },
                ]);
              }, 2000);
            }, 1000);
          }, 1500);
        }
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [status, setStatus, filters, preselectedFriend]);

  const handleSendMessage = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      sender: "me",
      text: inputText.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText("");
    scrollToBottom("smooth");

    // Random response simulation
    if (Math.random() > 0.2) {
      setTimeout(() => {
        setIsStrangerTyping(true);
        setTimeout(
          () => {
            setIsStrangerTyping(false);
            const response = {
              id: (Date.now() + 1).toString(),
              sender: "stranger",
              text: STRANGER_RESPONSES[Math.floor(Math.random() * STRANGER_RESPONSES.length)],
              timestamp: Date.now(),
            };
            setMessages((prev) => [...prev, response]);
          },
          1500 + Math.random() * 2000,
        );
      }, 500);
    }
  };

  const handleSkip = useCallback(() => {
    setStatus(ChatStatus.SEARCHING);
    setReportSuccess(false);
    setMessages([]);
    setIsStrangerTyping(false);
    setUnreadCount(0);
    setGlobalUnreadCount?.(0);
    setIsMobileChatOpen?.(false);
  }, [setStatus, setIsMobileChatOpen, setGlobalUnreadCount]);

  const handleReport = useCallback(() => {
    setReportSuccess(true);
    setTimeout(() => {
      handleSkip();
    }, 2000);
  }, [handleSkip]);

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks()[0].enabled = !localStream.getAudioTracks()[0].enabled;
      setIsMuted(!isMuted);
    }
  };

  const isAlreadyFriend = strangerInfo ? friendList.some((f) => f.id === strangerInfo.id) : false;

  return (
    <div className="h-full flex flex-col md:flex-row items-stretch overflow-hidden bg-white dark:bg-[#0a0a0c] transition-colors duration-300 relative">
      {/* Voice & Visualization Section */}
      <div className="flex-1 flex flex-col items-center justify-between py-8 md:py-12 px-4 border-r border-gray-100 dark:border-white/5 relative z-10">
        <div className="w-full max-w-md text-center">
          <div
            className={`text-sm font-bold uppercase tracking-[0.2em] mb-2 transition-colors duration-500 ${
              status === ChatStatus.CONNECTED
                ? "text-green-500"
                : "text-indigo-600 dark:text-indigo-400"
            }`}
          >
            {status === ChatStatus.SEARCHING && "Scanning for Strangers..."}
            {status === ChatStatus.CALLING_FRIEND && `Calling ${preselectedFriend?.username}...`}
            {status === ChatStatus.MATCHING && "User Found! Establishing Link..."}
            {status === ChatStatus.CONNECTED && "Audio Active"}
            {status === ChatStatus.ERROR && "Mic Check Failed"}
          </div>

          {status === ChatStatus.CONNECTED && (
            <div className="text-slate-400 dark:text-gray-500 text-xs flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Secure P2P Encrypted (ID: {matchId?.slice(0, 12)}...)
            </div>
          )}
        </div>

        {/* Visualizers */}
        <div className="flex-1 w-full flex flex-col sm:flex-row items-center justify-center gap-12 sm:gap-20 overflow-hidden py-4">
          <div className="flex flex-col items-center gap-4">
            <div
              className={`relative w-36 h-36 lg:w-52 lg:h-52 rounded-full flex items-center justify-center transition-all duration-500 bg-gray-50 dark:bg-gray-900 border-2 ${
                isMuted
                  ? "border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.1)]"
                  : "border-indigo-500/40 shadow-[0_0_20px_rgba(99,102,241,0.1)]"
              }`}
            >
              {localStream &&
                status !== ChatStatus.SEARCHING &&
                status !== ChatStatus.CALLING_FRIEND && (
                  <AudioVisualizer stream={localStream} color={isMuted ? "#ef4444" : "#6366f1"} />
                )}
              <div className="absolute inset-0 flex items-center justify-center px-4 text-center pointer-events-none">
                <span className="text-slate-900 dark:text-indigo-200 font-bold uppercase tracking-widest text-[11px] lg:text-xs">
                  {currentUser?.username || "You"}
                </span>
              </div>
            </div>
            <button
              onClick={toggleMute}
              className={`text-[10px] px-4 py-1.5 rounded-full border transition-all uppercase font-bold tracking-widest ${
                isMuted
                  ? "bg-red-500/10 text-red-500 border-red-500/20"
                  : "bg-gray-50 dark:bg-white/5 text-slate-500 dark:text-gray-400 border-gray-200 dark:border-white/10"
              }`}
            >
              {isMuted ? "Unmuted Mic" : "Mute Mic"}
            </button>
          </div>

          <div className="hidden sm:block w-12 h-px bg-gray-200 dark:bg-white/10" />

          <div className="flex flex-col items-center gap-4">
            <div
              className={`relative w-36 h-36 lg:w-52 lg:h-52 rounded-full flex items-center justify-center transition-all duration-700 ${
                status === ChatStatus.CONNECTED
                  ? "bg-gray-50 dark:bg-gray-900 border-2 border-emerald-500/40 scale-100 opacity-100"
                  : "bg-gray-100 dark:bg-white/5 border-2 border-gray-200 dark:border-white/5 scale-90 opacity-40"
              }`}
            >
              {status === ChatStatus.CONNECTED && (
                <AudioVisualizer stream={null} color="#10b981" simulate />
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
                <span className="text-emerald-700 dark:text-emerald-200 font-bold uppercase tracking-widest text-[11px] lg:text-xs mb-1">
                  {status === ChatStatus.CONNECTED ? strangerInfo?.username : "Searching..."}
                </span>
                {status === ChatStatus.CONNECTED && strangerInfo && (
                  <span className="text-[9px] text-emerald-600 dark:text-emerald-500/80 font-bold tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 uppercase">
                    {strangerInfo.country} {strangerInfo.flag}
                  </span>
                )}
              </div>
            </div>
            <div className="h-8 flex items-center justify-center">
              {status === ChatStatus.CONNECTED && strangerInfo && (
                <button
                  onClick={() => !isAlreadyFriend && onAddFriend(strangerInfo)}
                  disabled={isAlreadyFriend}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                    isAlreadyFriend
                      ? "bg-green-500/10 text-green-600 border border-green-500/20 cursor-default"
                      : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 active:scale-95"
                  }`}
                >
                  {isAlreadyFriend ? "Friends" : "+ Add Friend"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="w-full max-w-md bg-white dark:bg-gray-900/80 border border-gray-100 dark:border-white/10 p-4 rounded-[2.5rem] flex items-center justify-between gap-4 shadow-2xl transition-all">
          <button
            onClick={onEnd}
            className="w-14 h-14 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-slate-400 dark:text-gray-500 hover:text-red-500 transition-all hover:bg-red-500/5"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <button
            disabled={
              status === ChatStatus.SEARCHING ||
              status === ChatStatus.MATCHING ||
              status === ChatStatus.CALLING_FRIEND
            }
            onClick={handleSkip}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:opacity-50 text-white rounded-full py-4 px-6 font-bold text-sm shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
          >
            {status === ChatStatus.SEARCHING || status === ChatStatus.CALLING_FRIEND
              ? "Initiating Link..."
              : "Next Stranger"}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 5l7 7-7 7M5 5l7 7-7 7"
              />
            </svg>
          </button>
          <button
            onClick={handleReport}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${reportSuccess ? "bg-red-500 text-white" : "bg-gray-50 dark:bg-white/5 text-slate-400 dark:text-gray-500 hover:text-red-500"}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Side Chat Interface */}
      <div
        className={`
        fixed inset-0 z-50 md:relative md:inset-auto md:z-0
        w-full md:w-[400px] lg:w-[450px] 
        bg-white dark:bg-[#0b0b0d] md:bg-gray-50/30 md:dark:bg-black/20 
        flex flex-col border-l border-gray-100 dark:border-white/10 
        transition-all duration-300 ease-in-out shadow-[-20px_0_50px_rgba(0,0,0,0.05)]
        ${isMobileChatOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}
      `}
      >
        <div className="p-5 border-b border-gray-100 dark:border-white/5 bg-white/50 dark:bg-white/[0.02] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileChatOpen?.(false)}
              className="md:hidden p-2 -ml-2 text-slate-400 hover:text-indigo-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
              Active Session
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            <span className="text-[10px] text-slate-500 dark:text-gray-500 font-bold uppercase tracking-widest">
              Live
            </span>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin scrollbar-thumb-indigo-500/10"
        >
          {messages.length === 0 && status === ChatStatus.CONNECTED && (
            <div className="h-full flex flex-col items-center justify-center opacity-30 text-center px-10">
              <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-indigo-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium">
                Chatting with {strangerInfo?.username || "Stranger"}
              </p>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === "me" ? "items-end" : "items-start"} animate-in fade-in slide-in-from-bottom-2 duration-400`}
            >
              <div
                className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm shadow-sm ${
                  msg.sender === "me"
                    ? "bg-indigo-600 text-white rounded-tr-none"
                    : "bg-white dark:bg-white/10 text-slate-800 dark:text-gray-100 rounded-tl-none border border-gray-100 dark:border-transparent"
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[9px] text-slate-400 dark:text-gray-600 mt-1.5 px-1 font-medium">
                {msg.sender === "me" ? "You" : strangerInfo?.username || "Stranger"} •{" "}
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ))}

          {isStrangerTyping && (
            <div className="flex flex-col items-start animate-in fade-in slide-in-from-bottom-2">
              <div className="bg-white dark:bg-white/5 px-4 py-3 rounded-2xl rounded-tl-none border border-gray-100 dark:border-transparent flex gap-1.5 items-center">
                <span className="w-1.5 h-1.5 bg-indigo-500/50 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-indigo-500/50 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-indigo-500/50 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-5 border-t border-gray-100 dark:border-white/5 bg-white dark:bg-white/[0.02]">
          <form onSubmit={handleSendMessage} className="relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={status === ChatStatus.CONNECTED ? "Type a message..." : "Waiting..."}
              disabled={status !== ChatStatus.CONNECTED}
              className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl py-3.5 pl-5 pr-14 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-sm"
            />
            <button
              type="submit"
              disabled={status !== ChatStatus.CONNECTED || !inputText.trim()}
              className="absolute right-2 top-2 w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white hover:bg-indigo-700 disabled:opacity-20 transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7-7 7M5 5l7 7-7 7"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
