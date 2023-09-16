import { CommandInteraction, ChatInputApplicationCommandData, Client, SlashCommandBuilder } from 'discord.js';
import { bot } from '../../index';

export default {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('skip what\'s currently playing'),
    async execute(client: Client, interaction: CommandInteraction) {
        const queue = bot.queueMap.get(interaction.guildId!);
        if(!queue) return await interaction.reply({ content: 'Add some songs to the queue before skipping!', ephemeral: true });

        const player = queue!.player;

        const nowPlaying = queue.queue[0];

        if(player.stop()) return await interaction.reply(`Skipped **${nowPlaying.title}**`);
        else return await interaction.reply({ content: 'Something went wrong, please try again', ephemeral: true });
    }
}