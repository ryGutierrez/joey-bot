"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bot = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const discord_js_1 = require("discord.js");
const config_json_1 = require("../config.json");
class Bot {
    client;
    queueMap = new discord_js_1.Collection();
    commands = new Array();
    commandsMap = new discord_js_1.Collection();
    prefix = ';';
    constructor(client) {
        this.client = client;
        this.client.login(config_json_1.token);
        this.client.on('ready', () => {
            console.log(`Logged in as ${this.client.user.tag}`);
            this.registerCommands();
        });
        this.onInteractionCreate();
        this.onMessageCreate();
    }
    async registerCommands() {
        const foldersPath = (0, path_1.join)(__dirname, '..', 'commands');
        const commandFolders = (0, fs_1.readdirSync)(foldersPath);
        for (const folder of commandFolders) {
            const commandsPath = (0, path_1.join)(foldersPath, folder);
            const commandFiles = (0, fs_1.readdirSync)(commandsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
            for (const file of commandFiles) {
                const filePath = (0, path_1.join)(commandsPath, file);
                const command = await Promise.resolve(`${filePath}`).then(s => __importStar(require(s)));
                this.commands.push(command.default.data);
                this.commandsMap.set(command.default.data.name, command.default);
            }
        }
        const rest = new discord_js_1.REST({ version: '10' }).setToken(config_json_1.token);
        try {
            await rest.put(discord_js_1.Routes.applicationGuildCommands(this.client.user.id, config_json_1.guild_id), { body: this.commands });
        }
        catch (error) {
            console.error(error);
        }
    }
    async onInteractionCreate() {
        this.client.on(discord_js_1.Events.InteractionCreate, async (interaction) => {
            if (!interaction.isChatInputCommand())
                return;
            const command = this.commandsMap.get(interaction.commandName);
            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }
            try {
                await command.execute(this.client, interaction);
            }
            catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
                }
                else {
                    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
                }
            }
        });
    }
    async onMessageCreate() {
        this.client.on('messageCreate', async (message) => {
            let channel = message.channel;
            // Handle dice rolls
            const diceRegex = new RegExp(`^${this.prefix}r[0-9]+d[0-9]+([\+\-][0-9]+)?$`);
            if (diceRegex.test(message.content)) {
                let numDice = parseInt(message.content.substring(message.content.search('r') + 1, message.content.search('d')));
                let numSide = parseInt(message.content.substring(message.content.search('d') + 1, message.content.search(/[-+]/) == -1 ? message.content.length + 1 : message.content.search(/[-+]/)));
                let extra = message.content.search(/[-+]/) == -1 ? null : parseInt(message.content.substring(message.content.search(/[-+]/) + 1, message.content.length + 1));
                let sum = 0;
                let diceRolls = '';
                for (let i = 0; i < numDice; i++) {
                    let n = Math.floor(Math.random() * (numSide)) + 1;
                    diceRolls += n + ', ';
                    sum += n;
                }
                message.content.search('-') != -1 ? // if the roll modifier is negative, the output should be changed and the modifier should be subtracted from sum
                    await channel.send(`*${numDice}d${numSide}${extra != null ? '-' + extra : ''} by ${message.author.username}*\n${numDice > 1 ? '*' + diceRolls.substring(0, diceRolls.length - 2) + '*\n' : ''}**${extra == null ? sum : sum + ' - ' + extra + ' = ' + (sum - extra)}**`)
                    : await channel.send(`*${numDice}d${numSide}${extra != null ? '+' + extra : ''} by ${message.author.username}*\n${numDice > 1 ? '*' + diceRolls.substring(0, diceRolls.length - 2) + '*\n' : ''}**${extra == null ? sum : sum + ' + ' + extra + ' = ' + (sum + extra)}**`);
            }
            // Handle coin flips
            else if (message.content === this.prefix + 'flipcoin') {
                const flip = Math.floor(Math.random() * 2);
                await channel.send(flip == 1 ? 'heads' : 'tails');
            }
        });
    }
}
exports.Bot = Bot;
