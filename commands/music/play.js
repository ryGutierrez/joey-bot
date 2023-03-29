const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, getVoiceConnection, StreamType } = require('@discordjs/voice');
const play = require('play-dl');
const shuffle = require('shuffle-array');
var { ref } = require('../../constants.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play audio from a youtube link')
        .addStringOption(option =>
            option.setName('url')
            .setDescription('youtube url to a single video')
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
            console.log(`doLoop = ${ref.doLoop}`);
            if(ref.doLoop) {
                connectAndPlay(ref.nowplaying);
            } else if(ref.queue.length != 0) {
                console.log(ref.useShuffle);
                ref.useShuffle ? connectAndPlay(shuffle.pick(ref.queue).url) : connectAndPlay(ref.queue.shift().url)
            }
        });

        player.on('error', error => {
            console.error(error);
        });

        connectAndPlay(url);
        await interaction.reply(`Now playing ${url}`);

        async function connectAndPlay(u) {
            if (!play.yt_validate(u) === 'video') {
                await interaction.reply(`The url is invalid, try again.`)
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
            ref.nowplaying = u;
            console.log(`Now playing ${ref.nowplaying}`);
        }

        // TODO: Merge /queue and /play into a single command
        // TODO: Create /playnow to play a url immedately, skipping the queue 
    }
}