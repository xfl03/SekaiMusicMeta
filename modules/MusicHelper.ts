import * as fs from "fs";
import * as mm from "music-metadata";
import {MusicData, MusicVocalData} from "./MusicDataInterface";


//Please change these path before use
const masterDataPath = "";
const musicAssetPath = ""

const musicData = JSON.parse(fs.readFileSync(masterDataPath + "musics.json", "utf8")) as MusicData[];
const musicVocalData = JSON.parse(fs.readFileSync(masterDataPath + "musicVocals.json", "utf8")) as MusicVocalData[];

function getMusicData(id: number) {
    return musicData.filter(it => it.id === id)[0];
}

export function getMusicTitle(id: number) {
    return getMusicData(id).title;
}

export const musicTime: Record<number, number> = {
    1: 123.2,
    2: 107,
    3: 116.4,
    6: 95,
    10: 133,
    11: 94,
    13: 120,
    18: 128,
    19: 104.3,
    21: 121.7,
    22: 99.7,
    26: 98.5,
    27: 132.6,
    28: 127.2,
    36: 146.2,
    38: 99.6,
    41: 149,
    43: 126.9,
    44: 123.7,
    45: 119.1,
    47: 182.1,
    48: 170.8,
    49: 143.6,
    50: 132.6,
    51: 121.7,
    52: 107.6,//potatoになっていく
    54: 92.2,
    57: 106,
    60: 100.7,
    61: 139.1,
    62: 83.5,
    63: 114.8,
    64: 133.1,
    66: 146.7,
    67: 104,
    68: 101.9,
    69: 124,
    70: 118,//メルティランドナイトメア
    71: 122.8,
    73: 116.2,
    74: 74.8,
    76: 111.9,
    77: 109.1,
    78: 110.6,
    81: 140,
    82: 118.1,
    83: 134.9,
    84: 142.3,
    85: 130.6,
    86: 132.8,
    92: 111, //乙女解剖
    93: 116.9,
    99: 123.6,
    113: 120.9,
    114: 110.5,
    115: 136.7,
}

const musicTimeCache = new Map<number, number>()

export async function initMusicTime(id:number) {
    let music = getMusicData(id);
    let vocal = musicVocalData.filter(it => it.musicId === id)[0];

    let meta = await mm.parseFile(`${musicAssetPath}/${vocal.assetbundleName}_rip/${vocal.assetbundleName}.mp3`);
    let time = Math.round((meta.format.duration - music.fillerSec) * 10) / 10;
    musicTimeCache.set(id, time);
}

export async function initAllMusicTime() {
    let musics = musicData.filter(it=>musicTime[it.id]===undefined);
    for(let music of musics) {
        await initMusicTime(music.id);
    }
}

export function getMusicTime(id: number) {
    if (musicTime[id] !== undefined) return musicTime[id];
    if (musicTimeCache.has(id)) return musicTimeCache.get(id);

    console.log(`Cannot read music time:${id}`)
    return undefined;
}

export const eventMusicRate: Record<number, number> = {
    1: 114,
    2: 109,
    3: 112,
    6: 105,
    10: 116,
    11: 106,
    13: 113,
    18: 114,
    19: 108,
    21: 113,
    22: 106,
    26: 106,
    27: 116,
    28: 114,
    36: 120,
    38: 107,
    41: 121,
    43: 115,
    44: 114,
    45: 113,
    46: 114, //グリーンライツ・セレナーデ 2021.04.01 Tested
    47: 130, //メルト
    48: 128,
    49: 119,
    50: 116,
    51: 113,
    52: 109, //potatoになっていく
    54: 105,
    57: 110,
    60: 107,
    61: 118,
    62: 103,
    63: 111,
    64: 116,
    66: 120,
    67: 108,
    68: 108,
    69: 114,
    70: 111, //メルティランドナイトメア
    71: 113,
    73: 112,
    74: 100, //独りんぼエンヴィー
    76: 110,
    77: 110,
    78: 110,
    81: 119,
    82: 112,
    83: 117,
    84: 118,
    85: 116,
    86: 116,
    87: 116, //恋愛裁判 2021.04.02 Tested
    92: 110, //乙女解剖
    93: 113,
    103: 113, //ニジイロストーリーズ 2021.04.01 Tested
    110: 114, //千本桜 2021.04.02 Tested
    115: 118, //アンノウン・マザーグース 2021.04.02 Tested
    122: 112, //ポジティブ☆ダンスタイム 2021.04.02 Tested
}

export function getMusicEventRate(id: number) {
    if (eventMusicRate[id] !== undefined) return eventMusicRate[id];

    let time = getMusicTime(id);
    return Math.floor(time / 3.6) + 80;
}