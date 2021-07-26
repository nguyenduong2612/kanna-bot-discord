const config = require('../config.json')
const Discord = require('discord.js')

const shuffle = (a) => {
  const r = [...a]
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r
}

const choose = (message, gameBase, warg) => {
  const gameBaseEmbed = new Discord.MessageEmbed()
    .setTitle('Chọn bộ bài đi chúng mày!')
    .addFields(
      gameBase.map((v, i) => ({
        name: 'Làng ' + (i + 1), 
        value: v.join(', ')
      }))
    )
  message.channel.send(gameBaseEmbed)
    .then(m => {
      const numberReactions = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟']
      gameBase.forEach((v, i) => {
        m.react(numberReactions[i])
      })

      const filter = (reaction, user) => numberReactions.includes(reaction.emoji.name) && !user.bot

      const collector = m.createReactionCollector(filter)

      collector.on('collect', (reaction, user) => {
        const member = message.guild.member(user)

        const isAdmin = member.roles.cache.find(c => c.name === 'Admin')

        if (isAdmin) 
          collector.stop()

      })

      collector.on('end', (reaction, user) => {
        const indices = numberReactions.indexOf(reaction.last().emoji.name)
        const embed = new Discord.MessageEmbed()
          .setColor('#0099ff')
          .addField('ĐÃ CHỌN', gameBase[indices].join(', '))
        warg.deck = gameBase[indices].join(', ')
        message.channel.send(embed)
        message.channel.send('Đã chọn làng! Mọi người kiểm tra các role có trong làng!')
        const roles = shuffle(gameBase[indices])
        for (let i = 0; i < roles.length; i++) {
          const user = message.guild.member(warg.players[i])
            .roles
            .add(message.guild.roles.cache.find(r => r.name === roles[i]))
        }
        message.channel.send('Đã chia xong role! Mọi người kiểm tra role của mình!')
      })
    })  
}

const start = (message, warg) => {
  message.channel.send('**BẮT ĐẦU**\nXác nhận số người chơi bằng cách 👍!')
    .then(m => {

      m.react('👍')
      m.react('⭕')
      m.react('❌')

      const filter = (reaction, user) => {
        return ['⭕', '❌'].includes(reaction.emoji.name) && !user.bot
      };

      const collector = m.createReactionCollector(filter);

      collector.on('collect', (reaction, user) => {
        const member = message.guild.member(user)

        const isAdmin = member.roles.cache.find(c => c.name === 'Admin')

        const userReactions = m.reactions.cache.find(r => r.emoji.name === '👍').users.cache.filter(u => !u.bot)

        if (isAdmin) {
          warg.players = userReactions.array()
          collector.stop()
        }
      })

      collector.on('end', (reaction, user) => {
        if (reaction.find(r => r.emoji.name === '⭕')) {

          message.channel.send(`Số lượng người chơi: ${warg.players.length}\n`)
          // Tráo bài và chia bài
          if (warg.players.length + '' in config.gameBase) {
            choose(message, config.gameBase[warg.players.length + ''], warg)
          } else {
            message.channel.send(`Không có bộ bài nào cho ${warg.players.length} người`)
          }

        }
        else if (reaction.find(r => r.emoji.name === '❌'))
          message.channel.send('**HỦY**')
      })

    })
  
  console.log('Started')
}

module.exports = {
  name: 'start',
  aliases: ['new', 'begin'],
	description: '[KANNA QUẢN TRÒ] Bắt đầu chơi ma sói',
	guildOnly: true,
  adminOnly: true,
	execute(message, args, warg) {
		start(message, warg)
	},
};