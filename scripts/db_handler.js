var appRoot = process.cwd();

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

        var results = rows;

        if (err) {
            console.log(err);
            results = [{}];
        }

        return results;

    });

}