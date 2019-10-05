import { sendMP } from '../functions/sendMessage/sendMP';
import { client } from '../globals';

const gsay = (message, args) => {
  const trueEmoji = client.assets.emojis.CHECK_TRUE;

  if (message.member.roles.find(role => role.name === 'Mentor')) {
    const channel = !args[0]
      ? message.guild.channels.get(message.channel.id)
      : message.guild.channels.get(args[0]) ||
        message.guild.channels.find(channel => channel.name === args[0]) ||
        message.guild.channels.get(args[0].slice(2, -1));
    if (!channel)
      return message.channel.send(
        `Channel invalide
        Usage : \`gsay <channel> <message>\``
      );
    if (args[1]) {
      channel.send(args.splice(0, 1).join(' '));
      sendMP(`${trueEmoji} Envoyé !`, message.member);
    }
  } else {
    message.channel.send(
      "Tu n'as pas le droit de faire cette commande <:facepalm:428261651947716609>"
    );
  }
};

export { gsay };

