const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('history')
        .setDescription('List the previously played songs'),
    async execute(interaction) {
        await interaction.reply('pong');
    }
}