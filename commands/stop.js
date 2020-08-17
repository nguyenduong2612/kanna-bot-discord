module.exports = {
  name: "stop",
  description: "Stops the music",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    
    if (!queue) return message.reply("Không có nhạc thì dừng làm sao 😩").catch(console.error);

    queue.songs = [];
    queue.connection.dispatcher.end();
    console.log("stop: ok")
    queue.textChannel.send(`⏹ STOPPED`).catch(console.error);
  }
};
