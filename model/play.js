const ytdlDiscord = require("ytdl-core-discord");
const { MessageEmbed } = require("discord.js");

module.exports = {
  async play(song, message) {
    const queue = message.client.queue.get(message.guild.id);

    if (!song) {
      //queue.channel.leave();
      message.client.queue.delete(message.guild.id);
      return;
    }

    let stream = null;
    let streamType = song.url.includes("youtube.com") ? "opus" : "ogg/opus";

    try {
      if (song.url.includes("youtube.com")) {
        stream = await ytdlDiscord(song.url, { highWaterMark: 1 << 25 });
      }
    } catch (error) {
      if (queue) {
        queue.songs.shift();
        module.exports.play(queue.songs[0], message);
      }

      console.error(error);
      return message.channel.send(`Error: ${error.message ? error.message : error}`);
    }

    queue.connection.on("disconnect", () => message.client.queue.delete(message.guild.id));

    const dispatcher = queue.connection
      .play(stream, { type: streamType })
      .on("finish", () => {
        if (collector && !collector.ended) collector.stop();

        if (queue.loop == "one") {
          module.exports.play(queue.songs[0], message);
        } else if (queue.loop == "all") {
          let lastSong = queue.songs.shift();
          queue.songs.push(lastSong);
          module.exports.play(queue.songs[0], message);
        } else {
          queue.songs.shift();
          module.exports.play(queue.songs[0], message);
        }
      })
      .on("error", (err) => {
        console.error(err);
        queue.songs.shift();
        module.exports.play(queue.songs[0], message);
      });
    dispatcher.setVolumeLogarithmic(queue.volume / 100);

    // show playing
    let playingEmbed = new MessageEmbed()
      .setTitle(`🎶 ĐANG PHÁT: **${song.title}**`)
      .setURL(song.url)
      .setDescription(`🔊 Âm lượng: ${queue.volume}%
                       🔁 Loop: ${queue.loop == "one" ? "Một" : queue.loop == "all" ? "Tất cả" : "Tắt"}`)
                       
      .setColor("#C6AFD1")
      .setImage(song.thumbnail)
      .setFooter(`bài hát này dành tặng cho ${song.order} ❤️`)
 
    try {
      var playingMessage = await queue.textChannel.send(playingEmbed);
      await playingMessage.react("⏭");
      await playingMessage.react("⏯");
      await playingMessage.react("🔁");
      await playingMessage.react("🔂");
      await playingMessage.react("⏹");
    } catch (error) {
      console.error(error);
    }

    const filter = (reaction, user) => user.id !== message.client.user.id;
    var collector = playingMessage.createReactionCollector(filter, {
      time: song.duration > 0 ? song.duration * 1000 : 600000
    });

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
      playingMessage.reactions.removeAll().catch(console.error);
      if (playingMessage && !playingMessage.deleted) {
        playingMessage.delete({ timeout: 3000 }).catch(console.error);
      }
    });
  }
};
