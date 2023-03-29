const { SlashCommandBuilder } = require('discord.js');
var { ref } = require('../../constants.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Toggle shuffling for the queue'),
    async execute(interaction) {
        ref.useShuffle = ref.useShuffle ? false : true;
        await interaction.reply(`Shuffling is ${ref.useShuffle ? 'enabled' : 'disabled'}`);
    }
}