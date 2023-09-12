import { CommandInteraction, ChatInputApplicationCommandData, Client, SlashCommandBuilder } from "discord.js";
import { bot } from '../../index';

export default {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('resume what\'s currently playing'),
    async execute(client: Client, interaction: CommandInteraction) {
        const queue = bot.queueMap.get(interaction.guildId!);
        if(!queue) return await interaction.reply({ content: 'Play something first before resuming!', ephemeral: true });

        const player = queue!.player;

        if(!queue.paused) return await interaction.reply({ content: 'The music is already playing!', ephemeral: true });

        if(player.unpause()) {
            queue.paused = false;
            return await interaction.reply('Audio resuming');
        }
        else return await interaction.reply({ content: 'Something went wrong, please try again', ephemeral: true });
    }
}