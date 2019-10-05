import chalk from 'chalk';
import { guildBanAdd } from './events/guildBanAdd';
import { guildBanRemove } from './events/guildBanRemove';
import { guildMemberAdd } from './events/guildMemberAdd';
import { guildMemberRemove } from './events/guildMemberRemove';
import { message } from './events/message';
import { messageReactionAdd } from './events/messageReactionAdd';
import { messageReactionRemove } from './events/messageReactionRemove';
import { raw } from './events/raw';
import { ready } from './events/ready';
import { client } from './globals';

console.log(chalk.cyan('Starting...'));

client.on('ready', ready);
client.on('guildBanAdd', guildBanAdd);
client.on('guildBanRemove', guildBanRemove);
client.on('guildMemberAdd', guildMemberAdd);
client.on('guildMemberRemove', guildMemberRemove);
client.on('message', message);
client.on('messageReactionAdd', messageReactionAdd);
client.on('messageReactionRemove', messageReactionRemove);
client.on('raw', raw);
client.on('error', console.error);

client.login(client.config.token);
