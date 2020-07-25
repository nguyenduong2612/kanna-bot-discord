const Werewoft = require("../model/werewoft")

const end = (message, warg) => {
  if (warg.players.length === 0) {
    const adminRole = message.guild.roles.cache.find(c => c.name === 'Admin')
    message.guild.members.cache
      .each(m => {
        if (!m.roles.cache.has(adminRole.id) && !m.user.bot)
          m.roles.set([]).catch(console.error)
      })
    return
  }

  warg.players.forEach(user => {
    message.guild.member(user).roles.set([]).catch(console.error)
  })

  warg = new Werewoft()
}

module.exports = {
  name: 'end',
  aliases: ['e', 'finish'],
  description: 'Kết thúc và thiết lập lại vai trò',
  guildOnly: true,
  adminOnly: true,
	execute(message, args, warg) {
    end(message, warg)
    message.channel.send('**HẾT GAME, KIỂM TRA LẠI VAI TRÒ ĐÊ**')
	},
};