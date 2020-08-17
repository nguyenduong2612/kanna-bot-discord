module.exports = {
  name: "skip",
  description: "Skip the currently playing song",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue)
      return message.reply("Không có nhạc thì skip làm sao 😩").catch(console.error);

    queue.playing = true;
    queue.connection.dispatcher.end();
    console.log("skip: ok")
    queue.textChannel.send(`⏭ SKIPPED`).catch(console.error);
  }
};
