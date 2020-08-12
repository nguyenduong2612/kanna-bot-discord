module.exports = {
  name: "resume",
  description: "Resume the currently playing song",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue)
      return message.reply("HẾT NHẠC RÙI 😭").catch(console.error);

    if (!queue.playing) {
      queue.playing = true;
      queue.connection.dispatcher.resume();
      return queue.textChannel.send(`▶ RESUMED`).catch(console.error);
    }

    return message.reply("VẪN ĐANG PHÁT NHẠC MÀ 😦").catch(console.error);
  }
};
