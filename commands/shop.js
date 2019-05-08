var con = require("../scripts/db");

exports.run = (client, message, args) => {

    var con = mysql.createConnection({
        host: "localhost",
        user: client.config.mysqlUser,
        password: client.config.mysqlPass,
        database: "strad"
    });

    con.connect((err) => {
        if (err) console.log(err);
    });

    con.query("SELECT * FROM items", (err, rows) => {

        if (err) console.log(err)

    });

    con.end();

};