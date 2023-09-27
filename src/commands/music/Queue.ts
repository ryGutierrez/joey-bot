import { ActionRowBuilder, ButtonBuilder } from "@discordjs/builders";
import { ButtonStyle, EmbedBuilder } from "discord.js";
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

        const embed = new EmbedBuilder()
            .setTitle(`Queue for ${interaction.guild!.name}`)
            .setFooter({ text: `Page 1/${songs.length < 10 ? '1' : Math.ceil(songs.length / 10)}` });

        for(let i=0; i<10; i++) embed.addFields({ name: `${songs[i].title} \`${songs[i].durationRaw}\``, value: songs[i].channelName, inline: false });

        await interaction.editReply({
            embeds: [embed],
            // components: [
            //     new ActionRowBuilder<ButtonBuilder>().addComponents(
            //         new ButtonBuilder()
            //             .setCustomId('back_page')
            //             .setLabel('Back')
            //             .setStyle(ButtonStyle.Secondary)
            //             .setDisabled(true),
            //         new ButtonBuilder()
            //             .setCustomId('next_page')
            //             .setLabel('Next')
            //             .setStyle(ButtonStyle.Secondary)
            //     )
            // ]
        });
    }

};