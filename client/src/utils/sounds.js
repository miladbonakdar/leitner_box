const baseUrl = `${process.env.VUE_APP_SERVER_BASE_URL}api-v1/public/sound/`;

function soundUrl(sound) {
    return baseUrl + sound + ".mp3";
}

export function playSound(sound) {
    const audio = new Audio(soundUrl(sound));
    return audio.play();
}
