const { getVoiceConnection, disconnect } = require('@discordjs/voice');
const { SlashCommandBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('disconnect')
        .setDescription('Force bot to leave the voice channel'),
    async execute(interaction) {
        if(!interaction.member.voice.channel || !interaction.member.voice.channel.isVoiceBased()) {
            await interaction.reply('You must be in a voice channel to use this command.');
            return;
        }
        
        var channel = interaction.member.voice.channel
        const connection = getVoiceConnection(interaction.guild.id)
        var didDisconnect = connection.disconnect();
        if(!didDisconnect) {
            console.log(`Error disconnecting from channel ${channel.name}`);
        }
        await interaction.reply('Disconnected');
    }
}