const wake = (message) => {
  const channel = message.guild.channels.cache.find(c => c.name === 'chung' && c.type === 'voice');
  const members = message.guild.members.cache.filter(member => member.user.bot === false && member.voice.channel)
  members.each(m => {
    m.voice.setChannel(channel)
      .catch(console.error);
  })

  console.log('Waken')
}

module.exports = {
  name: 'wake',
  aliases: ['w', 'wakeup'],
  description: 'Cả làng thức dậy',
  guildOnly: true,
  adminOnly: true,
	execute(message, args, warg) {
    message.channel.send('**CẢ LÀNG THỨC DẬY**')
		wake(message)
	},
};