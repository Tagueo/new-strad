const Discord = require('discord.js');

const chalk = require('chalk');
const moment = require('moment');
const fs = require('fs');

var appRoot = process.cwd();

const logger = require(appRoot + '/scripts/logger.js');

module.exports = (client, message) => {
  if (!message.guild) {
    return;
  }
  
  // Écriture dans les logs
  logger.run(message);

  // Gestion des ressources postées
  var msg = message.content.toUpperCase();
  if (message.channel.id === "412622887317405707" || message.channel.id === "447416122468466688" || message.channel.id === "412622999267704834" || message.channel.id === "416227695429550100" || message.channel.id === "425739003623374848" || message.channel.id === "438794104621629441" || message.channel.id === "442374005177974825") {
    if (msg.includes("[RES]")) {
  	  message.pin();
  	}
    if (message.type === "PINS_ADD") {
  		message.delete(5);
  	}
    if (msg.includes("[POST]")) {
  		if (message.attachments.size === 0 && !msg.includes("HTTP")) {
  			return;
  		}
      message.react(client.emojis.get("419568361110896640"));
      message.react(client.emojis.get("419568377946832896"));
  	}
    if (message.attachments.size != 0) {
      message.react(client.emojis.get("419568361110896640"));
      message.react(client.emojis.get("419568377946832896"));
  	}
  }

  const guildId = message.guild.id;
  const ANSWERS = JSON.parse(fs.readFileSync(appRoot+"/static_data/answers.json", "utf8"));

  var botPrefix = client.config.prefix;

  // Ignores all bots
  if (message.author.bot) return;

  // Checks automatic answers
  if (ANSWERS[message.cleanContent.toLowerCase()]) {
    message.channel.send(ANSWERS[message.cleanContent.toLowerCase()]);
  }

  // Ignores messages not starting with the prefix
  if (!message.content.startsWith(botPrefix)) {
    return;
  }

  // Standard argument/command name definition.
  const args = message.content.slice(botPrefix.length).trim().split(/ +/g);
  var command = args.shift().toLowerCase();


  // Grabs the command data from the client.commands Enmap
  const cmd = client.commands.get(command);

  // try {
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
      if (true) {
        con.query(`INSERT INTO users (user_id, usertag) VALUES (${message.author.id}, ${message.author.tag})`, function(err, rows, fields) {
          if (err) {
            console.log(err);
          }
        })
      }

    });

    con.end();
  // } catch (err) {
  //   console.log(err);
  // }

  if (!cmd) {
    return;
  };

  // Run the command
  cmd.run(client, message, args);
  console.log(`[${chalk.cyan(moment(Date.now()).format('h:mm:ss'))}] [${chalk.yellow(message.author.tag)}] used ${chalk.green(command)} ${chalk.cyan(args.join(" "))}`);
};
