const Discord = require("discord.js");
const db = require("../scripts/db.js");

exports.run = async (client, message) => {

    const blockEmoji = client.assets.emojis.BLOCK;
    const creaEmoji = client.assets.emojis.CREA;

    let con = new db.Connection("localhost", client.config.mysqlUser, client.config.mysqlPass, "strad");

    let rows = await con.query(`SELECT * FROM users WHERE user_id = "${message.author.id}"`);

    if (!rows) {
        con.end();
        return;
    }

    let users = await con.query(`SELECT *
                                 FROM users
                                 ORDER BY creas_amount DESC`),
        userItems = await con.query(`SELECT has_items.item_id AS id, item_emoji AS emoji, has_items.amount AS amount
                                    FROM has_items INNER JOIN items ON items.item_id = has_items.item_id
                                    WHERE user_id = "${message.author.id}" AND amount != 0
                                    ORDER BY has_items.item_id ASC`),
        inventory = [],
        rank = 0,
        user = rows[0];

    for (i = 0; i < users.length; i++) {
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
        .addField("Valeur du compte", `${user.money} ${blockEmoji}`, true)
        .addField("Nombre de Créas", `${user.creas_amount} ${creaEmoji}`, true)
        .addField("Rang", `#${rank}`, true)
        .addField("Titre artistique", user.rank, true)
        .addField("Inventaire", inventory)
        .setFooter("Strad rank")
        .setColor(message.member.displayColor);

    client.channels.get('415633143861739541').send(rankEmbed);
    message.delete();

    con.end();

};