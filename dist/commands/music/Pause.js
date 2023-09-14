"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const index_1 = require("../../index");
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('pause')
        .setDescription('pause what\'s currently playing'),
    async execute(client, interaction) {
        const queue = index_1.bot.queueMap.get(interaction.guildId);
        if (!queue)
            return await interaction.reply({ content: 'Play something first before pausing!', ephemeral: true });
        const player = queue.player;
        if (queue.paused)
            return await interaction.reply({ content: 'The music is already paused!', ephemeral: true });
        if (player.pause()) {
            queue.paused = true;
            return await interaction.reply('Audio paused');
        }
        else
            return await interaction.reply({ content: 'Something went wrong, please try again', ephemeral: true });
    }
};
