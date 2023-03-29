
/**
 * Reference object to store variables whose data needs to be persisted/accessed across files
 * @param {boolean} doLoop if /play should loop the nowplaying url
 * @param {string} nowPlaying the currently playing video by the audio player
 * @param {boolean} doLoopQueue if the audio player should loop thorugh the entire queue it reaches the end
 * @param {boolean} useShuffle if the audio player should choose a random video from the queue to play instead of the queued video
 * @param {YoutubeVideo[]} queue queue of videos to be played consisting of play-dl YoutubeVideo objects (https://play-dl.github.io/classes/YouTubeVideo.html)
 */
var ref = {
    doLoop: false,
    nowPlaying: '',
    doLoopQueue: false,
    useShuffle: false,
    queue: [],
}

module.exports = { ref };