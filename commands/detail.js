const config = require('../config.json')
const Discord = require('discord.js')

const log = (message, warg) => {

  const aliveRole = config.roleArray.filter(v => v !== 'người chết')

  const alives = message.guild.members.cache
    .filter(member => member.roles.cache.find(c => aliveRole.includes(c.name)) ? true : false)
    .map(v => v.displayName || v.nickname)

  const embed = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .addFields([
      ...Object.keys(warg.deads).map((key, index) => ({
        name: key.toUpperCase(),
        value: '_ ' + warg.deads[key].join(', ')
      })),
      {
        name: `SỐNG: ${alives.length}`, 
        value: '_ ' + alives.join(', ')
      }
    ])
    .addField('LÀNG: ', "_" + warg.deck)


  message.channel.send(embed)
}

module.exports = {
  name: 'detail',
  aliases: ['d', 'l2', 'log2'],
  description: '[KANNA QUẢN TRÒ] Ghi chép sự kiện',
  usage: 'k.detail @Diep @Phuong Anh "Đêm 1"',
  guildOnly: true,
	execute(message, args, warg) {
		log(message, warg)
	},
};