exports.sendWIP = (channel) => {
    let imgURL = "https://discordapp.com/channels/412369732679893004/543888518167003136/602155110017269780";
    channel.send({
        files: [imgURL]
    })
};