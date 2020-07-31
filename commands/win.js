const admin = require('../database.js')
const database = require('../database.js').firestore()

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
      if (u.exists) {
        board.doc(uid).update({ win: admin.firestore.FieldValue.increment(1) })
      } else {
        board.doc(uid).set({
          win: 1
        })
      }
    }).catch(e => {
      console.log("Error getting document:", e);
    })
    
  })

  message.channel.send(`${winners_name.join(', ')} THẮNG`)
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
