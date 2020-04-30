/**
 * @param  {Message} message
 * @param  {MessageEmbed} embed
 */
const sendEmdedThenDelete = async (message, embed) => {
    const messageBot = await message.channel.send(embed);
    message.delete();
    messageBot.delete(5000);
};

export { sendEmdedThenDelete };
