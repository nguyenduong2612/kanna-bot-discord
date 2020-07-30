const config = require('../config.json')
const Discord = require('discord.js')

const log = (message, warg) => {
  const deads = message.guild.members.cache
    .filter(member => {
      return member.roles.cache.find(c => c.name === 'người chết') ? true : false
    })
    .map(v => v.displayName || v.nickname)

  const aliveRole = config.roleArray.filter(v => v !== 'người chết')

  const alives = message.guild.members.cache
    .filter(member => member.roles.cache.find(c => aliveRole.includes(c.name)) ? true : false)
    .map(v => v.displayName || v.nickname)

  const embed = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .addFields([
      {
        name: 'CHẾT', 
        value: '💀 ' + deads.join(', ')
      },
      {
        name: `SỐNG: ${alives.length}`, 
        value: '🖖 ' + alives.join(', ')
      }
    ])

  message.channel.send(embed)
}

module.exports = {
  name: 'log',
  aliases: ['l'],
  description: 'Ghi chép',
  guildOnly: true,
	execute(message, args, warg) {
		log(message, warg)
	},
};