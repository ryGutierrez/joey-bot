import { CommandInteraction, Client, SlashCommandBuilder, ChatInputCommandInteraction, TextChannel } from "discord.js";
import { bot } from "../../index";
import { Song } from "../../structs/Song";
import { Queue } from "../../structs/Queue";
import { DiscordGatewayAdapterCreator, joinVoiceChannel } from "@discordjs/voice";

export default {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('play from a youtube link')
        .addStringOption(option => 
            option.setName('url')
            .setDescription('url to a youtube video or playlist')
            .setRequired(true)
        ),
    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        const url = interaction.options.getString('url');
        const interactionUser = interaction.guild!.members.cache.get(interaction.user.id);
        const { channel } = interactionUser!.voice;

        if(!channel)
            return await interaction.reply({ content: 'You must be in a voice channel to use this command!', ephemeral: true }).catch(console.error);
        if(!url)
            return await interaction.reply({ content: 'Incorrect usage of the command, please try again.', ephemeral: true }).catch(console.error);

        const queue = bot.queueMap.get(interaction.guild!.id);

        if(queue && channel.id !== queue.connection.joinConfig.channelId)
            return await interaction.reply({ content: 'You must be in the same voice channel as the bot to use this command.', ephemeral: true }).catch(console.error);

        

        let song;
        try {
            await interaction.deferReply();
            song = await Song.from(url);
        } catch (error) {
            console.error(error);
            return interaction.editReply('The url was invalid or something went wrong, please try again.');
        }

        if(queue) {
            queue.enqueue(song);
            
            return await interaction.editReply(`${interaction.user.username} added ${url} to the queue.`);
        } else {
            const newQueue = new Queue(interaction, interaction.channel! as TextChannel, joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator
            }));

            bot.queueMap.set(channel.guild.id, newQueue);
            newQueue.enqueue(song);

            return interaction.editReply({ content: `${interaction.user.username} added ${url} to the queue.`});
        }
    }

};