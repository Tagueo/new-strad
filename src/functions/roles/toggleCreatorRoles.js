/**
 * @param  {Guild} guild
 * @param  {MessageReaction} reaction
 * @param  {User} user
 */
const toggleCreatorRoles = (guild, reaction, user) => {
  const emojiName = reaction.emoji.name;
  const member = guild.members.find(member => member.id === user.id);
  const roles = {
    '📝': 'Graphiste',
    '🎞': 'Vidéaste',
    '🎨': 'Dessinateur/trice',
    '📸': 'Photographe',
    '💻': 'Développeur/peuse',
    '🎹': 'Audiophile'
  };
  if (roles.hasOwnProperty(emojiName)) {
    if (member.roles.find(role => role.name === roles[emojiName])) {
      member.removeRole(
        guild.roles.find(role => role.name === roles[emojiName])
      );
    } else {
      member.addRole(guild.roles.find(role => role.name === roles[emojiName]));
    }
  } else {
    reaction.remove(user);
  }
};

export { toggleCreatorRoles };
