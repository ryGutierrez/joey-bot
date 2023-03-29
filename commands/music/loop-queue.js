const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop-queue')
        .setDescription('Loop back to the top of the queue once its done'),
    async execute(interaction) {
        await interaction.reply('Audio paused');
    }
}