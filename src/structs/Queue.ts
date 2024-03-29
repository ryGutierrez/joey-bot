import { AudioPlayer, AudioPlayerPlayingState, AudioPlayerStatus, AudioResource, createAudioPlayer, createAudioResource, createDefaultAudioReceiveStreamOptions, NoSubscriberBehavior, StreamType, VoiceConnection, VoiceConnectionStatus } from "@discordjs/voice";
import { Song } from "./Song";
import { bot } from "../index";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, CommandInteraction, EmbedBuilder, Events, TextChannel } from "discord.js";
import { stream } from "play-dl";
import nowplaying from "../commands/music/nowplaying";



export class Queue {
    public readonly player: AudioPlayer;
    public readonly bot = bot;
    public readonly connection: VoiceConnection;
    public readonly textChannel: TextChannel;
    public readonly interaction: CommandInteraction;

    public queue = new Array<Song>();
    public loop = false;
    private queueLock = false;
    private stopped = false;
    public paused = false;

    public constructor(interaction: CommandInteraction, textChannel: TextChannel, connection: VoiceConnection, client: Client) {
        this.connection = connection;
        this.textChannel = textChannel;
        this.interaction = interaction;
        this.player = createAudioPlayer();
        this.connection.subscribe(this.player);

        this.connection.on(VoiceConnectionStatus.Disconnected, () => {
            this.stopAudio(true);
        });

        client.on(Events.VoiceStateUpdate, async (channel) => {
            if(!channel.channel) return;
            
            const members = channel.channel!.members;

            if(members.size != 1) return;
            if(!members.find(user => user.id == client.user!.id)) return;

            this.stopAudio(true);
        });
        
        this.player.on(AudioPlayerStatus.Idle, () => {
            if(this.loop && this.queue.length > 2) {
                this.queue.push(this.queue.shift()!);
            } else {
                this.queue.shift();
                if(!this.queue.length) return this.stopAudio();
            }

            if(this.queue.length || this.player) this.processQueue();
        });
    }

    public async processQueue(): Promise<void> {
        if(this.queueLock || this.player.state.status !== AudioPlayerStatus.Idle) return;
        if(!this.queue.length) return this.stopAudio();

        this.queueLock = true;

        const nextSong = this.queue[0];
        try {
            const playStream = await stream(nextSong.url);
            const resource = createAudioResource(playStream.stream, { metadata: nextSong, inputType: StreamType.Opus });
            this.player.play(resource);

            await this.textChannel.send({
                embeds: [new EmbedBuilder()
                .setTitle("Now Playing")
                .setDescription(`**${nextSong.title}**\n${nextSong.channelName}`)
                .setColor('#96494b')],
                components: [
                    new ActionRowBuilder<ButtonBuilder>().addComponents(
                        new ButtonBuilder()
                            .setCustomId('skip')
                            .setLabel('Skip')
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId('pause')
                            .setLabel(this.paused ? '\u25b6I' : 'II')
                            .setStyle(ButtonStyle.Primary)
                    )
                ]
            });

        } catch (error) {
            console.error(error);
            return this.processQueue();
        } finally {
            this.queueLock = false;
        }
    }

    public enqueueSkip(song: Song[], skipCurrent?: boolean): void {
        this.stopped = false;

        let nowPlaying = this.queue.splice(0, 1);
        this.queue.unshift(...song);
        this.queue = nowPlaying.concat(this.queue);

        if(skipCurrent) this.player.stop();

        this.processQueue();
    }

    public enqueue(song: Song[], skipCurrent?: boolean): void {
        this.stopped = false;
        this.queue.push(...song);

        if(skipCurrent) this.player.stop();
        
        this.processQueue();
    }

    public stopAudio(destroyVoiceConnection?: boolean) {
        if(this.stopped) return;

        this.stopped = true;
        this.loop = false;
        this.queue = [];

        this.player.stop();

        if(destroyVoiceConnection && this.connection.state.status !== VoiceConnectionStatus.Destroyed) {
            try {
                this.connection.destroy();
            } catch (error) {
                console.error(error);
            }
            bot.queueMap.delete(this.interaction.guildId!);
        }
        
    }

}