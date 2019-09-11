const Discord = require('discord.js');
const Enmap = require("enmap");
const fs = require("fs");
const chalk = require('chalk');
let moment = require('moment');

const client = new Discord.Client();
client.config = require("config");
client.assets = require("static_data/assets");

console.log(chalk.cyan('Starting...'));

// Reads the /events/ folder and attaches each event file to the appropriate event.
fs.readdir("./events/", (err, files) => {
    console.log(`[${chalk.cyan(moment(Date.now()).format('h:mm:ss'))}] ${chalk.cyan('Loading events...')}`)
    if (err) return console.error(err);
    files.forEach(file => {
        if (!file.endsWith(".js")) return;
        // Load the event file
        const event = require(`./events/${file}`);
        // Get the event name
        let eventName = file.split(".")[0];
        // scall events with all their proper arguments *after* the `client` var.
        client.on(eventName, event.bind(null, client));
        delete require.cache[require.resolve(`./events/${file}`)];
        console.log(`[${chalk.cyan(moment(Date.now()).format('h:mm:ss'))}] ${chalk.green('Loaded')} event ${chalk.cyan(file)}`);
    });
});

client.commands = new Enmap();

fs.readdir("./commands/", (err, files) => {
    console.log(`[${chalk.cyan(moment(Date.now()).format('h:mm:ss'))}] ${chalk.cyan('Loading commands...')}`)
    if (err) return console.error(err);
    files.forEach(file => {
        if (!file.endsWith(".js")) return;
        // Load the command file
        let props = require(`./commands/${file}`);
        // Get command name
        let commandName = file.split(".")[0];
        // Storing in the Enmap
        client.commands.set(commandName, props);
        console.log(`[${chalk.cyan(moment(Date.now()).format('h:mm:ss'))}] ${chalk.green('Loaded')} command ${chalk.cyan(commandName)}`);
    });
});

client.login(client.config.token);

client.on('error', console.error);
