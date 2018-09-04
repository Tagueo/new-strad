const Discord = require("discord.js")

exports.run = (client, message, args) => {

  if (message.member.roles.find(x => x.name === "Mentor")) {

    switch (args[0]) {

      case 'general':
        var channel = '412369732679893008';
        break;

      case 'shit-post':
        var channel = '412545861256740877';
        break;

      case 'flash-annonces':
        var channel = '428548201939992600';
        break;

      default:
        message.channel.send('Tu dois indiquer un salon :\n`general`\n`shit-post`\n`flash-annonces`');
        return;
    }
    if (channel && args[1]) {
      args.splice(0, 1);
      client.channels.get(channel).send(args.join(' '));
      message.channel.send('<:true:413685423202893826> Envoyé !');
    }
  } else {
    message.channel.send('Tu n\'as pas le droit de faire cette commande <:facepalm:428261651947716609>');
  }
};
