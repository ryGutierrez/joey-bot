import { CommandInteraction, ChatInputApplicationCommandData, Client, SlashCommandBuilder } from "discord.js";
import { bot } from '../../index';

export default {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('pause what\'s currently playing'),
    async execute(client: Client, interaction: CommandInteraction) {
        const queue = bot.queueMap.get(interaction.guildId!);
        if(!queue) return await interaction.reply({ content: 'Play something first before pausing!', ephemeral: true });

        const player = queue!.player;
        if(queue.paused) return await interaction.reply({ content: 'The music is already paused!', ephemeral: true });

        if(player.pause()) {
            queue.paused = true;
            return await interaction.reply('Audio paused');
        }
        else return await interaction.reply({ content: 'Something went wrong, please try again', ephemeral: true });
    }
}