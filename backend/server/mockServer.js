const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

let waitingQueue = [];

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("start-search", () => {
    if (waitingQueue.length > 0) {
      const partner = waitingQueue.shift();
      const matchId = `match_${Date.now()}`;
      // Match them
      socket.join(matchId);
      partner.join(matchId);
      io.to(socket.id).emit("match-found", { partnerId: partner.id, matchId, initiator: true });
      io.to(partner.id).emit("match-found", { partnerId: socket.id, matchId, initiator: false });
      console.log(`Matched ${socket.id} with ${partner.id}`);
    } else {
      waitingQueue.push(socket);
      console.log(`${socket.id} added to queue`);
    }
  });

  socket.on("signal", (data) => {
    // Forward WebRTC signals (offer, answer, ice-candidate) to the partner
    socket.to(data.to).emit("signal", {
      from: socket.id,
      ...data,
    });
  });

  socket.on("disconnect", () => {
    waitingQueue = waitingQueue.filter((s) => s.id !== socket.id);
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Signaling server running on port ${PORT}`));
