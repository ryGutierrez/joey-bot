import { readdirSync } from 'fs';
import { join } from 'path';
import { ApplicationCommandDataResolvable, Client, Collection, Events, GatewayIntentBits, REST, Routes } from 'discord.js';
import { AudioPlayer } from '@discordjs/voice';
import { dev_token as token, dev_clientId as clientId } from '../config.json';
import { Command } from '../commands/Command';
import { Song } from './Song';
import { Queue } from './Queue';
import { guild_id } from "../config.json";

export class Bot {
    public queueMap = new Collection<string, Queue>(); // Maps a single AudioPlayer to a single Guild Id
    public commands = new Array<ApplicationCommandDataResolvable>();
    public commandsMap = new Collection<string, Command>();
    
    public constructor(public readonly client: Client) {
        this.client.login(token);
        this.client.on('ready', ()=> {
            console.log(`Logged in as ${this.client.user!.tag}`)
            this.registerCommands();
        });

        this.onInteractionCreate();
    }

    private async registerCommands() {
        const foldersPath = join(__dirname, '..', 'commands');
        const commandFolders = readdirSync(foldersPath).filter(file => file!='Command.ts');

        for (const folder of commandFolders) {
            const commandsPath = join(foldersPath, folder);
            const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.ts'));
            for (const file of commandFiles) {
                const filePath = join(commandsPath, file);
                const command = await import(filePath);
                this.commands.push(command.default.data);
                this.commandsMap.set(command.default.data.name, command.default);
            }
        }
        
        const rest = new REST({ version: '10' }).setToken(token);
        await rest.put(Routes.applicationGuildCommands(this.client.user!.id, guild_id), {body: this.commands});
    }

    private async onInteractionCreate() {
        this.client.on(Events.InteractionCreate, async interaction => {
            if(!interaction.isChatInputCommand()) return;
            const command = this.commandsMap.get(interaction.commandName);
            if(!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }
            try {
                await command.execute(this.client, interaction);
            } catch (error) {
                console.error(error);
                if(interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
                }
            }
        });
    }
}