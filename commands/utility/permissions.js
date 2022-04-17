const Discord = require('discord.js')
const client = new Discord.Client()
const { red, greenBright, cyan, yellow } = require("chalk");
const chalk = require('chalk');

module.exports = {
    name: "perms",
    description: "returns the permissions of the bot",
    cooldown: 2,
    execute(message, args){
        const perms = message.member.permissions.toArray()
        const embed = new Discord.MessageEmbed()
        .setTitle('Permissions')
        .setColor('#5865F2')
        .setDescription(`${perms}`)
        .setTimestamp()
        message.channel.send(embed)
    }
}
