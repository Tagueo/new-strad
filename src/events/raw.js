import { client } from '../globals';

const raw = async packet => {
  const { d: data, t: type } = packet;
  if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(type))
    return;
  const channel = client.channels.get(data.channel_id);
  if (channel.messages.has(data.message_id)) return;
  const message = await channel.fetchMessage(data.message_id);
  const emoji = data.emoji.id
    ? `${data.emoji.name}:${data.emoji.id}`
    : data.emoji.name;
  const reaction = message.reactions.get(emoji);
  if (reaction) {
    reaction.users.set(data.user_id, client.users.get(data.user_id));
  }
  const packets = {
    MESSAGE_REACTION_ADD: 'messageReactionAdd',
    MESSAGE_REACTION_REMOVE: 'messageReactionRemove'
  };
  client.emit(packets[type], reaction, client.users.get(data.user_id));
};

export { raw };

