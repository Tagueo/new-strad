const Discord = require("discord.js");
const db = require("../scripts/db");
const mp = require("../scripts/msgPresets");

function addItem(client, embed, item) {
    var notSaleableText;
    if (item.saleable === 1)
        notSaleableText = "";
    else
        notSaleableText = "\nCet item ne peut pas être vendu.";
    item.emoji = client.emojis.get(item.emoji);
    embed
        .addField(`${item.emoji} ${item.buy_amount} x ${item.name}`, `${item.description}\n`
            + `**Prix :** ${item.price} <:block:547449530610745364>\n**Numéro d'article :** ${item.id}` + notSaleableText);
}

exports.run = (client, message, args) => {

    if (!message.member.roles.find(r => r.name === "Mentor")) {
        message.delete();
        mp.sendWIP(client.channels.get('415633143861739541'));
        return;
    } // TODO À retirer après le développement

    var con = new db.Connection("localhost", client.config.mysqlUser, client.config.mysqlPass, "strad");

    sql = "SELECT item_id AS id, item_name AS name, item_emoji AS emoji, description, price, is_buyable AS buyable,"
        + " is_saleable AS saleable, quantity, buy_amount, discount, script_name, type FROM items WHERE is_buyable = 1 ORDER BY id ASC";
    con.query(sql, {}, (rows) => {
        var shopEmbed = new Discord.RichEmbed()
            .setColor("#ffd500")
            .setAuthor("Boutique")
            .addField("Aide", "• Acheter un article : **Strad buy"
                + " <numéro de l'article>**.\nExemple : Strad buy 1 (pour acheter un changement de pseudonyme)\n"
                + "• Accéder aux détails d'un article : **Strad view <numéro de l'article>**.")
            .addBlankField();
        rows.forEach(row => {
            let item = {
                id: row["id"],
                name: row["name"],
                emoji: row["emoji"],
                description: row["description"],
                price: row["price"],
                buyable: row["buyable"],
                saleable: row["saleable"],
                quantity: row["quantity"],
                buy_amount: row["buy_amount"],
                discount: row["discount"],
                script_name: row["script_name"],
                type: row["type"]
            };
            if (item.buyable === 1) addItem(client, shopEmbed, item);
        });

        message.delete();
        message.channel.send(shopEmbed); // TODO Mettre l'id du salon #commandes après le développement

        con.end();
    });

};