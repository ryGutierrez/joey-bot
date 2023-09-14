import { CommandInteraction, Client, SlashCommandBuilder } from "discord.js";
import { bot } from '../../index';

export default {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('shuffle the queue'),
    async execute(client: Client, interaction: CommandInteraction) {
        const queue = bot.queueMap.get(interaction.guildId!);
        if(!queue) return await interaction.reply({ content: 'Play something before shuffling!', ephemeral: true });

        await interaction.deferReply();

        const songs = queue.queue;
        for (let i = songs.length - 1; i > 1; i--) {
            let j = 1 + Math.floor(Math.random() * i);
            [songs[i], songs[j]] = [songs[j], songs[i]];
        }
        queue.queue = songs;

        await interaction.editReply(`The queue has been shuffled`);
    }
}