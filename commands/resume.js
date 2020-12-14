module.exports = {
  name: "resume",
  description: "[KANNA BIẾT HÁT] Tiếp tục phát nhạc",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue)
      return message.reply("Không có nhạc thì resume làm sao 😩").catch(console.error);

    if (!queue.playing) {
      queue.playing = true;
      queue.connection.dispatcher.resume();
      console.log("resume: ok")
      return queue.textChannel.send(`▶ RESUMED`).catch(console.error);
    }

    return message.reply("Vẫn đang phát nhạc mà 😦").catch(console.error);
  }
};
