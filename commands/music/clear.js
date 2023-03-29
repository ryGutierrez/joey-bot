const { SlashCommandBuilder } = require('discord.js');
var { ref } = require('../../constants.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clear the queue and stop all audio'),
    async execute(interaction) {
        ref.queue.length = 0;
        await interaction.reply('cleared queue');
    }
}