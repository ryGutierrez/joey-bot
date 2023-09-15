import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from "discord.js";
import { bot } from "../../index";

export default {
    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('reloads a command')
        .addStringOption(option => 
            option.setName('command')
            .setDescription('the command to reload')
            .setRequired(true)
        ),
    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        const commandName = interaction.options.getString('command', true).toLowerCase();
        const command = bot.commandsMap.get(commandName);

        if(!command) return interaction.reply({ content: `There is no command with the name \`${commandName}\``})

        delete require.cache[require.resolve(`../music/${command.data.name}.ts`)];

        try {
            bot.commandsMap.delete(command.data.name);
            const newCommand = require(`../music/${command.data.name}.ts`);
            bot.commandsMap.set(newCommand.default.data.name, newCommand.default);
            await interaction.reply(`Command \`${newCommand.default.data.name}\` was reloaded!`);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: `There was an error while reloading the command \`${command.data.name}\``, ephemeral: true });
        }
    }

};