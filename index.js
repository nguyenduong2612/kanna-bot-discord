const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
// const roleArray = ["cupid", "sói", "bảo vệ", "phù thủy", "tiên tri", "thợ săn", "thổi kèn", "người chết", "dân làng 1", "dân làng 2", "sói nguyền", "hoàng tử"];

client.once('ready', () => {
  console.log('🐶Ma Cún is ready! ');
});

client.on('message', message => {
  const args = message.content.substring(config.prefix.length).split(' ')

  switch (args[0]) {
    case 'test':
      message.channel.send('test')
      break
  }
})

client.login(config.token);