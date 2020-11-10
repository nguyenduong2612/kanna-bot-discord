const Heroku = require('heroku-client')
const heroku = new Heroku({ token: process.env.HEROKU_API_TOKEN })

const restart_kanna = (message, args) => {
  heroku.delete('/apps/kanna-the-cute-dragon/dynos/').then(app => {
    console.log('restart: ok')
    message.channel.send('Đang khởi động lại...')
    setTimeout(function() { 
      message.channel.send('Oke hết lỗi rùi')
    }, 8000);
  })
}

module.exports = {
  name: 'restart_kanna',
  aliases: ['restart_kanna'],
  description: 'kanna restart',
  guildOnly: true,
	execute(message, args) {
    restart_kanna(message, args)
	},
};
