const Discord = require("discord.js")

// const db_handler = require("../scripts/db_handler.js");

exports.run = (client, message, args) => {

  // DB connection

  var gb = {
    results: undefined
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

      const stradEmoji = "<:block:547449530610745364>";
      const creaEmoji = "<:crea:547482886824001539>";
    
      const embedMoney = new Discord.RichEmbed()
        .setAuthor(message.author.tag, message.author.avatarURL)
        .setThumbnail(message.author.avatarURL)
        .addField("Valeur du compte", `${gb.results.money} ${stradEmoji}`, true)
        .addField("Nombre de Créas", `${gb.results.creas_amount} ${creaEmoji}`, true)
        .addField("ID du propriétaire", message.author.id, true)
        .addField("Rang artistique", `${gb.results.rank}\nProchain rang : Non défini (X Créas)`, true)
        .setFooter("Strad rank")
        .setColor(message.member.displayColor);
    
        client.channels.get('413678978990080010').send(embedMoney);
        message.delete();

    });

    con.end();

  // DB connection

};