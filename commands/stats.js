const Discord = require("discord.js");
const {version} = require("discord.js");
const moment = require("moment");
const mLog = require("../scripts/mLog");
let os = require('os');
let cpuStat = require("cpu-stat");

exports.run = async (client, message, args) => {

  cpuStat.usagePercent(function(err, percent, seconds) {
    if (err) {
      return console.log(err);
    }
    const duration = moment().duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
    const embedStats = new Discord.RichEmbed()
      .setAuthor('Stats', client.user.avatarURL)
      .setColor(mLog.colors.NEUTRAL_BLUE)
      .addField("Temps de disponibilité", `\`${duration}\``, true)
      .addField("Version de Discord.js", `\`v${version}\``, true)
      .addField("Version de NodeJS", `\`${process.version}\``, true)
      .addField("Utilisation du CPU", `\`${percent.toFixed(2)}%\``, true)
      .addField("Utilisation de la RAM", `\`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}/${(os.totalmem() / 1024 / 1024).toFixed(2)} MB\``, true)
      .addField("Latence", `\`${Math.round(client.ping)} ms\``, true)
      .setTimestamp();
    client.channels.get('415633143861739541').send(embedStats);
    message.delete();

  });
};