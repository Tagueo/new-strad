const Discord = require("discord.js");
const db = require("../scripts/db");
const mLog = require("../scripts/mLog");

function addItem(client, embed, item) {
    if (item.discount > 100)
        item.discount = 100;
    else if (item.discount < 0)
        item.discount = 0;

    let notSaleableText, discountText = "", priceText = `${item.price} <:block:547449530610745364>`, discountEmoji = client.emojis.get("603356048107241483");
    let priceAfterDiscount = Math.round(item.price - item.price * (item.discount / 100));

    if (item.saleable === 1)
        notSaleableText = "";
    else
        notSaleableText = "\nCet item ne peut pas être vendu.";
    item.emoji = client.emojis.get(item.emoji);
    if (item.discount > 0) {
        discountText = ` • ${discountEmoji}`;
        priceText = `~~${item.price}~~ ${priceAfterDiscount} <:block:547449530610745364> (-${item.discount} %)`;
    }
    embed
        .addField(`${item.emoji} ${item.buy_amount} x ${item.name}${discountText}`, "**Description :** " + item.description + "\n"
            + `**Prix :** ${priceText}\n**Numéro d'article :** ${item.id}` + notSaleableText);
}

exports.run = async (client, message, args) => {

    let con = new db.Connection("localhost", client.config.mysqlUser, client.config.mysqlPass, "strad"),
        sql = "SELECT item_id AS id, item_name AS name, item_emoji AS emoji, description, price, is_buyable AS buyable,"
        + " is_saleable AS saleable, quantity, buy_amount, discount, script_name, type FROM items WHERE is_buyable = 1 ORDER BY id ASC",
        commandChannel = client.channels.get('415633143861739541');

    con.query(sql, {}, (rows) => {
        let shopEmbed = new Discord.RichEmbed()
            .setAuthor("Boutique")
            .setThumbnail("https://cdn.discordapp.com/attachments/543888518167003136/602227009468235791/SDVR_item.png")
            .addField("Aide", "Acheter un article : ``Strad buy"
                + " <numéro de l'article>``.\nExemple : ``Strad buy 1`` (pour acheter un changement de pseudonyme).");
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
        shopEmbed.setFooter("Strad shop")
            .setColor(mLog.colors.SHOP);

        message.delete();
        commandChannel.send(shopEmbed);

        con.end();
    });

};