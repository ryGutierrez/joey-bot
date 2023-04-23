const fs = require('node:fs');
const path = require('node:path');
const { token, clientId } = require('./config.json');
var { ref } = require('./constants.js');
const { getVoiceConnection } = require('@discordjs/voice');

const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
]});

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

client.login(token);

// Functions

/**
 * Checks if the user that made an interaction is in a voice channel
 * @param {Interaction<CacheType>} interaction user created interaction from a command
 * @returns true if the interaction creator (user) is in a voice channel, false otherwise
 */
const isInteractionUserInChannel = (interaction) => {
    var channel = interaction.member.voice.channel;

    return !interaction.member.voice.channel || !interaction.member.voice.channel.isVoiceBased() ? true : false;
}