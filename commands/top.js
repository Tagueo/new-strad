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

    con.query(`SELECT * FROM users ORDER BY creas_amount DESC LIMIT 15`, function(err, rows, fields) {

      if (err) {
          console.log(err);
      }
      
      gb.results = rows;

      const creaEmoji = "<:crea:547482886824001539>";
      var otherLeaders = "";
    
      const embedTop = new Discord.RichEmbed()
        .setAuthor(`Stradivarius - Classement (Créas)`);

      for (i=0;i<2;i++) {
        embedTop.addField(`${i + 1}. ${gb.results[i].usertag}`, `**${gb.results[i].creas_amount}** ${creaEmoji}`, true);
      }
      for (i=2;i<15;i++) {
        otherLeaders += `\`\`${i + 1}. ${gb.results[i].creas_amount}\`\` - ${gb.results[i].usertag}\n`;
      }
      embedTop.addField("Top 15", otherLeaders, true);
      embedTop.setFooter("Strad top");
      embedTop.setColor(0xff6b3e);
    
      client.channels.get('415633143861739541').send(embedTop);
      message.delete();

    });

    con.end();

  // DB connection

};