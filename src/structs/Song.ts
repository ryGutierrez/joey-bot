import { yt_validate, video_basic_info, stream, playlist_info } from "play-dl";

export class Song {
    public readonly url: string;
    public readonly title: string;
    public readonly duration: number;
    public readonly durationRaw: string;

    public constructor(url: string, title: string, duration: number, durationRaw: string) {
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
    public static async from(url: string) {
        const urlValidation = yt_validate(url);
        if(urlValidation === 'video') {
            const videoDetails = (await video_basic_info(url)).video_details;
            return new Song(url, videoDetails.title!, videoDetails.durationInSec, videoDetails.durationRaw);
        } else if(urlValidation === 'playlist') {
            const playlistInfo = await playlist_info(url, {incomplete: true });
            const allVideos = await playlistInfo.all_videos();
            let songs = Array<Song>();
            for(const video of allVideos) {
                songs = songs.concat(new Song(video.url, video.title!, video.durationInSec, video.durationRaw));
            }
            return songs;
        } else {
            throw new Error(`${url} not a valid playlist or video url`);
        }
    }

}