const database = require('../database.js').firestore()
const Discord = require('discord.js')

const profile = (message) => {
	var board = database.collection('leaderboard')
  const uid = message.member.id
  console.log(uid)
	board.doc(uid).get().then(u => {
    var embed = new Discord.MessageEmbed()
      .setTitle(message.member.displayName)
      .setThumbnail(message.member.user.avatarURL())
      .addField(`THẮNG: ${u.data().win}`, `Sói: ${u.data().wolf} trận\nNgười: ${u.data().human} trận\nPhe thứ ba: ${u.data().other} trận` , false)

    message.channel.send(embed)
  }).catch(e => {
    console.log("Error getting document:", e)
    message.channel.send("KHÔNG CÓ DỮ LIỆU")
  })
}

module.exports = {
	name: 'profile',
	aliases: ['p'],
	description: 'Thành tích',
	guildOnly: true,
	execute(message, args, warg) {
		profile(message, warg)
	},
};
