const Discord = require('discord.js');

exports.run = (client, title, content, color=exports.colors.NEUTRAL, callback=undefined) => {
    var logChannel = client.guilds.find(g => g.id === "412369732679893004").channels.find(c => c.id === client.config.logsChannel);
    var logEmbed = new Discord.RichEmbed()
        .setAuthor(title)
        .setDescription(content)
        .setColor(color);
    logChannel.send(logEmbed)
        .then(m => {
            if (callback) callback(m);
        });
};

exports.colors = {
    "NEUTRAL": 0xffffff,
    "NEUTRAL_BLUE": 0x21b1ff,
    "VALID": 0x5ab244,
    "WARNING": 0xffac00,
    "ALERT": 0xf44242,

    "SHOP": 0x00f33f,
    "SDVR": 0xff6b3e,
    "DOWNLOAD": 0x00eaa1,

    "MODERATOR": 0xffdb00
};