import { CommandInteraction, ChatInputApplicationCommandData, Client, SlashCommandBuilder, ButtonInteraction } from "discord.js";

export interface Command extends ChatInputApplicationCommandData {
    data: SlashCommandBuilder;
    execute(client: Client, interaction: CommandInteraction | ButtonInteraction): void;
}