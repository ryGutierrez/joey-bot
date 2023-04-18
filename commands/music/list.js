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
        for(let i=0; i<ref.queue.length; i++) {
            output += `**${ref.queue[i].title}**  \`${ref.queue[i].durationRaw}\`\n`;
            if(output.length > 500) {
                output += `+${ref.queue.length-i} more...`
                break;
            }
        }
        await interaction.reply(output);
    }
}