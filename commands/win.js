const admin = require('../database.js')
const database = require('../database.js').firestore()

const board = database.collection('leaderboard') //khai báo collection

/* RULES
Thắng + còn sống = +3 điểm
Thắng + chết (dạng háng) = +1 điểm
Thua = -1 điểm
*/

var winners_alive_name = []

const initData = (message, warg) => {
  const players = []
  warg.players.forEach(user => {
    players.push(message.guild.member(user).id)
  })
  players.forEach(uid => {
    board.doc(uid).get().then(u => {
      if (!u.exists) {
        board.doc(uid).set({
          win: 0,
          game: 1,
          wolf: 0,
          human: 0,
          other: 0,
          alive: 0,
          point: 0,
          name: message.guild.members.cache.get(uid).displayName
        })
      } else {
        board.doc(uid).update({
          game: admin.firestore.FieldValue.increment(1),
          point: admin.firestore.FieldValue.increment(-1)
        })
      }
    }).catch(e => {
      console.log("Error getting document:", e)
      message.channel.send("CÓ LỖI XẢY RA!")
    })
  })
}

const updateWin = (message, winners, team) => {
  winners.forEach(uid => {
    const deadRole = message.guild.roles.cache.find(r => r.name === 'người chết')
    const member = message.guild.members.cache.get(uid)

    if (member.roles.cache.has(deadRole.id)) {
      board.doc(uid).update({     //update người thắng + chết
        [`${team}`]: admin.firestore.FieldValue.increment(1),
        win: admin.firestore.FieldValue.increment(1),
        point: admin.firestore.FieldValue.increment(2)
      })
    } else {                      //update người thắng + còn sống
      winners_alive_name.push(member.displayName)
      board.doc(uid).update({ 
        [`${team}`]: admin.firestore.FieldValue.increment(1),
        win: admin.firestore.FieldValue.increment(1),
        alive: admin.firestore.FieldValue.increment(1),
        point: admin.firestore.FieldValue.increment(4)
      })
    }
  })
}

const win = (message, warg) => {
  
  const winners = message.mentions.members.map(u => {
    return u.id
  })

  const winners_name = message.mentions.members.map(u => {
    return u.displayName
  })

  initData(message, warg)

  message.channel.send('PHE THẮNG: sói/người/phe thứ ba ?')

  const filter = m => m.author.id ===  message.author.id
  message.channel.awaitMessages(filter, {
    max: 1,
    time: 60000
  }).then(async(collected) => {
    if (collected.first().content.toLowerCase() === "sói") {
      message.channel.send(`SÓI THẮNG (+1 điểm): ${winners_name.join(', ')}`)
      updateWin(message, winners, "wolf")
    } else if (collected.first().content.toLowerCase() === "người") {
      message.channel.send(`NGƯỜI THẮNG (+1 điểm): ${winners_name.join(', ')}`)
      updateWin(message, winners, "human")
    } else if (collected.first().content.toLowerCase() === "phe thứ ba") {
      message.channel.send(`PHE THỨ BA THẮNG (+1 điểm): ${winners_name.join(', ')}`)
      updateWin(message, winners, "other")
    } else if (collected.first().content.toLowerCase() !== ("người" || "sói" || "phe thứ ba")) {
      message.channel.send('Sai cú pháp. ')
    }

    message.channel.send(`SỐNG SÓT ĐẾN CUỐI CÙNG (+2 điểm bonus): ${winners_alive_name.join(', ')}`)
  }).catch((e) => {
    console.log(e)
    message.channel.send("CÓ LỖI XẢY RA!")
  })

}

module.exports = {
	name: 'win',
	description: 'Thắng',
	guildOnly: true,
  adminOnly: true,
		execute(message, args, warg) {
			win(message, warg)
			winners_alive_name = []
		},
};
