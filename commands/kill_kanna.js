const Heroku = require('heroku-client')
const heroku = new Heroku({ token: process.env.HEROKU_API_TOKEN })

const kill_kanna = (message, args) => {
  heroku.post('/apps/kanna-the-cute-dragon/dynos/worker/actions/stop').then(app => {
    console.log('shutdown: ok')
    message.channel.send('Tạm bịt :(')
  })
}

module.exports = {
  name: 'kill_kanna',
  aliases: ['kill_kanna'],
  description: '[ĐỪNG LÀM THẾ] Tắt Kanna nếu nó quá lắm mồm. Nhưng tý là nó tự bật lại =)) (KANNA BẤT TỬ)',
  guildOnly: true,
	execute(message, args) {
    kill_kanna(message, args)
	},
};
