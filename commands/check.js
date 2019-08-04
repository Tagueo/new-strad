const Discord = require("discord.js");
const db = require("../scripts/db");
const mp = require("../scripts/msgPresets"); // TODO À retirer
const mLog = require("../scripts/mLog");

exports.run = (client, message, args) => {

    function findKey(rows, keyPrint) {
        let key = null;
        for (let i=0;i<rows.length;i++) {
            if (rows[i]["key_print"] === keyPrint) key = rows[i];
        }
        return key;
    }

    if (!message.member.roles.find(r => r.name === "Mentor")) {
        message.delete();
        mp.sendWIP(client.channels.get('415633143861739541'));
        return;
    } // TODO À retirer après le développement

    function sendToTemp(messageContent) {
        message.channel.send(messageContent);
    }

    let commandChannel = client.channels.get('415633143861739541');

    if (!args[0]) {
        let errorEmbed = new Discord.RichEmbed()
            .setAuthor("Commande erronée")
            .setDescription("Merci de saisir l'empreinte de la clé à vérifier. Utilisation : ``Strad check <empreinte>``.")
            .setColor(mLog.colors.ALERT);
        message.delete();
        // commandChannel.send(errorEmbed);
        sendToTemp(errorEmbed); // TODO À retirer
        return;
    }

    let keyPrint = args[0];
    let con = new db.Connection("localhost", client.config.mysqlUser, client.config.mysqlPass, "strad");

    con.query(`SELECT * FROM blocks_keys`, {}, keys => {

        if (keys[0]) {
            let key = findKey(keys, keyPrint);

            if (key) {
                // TODO CONTINUER ICI ! (affichage des infos liées à la clé)
            } else {
                let errorEmbed = new Discord.RichEmbed()
                    .setAuthor("Clé introuvable")
                    .setDescription("L'empreinte ``" + keyPrint + "`` n'est liée à aucune clé existante. Format : ``XX-XXXX``.")
                    .setColor(mLog.colors.ALERT);
                message.delete();
                // commandChannel.send(errorEmbed);
                sendToTemp(errorEmbed); // TODO À retirer
                con.end();
                return;
            }
        } else {
            let errorEmbed = new Discord.RichEmbed()
                .setAuthor("Clé introuvable")
                .setDescription("L'empreinte ``" + keyPrint + "`` n'est liée à aucune clé existante. Format : ``XX-XXXX``.")
                .setColor(mLog.colors.ALERT);
            message.delete();
            // commandChannel.send(errorEmbed);
            sendToTemp(errorEmbed); // TODO À retirer
            con.end();
        }

    });

};