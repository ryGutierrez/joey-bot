import { yt_validate, video_basic_info, stream } from "play-dl";

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
     * @returns {Song} - a new Song instance with details from the url source, returns null if the url is invalid
     */
    public static async from(url: string) {
        if(yt_validate(url) !== 'video') throw new Error(`${url} not a valid url`);
        const videoDetails = (await video_basic_info(url)).video_details;

        return new Song(url, videoDetails.title!, videoDetails.durationInSec, videoDetails.durationRaw);
    }

}