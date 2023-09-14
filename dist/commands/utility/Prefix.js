"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const index_1 = require("../../index");
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('prefix')
        .setDescription('view or set the prefix for non-slash commands')
        .addStringOption(option => option.setName('prefix')
        .setDescription('one or more characters')),
    async execute(client, interaction) {
        const prefix = interaction.options.getString('prefix');
        if (!prefix)
            return await interaction.reply(`The prefix is \'${index_1.bot.prefix}\'`);
        index_1.bot.prefix = prefix;
        await interaction.reply(`The prefix is set to \'${prefix}\'`);
    }
};
