const chalk = require('chalk');
const Discord = require('discord.js');
var moment = require('moment');

module.exports = async (client) => {
    var stradivarius = client.guilds.find(g => g.id === "412369732679893004");

    console.log(`[${chalk.cyan(moment(Date.now()).format('h:mm:ss'))}] [${chalk.yellow(client.user.tag)}] Pret à servir dans ${chalk.cyan(client.channels.size)} channels sur ${chalk.cyan(client.guilds.size)} serveurs, pour un total de ${chalk.cyan(client.users.size)} utilisateurs.`);
    client.user.setActivity(`Strad help`, {
        type: 'STREAMING',
        url: 'https://www.twitch.tv/delphistudio'
    })
        .then(presence => console.log(`[${chalk.cyan(moment(Date.now()).format('h:mm:ss'))}] [${chalk.yellow(client.user.tag)}] Activity set`))
        .catch(console.error);

    // Distributeur de rôles
    var roleMsgId = "570618282177069076", notifMsgId = "601739344163897344";
    stradivarius.channels.find(c => c.id === "570605835172970496").fetchMessage(roleMsgId);
    stradivarius.channels.find(c => c.id === "570605835172970496").fetchMessage(notifMsgId);
};