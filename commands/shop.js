const Discord = require("discord.js");
const db = require("../scripts/db");
const mp = require("../scripts/msgPresets");

function addItem(embed, item) {
    var notSaleableText;
    if (item.saleable === 1)
        notSaleableText = "";
    else
        notSaleableText = "\nCet item ne peut être vendu.";
    if (item.emoji.length > 1) item.emoji = client.emojis.get(item.emoji);
    embed
        .addField(`${item.id}. ${item.buy_amount} x ${item.name} ${item.emoji}`, `${item.description}\n\n"
            + "Prix : ${item.price} <:block:547449530610745364>` + notSaleableText);
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
            .setAuthor("Boutique")
            .addField("Aide", "Pour acheter un article dans la boutique, tape la commande **Strad buy"
                + " <numéro de l'article>**.\nExemple : Strad buy 1 (pour acheter un changement de pseudonyme)\n"
                + "Pour accéder aux détails d'un article, tape la commande **Strad view <numéro de l'article>**.");
        rows.forEach(row => {
            let item = {
                id: id,
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
            if (item.buyable === 1) addItem(shopEmbed, item);
        });
        message.channel.send(shopEmbed); // TODO Mettre l'id du salon #commandes après le développement

        con.end();
    });

};