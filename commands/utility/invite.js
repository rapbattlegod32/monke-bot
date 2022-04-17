const Discord = require('discord.js')
const bot = require('../../settings/botsecrets.json')
const { red, greenBright, cyan, yellow } = require("chalk");
const chalk = require('chalk');
  

module.exports = {
    name: "invite",
    description: "Send's a invite of the bot.",
    cooldown: 2,
    execute(message, args){
        const embed = new Discord.MessageEmbed()
        .setTitle('Invite')
        .setURL(bot.invite)
        .setColor('#5865F2')
        .setDescription(bot.invite)
        .setTimestamp()
        message.channel.send(embed)
    }
}
