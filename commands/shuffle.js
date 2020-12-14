const { showQueue } = require("../model/showQueue");

module.exports = {
  name: "shuffle",
  description: "[KANNA BIẾT HÁT] Trộn queue",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send("KHÔNG CÓ NHẠC").catch(console.error);

    let songs = queue.songs;
    for (let i = songs.length - 1; i > 1; i--) {
      let j = 1 + Math.floor(Math.random() * i);
      [songs[i], songs[j]] = [songs[j], songs[i]];
    }
    queue.songs = songs;
    message.client.queue.set(message.guild.id, queue)
    queue.textChannel.send(`ĐÃ TRỘN QUEUE 🔀`)
      .then(() => {
        showQueue(message);
      })
      .catch(console.error);
  }
};
