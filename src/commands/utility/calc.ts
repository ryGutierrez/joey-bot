import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from "discord.js";
import { evaluate } from "mathjs";

export default {
    data: new SlashCommandBuilder()
        .setName('calc')
        .setDescription('calculate a mathmatical expression')
        .addStringOption(option => 
            option.setName('expression')
            .setDescription('mathmatical expression')
            .setRequired(true)
        ),
    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        const expression = interaction.options.getString('expression');
        if(!expression) return await interaction.reply({ content: 'Something went wrong, please try again.', ephemeral: true }).catch(console.error);

        let result = await evaluate(expression!);
        await interaction.reply(`${expression} = **${result}**`);
    }

};