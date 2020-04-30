import { toggleNotificationsSeparator } from './toggleNotificationsSeparator';

/**
 * @param  {Guild} guild
 * @param  {MessageReaction} reaction
 * @param  {User} user
 */
const toggleNotificationRoles = (guild, reaction, user) => {
    const emojiName = reaction.emoji.name;
    const member = guild.members.find(member => member.id === user.id);
    const roles = {
        '🔔': 'News',
        '🎉': 'Events',
        '📡': 'Streams'
    };
    if (roles.hasOwnProperty(emojiName)) {
        const emojiRole = guild.roles.find(
            role => role.name === `Notif's - ${roles[emojiName]}`
        );
        if (member.roles.find(role => role.name === emojiRole.name)) {
            member.removeRole(emojiRole);
        } else {
            member.addRole(emojiRole);
        }
        toggleNotificationsSeparator(guild, member);
    } else {
        reaction.remove(user);
    }
};

export { toggleNotificationRoles };
