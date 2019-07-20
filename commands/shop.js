const db = require("../scripts/db.js");

exports.run = (client, message, args) => {

    if (!message.member.roles.find(r => r.name === "Mentor")) return; // TODO À retirer après le développement

    var con = new db.Connection("localhost", client.config.mysqlUser, client.config.mysqlPass, "strad");

    con.connect();

    sql = "SELECT item_id AS id, item_name AS name, item_emoji AS emoji, description, price, is_buyable AS buyable,"
        + " is_saleable AS saleable, quantity, buy_amount, discount, script_name, type FROM items WHERE is_buyable = 1";
    con.query(sql, {}, (rows) => {
        console.log(rows);
        con.end();
    });

};