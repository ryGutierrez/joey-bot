const { SlashCommandBuilder } = require('discord.js');
var { ref } = require('../../constants.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Toggle shuffling for the queue'),
    async execute(interaction) {
        if(!interaction.member.voice.channel || !interaction.member.voice.channel.isVoiceBased()) {
            await interaction.reply('You must be in a voice channel to use this command.');
            return;
        }
        
        ref.useShuffle = ref.useShuffle ? false : true;
        await interaction.reply(`Shuffling is ${ref.useShuffle ? 'enabled' : 'disabled'}`);
    }
}