const Discord = require("discord.js");
const db = require("../scripts/db.js");

exports.run = async (client, message) => {

    let con = new db.Connection("localhost", client.config.mysqlUser, client.config.mysqlPass, "strad");

    let rows = await con.query(`SELECT * FROM users WHERE user_id = "${message.author.id}"`).then((w) => {
        console.log(w);
    });

    if (!rows) {
        con.end();
        return;
    }

    let users = await con.query(`SELECT *
                                 FROM users
                                 WHERE creas_amount <> 0
                                 ORDER BY creas_amount DESC`),
        userItems = await con.query(`SELECT has_items.item_id AS id, item_emoji AS emoji, has_items.amount AS amount
                                    FROM has_items INNER JOIN items ON items.item_id = has_items.item_id
                                    WHERE user_id = "${message.author.id}" AND amount != 0
                                    ORDER BY has_items.item_id ASC`),
        inventory = [],
        rank = 0,
        concernedUser = rows[0];
    const stradEmoji = "<:block:547449530610745364>";
    const creaEmoji = "<:crea:547482886824001539>";

    for (i = 0; i < rows.length; i++) {
        if (message.author.id == users[i].user_id) {
            rank = i + 1;
            break;
        }
    }

    if (userItems[0]) {
        for (let i = 0; i < userItems.length; i++) {
            let emoji = client.emojis.get(userItems[i].emoji);
            inventory[i] = `${emoji} x ${userItems[i].amount}`;
        }
    }

    inventory = inventory.join(" • ");
    if (inventory === "") inventory = "Ton inventaire est vide. Fais ``Strad shop`` pour acheter des items !";

    const rankEmbed = new Discord.RichEmbed()
        .setAuthor(message.author.tag, message.author.avatarURL)
        .setThumbnail(message.author.avatarURL)
        .addField("Valeur du compte", `${concernedUser.money} ${stradEmoji}`, true)
        .addField("Nombre de Créas", `${concernedUser.creas_amount} ${creaEmoji}`, true)
        .addField("Rang", `#${rank}`, true)
        .addField("Titre artistique", concernedUser.rank, true)
        .addField("Inventaire", inventory)
        .setFooter("Strad rank")
        .setColor(message.member.displayColor);

    client.channels.get('415633143861739541').send(rankEmbed);
    message.delete();

    con.end();

};