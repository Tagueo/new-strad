var mysql = require("mysql");

exports.run = (client, query, callback) => {

    var results;

    var con = mysql.createConnection({
      host: "localhost",
      user: client.config.mysqlUser,
      password: client.config.mysqlPass,
      database: "strad"
    });

    con.connect((err) => {
        if (err) console.log(err);
    });

    con.query(query, function(err, rows) {

        results = rows;

        if (err) {
            console.log(err);
            return;
        }

        callback(results);

        con.end();

    });

};