exports.run = (client, query) => {

    var mysql = require("mysql");

    var con = mysql.createConnection({
      host: "localhost",
      user: client.config.mysqlUser,
      password: client.config.mysqlPass,
      database: "strad"
    });

    con.connect((err) => {
        if (err) console.log(err);
    });

    con.query(query, function(err, rows, fields) {

        results = rows;

        if (err) {
            console.log(err);
            results = [{}];
        }

        callback(results);

        con.end();

    });

}