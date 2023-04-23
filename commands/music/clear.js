const { SlashCommandBuilder } = require('discord.js');
var { ref } = require('../../constants.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clear the queue and stop all audio'),
    async execute(interaction) {
        if(!interaction.member.voice.channel || !interaction.member.voice.channel.isVoiceBased()) {
            await interaction.reply('You must be in a voice channel to use this command.');
            return;
        }
        
        ref.queue.length = 0;
        await interaction.reply('cleared queue');
    }
}