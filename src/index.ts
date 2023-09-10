import { Bot } from "./structs/Bot";
import { Client, GatewayIntentBits } from "discord.js";

export const bot = new Bot(new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
]}));