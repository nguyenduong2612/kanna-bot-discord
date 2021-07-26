require('dotenv').config()

const fs = require('fs');
const Discord = require('discord.js');
const { prefix } = process.env;

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.queue = new Map();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

const Werewoft = require('./model/werewoft')
var warg = new Werewoft()

client.once('ready', () => {
	console.log('🐶 is ready!');
	client.user.setActivity('with umih4ra', { type: 'PLAYING' });
});

client.on('message', message => {
	if (!message.content.startsWith(prefix)) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return;
  
  if (command.adminOnly && !message.member.roles.cache.find(r => r.name === 'Admin')) return;

	if (command.guildOnly && message.channel.type !== 'text') {
		return message.reply('Không thể thực hiện lệnh trong hộp chat riêng');
	}

	if (command.args && !args.length) {
		let reply = `Không có tham số!`;

		if (command.usage) {
			reply += `\nCách dùng lệnh: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`Vui lòng đợi ${timeLeft.toFixed(1)} giây trước khi dùng lệnh \`${command.name}\`.`);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		command.execute(message, args, warg);
	} catch (error) {
		console.error(error);
		message.reply('Có lỗi khi thực hiện!');
	}
});

client.login(process.env.token)
