const Discord = require("discord.js")

// const db_handler = require("../scripts/db_handler.js");

exports.run = (client, message, args) => {

  // DB connection

  var gb = {
    results: undefined, rank: undefined
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

      if (err) {
          console.log(err);
      }
      
      gb.results = rows[0];

      con.query(`SELECT * FROM users ORDER BY creas_amount DESC`, function(err, rows, fields) {

        console.log(rows);
        // for (i=0;i<rows.length;i++) {
        //   if (message.author.id == rows[i].user_id) {
        //     gb.rank = i + 1;
        //     break;
        //   }
        // }

        const stradEmoji = "<:block:547449530610745364>";
        const creaEmoji = "<:crea:547482886824001539>";
      
        const embedMoney = new Discord.RichEmbed()
          .setAuthor(message.author.tag, message.author.avatarURL)
          .setThumbnail(message.author.avatarURL)
          .addField("Valeur du compte", `${gb.results.money} ${stradEmoji}`, true)
          .addField("Nombre de Créas", `${gb.results.creas_amount} ${creaEmoji}`, true)
          .addField("Rang", `#${gb.rank}`, true)
          .addField("Titre artistique", `${gb.results.rank}`, true)
          .setFooter("Strad rank")
          .setColor(message.member.displayColor);
      
          client.channels.get('415633143861739541').send(embedMoney);
          message.delete();

      });

    });

    con.end();

  // DB connection

};