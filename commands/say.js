const say = (message, args) => {
  const say = args.join(" ")
  message.member.lastMessage.delete()
    .then(() => {
      message.channel.send(say)
    })
    .catch(console.error)
}

module.exports = {
  name: 'say',
  aliases: ['talk', 't'],
  description: 'kanna say',
  guildOnly: true,
	execute(message, args) {
    say(message, args)
	},
};
