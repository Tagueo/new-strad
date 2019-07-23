const Discord = require("discord.js");
const db = require("../scripts/db.js");

exports.run = (client, message, args) => {

    try {

        let con = new db.Connection("localhost", client.config.mysqlUser, client.config.mysqlPass, "strad");

        con.query(`SELECT * FROM users WHERE user_id = ${message.author.id}`, {}, rows => {

            if (!rows) {
                con.end();
                return;
            }

            con.query(`SELECT * FROM users ORDER BY creas_amount DESC`, {"results": rows[0], "rank": undefined}, (rows, dg) => {
                for (i=0;i<rows.length;i++) {
                    if (message.author.id == rows[i].user_id) {
                        dg["rank"] = i + 1;
                        break;
                    }
                }

                con.query(`SELECT has_items.item_id AS id, item_emoji AS emoji, has_items.amount AS amount FROM has_items INNER JOIN items ON items.item_id = has_items.item_id`
                    + ` WHERE user_id = "${message.author.id}" AND amount != 0 ORDER BY has_items.item_id ASC`, {}, rows => {
                    const stradEmoji = "<:block:547449530610745364>";
                    const creaEmoji = "<:crea:547482886824001539>";
                    let inventory = [];

                    if (rows[0]) {
                        for (let i=0;i<rows.length;i++) {
                            let emoji = client.emojis.get(rows[i]["emoji"]);
                            inventory[i] = `${emoji} x ${rows[0]["amount"]}`;
                        }
                    }

                    inventory = inventory.join(" • ");

                    if (inventory === "") inventory = "Ton inventaire est vide. Fais ``Strad shop`` pour acheter des items !";

                    const embedMoney = new Discord.RichEmbed()
                        .setAuthor(message.author.tag, message.author.avatarURL)
                        .setThumbnail(message.author.avatarURL)
                        .addField("Valeur du compte", `${dg["results"].money} ${stradEmoji}`, true)
                        .addField("Nombre de Créas", `${dg["results"].creas_amount} ${creaEmoji}`, true)
                        .addField("Rang", `#${dg["rank"]}`, true)
                        .addField("Titre artistique", dg["results"].rank, true)
                        .addField("Inventaire", inventory)
                        .setFooter("Strad rank")
                        .setColor(message.member.displayColor);

                    client.channels.get('415633143861739541').send(embedMoney);
                    message.delete();

                    con.end();
                })
            })

        });

    } catch (e) {
        console.log(e);
    }

};