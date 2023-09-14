"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const index_1 = require("../../index");
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('queue')
        .setDescription('list what\'s in the queue'),
    async execute(client, interaction) {
        const queue = index_1.bot.queueMap.get(interaction.guildId);
        if (!queue)
            return await interaction.reply('The queue is empty');
        const songs = queue.queue;
        const queueEmpty = songs.length <= 1 ? true : false;
        if (queueEmpty)
            return await interaction.reply('The queue is empty');
        await interaction.deferReply();
        var output = '';
        for (let i = 1; i < songs.length; i++) {
            output += `**${songs[i].title}**  \`${songs[i].durationRaw}\`\n`;
            if (output.length > 500) {
                output += `+${songs.length - i} more...`;
                break;
            }
        }
        await interaction.editReply(output);
    }
};
