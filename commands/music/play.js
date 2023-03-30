const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, getVoiceConnection, StreamType } = require('@discordjs/voice');
const play = require('play-dl');
const shuffle = require('shuffle-array');
var { ref } = require('../../constants.js');
const nowplaying = require('./nowplaying.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play audio from a youtube link')
        .addStringOption(option =>
            option.setName('url')
            .setDescription('url to a youtube video or playlist (Warning: Long playlists WILL take time to load)')
            .setRequired(true)
        ),
    async execute(interaction) {
        const url = interaction.options.getString('url');
        const player = createAudioPlayer();

        player.on(AudioPlayerStatus.Playing, () => {
            console.log('Audio player now playing...');
        });

        player.on(AudioPlayerStatus.Idle, () => {
            console.log('Audio resource finished, playing next in queue...');
            if(ref.queue.length == 0) {
                ref.nowPlaying = '';
                return;
            }
            if(ref.doLoop) {
                connectAndPlay(ref.nowPlaying);
            } else if(ref.queue.length != 0) {
                console.log('playing without loop');
                ref.useShuffle ? connectAndPlay(shuffle.pick(ref.queue).url) : connectAndPlay(ref.queue.shift().url)
            }
        });

        player.on('error', error => {
            console.error(error);
        });

        // if nowplaying === '', this is the first /play call meaning audio player should play url
        if(ref.nowPlaying === '') {
            connectAndPlay(url);
            let validated = play.yt_validate(url);
            if(validated === 'video') {
                await interaction.reply(`Now playing ${url}`);
            } else if(validated === 'playlist') {
                await interaction.reply(`Now playing from playlist: ${url}`);
            }
        } else { // else nowplaying != '', something is playing meaning url should be added to queue
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

        async function connectAndPlay(u) {
            let validated = play.yt_validate(u);
            if(validated === 'playlist') {
                let info = await play.playlist_info(u, { incomplete : true } );
                let all = await info.all_videos();
                u = all.splice(0,1)[0].url;
                
                ref.queue = ref.queue.concat(all);
                // await interaction.channel.send(`Now playing ${u}`);
            } else if(validated === 'search') {
                // await interaction.channel.send('Search queries not supported yet, please try again.');
                return;
            } else if(validated == false) {
                // await interaction.channel.send('The url is not a valid youtube video or playlist, please try again.');
                return;
            }

            const connection = joinVoiceChannel({
                channelId: interaction.member.voice.channelId,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            });
            const stream = await play.stream(u);
            const resource = createAudioResource(stream.stream, { inputType: stream.type });
            player.play(resource);
            const subscription = connection.subscribe(player);
            ref.nowPlaying = u;
        }

        // TODO: Merge /queue and /play into a single command
        // TODO: Create /playnow to play a url immedately, skipping the queue 
    }
}