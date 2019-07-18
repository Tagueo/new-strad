var mysql = require("mysql");

exports.Connection = class Connection {

    constructor(host, user, pass, dbname) {
        this.core = mysql.createConnection({
            host: host,
            user: user,
            password: pass,
            database: dbname
        });
        this.core.connect((err) => {
            if (err) throw err;
        });
    }

    query(sql, datagate={}, callback) {
        this.core.query(sql, function (err, rows) {
            if (err) throw err;
            if (datagate !== {})
                callback(rows, datagate);
            else
                callback(rows);
        });
    }

    end() {
        this.core.end();
    }

};