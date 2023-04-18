const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip the current song'),
    async execute(interaction) {
        if(!interaction.member.voice.channel || !interaction.member.voice.channel.isVoiceBased()) {
            await interaction.reply('You must be in a voice channel to use this command.');
            return;
        }
        
        const connection = getVoiceConnection(interaction.guildId);
        connection.state.subscription.player.stop();
        await interaction.reply('Skipped the song');
    }
}