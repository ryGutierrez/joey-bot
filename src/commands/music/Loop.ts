import { CommandInteraction, Client, SlashCommandBuilder } from 'discord.js';
import { bot } from '../../index';

export default {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('toggle song looping'),
    async execute(client: Client, interaction: CommandInteraction) {
        const queue = bot.queueMap.get(interaction.guildId!);
        if(!queue) return await interaction.reply({ content: 'Play a song first before toggling the queue', ephemeral: true });

        queue.loop = !queue.loop;
        await interaction.reply({ content: `Looping is ${queue.loop ? 'on' : 'off'}`, ephemeral: true });
    }

};