const { SlashCommandBuilder } = require('discord.js');
var { ref } = require('../../constants.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('loop the current song'),
    async execute(interaction) {
        ref.doLoop = ref.doLoop ? false : true
        console.log(ref.doLoop);
        await interaction.reply(`Song looping is ${ref.doLoop ? 'enabled' : 'disabled'}`);
    }
}