import { AudioPlayer } from "./lib/sound";
import { ENABLE_MUSIC } from "./settings";

let volume = 0;
const {
  music,
  gunSound,
  bombSound,
  preAppearanceSound,
  appearanceSound,
  damageSound,
} = window.sounds;

export const playMusic = () => {
  if (ENABLE_MUSIC) music.play();
};

export const stopMusic = () => {
  if (ENABLE_MUSIC) music.stop();
};

export const setVolume = (vol: number) => {
  if (ENABLE_MUSIC) music.setVolume(vol);
  gunSound.setVolume(0.25 * vol);
  bombSound.setVolume(0.65 * vol);
  preAppearanceSound.setVolume(0.3 * vol);
  appearanceSound.setVolume(0.5 * vol);
  damageSound.setVolume(1.0 * vol);

  if (volume === 0 && vol > 0) playMusic();
  else if (volume > 0 && vol === 0) stopMusic();

  volume = vol;
};

export const playGunSound = () => {
  if (!gunSound.isPlaying()) gunSound.play();
};
export const stopGunSound = () => {
  if (gunSound.isPlaying()) gunSound.stop();
};

const playRestart = (sound: AudioPlayer) => {
  if (sound.isPlaying()) sound.stop();
  sound.play();
};

export const playBombSound = () => playRestart(bombSound);
export const playPreAppearanceSound = () => playRestart(preAppearanceSound);
export const playAppearanceSound = () => playRestart(appearanceSound);
export const playDamageSound = () => playRestart(damageSound);
