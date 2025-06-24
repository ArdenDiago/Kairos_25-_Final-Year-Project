const { Server } = require('socket.io');

let io;

function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: '*', // allow all origins for dev, lock this down in prod
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Listen for 'upload-photo' from a client
    socket.on('upload-photo', (photo) => {
      console.log('Received photo upload:', photo);

      // Broadcast 'photo-added' to all other clients except sender
      socket.broadcast.emit('photo-added', photo);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
}

function getIO() {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
}

module.exports = { initializeSocket, getIO };
