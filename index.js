const fs = require('fs');
const Discord = require('discord.js');
const { MessageAttachment } = require("discord.js");
const client = new Discord.Client();
const { prefix, token, clientid, clientsecret, publickey, invite } = require('./settings/botsecrets.json');
const chalk = require('chalk')
const { red, greenBright, cyan, yellow } = require("chalk");

const admins = ['', '', '']

client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();

function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

// example

/**
 * sleep(2000).then(() => {
 * do stuff
 * })
 */

 const blurple = chalk.hex('#5865F2');
 const white = chalk.hex('#FFFFFF')

const activities = [
    `with JavaScript`,
	"with noodles,
  ];
  
  client.once("ready", () => {
	  console.log(greenBright('[>>] Logged into ') + cyan(client.user.tag) + ' ' + cyan(clientid) + '\n')

	  sleep(500).then(() => {
		console.log(greenBright('[>>] Loading events: ') + blurple(eventFiles))
	  })

	  sleep(500).then(() => {
		console.log(greenBright('[>>] Loading Folders: ') + blurple(commandFolders) + '\n')
	  })

	  sleep(500).then(() => {
		  client.user.setActivity('Starting up...', { type: 'PLAYING' });
	  })
	  sleep(10000).then(() => {
		setInterval(() => {
			const randomIndex = Math.floor(Math.random() * (activities.length - 1) + 1);
			const newActivity = activities[randomIndex];
			
			client.user.setActivity(newActivity)
		  }, 30000);
		})
})



const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}


const commandFolders = fs.readdirSync('./commands');

for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
	}
}


client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (command.guildOnly && message.channel.type === 'dm') {
		return message.reply('I can\'t execute that command inside DMs!');
	}

	if (command.permissions) {
		const authorPerms = message.channel.permissionsFor(message.author);
		if (!authorPerms || !authorPerms.has(command.permissions)) {
			return message.reply('You can not do this!');
		}
	}

	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}


	const { cooldowns } = client;

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;


	if (message.author.id === 'ownerid to skip cooldown') {
		return command.execute(message, args, client);
	}
	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	
	try {
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

client.on('message', message => {
	if (message.content === prefix + 'suggestion') {
        const intro = new Discord.MessageEmbed()
        .setTitle('What would you like the suggestion to be?')
        .setDescription('e.g I would like the bot to have a command that kills skinwalkers')
        .setColor('#0099ff')
        .setTimestamp()
        message.channel.send(intro)
        message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 90000, errors: ['time'] })
            .then(collected => {
                const suggestion = collected.first().content
                const embed = new Discord.MessageEmbed()
                .setTitle('Your suggestion has been sent to the owner')
                .setDescription(`${suggestion}`)
                .setColor('#0099ff')
                .setTimestamp()
                message.channel.send(embed)
                const ownerembed = new Discord.MessageEmbed()
                .setTitle(message.author.username + '#' + message.author.discriminator + ` suggestion`)
                .setDescription(`${suggestion}`)
                .setColor('#0099ff')
                .setTimestamp()
                client.channels.cache.find(channel => channel.id === 'channelid you want suggestions to be sent to').send(ownerembed)
            }) 
		}
	})


// Logins to the discord bot with token
client.login(token);
