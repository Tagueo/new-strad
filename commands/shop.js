exports.run = (client, message, aegs) => {

    var con = client.con;

    con.connect((err) => {
        if (err) console.log(err);
    });

    con.end();

};