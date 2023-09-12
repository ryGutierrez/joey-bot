import { CommandInteraction, ChatInputApplicationCommandData, Client, SlashCommandBuilder } from "discord.js";
import { bot } from '../../index';
import { VoiceConnection, VoiceConnectionStatus } from "@discordjs/voice";

export default {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('stop audio playback, clear the queue, and disconnect the bot'),
    async execute(client: Client, interaction: CommandInteraction) {
        const queue = bot.queueMap.get(interaction.guildId!);
        if(!queue) return await interaction.reply({ content: 'The bot is already stopped!', ephemeral: true });

        if(queue.connection.state.status !== VoiceConnectionStatus.Destroyed) {
            queue.stopAudio(true);
            return await interaction.reply('Stopping audio');
        } else return await interaction.reply({ content: 'The bot is already stopped!', ephemeral: true });
        
    }
}