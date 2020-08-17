module.exports = {
  name: "volume",
  description: "Change volume of currently playing music",
  execute(message, args) {
    const queue = message.client.queue.get(message.guild.id);

    if (!queue) return message.reply("Không có nhạc thì chỉnh volume kiểu gì 😩").catch(console.error);

    if (!args[0]) return message.reply(`🔊 ÂM LƯỢNG: **${queue.volume}%**`).catch(console.error);
    if (isNaN(args[0])) return message.reply("Sai cú pháp :( !volume <1 đến 100>").catch(console.error);
    if (parseInt(args[0]) > 100 || parseInt(args[0]) < 0)
      return message.reply("Nhập từ 0 đến 100 😩").catch(console.error);

    queue.volume = args[0];
    queue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);
    console.log("volume: ok")

    return queue.textChannel.send(`ÂM LƯỢNG: **${args[0]}%**`).catch(console.error);
  }
};
