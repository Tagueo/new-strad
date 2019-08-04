const Discord = require('discord.js');
const welcome = require('../scripts/welcome.js');

module.exports = (client, member) => {
  // Récupération du salon de modération
  const logs = client.channels.get(client.config.logsChannel);

  // Récupération de la catégorie de bienvenue
  const welcomeCategId = "443782424653070346";

  // On vérifie si l'évènement a lieu sur Stradivarius
  if (member.guild.id = '412369732679893004') {
    const apprenti = member.guild.roles.find(x => x.name === "Apprenti(e)");
    member.addRole(apprenti).catch(console.error);
    
    var embed = new Discord.RichEmbed()
      .setColor("#21b1ff")
      .setTitle("Nouveau Membre")
      .setDescription(`**<@${member.user.id}>** vient de rejoindre le serveur !`);

    try {
      // DB connection
      var gb = { results: undefined };
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

      con.query(`SELECT * FROM users WHERE user_id = "${member.user.id}"`, function(err, rows, fields) {

        if (err) {
            console.log(err);
        }

        gb.results = rows[0];
        if (!gb.results) {
          con.query(`INSERT INTO users (user_id, usertag) VALUES ("${member.user.id}", "${member.user.tag}")`, function(err, rows, fields) {
            if (err) {
              console.log("Membre déjà présent dans la base de données.");
            }
            con.end();
          })
        } else {
          con.end();
        }

      });

    } catch (err) {
      console.log(err);
    }

    welcome.run(client, member);
    member.guild.channels.find(c => c.id === welcomeCategId).setName("STRADIVARIUS | " + member.guild.memberCount + " MEMBRES");
    logs.send(embed);
    console.log(member.user.username + " a rejoint le serveur !");

  }
};