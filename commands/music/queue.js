const { SlashCommandBuilder } = require('discord.js');
const play = require('play-dl');
var { ref } = require('../../constants.js');
const TAG = '/queue';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Add to the queue')
        .addStringOption(option =>
            option.setName('url')
            .setDescription('youtube url to video or playlist')
            .setRequired(true)
        ),
    async execute(interaction) {
        const url = interaction.options.getString('url');
        let validated = play.yt_validate(url);
        if(validated === 'video') {
            let info = await play.video_info(url);
            ref.queue.push(info.video_details);
            await interaction.reply(`Added the video ${url} to the queue.`);
        } else if(validated === 'playlist') {
            let info = await play.playlist_info(url, { incomplete : true } );
            let all = await info.all_videos();

            ref.queue = ref.queue.concat(all);
            await interaction.reply(`Added the playlist ${url} to the queue.`);
        } else if(validated === 'search') {
            await interaction.reply('Search queries not supported yet, please try again.');
        } else {
            await interaction.reply('The url is not a valid youtube video or playlist, please try again.');
        }

    }
}