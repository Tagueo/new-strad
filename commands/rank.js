const Discord = require("discord.js")

// const db_handler = require("../scripts/db_handler.js");

exports.run = (client, message, args) => {

  // DB connection

  var gb = {
    results: [{}]
  };
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

    con.query(`SELECT * FROM users WHERE user_id = ${message.author.id}`, function(err, rows, fields) {

        gb.results = rows;

        if (err) {
            console.log(err);
            gb.results = [{}];
        }

        console.log("LOG DB : " + rows[0]);

    });

  // DB connection

  console.log("LOG RANK.JS : " + gb.results);
  
  const stradEmoji = "<:strad:544057514589683723>";

  // const embedMoney = new Discord.RichEmbed()
  //   .setAuthor(message.author.tag, message.author.avatarURL)
  //   .setThumbnail(message.author.avatarURL)
  //   .addField("Valeur du compte", `${results["money"]} ${stradEmoji}`, true)
  //   .addField("Nombre de Créas", `${results["creas_amount"]}`, true)
  //   .addField("ID du propriétaire", message.author.id, true)
  //   .addField("Rang artistique", "unknown", true)
  //   .setFooter("Strad rank")
  //   .setColor(message.member.displayColor);

  //   client.channels.get('413678978990080010').send(embedMoney);
  //   message.delete();

};