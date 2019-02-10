const Discord = require('discord.js');

const chalk = require('chalk');
const moment = require('moment');
const fs = require('fs');

var appRoot = process.cwd();

module.exports = (client, message) => {
  if (!message.guild) {
    return;
  }

  const guildId = message.guild.id;
  const userData = JSON.parse(fs.readFileSync(appRoot+"/json/userData.json", "utf8"));
  const ANSWERS = JSON.parse(fs.readFileSync(appRoot+"/static_data/answers.json", "utf8"));

  var botPrefix = client.config.prefix;

  // Ignores all bots
  if (message.author.bot) return;

  // Checks automatic answers
  try {
    message.channel.send(ANSWERS[message.cleanContent.toLowerCase()]);
    return
  } catch (e) {
    continue
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

  if (!cmd) {
    return;
  };

  // Run the command
  cmd.run(client, message, args, userData);
  console.log(`[${chalk.cyan(moment(Date.now()).format('h:mm:ss'))}] [${chalk.yellow(message.author.tag)}] used ${chalk.green(command)} ${chalk.cyan(args.join(" "))}`);

};
