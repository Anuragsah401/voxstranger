export const ChatStatus = {
  IDLE: "IDLE",
  SEARCHING: "SEARCHING",
  MATCHING: "MATCHING",
  CONNECTED: "CONNECTED",
  CALLING_FRIEND: "CALLING_FRIEND",
  DISCONNECTED: "DISCONNECTED",
  ERROR: "ERROR",
};

// User: { id: string, isStranger: boolean }

// ChatMessage: { id: string, sender: 'me' | 'stranger', text: string, timestamp: number }

// ChatFilters: { preferredCountries: string[], excludedCountries: string[] }

// SignalingMessage: { type: 'offer' | 'answer' | 'ice-candidate' | 'match' | 'peer-left', payload: any, from: string }

// Friend: { id: string, username: string, country: string, flag: string, avatarSeed: string, isOnline: boolean }
