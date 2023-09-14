"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const index_1 = require("../../index");
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('show what\'s currently playing'),
    async execute(client, interaction) {
        const queue = index_1.bot.queueMap.get(interaction.guildId);
        if (!queue || queue.queue.length == 0)
            return await interaction.reply({ content: 'Nothing is playing right now!', ephemeral: true });
        return await interaction.reply(`Now playing ${queue.queue[0].url}`);
    }
};
