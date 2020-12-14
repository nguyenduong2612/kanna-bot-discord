const react = (message, args) => {
  const emoji_name = args.join(" ")
  const emoji = message.guild.emojis.cache.find(emoji => emoji.name == emoji_name).id

  message.member.lastMessage.delete()
    .then(() => {
      message.channel.messages.fetch({ limit: 1 })
        .then(messages => messages.first().react(emoji))
        .catch(console.error);
    })
    .catch(console.error)
}

module.exports = {
  name: 'react',
  aliases: ['r'],
  description: '[KANNA TẤU HÀI] Thả reaction' ,
  guildOnly: true,
	execute(message, args) {
    react(message, args)
	},
};
