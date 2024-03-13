import { AudioPlayer } from "./lib/sound";
import p5 from "p5";
import * as p5Extension from "@fal-works/p5-extension";
import * as creativeCodingCore from "@fal-works/creative-coding-core";

interface Sounds {
  music: AudioPlayer;
  gunSound: AudioPlayer;
  bombSound: AudioPlayer;
  preAppearanceSound: AudioPlayer;
  appearanceSound: AudioPlayer;
  damageSound: AudioPlayer;
}

export declare global {
  interface Window {
    sounds: Sounds;
    p5: p5;
    p5Extension: p5Extension;
    creativeCodingCore: creativeCodingCore;
  }
}
