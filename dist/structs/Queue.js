"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queue = void 0;
const voice_1 = require("@discordjs/voice");
const index_1 = require("../index");
const play_dl_1 = require("play-dl");
class Queue {
    player;
    bot = index_1.bot;
    connection;
    textChannel;
    interaction;
    // public resource: AudioResource;
    queue = new Array();
    loop = false;
    queueLock = false;
    stopped = false;
    paused = false;
    constructor(interaction, textChannel, connection) {
        this.connection = connection;
        this.textChannel = textChannel;
        this.interaction = interaction;
        this.player = (0, voice_1.createAudioPlayer)();
        this.connection.subscribe(this.player);
        // listeners
        // when the bot disconnects for whatever reason, destroy connection and stop audio
        // when everyone else leaves the channel, the bot should destroy connection and stop audio
        // when the player goes from Playing to Idle, shift the queue and process
        this.player.on(voice_1.AudioPlayerStatus.Idle, () => {
            if (this.loop && this.queue.length) {
                this.queue.push(this.queue.shift());
            }
            else {
                this.queue.shift();
                if (!this.queue.length)
                    return this.stopAudio();
            }
            if (this.queue.length || this.player)
                this.processQueue();
        });
    }
    async processQueue() {
        if (this.queueLock || this.player.state.status !== voice_1.AudioPlayerStatus.Idle)
            return;
        if (!this.queue.length)
            return this.stopAudio();
        this.queueLock = true;
        const nextSong = this.queue[0];
        try {
            const playStream = await (0, play_dl_1.stream)(nextSong.url);
            const resource = (0, voice_1.createAudioResource)(playStream.stream, { metadata: nextSong, inputType: voice_1.StreamType.Opus });
            this.player.play(resource);
        }
        catch (error) {
            console.error(error);
            return this.processQueue();
        }
        finally {
            this.queueLock = false;
        }
    }
    enqueue(song) {
        this.stopped = false;
        this.queue = this.queue.concat(song);
        this.processQueue();
    }
    stopAudio(destroyVoiceConnection) {
        if (this.stopped)
            return;
        this.stopped = true;
        this.loop = false;
        this.queue = [];
        this.player.stop();
        if (destroyVoiceConnection && this.connection.state.status !== voice_1.VoiceConnectionStatus.Destroyed) {
            try {
                this.connection.destroy();
            }
            catch (error) {
                console.error(error);
            }
            index_1.bot.queueMap.delete(this.interaction.guildId);
        }
    }
}
exports.Queue = Queue;
