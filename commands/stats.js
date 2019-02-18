const Discord = require("discord.js")

const {
  version
} = require("discord.js");
const moment = require("moment");
const m = require("moment-duration-format");
let os = require('os')
let cpuStat = require("cpu-stat")
const ms = require("ms")

exports.run = (client, message, args) => {

  cpuStat.usagePercent(function(err, percent, seconds) {
    if (err) {
      return console.log(err);
    }
    const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
    const embedStats = new Discord.RichEmbed()
      .setAuthor('Stats', client.user.avatarURL)
      .setColor("#21b1ff")
      .addField("Uptime", `\`${duration}\``, true)
      .addField("Discord.js Version", `\`v${version}\``, true)
      .addField("Node Version", `\`${process.version}\``, true)
      .addField("CPU usage", `\`${percent.toFixed(2)}%\``, true)
      .addField("RAM usage", `\`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} / ${(os.totalmem() / 1024 / 1024).toFixed(2)} MB\``, true)
      .addField("Latency", `\`${Math.round(client.ping)}ms\``, true)
      .setTimestamp();
    client.channels.get('415633143861739541').send(embedStats);
    message.delete();
  });
};