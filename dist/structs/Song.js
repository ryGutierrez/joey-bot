"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Song = void 0;
const play_dl_1 = require("play-dl");
const youtube_sr_1 = __importDefault(require("youtube-sr"));
class Song {
    url;
    title;
    duration;
    durationRaw;
    constructor(url, title, duration, durationRaw) {
        this.url = url;
        this.title = title;
        this.duration = duration;
        this.durationRaw = durationRaw;
    }
    /**
     * Creates a new Song object with relevant information
     * @param {Number} url - a url to a single youtube video (excluding playlists and channels)
     * @returns {Song} - a single Song or Array of Songs
     */
    static async from(url) {
        const urlValidation = (0, play_dl_1.yt_validate)(url);
        if (urlValidation === 'video') {
            // const basic_info = await video_basic_info(url);
            // const videoDetails = basic_info.video_details;
            const video = await youtube_sr_1.default.getVideo(url);
            return new Song(url, video.title, video.duration, video.durationFormatted);
        }
        else if (urlValidation === 'playlist') {
            // const playlistInfo = await playlist_info(url, {incomplete: true });
            // const allVideos = await playlistInfo.all_videos();
            const playlist = await youtube_sr_1.default.getPlaylist(url).then(playlist => playlist.fetch());
            const videos = playlist.videos;
            let songs = Array();
            for (const video of videos) {
                songs = songs.concat(new Song(video.url, video.title, video.duration, video.durationFormatted));
            }
            return songs;
        }
        else {
            throw new Error(`\"${url}\" invalid playlist or video url`);
        }
    }
}
exports.Song = Song;
