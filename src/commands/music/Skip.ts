import { CommandInteraction, ChatInputApplicationCommandData, Client, SlashCommandBuilder, ButtonInteraction } from 'discord.js';
import { bot } from '../../index';

export default {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('skip what\'s currently playing'),
    async execute(client: Client, interaction: CommandInteraction | ButtonInteraction) {
        const queue = bot.queueMap.get(interaction.guildId!);
        if(!queue || queue.queue.length == 0) return await interaction.reply({ content: 'Add some songs to the queue before skipping!', ephemeral: true });

        const player = queue!.player;
        const nowPlaying = queue.queue[0];

        if(player.stop()) return await interaction.reply(`Skipped **${nowPlaying.title}**`);
        else return await interaction.reply({ content: 'Something went wrong, please try again', ephemeral: true });
    }
}