import { readdirSync } from 'fs';
import { join } from 'path';
import { ActionRowBuilder, ActivityType, ApplicationCommandDataResolvable, ButtonBuilder, ButtonStyle, Client, Collection, EmbedBuilder, Events, GatewayIntentBits, REST, Routes } from 'discord.js';
import { TOKEN, DEV_TOKEN, GUILD_ID} from '../config.json';
import { Command } from './Command';
import { Queue } from './Queue';

const runDev = process.argv.includes('dev');
const token = runDev ? DEV_TOKEN : TOKEN;
const guildId = GUILD_ID;    

export class Bot {
    public queueMap = new Collection<string, Queue>();
    public commands = new Array<ApplicationCommandDataResolvable>();
    public commandsMap = new Collection<string, Command>();

    public prefix = '!';
    
    public constructor(public readonly client: Client) {
        this.client.login(token);
        this.client.on('ready', ()=> {
            console.log(`Logged in as ${this.client.user!.tag}`);
            this.client.user!.setActivity('/help', { type: ActivityType.Listening });
            this.registerCommands();
        });

        this.onInteractionCreate();
        this.onMessageCreate();
        
    }

    private async registerCommands() {
        const foldersPath = join(__dirname, '..', 'commands');
        const commandFolders = readdirSync(foldersPath);

        for (const folder of commandFolders) {
            const commandsPath = join(foldersPath, folder);
            const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
            for (const file of commandFiles) {
                const filePath = join(commandsPath, file);
                const command = await import(filePath);
                this.commands.push(command.default.data);
                this.commandsMap.set(command.default.data.name, command.default);
            }
        }
        
        const rest = new REST({ version: '10' }).setToken(token);
        try {
            if(runDev)
                await rest.put(Routes.applicationGuildCommands(this.client.user!.id, guildId), {body: this.commands});
            else
                await rest.put(Routes.applicationCommands(this.client.user!.id), {body: this.commands});
        } catch (error) {
            console.error(error);
        }
        
    }

    private async onInteractionCreate() : Promise<void> {
        this.client.on(Events.InteractionCreate, async interaction => {
            if(interaction.isChatInputCommand()) {
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
            } else if(interaction.isButton()) {
                const queue = this.queueMap.get(interaction.guildId!);
                let nowPlaying = queue!.queue[0];
                let nextSong = queue!.queue[1];

                if(interaction.customId === 'skip') {
                    const command = this.commandsMap.get('skip');
                    if(!command) await interaction.reply({ content: 'Something went wrong, please try again.', ephemeral: true });
                    else await command.execute(this.client, interaction);

                } else if(interaction.customId === 'pause') {
                    if(!queue || queue.queue.length == 0) {
                        await interaction.reply({ content: 'Play something first before resuming!', ephemeral: true });
                        return;
                    }

                    if(queue!.paused) {
                        await interaction.reply('Audio resuming');
                        queue!.player.unpause();
                    }
                    else {
                        await interaction.reply('Audio paused');
                        queue!.player.pause();
                    }

                    queue!.paused = !queue!.paused;

                    await interaction.channel!.send({
                        embeds: [new EmbedBuilder()
                        .setTitle("Now Playing")
                        .setDescription(`**${nowPlaying.title}**\n${nowPlaying.channelName}`)
                        .setColor('#96494b')],
                        components: [
                            new ActionRowBuilder<ButtonBuilder>().addComponents(
                                new ButtonBuilder()
                                    .setCustomId('skip')
                                    .setLabel('Skip')
                                    .setStyle(ButtonStyle.Secondary),
                                new ButtonBuilder()
                                    .setCustomId('pause')
                                    .setLabel(queue!.paused ? '\u25b6I' : 'II')
                                    .setStyle(ButtonStyle.Primary)
                            )
                        ]
                    });

                } else if(interaction.customId === 'next_page') {
                    
                } else if(interaction.customId === 'back_page') {

                }
            }
            
        });
    }

    private async onMessageCreate() {
        this.client.on('messageCreate', async (message) => {
            let channel = message.channel;

            // Handle dice rolls
            const diceRegex = new RegExp(`^${this.prefix}r[0-9]+d[0-9]+([\+\-][0-9]+)?$`);
            if(diceRegex.test(message.content)) {
                let numDice = parseInt(message.content.substring(message.content.search('r')+1, message.content.search('d')));
                let numSide = parseInt(message.content.substring(message.content.search('d')+1, message.content.search(/[-+]/) == -1 ? message.content.length+1 : message.content.search(/[-+]/)));
                let extra = message.content.search(/[-+]/) == -1 ? null : parseInt(message.content.substring(message.content.search(/[-+]/)+1, message.content.length+1));
                let sum = 0;
                let diceRolls = '';
                for(let i=0; i<numDice; i++) {
                    let n = Math.floor(Math.random() * (numSide) ) + 1;
                    diceRolls += n+', ';
                    sum += n;
                }

                message.content.search('-') != -1 ? // if the roll modifier is negative, the output should be changed and the modifier should be subtracted from sum
                    await channel.send(`*${numDice}d${numSide}${extra != null ? '-'+extra : ''} by ${message.author.username}*\n${numDice > 1 ? '*'+diceRolls.substring(0, diceRolls.length-2)+'*\n' : ''}**${extra == null ? sum : sum+' - '+extra+' = '+(sum-extra)}**`)
                :   await channel.send(`*${numDice}d${numSide}${extra != null ? '+'+extra : ''} by ${message.author.username}*\n${numDice > 1 ? '*'+diceRolls.substring(0, diceRolls.length-2)+'*\n' : ''}**${extra == null ? sum : sum+' + '+extra+' = '+(sum+extra)}**`);
            }

            // Handle coin flips
            else if(message.content === this.prefix + 'flipcoin') {
                const flip = Math.floor(Math.random()*2);
                await channel.send(flip == 1 ? 'heads' : 'tails');
            }
        });
    }
}