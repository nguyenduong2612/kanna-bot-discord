module.exports = {
  name: "pause",
  description: "[KANNA BIẾT HÁT] Dừng nhạc đang phát",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply("HẾT NHẠC RÙI 😭").catch(console.error);

    if (queue.playing) {
      queue.playing = false;
      queue.connection.dispatcher.pause(true);
      return queue.textChannel.send(`⏸ PAUSED`).catch(console.error);
    }
  }
};
