const Discord = require("discord.js");
const db = require("../scripts/db");
const mp = require("../scripts/msgPresets"); // TODO À retirer
const mLog = require("../scripts/mLog");

exports.run = (client, message, args) => {

    if (!message.member.roles.find(r => r.name === "Mentor")) {
        message.delete();
        mp.sendWIP(client.channels.get('415633143861739541'));
        return;
    } // TODO À retirer après le développement

    function sendToTemp(messageContent) {
        message.channel.send(messageContent);
    }

    var commandChannel = client.channels.get('415633143861739541');

    if (!args[0]) {
        let errorEmbed = new Discord.RichEmbed()
            .setAuthor("Aide")
            .setDescription("Faire parler Strad : ``Strad say <message>``.")
            .setColor(mLog.colors.NEUTRAL_BLUE);
        message.delete();
        // commandChannel.send(errorEmbed);
        sendToTemp(errorEmbed); // TODO À retirer
        return;
    }

    let msg = args.join(" "), itemId = 2,
        con = new db.Connection("localhost", client.config.mysqlUser, client.config.mysqlPass, "strad");

    con.query(`SELECT * FROM has_items WHERE user_id = "${message.member.id}" AND item_id = ${itemId}`, {}, rows => {
        if (!rows[0] || rows[0]["amount"] < 1) {
            let errorEmbed = new Discord.RichEmbed()
                .setAuthor("Boutique")
                .setDescription("Pour avoir accès à ça, fais ``Strad shop`` !")
                .setColor(mLog.colors.SHOP);
            message.delete();
            // commandChannel.send(errorEmbed);
            sendToTemp(errorEmbed); // TODO À retirer
            con.end();
            return;
        }

        message.delete();
        message.channel.send(msg);
        mLog.run(client, "Strad say", `${message.author} a envoyé un message via Strad : "${msg}"`, mLog.colors.NEUTRAL_BLUE);

        con.query(`UPDATE has_items SET amount = amount - 1 WHERE user_id = "${message.member.id}" AND item_id = ${itemId}`, {}, rows => {
            con.end();
        });
    });

};