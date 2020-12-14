const join = (message, args) => {
  const { channel } = message.member.voice;
  channel.join().then(connection => {
        // Yay, it worked!
    console.log("Successfully connected.");
     message.channel.send(`ĐÃ KẾT NỐI`)
  }).catch(e => {
    // Oh no, it errored! Let's log it to console :)
    console.error(e);
    message.channel.send(`Không vào đượcccccccccccc`)
  });
}

module.exports = {
	name: 'join',
	aliases: ['j'],
  description: '[KANNA BIẾT HÁT] Kéo Kanna vào kênh',
  guildOnly: true,
	execute(message, args) {
    join(message, args)
	},
};
