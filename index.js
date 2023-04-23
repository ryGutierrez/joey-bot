const fs = require('node:fs');
const path = require('node:path');
const { dev_token: token, dev_clientId: clientId } = require('./config.json');
var { ref } = require('./constants.js');
const { getVoiceConnection } = require('@discordjs/voice');

const { Client, Collection, Events, GatewayIntentBits, range } = require('discord.js');
const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
]});

diceRegex = /^!r[0-9]+d[0-9]+(\+[0-9]+)?$/;

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// functions

// Return random integer in range [min, max]
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

// Event handlers

client.once(Events.ClientReady, c => {
    console.log(`Logged in as ${client.user.tag}...`);
});

client.on(Events.InteractionCreate, async interaction => {
    if(!interaction.isChatInputCommand()) return;
    const command = interaction.client.commands.get(interaction.commandName);

    if(!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    ref.lastInteractedChannel = interaction.channelId;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if(interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
});

client.on(Events.VoiceStateUpdate, async c => {
    var channel = c.channel;
    if(!channel) {
        return;
    }
    var channel = c.channel;
    if(c.channel.members.size == 1 && channel.members.find(u => u.id == clientId)) {
        const connection = getVoiceConnection(channel.guildId);
        var didDisconnect = connection.disconnect();
        if(!didDisconnect) {
            console.log(`Error disconnecting from channel ${channel.name}`);
        }
        ref.queue = [];
        ref.nowPlaying = [];
        ref.useShuffle = false;
        ref.doLoop = false;
        await channel.guild.channels.cache.get(ref.lastInteractedChannel).send(`All users left #${channel.name}. Clearing and resetting audio player.`);
    }
});

client.on('messageCreate', async (message) => {
    let guild = client.guilds.cache.get(message.guildId);
    let channel = guild.channels.cache.get(message.channelId);

    if(diceRegex.test(message.content)) {
        let numDice = parseInt(message.content.substring(message.content.search('r')+1, message.content.search('d')));
        let numSide = parseInt(message.content.substring(message.content.search('d')+1, message.content.search('\\+') == -1 ? message.content.length+1 : message.content.search('\\+')));
        let extra = message.content.search('\\+') != -1 ? parseInt(message.content.substring(message.content.search('\\+')+1, message.content.length+1)) : null;
        
        let sum = 0;
        let diceRolls = '';
        for(let i=0; i<numDice; i++) {
            let n = randomInt(1, numSide);
            diceRolls += n+', ';
            sum += n;
        }

        await channel.send(`*${numDice}d${numSide}${extra != null ? '+'+extra : ''} by ${message.author.username}*\n${numDice > 1 ? '*'+diceRolls.substring(0, diceRolls.length-2)+'*\n' : ''}**${extra == null ? sum : sum+' + '+extra+' = '+(sum+extra)}**`);

    } if(message.content === '!flipcoin') {
        await channel.send(randomInt(0,1) == 1 ? 'heads' : 'tails');
    }
});

client.login(token);