const Discord = require("discord.js");
const db = require("../classes/db");
const mLog = require("../functions/mLog");

exports.run = async (client, message) => {

    let quantity = 10, // Quantité de membres affichés dans le top 10
        con = new db.Connection("localhost", client.config.mysqlUser, client.config.mysqlPass, "strad");

    let users = await con.query(`SELECT * FROM users ORDER BY creas_amount DESC LIMIT ${quantity}`),
        otherLeaders = "";
    const creaEmoji = client.assets.emojis.CREA,
        topEmbed = new Discord.RichEmbed()
            .setAuthor(`Stradivarius - Classement (Créas)`);

    for (i = 0; i < 2; i++) { // Podium
        topEmbed.addField(`${i + 1}. ${users[i].usertag}`, `**${users[i].creas_amount}** ${creaEmoji}`, true);
    }
    for (i = 2; i < quantity; i++) { // Reste du classement
        otherLeaders += `\`\`${i + 1}. ${users[i].creas_amount}\`\` - ${users[i].usertag}\n`;
    }

    topEmbed.addField(`Top ${quantity}`, otherLeaders, false);
    topEmbed.setFooter("Strad top");
    topEmbed.setColor(mLog.colors.SDVR);

    client.channels.get('415633143861739541').send(topEmbed);
    message.delete();

    con.end();

};