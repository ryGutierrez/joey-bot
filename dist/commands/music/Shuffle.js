"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const index_1 = require("../../index");
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('shuffle the queue'),
    async execute(client, interaction) {
        const queue = index_1.bot.queueMap.get(interaction.guildId);
        if (!queue)
            return await interaction.reply({ content: 'Play something before shuffling!', ephemeral: true });
        await interaction.deferReply();
        const songs = queue.queue;
        for (let i = songs.length - 1; i > 1; i--) {
            let j = 1 + Math.floor(Math.random() * i);
            [songs[i], songs[j]] = [songs[j], songs[i]];
        }
        queue.queue = songs;
        await interaction.editReply(`The queue has been shuffled`);
    }
};
