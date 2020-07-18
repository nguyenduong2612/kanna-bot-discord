require('dotenv').config()
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');

var players = []

const shuffle = (a) => {
  const r = [...a]
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r
}

const choose = (message, gameBase) => {
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
        const member = message.guild.members.cache
          .find(u => u.id === user.id)

        const isAdmin = member.roles.cache.find(c => c.name === 'Admin')

        if (isAdmin) 
          collector.stop()

      })

      collector.on('end', (reaction, user) => {
        const indices = numberReactions.indexOf(reaction.last().emoji.name)
        message.channel.send('Đã chọn làng! Mọi người kiểm tra các role có trong làng!')
        const roles = shuffle(gameBase[indices])
        for (let i = 0; i < roles.length; i++) {
          const user = message.guild.members.cache
            .find(u => u.id === players[i].id)
            .roles
            .add(message.guild.roles.cache.find(r => r.name === roles[i]))
        }
        message.channel.send('Đã chia xong role! Mọi người kiểm tra role của mình!')
      })
    })


  
}

const start = (message) => {
  message.channel.send('Xác nhận số người chơi bằng cách thích!')
    .then(m => {

      m.react('👍')
      m.react('⭕')
      m.react('❌')

      const filter = (reaction, user) => {
        return ['⭕', '❌'].includes(reaction.emoji.name) && !user.bot
      };

      const collector = m.createReactionCollector(filter);

      collector.on('collect', (reaction, user) => {
        const member = message.guild.members.cache
          .find(u => u.id === user.id)

        const isAdmin = member.roles.cache.find(c => c.name === 'Admin')

        const userReactions = m.reactions.cache.find(r => r.emoji.name === '👍').users.cache.filter(u => !u.bot)

        if (isAdmin) {
          players = userReactions.array()
          collector.stop()
        }
      })

      collector.on('end', (reaction, user) => {
        if (reaction.find(r => r.emoji.name === '⭕')) {

          message.channel.send(`Số lượng người chơi: ${players.length}\n`)
          // Tráo bài và chia bài
          if (players.length + '' in config.gameBase) {
            choose(message, config.gameBase[players.length + ''])
          } else {
            message.channel.send(`Không có bộ bài nào cho ${players.length} người~!~?`)
          }

        }
        else if (reaction.find(r => r.emoji.name === '❌'))
          message.channel.send('HỦY')
      })

    })
}

const wakeup = (message) => {
  if (message.member.roles.cache.find(c => c.name === 'Admin')) {
    const channel = client.channels.cache.find(c => c.name === 'chung' && c.type === 'voice');
    const members = message.guild.members.cache.filter(member => member.user.bot === false && member.voice.channel)
    members.each(m => {
      m.voice.setChannel(channel)
        .catch(console.error);;
    })
  }
}

const end = (message) => {
  players.forEach((u, i) => {
    console.log(u)
    message.guild.members.cache
      .find(m => m.id === u.id)
      .roles.set([])
      .catch(console.error)
  })

  players = []
}

const forceEnd = (message) => {
  if (message.member.roles.cache.find(c => c.name === 'Admin')) {
    const members = message.guild.members.cache.filter(member => (member.user.bot === false))
    members.each(m => {
      if (m.roles.cache.find(c => c.name === 'Admin'))
        return;
      m.roles.set([])
        .catch(console.error);
    })
  }

  players = []
}

const sleep = (message) => {
  if (message.member.roles.cache.find(c => c.name === 'Admin')) {
    const members = message.guild.members.cache.filter(member => member.user.bot === false && member.voice.channel)

    members.each(m => {
      config.roleArray.forEach(i => {
        if (m.roles.cache.find(c => c.name === i)) {
          console.log(m.nickname + ': ' + i);

          if (i == 'sói con' || i == 'sói trắng' || i == 'sói trùm' || i == 'sói lửa')
            i = 'sói'

          const channel = client.channels.cache.find(c => c.name === i && c.type === 'voice');

          m.voice.setChannel(channel).catch(console.error)

        }
      })
    })
  }
}

client.once('ready', () => {
  console.log('🐶Ma Cún is ready! ');
});

client.on('message', message => {
  if (!message.member.roles.cache.find(c => c.name === 'Admin'))
    return

  if (!message.content.startsWith(config.prefix))
    return

  const args = message.content.substring(config.prefix.length).split(' ')

  switch (args[0]) {
    case 'test':
      message.channel.send('test')
      break

    case 'sleep':
      message.channel.send('CẢ LÀNG ĐI NGỦ')
      sleep(message)
      break

    case 'wakeup':
      message.channel.send('CẢ LÀNG THỨC DẬY')
      wakeup(message)
      break

    case 'start':
      // TODO: cho con bot gửi một tin nhắn ai like thì settup luôn
      message.channel.send('START')
      start(message)
      break

    case 'end':
      message.channel.send('END GAME')
      end(message)
      break

    case 'fquit':
      message.channel.send('FORCE END GAME')
      forceEnd(message)
      break
  }
})

client.login(process.env.token);