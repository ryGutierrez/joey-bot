const { SlashCommandBuilder } = require('discord.js');
var { ref } = require('../../constants.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('Show what\'s currently playing.'),
    async execute(interaction) {
        await interaction.reply(ref.nowPlaying == undefined ? 'Nothing is playing right now' : `Now playing ${ref.nowPlaying}`);
    }
}