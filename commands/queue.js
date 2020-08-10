const { showQueue } = require("../model/showQueue");

module.exports = {
  name: "queue",
  description: "Show the music queue and now playing.",
  execute(message) {
    showQueue(message)
  }
};
