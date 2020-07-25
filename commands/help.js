const { prefix } = require('../config.json');

module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	aliases: ['commands'],
	usage: '[command name]',
	cooldown: 5,
	execute(message, args, warg) {
		const data = [];
		const { commands } = message.client;

		if (!args.length) {
			data.push('Danh sách lệnh');
			data.push(commands.map(command => command.name + ': ' + command.description).join('\n'));

			return message.channel.send(data, { split: true })
				.then(() => {
					// if (message.channel.type === 'dm') return;
					// message.reply('I\'ve sent you a DM with all my commands!');
				})
				.catch(error => {
					console.error(`Could not send help to ${message.author.tag}.\n`, error);
					message.reply('Lỗi éo gửi được!');
				});
		}

		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) {
			return message.reply('Tao không có lệnh nào như thế');
		}

		data.push(`**Lệnh:** ${command.name}`);

		if (command.aliases) data.push(`**Thay thế:** ${command.aliases.join(', ')}`);
		if (command.description) data.push(`**Mô tả:** ${command.description}`);
		if (command.usage) data.push(`**Cách dùng:** ${prefix}${command.name} ${command.usage}`);

		data.push(`**Spam sau:** ${command.cooldown || 3} giây`);

		message.channel.send(data, { split: true });
	},
};
