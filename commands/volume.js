module.exports = {
  name: "volume",
  description: "Change volume of currently playing music",
  execute(message, args) {
    const queue = message.client.queue.get(message.guild.id);

    if (!queue) return message.reply("There is nothing playing.").catch(console.error);

    if (!args[0]) return message.reply(`🔊 ÂM LƯỢNG: **${queue.volume}%**`).catch(console.error);
    if (isNaN(args[0])) return message.reply("GÕ SAI RÙIIIIII").catch(console.error);
    if (parseInt(args[0]) > 100 || parseInt(args[0]) < 0)
      return message.reply("NHẬP SỐ TỪ 0 ĐẾN 100 CHỚ").catch(console.error);

    queue.volume = args[0];
    queue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);

    return queue.textChannel.send(`ÂM LƯỢNG: **${args[0]}%**`).catch(console.error);
  }
};
