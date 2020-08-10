const { MessageEmbed, splitMessage, escapeMarkdown } = require("discord.js");

module.exports = {
  showQueue(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply("HẾT NHẠC !").catch(console.error);

    const description = queue.songs.map((song, index) => {
      if (index == 0) {
        return `**▶️ ${index + 1}. ${escapeMarkdown(song.title)}**`;
      } else {
        return `${index + 1}. ${escapeMarkdown(song.title)}`;
      }
    });

    let queueEmbed = new MessageEmbed()
      .setTitle("QUEUE")
      .setDescription(description)
      .setColor("#C6AFD1");

    const splitDescription = splitMessage(description, {
      maxLength: 2048,
      char: "\n",
      prepend: "",
      append: ""
    });

    splitDescription.forEach(async (m) => {
      queueEmbed.setDescription(m);
      var queueMessage = await message.channel.send(queueEmbed);
      try {     //add music controller
        await queueMessage.react("⏭");
        await queueMessage.react("⏯");
        await queueMessage.react("🔁");
        await queueMessage.react("⏹");
      } catch (error) {
        console.error(error);
      }
  
      const filter = (reaction, user) => user.id !== message.client.user.id;
      var collector = queueMessage.createReactionCollector(filter, {
        time: 600000
      });
  
      collector.on("collect", (reaction, user) => {
        if (!queue) return;
        const member = message.guild.member(user);
  
        switch (reaction.emoji.name) {
          case "⏭":
            queue.playing = true;
            reaction.users.remove(user).catch(console.error);
            queue.connection.dispatcher.end();
            queue.textChannel.send(`${user} ⏩ SKIPPED`).catch(console.error);
            collector.stop();
            break;
  
          case "⏯":
            reaction.users.remove(user).catch(console.error);
            if (queue.playing) {
              queue.playing = !queue.playing;
              queue.connection.dispatcher.pause(true);
              queue.textChannel.send(`${user} ⏸ PAUSED.`).catch(console.error);
            } else {
              queue.playing = !queue.playing;
              queue.connection.dispatcher.resume();
              queue.textChannel.send(`${user} ▶ RESUMED`).catch(console.error);
            }
            break;
  
          case "🔁":
            reaction.users.remove(user).catch(console.error);
            queue.loop = !queue.loop;
            queue.textChannel.send(`${queue.loop ? "**BẬT**" : "**TẮT**"} LOOP`).catch(console.error);
            break;
  
          case "⏹":
            reaction.users.remove(user).catch(console.error);
            queue.songs = [];
            queue.textChannel.send(`${user} ⏹ STOPED!`).catch(console.error);
            try {
              queue.connection.dispatcher.end();
            } catch (error) {
              console.error(error);
              queue.connection.disconnect();
            }
            collector.stop();
            break;
  
          default:
            reaction.users.remove(user).catch(console.error);
            break;
        }
      });
  
      collector.on("end", () => {
        queueMessage.reactions.removeAll().catch(console.error);
      });
    });
  }
};
