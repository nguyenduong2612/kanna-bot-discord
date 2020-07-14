const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');

client.once('ready', () => {
  console.log('Ready!');
});

client.on('message', message => {
  if (message.content === '!test') {
    const targetUser = message.member;
    const channel = client.channels.cache.find(c => c.name === 'sói' && c.type === 'voice');
    if (targetUser) {
      targetUser.voice.setChannel(channel)
        .then(() => console.log(`Disconnect ${targetUser.displayName} from voiceChannel`))
        .catch(console.error);
    }
  }
});

client.login(config.token);