const admin = require('../database.js')
const database = require('../database.js').firestore()

const updateWin = (board, winners, team) => {
  winners.forEach(uid => {
    board.doc(uid).update({ 
      [`${team}`]: admin.firestore.FieldValue.increment(1),
      win: admin.firestore.FieldValue.increment(1)
    })
  })
}

const win = (message) => {
  const winners = message.mentions.members.map(u => {
    return u.id
  })

  const winners_name = message.mentions.members.map(u => {
    return u.displayName
  })

  const board = database.collection('leaderboard')

  winners.forEach(uid => {
    board.doc(uid).get().then(u => {
      if (!u.exists) {
        board.doc(uid).set({
          win: 0,
          wolf: 0,
          human: 0,
          other: 0
        })
      }
    }).catch(e => {
      console.log("Error getting document:", e)
    })
    
  })

  message.channel.send('PHE THẮNG: sói/người/phe thứ ba ?')

  const filter = m => m.author.id ===  message.author.id
  message.channel.awaitMessages(filter, {
    max: 1,
    time: 60000
  }).then(async(collected) => {
    if (collected.first().content.toLowerCase() === "sói") {
      message.channel.send(`SÓI THẮNG: ${winners_name.join(', ')}`)
      updateWin(board, winners, "wolf")
    } else if (collected.first().content.toLowerCase() === "người") {
      message.channel.send(`NGƯỜI THẮNG: ${winners_name.join(', ')}`)
      updateWin(board, winners, "human")
    } else if (collected.first().content.toLowerCase() === "phe thứ ba") {
      message.channel.send(`PHE THỨ BA THẮNG: ${winners_name.join(', ')}`)
      updateWin(board, winners, "other")
    } else if (collected.first().content.toLowerCase() !== ("người" || "sói" || "phe thứ ba")) {
      message.channel.send('Sai cú pháp. ')
    }
  }).catch(() => {
    console.log("Out of time")
    message.channel.send("Out of time")
  })

}

module.exports = {
	name: 'win',
	description: 'Thắng',
	guildOnly: true,
  adminOnly: true,
		execute(message, args, warg) {
			win(message, warg)
		},
};
