const Discord = require("discord.js");
const db = require("../scripts/db");
const mp = require("../scripts/msgPresets"); // TODO À retirer
const mLog = require("../scripts/mLog");

exports.run = (client, message, args) => {

    function createKey() {
        let alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N",
            "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"], res = "", randomNumber, keyFace = [];

        for (let i=0;i<4;i++) {
            res = ""
            for (let j=0;j<4;i++) {
                randomNumber = Math.floor(Math.random() * 26);
                res += alphabet[randomNumber]
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

    let commandChannel = client.channels.get('415633143861739541'), choosenId;
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

    con.query(`SELECT * FROM blocks_keys`, {}, keys => {

        if (keys[0]) {
            while (keyExists(keys, keyFace)) {
                keyFace = createKey();
            }
        } else {

        }

        con.query(`SELECT * FROM items WHERE item_id = ${choosenId}`, {"money": money}, (rows, dg) => {
            let item = rows[0];

            if (!item) {
                let errorEmbed = new Discord.RichEmbed()
                    .setAuthor("Achat impossible")
                    .setDescription("Cet article est introuvable.")
                    .setColor(mLog.colors.ALERT);
                message.delete();
                // commandChannel.send(errorEmbed);
                sendToTemp(errorEmbed); // TODO À retirer
                con.end();
                return;
            } else if (item["is_buyable"] === 0) {
                let errorEmbed = new Discord.RichEmbed()
                    .setAuthor("Achat impossible")
                    .setDescription("Cet article n'est pas à vendre.")
                    .setColor(mLog.colors.ALERT);
                message.delete();
                // commandChannel.send(errorEmbed);
                sendToTemp(errorEmbed); // TODO À retirer
                con.end();
                return;
            } else if ((item["quantity"] > -1) && (item["quantity"] < item["buy_amount"])) {
                let errorEmbed = new Discord.RichEmbed()
                    .setAuthor("Achat impossible")
                    .setDescription(`Il ne reste plus assez de stocks pour acheter **${item["buy_amount"]} x ${item["item_name"]}**.`)
                    .setColor(mLog.colors.ALERT);
                message.delete();
                // commandChannel.send(errorEmbed);
                sendToTemp(errorEmbed); // TODO À retirer
                con.end();
                return;
            } else if (dg["money"] < item["price"]) {
                let errorEmbed = new Discord.RichEmbed()
                    .setAuthor("Achat impossible")
                    .setDescription(`Tu n'as pas assez d'argent pour acheter **${item["buy_amount"]}"
                        + " x ${item["item_name"]}**. Il te manque encore ${item["price"] - dg["money"]} <:block:547449530610745364> !`)
                    .setColor(mLog.colors.ALERT);
                message.delete();
                // commandChannel.send(errorEmbed);
                sendToTemp(errorEmbed); // TODO À retirer
                con.end();
                return;
            }

            let priceAfterDiscount = Math.round(item["price"] - item["price"] * (item["discount"] / 100));

            con.query(`UPDATE users SET money = ${dg["money"] - priceAfterDiscount} WHERE user_id = "${message.member.id}"`,
                {"item": item}, (rows, dg) => {
                con.query(`SELECT * FROM has_items WHERE user_id = "${message.member.id}" AND item_id = ${dg["item"]["item_id"]}`,
                    {"item": dg["item"]}, (rows, dg) => {
                    let sql, item = dg["item"];
                    if (rows[0])
                        sql = `UPDATE has_items SET amount = amount + ${item["buy_amount"]} WHERE user_id = "${message.member.id}" AND item_id = ${item["item_id"]}`;
                    else
                        sql = `INSERT INTO has_items (user_id, item_id, amount) VALUES("${message.member.id}", ${item["item_id"]}, ${item["buy_amount"]})`;
                    con.query(sql, {"item": item}, (rows, dg) => {
                        var item = dg["item"];
                        let successEmbed = new Discord.RichEmbed()
                            .setAuthor("Achat réussi")
                            .setDescription(`Tu as acheté **${item["buy_amount"]} x ${item["item_name"]}** pour **${priceAfterDiscount}** <:block:547449530610745364> !`)
                            .setFooter("Tape \"Strad rank\" pour accéder à ton inventaire")
                            .setColor(mLog.colors.VALID);
                        message.delete();
                        // commandChannel.send(successEmbed);
                        sendToTemp(successEmbed); // TODO À retirer
                        if (item["quantity"] !== -1) {
                            con.query(`UPDATE items SET quantity = quantity - ${item["buy_amount"]} WHERE item_id = ${item["item_id"]}`, {}, rows => {
                                con.end();
                            })
                        } else
                            con.end();
                    })
                });
            });
        });
    });

};