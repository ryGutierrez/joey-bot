import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from "discord.js";
import { bot } from "../../index";

export default {
    data: new SlashCommandBuilder()
        .setName('prefix')
        .setDescription('view or set the prefix for non-slash commands')
        .addStringOption(option => 
            option.setName('prefix')
            .setDescription('one or more characters')
        ),
    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        const prefix = interaction.options.getString('prefix');
        if(!prefix) return await interaction.reply(`The prefix is \'${bot.prefix}\'`);

        bot.prefix = prefix;
        await interaction.reply(`The prefix is set to \'${prefix}\'`);
    }

};