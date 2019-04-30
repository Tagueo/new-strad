exports.run = (client, message, args) => {

  if (message.member.roles.find(x => x.name === "Mentor")) {

    if (!args[0]) {
        var channel = message.guild.channels.get(message.channel.id);
    } else {
        var channel = message.guild.channels.get(args[0]) || message.guild.channels.find("name", args[0]);
        if (!channel) {
            var tempChannel = args[0];
            tempChannel = tempChannel.slice(2, -1);
            var channel = message.guild.channels.get(tempChannel);
        }
        if (!channel) {
            error.run(client, message, 'Channel invalide\nUsage : gsay <channel> <message>');
        }
    }

    if (channel && args[1]) {
        args.splice(0, 1);
        channel.send(args.join(' '));
        message.author.send('<:true:413685423202893826> Envoyé !');
    }

  } else {
      message.channel.send('Tu n\'as pas le droit de faire cette commande <:facepalm:428261651947716609>');
  }
};
