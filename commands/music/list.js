const { SlashCommandBuilder } = require('discord.js');
const { ref } = require('../../constants.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('list')
        .setDescription('List the songs in the queue'),
    async execute(interaction) {

        // TODO: Put list into embed and page the list when there are too many rows

        if(ref.queue.length == 0) {
            await interaction.reply('The queue is empty');
            return;
        }

        var output = '';
        for(let video of ref.queue) {
            output += `<${video.url}>\n`;
        }
        await interaction.reply(output);
    }
}