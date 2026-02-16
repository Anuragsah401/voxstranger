/**
 * VoxStrangers WebRTC Service
 * This provides the logic for peer-to-peer connection establishment.
 * In a production app, these functions would be called by your socket listeners.
 */

export const RTC_CONFIG = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    // TURN servers would be added here for production (behind symmetric NATs)
    // {
    //   urls: 'turn:your-turn-server.com',
    //   username: 'user',
    //   credential: 'password'
    // }
  ],
};

export const createPeerConnection = (onIceCandidate, onTrack) => {
  const pc = new RTCPeerConnection(RTC_CONFIG);

  pc.onicecandidate = (event) => {
    if (event.candidate) {
      onIceCandidate(event.candidate);
    }
  };

  pc.ontrack = (event) => {
    if (event.streams && event.streams[0]) {
      onTrack(event.streams[0]);
    }
  };

  return pc;
};

export const handleOffer = async (pc, offer) => {
  await pc.setRemoteDescription(new RTCSessionDescription(offer));
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);
  return answer;
};

export const handleAnswer = async (pc, answer) => {
  await pc.setRemoteDescription(new RTCSessionDescription(answer));
};

export const handleNewICECandidate = async (pc, candidate) => {
  await pc.addIceCandidate(new RTCIceCandidate(candidate));
};
