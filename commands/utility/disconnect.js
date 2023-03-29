const { getVoiceConnection } = require('@discordjs/voice');
const { SlashCommandBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('disconnect')
        .setDescription('Force bot to leave the voice channel'),
    async execute(interaction) {
        var channel = interaction.member.voice.channel
        const connection = getVoiceConnection(interaction.guild.id)
        var didDisconnect = connection.disconnect();
        if(!didDisconnect) {
            console.log(`Error disconnecting from channel ${channel.name}`);
        }
        await interaction.reply('Disconnected');
    }
}