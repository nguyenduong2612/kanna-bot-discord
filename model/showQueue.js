const { MessageEmbed, splitMessage, escapeMarkdown } = require("discord.js");

module.exports = {
  showQueue(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply("Hết nhạc rùi 😭").catch(console.error);

    let totalTime = 0
    const description = queue.songs.map((song, index) => {
      if (index == 0) {
        totalTime += parseInt(song.duration)
        return `**▶️ ${index + 1}. ${escapeMarkdown(song.title)} - @${song.order} **`;
      } else {
        totalTime += parseInt(song.duration)
        return `${index + 1}. ${escapeMarkdown(song.title)} - @${song.order}`;
      }
    });

    let queueEmbed = new MessageEmbed()
      .setTitle("QUEUE")
      .setDescription(description)
      .setColor("#C6AFD1")
      .setFooter(`Tổng thời gian: ${new Date(totalTime * 1000).toISOString().substr(11, 8)}`);

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
        await queueMessage.react("🔂");
        await queueMessage.react("⏹");
      } catch (error) {
        console.error(error);
      }
  
      const filter = (reaction, user) => user.id !== message.client.user.id;
      var collector = queueMessage.createReactionCollector(filter);
  
      collector.on("collect", (reaction, user) => {
        if (!queue) return;
        const member = message.guild.member(user);
  
        switch (reaction.emoji.name) {
          case "⏭":
            queue.playing = true;
            reaction.users.remove(user).catch(console.error);
            queue.connection.dispatcher.end();
            queue.textChannel.send(`⏩ SKIPPED`).catch(console.error);
            collector.stop();
            break;
  
          case "⏯":
            reaction.users.remove(user).catch(console.error);
            if (queue.playing) {
              queue.playing = !queue.playing;
              queue.connection.dispatcher.pause(true);
              queue.textChannel.send(`⏸ PAUSED`).catch(console.error);
            } else {
              queue.playing = !queue.playing;
              queue.connection.dispatcher.resume();
              queue.textChannel.send(`▶ RESUMED`).catch(console.error);
            }
            break;
  
          case "🔁":
            reaction.users.remove(user).catch(console.error);
            if (queue.loop != "all") queue.loop = "all";
            else queue.loop = "none";
  
            queue.textChannel.send(`LOOP: ${queue.loop == "all" ? "**TẤT CẢ**" : "**TẮT**"}`).catch(console.error);
            break;
  
          case "🔂":
            reaction.users.remove(user).catch(console.error);
            if (queue.loop != "one") queue.loop = "one";
            else queue.loop = "none";
  
            queue.textChannel.send(`LOOP: ${queue.loop == "one" ? "**MỘT**" : "**TẮT**"}`).catch(console.error);
            break;
  
          case "⏹":
            reaction.users.remove(user).catch(console.error);
            queue.songs = [];
            queue.textChannel.send(`⏹ STOPED!`).catch(console.error);
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
