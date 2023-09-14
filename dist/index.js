"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bot = void 0;
const Bot_1 = require("./structs/Bot");
const discord_js_1 = require("discord.js");
exports.bot = new Bot_1.Bot(new discord_js_1.Client({ intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent,
        discord_js_1.GatewayIntentBits.GuildMembers,
        discord_js_1.GatewayIntentBits.GuildVoiceStates,
    ] }));
