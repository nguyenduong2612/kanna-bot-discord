const Discord = require('discord.js')
const database = require('../database.js').firestore()

const board = database.collection('leaderboard') //khai báo collection

const addMedalToName = (rank, username) => {
  if (rank == 1) return '🏆 ' + username
  else if (rank == 2) return '🥈 ' + username
  else if (rank == 3) return '🥉 ' + username
  else return username
}

const leaderboard = (message) => {
	
	board.orderBy('point', 'desc').limit(10).get().then(users => {
    var embed = new Discord.MessageEmbed()
      .setTitle('BẢNG XẾP HẠNG TOP 10')
      .setDescription(`Thắng + còn sống = +3 điểm
                       Thắng + chết (dạng háng) = +1 điểm
                       Thua = -1 điểm\n`)
    
    var rank = 1
    users.forEach(u => {
      const win_over_game = ((u.data().win / u.data().game)*100).toFixed(2)
      const username =  message.guild.members.cache.get(u.id).displayName
      embed.addField(`${addMedalToName(rank, username)}: ${u.data().point} điểm (${win_over_game}%)`, '-------------------------------------' , false)
      rank++
    })
    message.channel.send(embed)
      
  }).catch(e => {
    console.log("Error getting document:", e)
  })
}

module.exports = {
	name: 'leaderboard',
	aliases: ['lb'],
	description: '[KANNA QUẢN TRÒ] Bảng xếp hạng',
	guildOnly: true,
		execute(message, args, warg) {
			leaderboard(message, warg)
		},
};
