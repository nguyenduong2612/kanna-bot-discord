const config = require('../config.json')

const sleep = (message) => {
  const members = message.guild.members.cache.filter(member => member.user.bot === false && member.voice.channel)

  members.each(m => {
    config.roleArray.forEach(i => {
      if (m.roles.cache.find(c => c.name === i)) {
        // console.log(m.nickname + ': ' + i);

        if (i == 'sói con' || i == 'sói trắng' || i == 'sói trùm' || i == 'sói lửa')
          i = 'sói'

        const channel = message.guild.channels.cache.find(c => c.name === i && c.type === 'voice');

        m.voice.setChannel(channel).catch(console.error)

      }
    })
  })
  
  console.log('Slept')
}

module.exports = {
  name: 'sleep',
  aliases: ['s'],
  description: '[KANNA QUẢN TRÒ] Cho cả làng đi ngủ',
	guildOnly: true,
  adminOnly: true,
	execute(message, args, warg) {
    message.channel.send('**CẢ LÀNG ĐI NGỦ**')
		sleep(message)
	},
};