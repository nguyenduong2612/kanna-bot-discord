const kill = (message, args, warg) => {
  const killKey = args.join(' ').match(/"([^\\"]|\\")*"/)[0]
  const deadRole = message.guild.roles.cache.find(r => r.name === 'người chết')
  const killMembers = message.mentions.members.map(u => {
    u.roles.set([deadRole]).catch(console.error)
    return u.displayName
  })
  message.channel.send(`${killMembers.join(', ')} ĐÃ CHẾT. RIP 💀`)
  warg.deads[killKey] = !warg.deads[killKey] ? killMembers : [...warg.deads[killKey] ,...killMembers]

}

module.exports = {
  name: 'kill',
  aliases: ['k'],
	description: 'Giết',
	guildOnly: true,
  adminOnly: true,
	execute(message, args, warg) {
		kill(message, args, warg)
	},
};