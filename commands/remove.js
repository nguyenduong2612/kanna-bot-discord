const { showQueue } = require("../model/showQueue");

module.exports = {
  name: "remove",
  description: "Remove song from the queue",
  execute(message, args) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send("KHÔNG CÓ NHẠC").catch(console.error);
    
    if (!args.length) return message.reply(`XÓA NHẠC KHỎI QUEUE: !remove <Queue Number>`);
    if (isNaN(args[0])) return message.reply(`XÓA NHẠC KHỎI QUEUE: !remove <Queue Number>`);

    const song = queue.songs.splice(args[0] - 1, 1);
    queue.textChannel.send(`❌ ${message.author} ĐÃ XÓA **${song[0].title}** KHỎI QUEUE`);

    showQueue(message);
  }
}
