const config = require('../config.json')
const Discord = require('discord.js')

const vote = (message, warg) => {
  const aliveRole = config.roleArray.filter(v => v !== 'người chết')

  const alives = message.guild.members.cache
    .filter(member => member.roles.cache.find(c => aliveRole.includes(c.name)) ? true : false)
    .map(v => v.displayName || v.nickname)

  const emoji = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓']

  const embed = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle('VOTE')
    .setDescription(
      alives.map((v, i) => `${emoji[i]}・${v}`).join('\n')
    )
  
  message.channel.send(embed)
    .then(m => {
      alives.forEach((v, i) => {
        m.react(emoji[i])
      })
    })
}

module.exports = {
  name: 'vote',
  aliases: ['v'],
  description: 'Vote tất cả',
  guildOnly: true,
  adminOnly: true,
	execute(message, args, warg) {
    vote(message, warg)
    message.channel.send('**QUẢN TRÒ XÁC NHẬN**')
	},
};