import mysql from 'mysql';

class Connection {
  constructor(host, user, password, database) {
    this.core = mysql.createConnection({
      host,
      user,
      password,
      database,
      charset: 'utf8_general_ci'
    });
    this.core.connect(error => {
      if (error) throw error;
    });
  }

  async query(sql) {
    return await new Promise((resolve, reject) => {
      this.core.query(sql, (error, rows) => {
        if (error) reject(error);
        resolve(rows);
      });
    });
  }

  end() {
    this.core.end();
  }
}

export { Connection };

