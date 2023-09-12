import { CommandInteraction, Client, SlashCommandBuilder } from 'discord.js';
import { bot } from '../../index';

export default {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('list what\'s in the queue'),
    async execute(client: Client, interaction: CommandInteraction) {
        const queue = bot.queueMap.get(interaction.guildId!);
        if(!queue) return await interaction.reply('The queue is empty');
        const songs = queue.queue;
        const queueEmpty = songs.length <= 1 ? true : false;

        if(queueEmpty) return await interaction.reply('The queue is empty');

        await interaction.deferReply();

        var output = '';
        for(let i=1; i<songs.length; i++) {
            output += `**${songs[i].title}**  \`${songs[i].durationRaw}\`\n`;
            if(output.length > 500) {
                output += `+${songs.length-i} more...`
                break;
            }
        }
        await interaction.editReply(output);
    }

};