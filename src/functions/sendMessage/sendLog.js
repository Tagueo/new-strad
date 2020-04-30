import { client, stradivariusID } from '../../globals';

/**
 * @param  {MessageEmbed} logEmbed
 * @param  {Function} callback
 */
const sendLog = async (logEmbed, callback = null) => {
    const logChannel = client.guilds
        .find(guild => guild.id === stradivariusID)
        .channels.find(channel => channel.id === client.config.logsChannel);
    const messageBot = await logChannel.send(logEmbed);
    if (callback) callback(messageBot);
};

export { sendLog };
