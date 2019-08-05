const Discord = require("discord.js");
const db = require("../scripts/db");
const mLog = require("../scripts/mLog");
var moment = require("moment");

exports.run = (client, message, args) => {

    function findKey(rows, keyFace) {
        let key = null;
        for (let i=0;i<rows.length;i++) {
            if (rows[i]["key_face"] === keyFace) key = rows[i];
        }
        return key;
    }

    let commandChannel = client.channels.get('415633143861739541');

    if (!args[0]) {
        let errorEmbed = new Discord.RichEmbed()
            .setAuthor("Commande erronée")
            .setDescription("Merci de saisir la clé à utiliser. Utilisation : ``Strad redeem <clé>``.")
            .setColor(mLog.colors.ALERT);
        message.delete();
        commandChannel.send(errorEmbed);
        return;
    }

    let keyFace = args[0], todayDate = moment().format('DD/MM/YY');
    let con = new db.Connection("localhost", client.config.mysqlUser, client.config.mysqlPass, "strad");

    con.query(`SELECT * FROM blocks_keys`, {}, keys => {

        if (keys[0]) {
            let key = findKey(keys, keyFace);

            if (key) {
                if (!key["recipient_id"]) {
                    con.query(`UPDATE blocks_keys SET recipient_id = "${message.author.id}", redeem_date = "${todayDate}" WHERE key_id = ${key["key_id"]}`, {}, rows => {
                        con.query(`UPDATE users SET money = money + ${key["key_value"]} WHERE user_id = "${message.author.id}"`, {}, rows => {

                            let successEmbed = new Discord.RichEmbed()
                                .setAuthor("Récupération réussie")
                                .setDescription("Youpi ! La clé ``" + keyFace + "`` est valide. Tu viens de recevoir **" + key["key_value"] + "** <:block:547449530610745364> !")
                                .setFooter("Strad redeem <clé>")
                                .setColor(mLog.colors.VALID);
                            message.delete();
                            commandChannel.send(successEmbed);

                            mLog.run(client, "Récupération de clé", message.author + " a utilisé la clé ``" + keyFace + "`` d'une valeur de **" + key["key_value"] + "** <:block:547449530610745364>.",
                                mLog.colors.NEUTRAL_BLUE);

                            con.end();

                        });
                    });
                } else {
                    let errorEmbed = new Discord.RichEmbed()
                        .setAuthor("Récupération impossible")
                        .setDescription("La clé ``" + keyFace + "`` a déjà été utilisée. En cas de litige, contacte un Mentor en message privé.")
                        .setColor(mLog.colors.ALERT);
                    message.delete();
                    commandChannel.send(errorEmbed);
                    con.end();
                }
            } else {
                let errorEmbed = new Discord.RichEmbed()
                    .setAuthor("Récupération impossible")
                    .setDescription("La clé ``" + keyFace + "`` n'est pas valide. Format : ``XXXX-XXXX-XXXX-XXXX``.")
                    .setColor(mLog.colors.ALERT);
                message.delete();
                commandChannel.send(errorEmbed);
                con.end();
            }
        } else {
            let errorEmbed = new Discord.RichEmbed()
                .setAuthor("Récupération impossible")
                .setDescription("La clé ``" + keyFace + "`` n'est pas valide. Format : ``XXXX-XXXX-XXXX-XXXX``.")
                .setColor(mLog.colors.ALERT);
            message.delete();
            commandChannel.send(errorEmbed);
            con.end();
        }

    });

};