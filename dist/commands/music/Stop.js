"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const index_1 = require("../../index");
const voice_1 = require("@discordjs/voice");
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('stop')
        .setDescription('stop audio playback, clear the queue, and disconnect the bot'),
    async execute(client, interaction) {
        const queue = index_1.bot.queueMap.get(interaction.guildId);
        if (!queue)
            return await interaction.reply({ content: 'The bot is already stopped!', ephemeral: true });
        if (queue.connection.state.status !== voice_1.VoiceConnectionStatus.Destroyed) {
            queue.stopAudio(true);
            return await interaction.reply('Stopping audio');
        }
        else
            return await interaction.reply({ content: 'The bot is already stopped!', ephemeral: true });
    }
};
