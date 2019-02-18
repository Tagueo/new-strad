var appRoot = process.cwd();

exports.run = (client, query) => {

    var mysql = require("mysql");
  
    var con = mysql.createConnection({
      host: "localhost",
      user: client.config.mysqlUser,
      password: client.config.mysqlPass,
      database: "strad"
    });
    
    console.log(con);

    con.connect((err) => {
        if (err) console.log(err);
    });

    console.log(con);

    con.query(query, function(err, rows, fields) {
        if (err) console.log(err);
        exports.results = rows;
        console.log(rows[0]);
    })

}

exports.results = undefined;