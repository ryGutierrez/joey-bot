import { CommandInteraction, ChatInputApplicationCommandData, Client, SlashCommandBuilder } from "discord.js";
import { bot } from '../../index';

export default {
    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('show what\'s currently playing'),
    async execute(client: Client, interaction: CommandInteraction) {
        const queue = bot.queueMap.get(interaction.guildId!);
        if(!queue || queue.queue.length == 0) return await interaction.reply({ content: 'Nothing is playing right now!', ephemeral: true });

        return await interaction.reply(`Now playing ${queue.queue[0].url}`);
    }
}