let mysql = require("mysql");

exports.Connection = class Connection {

    constructor(host, user, pass, dbname) {
        this.core = mysql.createConnection({
            host: host,
            user: user,
            password: pass,
            database: dbname,
            charset: "utf8_general_ci"
        });
        this.core.connect((err) => {
            if (err) throw err;
        });
    }

    query(sql) {
        this.core.query(sql, function (err, rows) {
            if (err) throw err;
            return new Promise(function (resolve, reject) {
                // resolve(rows);
                resolve("C'est censé fonctionner !");
            });
        });
    }

    end() {
        this.core.end();
    }

};