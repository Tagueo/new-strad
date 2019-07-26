const Discord = require("discord.js");
const db = require("../scripts/db");
const mp = require("../scripts/msgPresets"); // TODO À retirer
const mLog = require("../scripts/mLog");

exports.run = (client, message, args) => {

    function createKey() {
        let possibleChars = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N",
            "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "1", "2", "3", "4", "5", "6", "7", "8", "9"], res = "", randomNumber, keyFace = [];

        for (let i=0;i<4;i++) {
            res = "";
            for (let j=0;j<4;i++) {
                randomNumber = Math.floor(Math.random() * 26);
                res += possibleChars[randomNumber]
            }
            keyFace[i] = res;
        }
        return keyFace.join("-");
    }

    function keyExists(rows, keyFace) {
        let b = false;
        for (let i=0;i<rows.length;i++) {
            if (rows[i]["keyface"] === keyFace) b = true;
        }
        return b;
    }

    if (!message.member.roles.find(r => r.name === "Mentor")) {
        message.delete();
        mp.sendWIP(client.channels.get('415633143861739541'));
        return;
    } // TODO À retirer après le développement

    function sendToTemp(messageContent) {
        message.channel.send(messageContent);
    }

    let commandChannel = client.channels.get('415633143861739541'), chosenValue;
    let minAllowedValue = 50, maxAllowedValue = 15000;

    if (!args[0] || isNaN(args[0])) {
        let errorEmbed = new Discord.RichEmbed()
            .setAuthor("Commande erronée")
            .setDescription("Merci de saisir une valeur en Blocs valide. Utilisation : ``Strad ckey <valeur>``.")
            .setColor(mLog.colors.ALERT);
        message.delete();
        // commandChannel.send(errorEmbed);
        sendToTemp(errorEmbed); // TODO À retirer
        return;
    } else
        chosenValue = parseInt(args[0]);

    if ((chosenValue < minAllowedValue) || (chosenValue > maxAllowedValue)) {
        let errorEmbed = new Discord.RichEmbed()
            .setAuthor("Création de clé impossible")
            .setDescription("Tu dois saisir une valeur en Blocs comprise entre 50 et 15000.")
            .setColor(mLog.colors.ALERT);
        message.delete();
        // commandChannel.send(errorEmbed);
        sendToTemp(errorEmbed); // TODO À retirer
        return;
    }

    let keyFace = createKey();
    let con = new db.Connection("localhost", client.config.mysqlUser, client.config.mysqlPass, "strad");

    con.query(`SELECT money FROM users WHERE user_id = "${message.author.id}"`, {}, rows => {

        let money = rows[0]["money"];

        if (chosenValue < money) {
            let errorEmbed = new Discord.RichEmbed()
                .setAuthor("Création de clé impossible")
                .setDescription(`Tu n'as pas assez de Blocs pour créer cette clé. Il te manque ${chosenValue - money} <:block:547449530610745364> !`)
                .setColor(mLog.colors.ALERT);
            message.delete();
            // commandChannel.send(errorEmbed);
            sendToTemp(errorEmbed); // TODO À retirer
            con.end();
            return;
        }

        con.query(`SELECT * FROM blocks_keys`, {}, keys => {

            if (keys[0]) {
                while (keyExists(keys, keyFace)) {
                    keyFace = createKey();
                }
            }

            con.query(`INSERT INTO blocks_keys (key_face, key_value, creator_id) VALUES ("${keyFace}", ${chosenValue}, "${message.author.id}")`, {}, rows => {
                con.query(`UPDATE users SET money = money - ${chosenValue} WHERE user_id = "${message.author.id}"`, {}, rows => {

                    let publicSuccessEmbed = new Discord.RichEmbed()
                        .setAuthor("Création effectuée")
                        .setDescription("Ta clé a correctement été débloquée. Tu l'as reçue en message privé !")
                        .setColor(mLog.colors.ALERT);
                    message.delete();
                    // commandChannel.send(errorEmbed);
                    sendToTemp(publicSuccessEmbed); // TODO À retirer

                    let privateSuccessEmbed = new Discord.RichEmbed()
                        .setAuthor("Ceci est un test")
                        .setDescription("Cet article est introuvable.")
                        .setColor(mLog.colors.ALERT);
                    message.delete();
                    message.member.send(privateSuccessEmbed);

                    con.end();

                });
            });
        });
    });

};