const Discord = require("discord.js");
const db = require("../scripts/db.js");

exports.run = (client, message, args) => {

    try {

        var con = new db.Connection("localhost", client.config.mysqlUser, client.config.mysqlPass, "strad");

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

                const stradEmoji = "<:block:547449530610745364>";
                const creaEmoji = "<:crea:547482886824001539>";

                const embedMoney = new Discord.RichEmbed()
                    .setAuthor(message.author.tag, message.author.avatarURL)
                    .setThumbnail(message.author.avatarURL)
                    .addField("Valeur du compte", `${dg["results"].money} ${stradEmoji}`, true)
                    .addField("Nombre de Créas", `${dg["results"].creas_amount} ${creaEmoji}`, true)
                    .addField("Rang", `#${dg["rank"]}`, true)
                    .addField("Titre artistique", `${dg["results"].rank}`, true)
                    .setFooter("Strad rank")
                    .setColor(message.member.displayColor);

                client.channels.get('415633143861739541').send(embedMoney);
                message.delete();

                con.end();
            })

        });

    } catch (e) {

        console.log(e);

    }

};