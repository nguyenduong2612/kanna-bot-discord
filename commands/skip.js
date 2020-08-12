module.exports = {
  name: "skip",
  description: "Skip the currently playing song",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue)
      return message.reply("HẾT NHẠC RÙI 😭").catch(console.error);

    queue.playing = true;
    queue.connection.dispatcher.end();
    queue.textChannel.send(`⏭ SKIPPED`).catch(console.error);
  }
};
