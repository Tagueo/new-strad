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

    async query(sql) {
        return await new Promise((resolve, reject) => {
            this.core.query(sql, function (err, rows) {
                if (err) reject(err);
                resolve(rows);
            });
        });
    }

    end() {
        this.core.end();
    }

};