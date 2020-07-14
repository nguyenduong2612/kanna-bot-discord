const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const roleArray = ["cupid", "sói", "bảo vệ", "phù thủy", "tiên tri", "thợ săn", "thổi kèn", "người chết", "dân làng 1", "dân làng 2", "sói nguyền", "hoàng tử"];

const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const sendConfirmationAndAwaitReaction = (message) => {
  return new Promise((resolve, reject) => {
    message.channel.send('Xác nhận số người chơi bằng cách thích!')
      .then(m => {
        const players = []
        m.react('👍')

        const filter = (reaction, user) => {
          return reaction.emoji.name === '👍';
        };

        const collector = m.createReactionCollector(filter, { time: 15000 });

        collector.on('collect', (reaction, user) => {
          console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
          const member = message.guild.members.cache
                          .find(u => u.id === user.id)
          if (member.voice.channel !== null ) {
            if (user.bot === false && member.voice.channel.name === 'chung') players.push(user)
          }
        });

        collector.on('end', collected => {
          console.log('Collector is finished!');
          resolve(players)
        });
      })
  }) 
}

const parseRoles = (message) => {
  const content = message.content.replace('!init ', '');
  const baseRoles = content.split(', ').map(u => u.split(':'))
  const roles = []
  baseRoles.forEach((v) => {
    num = parseInt(v[1])
    for (let i = 0; i < num; i++) {
      roles.push(v[0])
    }
  })

  return roles
}

client.once('ready', () => {
  console.log('Ready!');
});

client.on('message', message => {
  if (!message.member.roles.cache.find(c => c.name === 'Admin'))
    return

  if (message.content === '!help') {
    message.channel.send('!init ' + roleArray.join(': 1,'))
  }
})

client.on('message', message => {
  // TODO: Chia bài Config Roles từng người theo Bài vừa chia
  if (!message.member.roles.cache.find(c => c.name === 'Admin'))
    return

  if (message.content.startsWith('!init ')) {
    sendConfirmationAndAwaitReaction(message)
      .then(players => {
        const roles = shuffle(parseRoles(message))
        console.log(roles)
        console.log(players)

        for (let i = 0; i < roles.length; i++) {
          
          const user = message.guild.members.cache
            .find(u => u.id === players[i].id)
            .roles
            .add(message.guild.roles.cache.find(r => r.name === roles[i]))
        }
        
      })
      .catch(console.error)
  }
})

// Cả làng đi ngủ :D
// Admin only
client.on('message', message => {
  // TODO: Bắt đầu và kéo người chơi về kênh đã chia 
  if (message.content === '!sleep') {
    if (message.member.roles.cache.find(c => c.name === 'Admin')) {
      const members = message.guild.members.cache.filter(member => member.presence.status === "online" && member.user.bot === false)

      members.each(m => {
        roleArray.forEach(i => {
          if (m.roles.cache.find(c => c.name === i)) {
            console.log(m.nickname + ': ' + i);
            const channel = client.channels.cache.find(c => c.name === i && c.type === 'voice');
            m.voice.setChannel(channel)
              .catch(console.error);
          }
        })
      })
    }
  }
});


// Admin only
client.on('message', message => {
  // TODO: kéo người chơi về kênh Chung thảo luận
  if (message.content == '!wakeup') {
    if (message.member.roles.cache.find(c => c.name === 'Admin')) {

      const channel = client.channels.cache.find(c => c.name === 'chung' && c.type === 'voice');
      const members = message.guild.members.cache.filter(member => member.presence.status === "online" && member.user.bot === false)
      members.each(m => {
        m.voice.setChannel(channel)
          .catch(console.error);;
      })
    }
  }
})

// Admin only
client.on('message', message => {
  //TODO: gỡ hết role của tất cả người chơi
  if (message.content == '!end') {
    if (message.member.roles.cache.find(c => c.name === 'Admin')) {
      const members = message.guild.members.cache.filter(member => (member.user.bot === false))
      // gỡ role
      members.each(m => {
        if(m.roles.cache.find(c => c.name === 'Admin'))
          return;
        m.roles.set([])
        .catch(console.error);  
      })
    }
  }
})

client.login(config.token);