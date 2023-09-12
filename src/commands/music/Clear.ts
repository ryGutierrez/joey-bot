import { CommandInteraction, ChatInputApplicationCommandData, Client, SlashCommandBuilder } from "discord.js";
import { bot } from '../../index';

export default {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('clear the queue'),
    async execute(client: Client, interaction: CommandInteraction) {
        const queue = bot.queueMap.get(interaction.guildId!);
        if(!queue) return await interaction.reply({ content: 'The queue is already empty!', ephemeral: true });

        queue.queue = [queue.queue[0]];
        return await interaction.reply('Cleared the queue');
    }
}