const Discord = require("discord.js");
const db = require("../scripts/db");
const mLog = require("../scripts/mLog");

exports.run = async (client, message, args) => {

    let commandChannel = client.channels.get('415633143861739541'), chosenId;

    if (!args[0] || isNaN(args[0])) {
        let errorEmbed = new Discord.RichEmbed()
            .setAuthor("Commande erronée")
            .setDescription("Merci de saisir un numéro d'article valide.")
            .setColor(mLog.colors.ALERT);
        message.delete();
        commandChannel.send(errorEmbed);
        return;
    } else
        chosenId = parseInt(args[0]);

    let con = new db.Connection("localhost", client.config.mysqlUser, client.config.mysqlPass, "strad");
    let res1 = await con.query(`SELECT money FROM users WHERE user_id = "${message.member.id}"`);
    let res2 = await con.query(`SELECT * FROM items WHERE item_id = ${chosenId}`);
    money = res1[0].money, item = res2[0];

    if (!item) {
        const errorEmbed = new Discord.RichEmbed()
            .setAuthor("Achat impossible")
            .setDescription("Cet article est introuvable.")
            .setColor(mLog.colors.ALERT);
        message.delete();
        commandChannel.send(errorEmbed);
        con.end();
        return;
    }

    let priceAfterDiscount = Math.round(item.price - item.price * (item.discount / 100));

    if (item.is_buyable === 0) {
        const errorEmbed = new Discord.RichEmbed()
            .setAuthor("Achat impossible")
            .setDescription("Cet article n'est pas à vendre.")
            .setColor(mLog.colors.ALERT);
        message.delete();
        commandChannel.send(errorEmbed);
        con.end();
        return;
    } else if ((item.quantity > -1) && (item.quantity < item.buy_amount)) {
        const errorEmbed = new Discord.RichEmbed()
            .setAuthor("Achat impossible")
            .setDescription(`Il ne reste plus assez de stocks pour acheter **${item.buy_amount} x ${item.item_name}**.`)
            .setColor(mLog.colors.ALERT);
        message.delete();
        commandChannel.send(errorEmbed);
        con.end();
        return;
    } else if (money < priceAfterDiscount) {
        const errorEmbed = new Discord.RichEmbed()
            .setAuthor("Achat impossible")
            .setDescription(`Tu n'as pas assez d'argent pour acheter **${item.buy_amount}`
                + ` x ${item.item_name}**. Il te manque encore ${priceAfterDiscount - money} <:block:547449530610745364> !`)
            .setColor(mLog.colors.ALERT);
        message.delete();
        commandChannel.send(errorEmbed);
        con.end();
        return;
    }

    // Prélèvement de l'argent sur le compte de l'utilisateur
    await con.query(`UPDATE users SET money = ${money - priceAfterDiscount} WHERE user_id = "${message.member.id}"`);

    let items = await con.query(`SELECT * FROM has_items WHERE user_id = "${message.member.id}" AND item_id = ${item.item_id}`),
        sql;

    if (items[0])
        sql = `UPDATE has_items SET amount = amount + ${item.buy_amount} WHERE user_id = "${message.member.id}" AND item_id = ${item.item_id}`;
    else
        sql = `INSERT INTO has_items (user_id, item_id, amount) VALUES ("${message.member.id}", ${item.item_id}, ${item.buy_amount})`;

    await con.query(sql);

    const successEmbed = new Discord.RichEmbed()
        .setAuthor("Achat réussi")
        .setDescription(`Tu as acheté **${item.buy_amount} x ${item.item_name}** pour **${priceAfterDiscount}** <:block:547449530610745364> !`)
        .setFooter("Tape \"Strad rank\" pour accéder à ton inventaire")
        .setColor(mLog.colors.VALID);
    message.delete();
    commandChannel.send(successEmbed);

    mLog.run(client, "Strad buy", `${message.author} a acheté **${item.buy_amount} x ${item.item_name}** pour **${priceAfterDiscount}** <:block:547449530610745364>.`,
        mLog.colors.NEUTRAL_BLUE);

    if (item.quantity !== -1) {
        await con.query(`UPDATE items SET quantity = quantity - ${item.buy_amount} WHERE item_id = ${item.item_id}`);
    }

    con.end();

};