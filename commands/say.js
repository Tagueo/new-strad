const Discord = require("discord.js");
const db = require("../scripts/db");
const mLog = require("../scripts/mLog");

exports.run = async (client, message, args) => {

    let commandChannel = client.channels.get('415633143861739541');

    if (!args[0]) {
        let errorEmbed = new Discord.RichEmbed()
            .setAuthor("Aide")
            .setDescription("Faire parler Strad : ``Strad say <message>``.")
            .setColor(mLog.colors.NEUTRAL_BLUE);
        message.delete();
        commandChannel.send(errorEmbed);
        return;
    }

    let msg = args.join(" "),
        itemId = 2,
        con = new db.Connection("localhost", client.config.mysqlUser, client.config.mysqlPass, "strad");

    let sayItem = (await con.query(`SELECT * FROM has_items WHERE user_id = "${message.member.id}" AND item_id = ${itemId}`))[0];

    if (!sayItem || sayItem.amount < 1) {
        let errorEmbed = new Discord.RichEmbed()
            .setAuthor("Boutique")
            .setDescription("Pour avoir accès à ça, fais ``Strad shop`` !")
            .setColor(mLog.colors.SHOP);
        message.delete();
        commandChannel.send(errorEmbed);
        con.end();
        return;
    }

    message.delete();
    message.channel.send(msg); // Envoi du message personnalisé

    mLog.run(client, "Strad say", `${message.author} a envoyé un message via Strad : "${msg}"`, mLog.colors.NEUTRAL_BLUE);

    await con.query(`UPDATE has_items SET amount = amount - 1 WHERE user_id = "${message.member.id}" AND item_id = ${itemId}`);

    con.end();

};