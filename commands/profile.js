const Discord = require('discord.js')
const database = require('../database.js').firestore()
const board = database.collection('leaderboard')

const profile = (message) => {
	
  const uid = message.member.id
  console.log(uid)
	board.doc(uid).get().then(u => {
    const win_over_game = ((u.data().win / u.data().game)*100).toFixed(2)
    const alive_over_win = ((u.data().alive / u.data().win)*100).toFixed(2)
    var embed = new Discord.MessageEmbed()
      .setTitle(message.member.displayName)
      .setThumbnail(message.member.user.avatarURL())
      .addField(`THẮNG: ${u.data().win}/${u.data().game} (${win_over_game}%)\nĐIỂM: ${u.data().point}`,
                `\nSói thắng: ${u.data().wolf} trận
                 Người thắng: ${u.data().human} trận
                 Phe thứ ba thắng: ${u.data().other} trận
                 Sống đến cuối: ${u.data().alive} trận
                 Sống/Thắng: ${alive_over_win}% `, false)


    message.channel.send(embed)
  }).catch(e => {
    console.log("Error getting document:", e)
    message.channel.send("KHÔNG CÓ DỮ LIỆU")
  })
}

module.exports = {
	name: 'profile',
	aliases: ['p'],
	description: '[KANNA QUẢN TRÒ] Thành tích người chơi',
	guildOnly: true,
		execute(message, args, warg) {
			profile(message, warg)
		},
};
