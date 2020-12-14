const { showQueue } = require("../model/showQueue");

module.exports = {
  name: "queue",
  description: "[KANNA BIẾT HÁT] Xem danh sách order nhạc",
  execute(message) {
    showQueue(message)
  }
};
