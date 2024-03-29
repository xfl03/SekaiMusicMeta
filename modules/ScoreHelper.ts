import { MusicScoreResult } from "./MusicMetaInterface";
import { getMusicTitle } from "./MusicHelper";
import * as fs from 'fs';

export const noteWeight: Record<string, number> = {
    "Normal": 10,
    "Long Start": 10,
    "Long End": 10,
    "Long Mid": 1,
    "Flick": 10,
    "Long End Flick": 10,

    "Normal Critical": 20,
    "Long Start Critical": 20,
    "Long End Critical": 20,
    "Long Mid Critical": 2,
    "Flick Critical": 30,
    "Long End Flick Critical": 30,

    "Long Auto": 1,
    "Long Auto Critical": 1,
}

export function comboWeight(combo: number): number {
    return 1 + Math.min(10, Math.floor((combo - 2) / 100)) / 100;
}

export function levelWeight(level: number): number {
    return 1 + Math.max(0, level - 5) * 0.005;
}

export function eventPoint(score: number, other: number, rate: number, unitRate: number) {
    if (other === 0) {
        //Solo
        return Math.floor((100 + Math.floor(score / 20000)) * rate / 100 * (100 + unitRate) / 100);
    }
    return Math.floor((114 + Math.floor(score / 17500) + Math.min(11, Math.floor(other / 400000))) * rate / 100 * (100 + unitRate) / 100);
}

export function eventPointCheerful(score: number, other: number, life: number, rate: number, unitRate: number) {
    return Math.floor((114 + Math.floor(score / 12500) + Math.min(11, Math.floor(other / 400000)) + Math.min(40, Math.floor(life / 25))) * rate / 100 * (100 + unitRate) / 100);
}

export function displayScores(
    scores: MusicScoreResult[],
    sortItem: (s: MusicScoreResult) => number, sortOrder: boolean,
    displayTitle: string, displayNum: number
) {
    scores.sort((a, b) => sortItem(sortOrder ? b : a) === sortItem(sortOrder ? a : b) ? (a.music_time === b.music_time ? a.level-b.level : a.music_time - b.music_time) :sortItem(sortOrder ? b : a) - sortItem(sortOrder ? a : b));

    console.log(displayTitle);
    for (let i = 0; i < Math.min(displayNum, scores.length); ++i) {
        let score = scores[i];
        console.log("#" + (i + 1) + " " + score.music_id + " " + getMusicTitle(score.music_id) + " " + score.difficulty + " Level:" + score.level + " " + score.music_time + " " + sortItem(score) + " " + score.multi_event_pt);
    }
    console.log();
}

export function paretoOptimality(
    scores: MusicScoreResult[],
    sortItem: (s: MusicScoreResult) => number, sortOrder: boolean,
    fileName: string): MusicScoreResult[] {
    let scores_t = scores.sort((a, b) =>
        (a.music_time === b.music_time ? (sortItem(sortOrder ? b : a) === sortItem(sortOrder ? a : b) ? a.level - b.level :sortItem(sortOrder ? b : a) - sortItem(sortOrder ? a : b)) : a.music_time - b.music_time));
    let last = scores_t[0];
    let scores0 = scores.filter(it => {
        let result: boolean;
        if (it.music_time === last.music_time) {
            if(sortItem(it) === sortItem(last)){
                result = it.level <= last.level
            }else {
                result = sortItem(it) > sortItem(last)
            }
        } else {
            result = sortItem(it) > sortItem(last)
        }
        if (result) last = it;
        return result;
    })
    fs.writeFileSync(`${fileName}.json`, JSON.stringify(scores0), { encoding: 'utf8', flag: 'w' });
    return scores0;
}
