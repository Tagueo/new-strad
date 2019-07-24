const Discord = require("discord.js");
const db = require("../scripts/db");
const mLog = require("../scripts/mLog");

exports.run = (client, message, args) => {

    let commandChannel = client.channels.get('415633143861739541');

    if (message.member.id === "315816143137013761") {
        let errorEmbed = new Discord.RichEmbed()
            .setAuthor("Changement de pseudonyme")
            .setDescription("Rôôôh Delphi, tu sais très bien que je n'ai pas la permission de te renommer... :confused:")
            .setColor(mLog.colors.ALERT);
        message.delete();
        commandChannel.send(errorEmbed);
        return;
    }

    function sendToTemp(messageContent) {
        message.channel.send(messageContent);
    }

    if (!args[0]) {
        let errorEmbed = new Discord.RichEmbed()
            .setAuthor("Aide")
            .setDescription("Changer de pseudonyme : ``Strad nick <pseudonyme>``.\nRétablir le pseudonyme par défaut (gratuit) : ``Strad nick default``.")
            .setColor(mLog.colors.NEUTRAL_BLUE);
        message.delete();
        commandChannel.send(errorEmbed);
        return;
    } else if (args[0].toLowerCase() === "default") {
        message.member.setNickname(message.author.username);
        let successEmbed = new Discord.RichEmbed()
            .setAuthor("Changement de pseudonyme")
            .setDescription("Ton pseudonyme est revenu à la normale !")
            .setColor(mLog.colors.NEUTRAL_BLUE);
        message.delete();
        commandChannel.send(errorEmbed);
        return;
    }

    var newNickname = args[0], itemId = 1, username = message.author.username,
        con = new db.Connection("localhost", client.config.mysqlUser, client.config.mysqlPass, "strad");

    con.query(`SELECT * FROM has_items WHERE user_id = "${message.member.id}" AND item_id = ${itemId}`, {}, rows => {
        if (!rows[0] || rows[0]["amount"] < 1) {
            let errorEmbed = new Discord.RichEmbed()
                .setAuthor("Boutique")
                .setDescription("Pour avoir accès à ça, fais ``Strad shop`` !")
                .setColor(mLog.colors.SHOP);
            message.delete();
            commandChannel.send(errorEmbed);
            con.end();
            return;
        }

        try {
            message.member.setNickname(newNickname);
        } catch (e) {
            let errorEmbed = new Discord.RichEmbed()
                .setAuthor("Changement de pseudonyme")
                .setDescription("Je ne peux pas te mettre ce pseudonyme, désolé !")
                .setColor(mLog.colors.ALERT);
            message.delete();
            commandChannel.send(errorEmbed);
            con.end();
            return;
        }

        con.query(`UPDATE has_items SET amount = amount - 1 WHERE user_id = "${message.member.id}" AND item_id = ${itemId}`, {}, rows => {
            let successEmbed = new Discord.RichEmbed()
                .setAuthor("Changement de pseudonyme")
                .setDescription(`Génial, ta nouvelle identité est prête !`)
                .setColor(mLog.colors.VALID);
            message.delete();
            commandChannel.send(successEmbed);

            mLog.run(client, "Changement de pseudonyme", `${username} a changé son pseudo en "${newNickname}"`, mLog.colors.NEUTRAL_BLUE);
            con.end();
        });
    });

};