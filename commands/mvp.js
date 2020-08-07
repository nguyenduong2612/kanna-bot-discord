const Discord = require('discord.js')
const admin = require('../database.js')
const database = require('../database.js').firestore()

const board = database.collection('leaderboard') //khai báo collection

const addMedalToName = (rank, username) => {
  if (rank == 1) return '🏆 ' + username
  else if (rank == 2) return '🥈 ' + username
  else if (rank == 3) return '🥉 ' + username
  else return username
}

const mvp = (message, args) => {
	if (args.length == 0) {
    board.orderBy('mvp', 'desc').limit(5).get().then(users => {
      var embed = new Discord.MessageEmbed().setTitle('BẢNG XẾP HẠNG MVP')
      var rank = 1
      users.forEach(u => {
        const mvp_over_game = ((u.data().mvp / u.data().game)*100).toFixed(2)
        const username =  message.guild.members.cache.get(u.id).displayName
        embed.addField(`${addMedalToName(rank, username)}: ${u.data().mvp} trận (${mvp_over_game}%)`, '-------------------------------------' , false)
        rank++
      })
      message.channel.send(embed)
    }).catch(e => {
      console.log("Error getting document:", e)
    })
  } else if (args.length == 1) {
    message.mentions.members.map(u => {
      board.doc(u.id).update({ 
        mvp: admin.firestore.FieldValue.increment(1)
      })
      message.channel.send(`NGƯỜI CHƠI HAY NHẤT: **${u.displayName}**  🎉 🎉`)
    })
  } else {
    message.channel.send("Chỉ 1 người được MVP/Sai cú pháp. ")
  }
}

module.exports = {
	name: 'mvp',
	aliases: ['mvp'],
	description: 'Bảng xếp hạng MVP',
	guildOnly: true,
  adminOnly: true,
		execute(message, args, warg) {
			mvp(message, args)
		},
};
