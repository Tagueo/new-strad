const Discord = require("discord.js");
const db = require("../scripts/db");
const mLog = require("../scripts/mLog");

exports.run = async (client, message) => {

    const blockEmoji = client.assets.emojis.BLOCK,
        discountEmoji = client.assets.emojis.DISCOUNT;

    function addItem(client, embed, item) {
        if (item.discount > 100)
            item.discount = 100;
        else if (item.discount < 0)
            item.discount = 0;

        let notSaleableText, discountText = "", priceText = `${item.price} ${blockEmoji}`;
        let priceAfterDiscount = Math.round(item.price - item.price * (item.discount / 100));

        if (item.saleable === 1)
            notSaleableText = "";
        else
            notSaleableText = "\nCet item ne peut pas être vendu.";
        item.emoji = client.emojis.get(item.emoji);
        if (item.discount > 0) {
            discountText = ` • ${discountEmoji}`;
            priceText = `~~${item.price}~~ ${priceAfterDiscount} ${blockEmoji} (-${item.discount} %)`;
        }
        if (item.quantity === -1) item.quantity = "∞";
        embed
            .addField(`${item.emoji} ${item.buy_amount} x ${item.name}${discountText}`, "**Description :** " + item.description + "\n"
                + `**Prix :** ${priceText}\n**Stock :** ${item.quantity}\n**Numéro d'article :** ${item.id}` + notSaleableText);
    }

    let con = new db.Connection("localhost", client.config.mysqlUser, client.config.mysqlPass, "strad"),
        sql = "SELECT item_id AS id, item_name AS name, item_emoji AS emoji, description, price, is_buyable AS buyable,"
        + " is_saleable AS saleable, quantity, buy_amount, discount, script_name, type FROM items WHERE is_buyable = 1 ORDER BY id ASC",
        commandChannel = client.channels.get('415633143861739541');

    let items = await con.query(sql),
        shopEmbed = new Discord.RichEmbed()
            .setAuthor("Boutique")
            .setThumbnail("https://cdn.discordapp.com/attachments/543888518167003136/602227009468235791/SDVR_item.png")
            .addField("Aide", "Acheter un article : ``Strad buy"
                + " <numéro de l'article>``.\nExemple : ``Strad buy 1`` (pour acheter un changement de pseudonyme).");

    items.forEach(item => {
        item = {
            id: item.id,
            name: item.name,
            emoji: item.emoji,
            description: item.description,
            price: item.price,
            buyable: item.buyable,
            saleable: item.saleable,
            quantity: item.quantity,
            buy_amount: item.buy_amount,
            discount: item.discount,
            script_name: item.script_name,
            type: item.type
        };
        if (item.buyable === 1) addItem(client, shopEmbed, item);
    });

    shopEmbed.setFooter("Strad shop")
        .setColor(mLog.colors.SHOP);

    message.delete();
    commandChannel.send(shopEmbed);

    con.end();

};