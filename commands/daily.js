const Discord = require("discord.js");
var moment = require("moment");

exports.run = (client, message, args, userData) => {

  try {
    // DB connection
    var gb = {embed: undefined};
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

    con.query(`SELECT * FROM users WHERE user_id = "${message.author.id}"`, function (err, rows, fields) {

      if (err) {
        console.log(err);
      }

      if (rows[0].lastdaily != moment().format("DD/MM/AA")) {

        gb.embed = new Discord.RichEmbed()
          .setAuthor("Récompense quotidienne (" + message.member.displayName + ")", message.author.avatarURL)
          .setColor("#6cb254")
          .addField("**50** <:block:547449530610745364> ont été ajoutés sur ton compte !\nPour y accéder, fais : Strad rank")
          .setFooter("Strad daily");

        con.query(`UPDATE users SET money = money + 50 WHERE user_id = "${message.author.id}"`, function (err, rows, fields) {
          if (err) {
            console.log(err);
          }
          con.end();
        })

      } else {

        gb.embed = new Discord.RichEmbed()
          .setAuthor("Récompense quotidienne (" + message.member.displayName + ")", message.author.avatarURL)
          .setColor("#ff6766")
          .addField("Tu as déjà obtenu ta récompense aujourd'hui.\nAttends demain avant de la récupérer !")
          .setFooter("Strad daily");
        
        con.end();

      }

    });

    client.channels.get('413678978990080010').send(gb.embed);
    message.delete();

  } catch (err) {
    console.log(err);
  }

};