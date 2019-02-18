var appRoot = process.cwd();

exports.run = (client, query) => {

    var mysql = require("mysql");
  
    var con = mysql.createConnection({
      host: "localhost",
      user: client.config.mysqlUser,
      password: client.config.mysqlPass,
      database: "strad"
    });
    
    console.log("--------------------");
    console.log(client.config.mysqlUser);
    console.log(con);

    con.connect((err) => {
        if (err) console.log(err);
    });

    console.log(con);

    con.query(query, function(err, rows, fields) {

        var results = rows;

        if (err) {
            console.log(err);
            results = [{}];
        }

        var promise = new Promise((success, failure) => {
            success(rows);
        });

        console.log("LOG DB : " + rows[0]);
        return promise;

        console.log("--------------------");

    });

}