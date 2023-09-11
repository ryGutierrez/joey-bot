import { AudioPlayer, AudioPlayerPlayingState, AudioPlayerStatus, AudioResource, createAudioPlayer, createAudioResource, createDefaultAudioReceiveStreamOptions, NoSubscriberBehavior, VoiceConnection, VoiceConnectionStatus } from "@discordjs/voice";
import { Song } from "./Song";
import { bot } from "../index";
import { CommandInteraction, TextChannel } from "discord.js";
import { stream } from "play-dl";

export class Queue {
    public readonly player: AudioPlayer;
    public readonly bot = bot;
    public readonly connection: VoiceConnection;
    public readonly textChannel: TextChannel;
    public readonly interaction: CommandInteraction;

    // public resource: AudioResource;
    public queue = new Array<Song>();
    public loop = false;
    private queueLock = false;
    private stopped = false; 

    public constructor(interaction: CommandInteraction, textChannel: TextChannel, connection: VoiceConnection) {
        this.connection = connection;
        this.textChannel = textChannel;
        this.interaction = interaction;
        this.player = createAudioPlayer();
        this.connection.subscribe(this.player);

        // listeners
        // when the bot disconnects for whatever reason, destroy connection and stop audio
        // when everyone else leaves the channel, the bot should destroy connection and stop audio
        // when the player goes from Playing to Idle, shift the queue and process
        this.player.on(AudioPlayerStatus.Idle, () => {
            if(this.loop && this.queue.length) {
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
            const resource = createAudioResource(playStream.stream, { inputType: playStream.type });
            this.player.play(resource);
        } catch (error) {
            console.error(error);
            return this.processQueue();
        } finally {
            this.queueLock = false;
        }
    }

    public enqueue(...song: Song[]) {
        this.stopped = false;
        this.queue = this.queue.concat(song);
        this.processQueue();
    }

    public stopAudio() {
        if(this.stopped) return;

        this.stopped = true;
        this.loop = false;
        this.queue = [];

        this.player.stop();
        if(this.connection.state.status !== VoiceConnectionStatus.Destroyed) {
            try {
                this.connection.destroy();
            } catch (error) {
                console.error(error);
            }
        }
        bot.queueMap.delete(this.interaction.guildId!);
    }

}