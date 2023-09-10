import { CommandInteraction, Client, SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('pong'),
    async execute(client: Client, interaction: CommandInteraction) {
        await interaction.reply("Pong");
    }

};