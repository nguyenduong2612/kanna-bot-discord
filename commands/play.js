const { play } = require("../model/play");
const { showQueue } = require("../model/showQueue");
const ytdl = require("ytdl-core");
const YouTubeAPI = require("simple-youtube-api");

const keylist = [process.env.YOUTUBE_API_KEY, process.env.YOUTUBE_API_KEY_1, process.env.YOUTUBE_API_KEY_2];

module.exports = {
  name: "play",
  description: "Plays audio from YouTube",
  async execute(message, args) {
    const { channel } = message.member.voice;

    const serverQueue = message.client.queue.get(message.guild.id);
    if (!channel) return message.reply("You need to join a voice channel first!").catch(console.error);
    if (serverQueue && channel !== message.guild.me.voice.channel)
      return message.reply(`You must be in the same channel as ${message.client.user}`).catch(console.error);

    if (!args.length)
      return message
        .reply(`Usage: ${message.client.prefix}play <YouTube URL | Video Name>`)
        .catch(console.error);

    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT"))
      return message.reply("Cannot connect to voice channel, missing permissions");
    if (!permissions.has("SPEAK"))
      return message.reply("Cannot speak in this voice channel, missing permissions");

    const search = args.join(" ");
    const videoPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
    const playlistPattern = /^.*(list=)([^#\&\?]*).*/gi;
    const url = args[0];
    const urlValid = videoPattern.test(args[0]);

    const queueConstruct = {
      textChannel: message.channel,
      channel,
      connection: null,
      songs: [],
      loop: "none",
      volume: 100,
      playing: true
    };

    let songInfo = null;
    let song = null;
    let videos = [];

    if (!videoPattern.test(args[0]) && playlistPattern.test(args[0])) {
      if (urlValid) {
        try {
          //get random key
          const youtube = new YouTubeAPI(keylist[Math.floor(Math.random() * keylist.length)]);
          playlist = await youtube.getPlaylist(url, { part: ["snippet"] });
          videos = await playlist.getVideos(20, { part: ["snippet"] });
        } catch (error) {
          console.error(error);
          return message.reply("KHÔNG TÌM THẤY :(").catch(console.error);
        }
      } else {
        return message.reply("KHÔNG TÌM THẤY :(").catch(console.error);
      }
    } else {
      if (urlValid) {
        try {
          songInfo = await ytdl.getInfo(url);
          song = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url,
            duration: songInfo.videoDetails.lengthSeconds,
            thumbnail: songInfo.videoDetails.thumbnail.thumbnails[3].url,
            order: message.author.username
          };
        } catch (error) {
          console.error(error);
          return message.reply(error.message).catch(console.error);
        }
      } else {
        try {
          //get random key
          const youtube = new YouTubeAPI(keylist[Math.floor(Math.random() * keylist.length)]);
          const results = await youtube.searchVideos(search, 1);
          songInfo = await ytdl.getInfo(results[0].url);
          song = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url,
            duration: songInfo.videoDetails.lengthSeconds,
            thumbnail: songInfo.videoDetails.thumbnail.thumbnails[3].url,
            order: message.author.username
          };
        } catch (error) {
          console.error(error);
          return message.reply("KHÔNG TÌM THẤY").catch(console.error);
        }
      }
    }

    if (videos.length == 0) {
      if (serverQueue) {
        serverQueue.songs.push(song);
        return serverQueue.textChannel
          .send(`✅ ĐÃ THÊM **${song.title}** ordered by **@${song.order}**`)
          .then(() => {
            showQueue(message)
          })
          .catch(console.error);
      } else {
        queueConstruct.songs.push(song);
        message.client.queue.set(message.guild.id, queueConstruct);
      }
    } else {
      message.channel.send("Đợi 10 giây để Kanna lấy nhạc nhé ❤️")
      if (serverQueue) {
        videos.forEach(async(video) => {
          //songInfo = await ytdl.getInfo(video.url);
          song = {
            title: video.title,
            url: video.url,
            duration: 0,
            thumbnail: video.thumbnails.medium.url,
            order: message.author.username
          };
          serverQueue.songs.push(song);
        });
        return serverQueue.textChannel
          .send(`✅ ĐÃ THÊM **${videos.length}** bài hát by **@${song.order}**`)
          .then(() => {
            showQueue(message)
          })
          .catch(console.error);
      } else {
        videos.forEach(async(video) => {
          //songInfo = await ytdl.getInfo(video.url);
          song = {
            title: video.title,
            url: video.url,
            duration: 0,
            thumbnail: video.thumbnails.medium.url,
            order: message.author.username
          };
          // console.log(song)
          queueConstruct.songs.push(song);
        });
        message.client.queue.set(message.guild.id, queueConstruct);
      }
    }
    
    try {
      queueConstruct.connection = await channel.join();
      await queueConstruct.connection.voice.setSelfDeaf(true);
      play(queueConstruct.songs[0], message);
      console.log('ok')
    } catch (error) {
      console.error(error);
      message.client.queue.delete(message.guild.id);
      await channel.leave();
      return message.channel.send(`Could not join the channel: ${error}`).catch(console.error);
    }
  }
};
