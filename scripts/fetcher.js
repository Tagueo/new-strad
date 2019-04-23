exports.run = async function (guild) {
    var creativeChannels = new Map();
    var channelsIDs = [
        "412622887317405707",
        "412622912043089920",
        "412622999267704834",
        "416227695429550100",
        "425739003623374848",
        "438794104621629441",
        "442374005177974825"
    ];
    for (i=0;i<creativeChannels.length;i++) {
        creativeChannels.add(guild.channels.find("id", channelsIDs[i]));
    }
    creativeChannels.forEach(channel => {
        channel.fetchMessages({limit: 50});
    })
};