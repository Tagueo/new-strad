exports.run = (client, message, args) => {

    var con = client.con;

    con.connect((err) => {
        if (err) console.log(err);
    });

    con.end();

};