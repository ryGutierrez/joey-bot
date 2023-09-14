"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const index_1 = require("../../index");
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('loop')
        .setDescription('toggle song looping'),
    async execute(client, interaction) {
        const queue = index_1.bot.queueMap.get(interaction.guildId);
        if (!queue)
            return await interaction.reply({ content: 'Play a song first before toggling the queue', ephemeral: true });
        queue.loop = !queue.loop;
        await interaction.reply({ content: `Looping is ${queue.loop ? 'on' : 'off'}`, ephemeral: true });
    }
};
