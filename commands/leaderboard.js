const database = require('../database.js').firestore()
const Discord = require('discord.js');

const addMedalToName = (rank, username) => {
  if (rank == 1) return '🏆 ' + username
  else if (rank == 2) return '🥈 ' + username
  else if (rank == 3) return '🥉 ' + username
  else return username
}

const leaderboard = (message) => {
	var board = database.collection('leaderboard')
	board.orderBy('win', 'desc').get().then(users => {
    var embed = new Discord.MessageEmbed().setTitle('BẢNG XẾP HẠNG')
    
    var rank = 1
    users.forEach(u => {
      //console.log(u.id, u.data().win);
      const username =  message.guild.members.cache.get(u.id).displayName
      embed.addField(`${addMedalToName(rank, username)}: ${u.data().win} ván thắng`, '--------------------------------' , false)
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
	description: 'Bảng xếp hạng',
	guildOnly: true,
		execute(message, args, warg) {
			leaderboard(message, warg)
		},
};
