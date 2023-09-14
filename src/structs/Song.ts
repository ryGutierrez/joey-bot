import { yt_validate, video_basic_info, playlist_info } from 'play-dl';
import YouTube from 'youtube-sr';

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
            // const basic_info = await video_basic_info(url);
            // const videoDetails = basic_info.video_details;
            const video = await YouTube.getVideo(url);
            return new Song(url, video.title!, video.duration, video.durationFormatted);
        } else if(urlValidation === 'playlist') {
            // const playlistInfo = await playlist_info(url, {incomplete: true });
            // const allVideos = await playlistInfo.all_videos();
            const playlist = await YouTube.getPlaylist(url).then(playlist => playlist.fetch());
            const videos = playlist.videos;
            let songs = Array<Song>();
            for(const video of videos) {
                songs = songs.concat(new Song(video.url, video.title!, video.duration, video.durationFormatted));
            }
            return songs;
        } else {
            throw new Error(`\"${url}\" invalid playlist or video url`);
        }
    }

}