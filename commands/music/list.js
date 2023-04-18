const { SlashCommandBuilder } = require('discord.js');
const { ref } = require('../../constants.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('list')
        .setDescription('List the songs in the queue'),
    async execute(interaction) {
        if(!interaction.member.voice.channel || !interaction.member.voice.channel.isVoiceBased()) {
            await interaction.reply('You must be in a voice channel to use this command.');
            return;
        }
        
        if(ref.queue.length == 0) {
            await interaction.reply('The queue is empty');
            return;
        }

        var output = ref.useShuffle ? '*Warning: shuffle is on*\n' : '';;
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