const Tenor = require("tenorjs").client({
  "Key": "TU0CJVVEVYT2",
  "Filter": "off",
  "Locale": "en_US", 
  "MediaFilter": "minimal",
  "DateFormat": "D/MM/YYYY - H:mm:ss A"
});

const gif = (message, args) => {
  if (args.length < 1) {
    message.reply("nhập tên gif đi");
  } else {
    message.member.lastMessage.delete()
      .then(() => {
        const search = args.join(" ")
        Tenor.Search.Random(search, "1").then(Results => {
          Results.forEach(Post => {
            message.channel.send(Post.url)
          });
        }).catch(console.error);
      })
      .catch(console.error);
  }
}

module.exports = {
  name: 'gif',
  aliases: ['g'],
  description: 'tenor gif',
  guildOnly: true,
	execute(message, args) {
    gif(message, args)
	},
};
