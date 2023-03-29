const { getVoiceConnection } = require('@discordjs/voice');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('pause currently playing audio'),
    async execute(interaction) {
        const connection = getVoiceConnection(interaction.guildId);
        connection.state.subscription.player.pause();
        await interaction.reply('Audio paused');
    }
}