// ============================================
// FILE: backend/user/src/services/socketService.js
// ============================================
const { getIO } = require('../socket');

exports.emitToUser = (userId, event, data) => {
  const io = getIO();
  if (io) {
    io.to(userId.toString()).emit(event, data);
  }
};

exports.emitToRoom = (room, event, data) => {
  const io = getIO();
  if (io) {
    io.to(room).emit(event, data);
  }
};