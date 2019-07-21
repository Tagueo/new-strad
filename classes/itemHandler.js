// TODO À continuer plus tard

const db = require("../scripts/db");

/**
 * @type {Inventory}
 * @param {Client} client The bot's client.
 * @param {GuildMember} ownerMember The owner of the inventory.
 */
exports.Inventory = class Inventory {
    constructor(client, ownerMember) {
        let con = new db.Connection("localhost", client.config.mysqlUser, client.config.mysqlPass, "strad");
        con.query();
        this.content = [];
    }
};

/**
 * @type {Item}
 * @private
 * @param {Array} rawData The data the MySQL query has returned.
 */
exports._Item = class Item {
    constructor(rawData)
}