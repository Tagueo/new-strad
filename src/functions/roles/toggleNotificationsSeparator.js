/**
 * @param  {Guild} guild
 * @param  {GuildMember} member
 */
const toggleNotificationsSeparator = (guild, member) => {
  const rolePrefix = "Notif's - ";
  const SeparatorRole = guild.roles.find(
    role => role.name === '------------ Notifications ------------'
  );
  if (
    member.roles.find(role => role.name === `${rolePrefix} News`) ||
    member.roles.find(role => role.name === `${rolePrefix} Events`) ||
    member.roles.find(role => role.name === `${rolePrefix} Streams`)
  ) {
    member.addRole(SeparatorRole);
  } else {
    member.removeRole(SeparatorRole);
  }
};

export { toggleNotificationsSeparator };
