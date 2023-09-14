"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const index_1 = require("../../index");
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('skip')
        .setDescription('skip what\'s currently playing'),
    async execute(client, interaction) {
        const queue = index_1.bot.queueMap.get(interaction.guildId);
        if (!queue)
            return await interaction.reply({ content: 'Add some songs to the queue before skipping!', ephemeral: true });
        const player = queue.player;
        const nowPlaying = queue.queue[0];
        if (player.stop())
            return await interaction.reply(`Skipped **${nowPlaying.title}**`);
        else
            return await interaction.reply({ content: 'Something went wrong, please try again', ephemeral: true });
    }
};
