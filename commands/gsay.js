const Discord = require("discord.js")

exports.run = (client, message, args) => {
  if(message.member.roles.find("name", "Mentor")) {

  } else {
    message.send('Tu n\'as pas le droit de faire cette commande <:facepalm:428261651947716609>')
  }
};
