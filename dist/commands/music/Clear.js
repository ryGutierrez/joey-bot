"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const index_1 = require("../../index");
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('clear')
        .setDescription('clear the queue'),
    async execute(client, interaction) {
        const queue = index_1.bot.queueMap.get(interaction.guildId);
        if (!queue)
            return await interaction.reply({ content: 'The queue is already empty!', ephemeral: true });
        queue.queue = [queue.queue[0]];
        return await interaction.reply('Cleared the queue');
    }
};
