const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip the current song'),
    async execute(interaction) {
        const connection = getVoiceConnection(interaction.guildId);
        connection.state.subscription.player.stop();
        await interaction.reply('Skipped the song');
    }
}