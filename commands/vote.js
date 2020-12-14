const config = require('../config.json')
const Discord = require('discord.js')

const vote = (message, args, warg) => {
  const emoji = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓']

  if (args.length == 0) {
    const aliveRole = config.roleArray.filter(v => v !== 'người chết')

    const alives = message.guild.members.cache
      .filter(member => member.roles.cache.find(c => aliveRole.includes(c.name)) ? true : false)
      .map(v => v.displayName || v.nickname)

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
    message.channel.send('**QUẢN TRÒ XÁC NHẬN**')

  } else if (args[0] === 'mvp') {
    const players = []
    
    warg.players.forEach(user => {
      players.push(message.guild.member(user).displayName)
    })
    
    const embed = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle('VOTE MVP')
      .setDescription(
        players.map((v, i) => `${emoji[i]}・${v}`).join('\n')
      )
    
    message.channel.send(embed)
      .then(m => {
        players.forEach((v, i) => {
          m.react(emoji[i])
        })
      })
    message.channel.send('**QUẢN TRÒ XÁC NHẬN MVP: !mvp <@tên-người-chơi>**')

  } else {
    message.channel.send("Sai cú pháp. ")
  }
}

module.exports = {
  name: 'vote',
  aliases: ['v'],
  description: '[KANNA QUẢN TRÒ] Mở vote/MVP',
  guildOnly: true,
  adminOnly: true,
	execute(message, args, warg) {
    vote(message, args, warg)
	},
};