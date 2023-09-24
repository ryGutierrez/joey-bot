import { ChatInputCommandInteraction, Client, SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('...'),
    async execute(client: Client, interaction: ChatInputCommandInteraction) {        
        const embed = new EmbedBuilder()
            .setTitle("Help")
            .setDescription("To get started with Joey Bot use `/play` and give the command a YouTube playlist or video url.\n\nTo view a list of other available commands, start by typing \" **/** \" and select the Joey Bot icon.\n\n**Non-Slash Commands**\nJoey Bot contains a few non-slash commands for quicker use. To use a prefix command start by typing the bot's configured prefix (default \" **!** \") followed by one of the commands below:\n\n__Dice Rolling__\n`!r1d20` *rolls a single twenty sided die*\n`!r1d20+3` *adds a positive or negative modifier to the rolled sum*\n\n__Coin  Flip__\n`!flipcoin` *flips a coin and sends the outcome*")
            .setColor("#96494b");

        await interaction.reply({ embeds: [embed] });
    }

};