const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, getVoiceConnections } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('Force bot to join the current voice channel'),
    async execute(interaction) {
        var channel = interaction.member.voice.channel;
        const connection = joinVoiceChannel({
            channelId: interaction.member.voice.channelId,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        });
        
    }
}