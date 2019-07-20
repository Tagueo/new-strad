const Discord = require("discord");
const db = require("../scripts/db");
const mp = require("../scripts/msgPresets");

function formatItem(itemId) {
    // TODO À compléter
}

exports.run = (client, message, args) => {

    if (!message.member.roles.find(r => r.name === "Mentor")) {
        mp.sendWIP(client.channels.get('415633143861739541'));
        return;
    } // TODO À retirer après le développement

    var con = new db.Connection("localhost", client.config.mysqlUser, client.config.mysqlPass, "strad");

    sql = "SELECT item_id AS id, item_name AS name, item_emoji AS emoji, description, price, is_buyable AS buyable,"
        + " is_saleable AS saleable, quantity, buy_amount, discount, script_name, type FROM items WHERE is_buyable = 1";
    con.query(sql, {}, (rows) => {
        var shopEmbed = new Discord.RichEmbed()
            .setAuthor("Boutique")
        con.end();
    });

};