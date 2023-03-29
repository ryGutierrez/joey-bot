const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Resume paused audio'),
    async execute(interaction) {
        const connection = getVoiceConnection(interaction.guildId);
        connection.state.subscription.player.unpause();
        await interaction.reply('Resuming audio');
    }
}