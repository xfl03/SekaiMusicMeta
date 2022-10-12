import * as fs from "fs";
import { MusicMeta } from "./modules/MusicMetaInterface";
import { BpmChangeEvent, MusicScore } from "./modules/MusicScoreInterface";
import { getMusicTitle } from "./modules/MusicHelper";

//Read metas
let metaStr = fs.readFileSync("music_metas.json", "utf8");
let metaObj = JSON.parse(metaStr) as MusicMeta[];

let noteCount = {
    easy: 0,
    normal: 0,
    hard: 0,
    expert: 0,
    master: 0
}

metaObj = metaObj.filter(it => it.music_time !== undefined).sort((a, b) => a.music_time - b.music_time);
let lastTime = 0, lastRate = 0;
metaObj.forEach(it => {
    if (it.music_time != lastTime && it.event_rate != lastRate) {
        console.log(it.music_time + "," + it.event_rate + ",");
    }
    lastTime = it.music_time;
    lastRate = it.event_rate;

    it.skill_note_count.forEach(i => noteCount[it.difficulty] += i)
});

let musicCount = metaObj.length / 5;
for (let key in noteCount) {
    console.log(`${key} ${noteCount[key] / musicCount / 6}`)
}

//Read all scores
let scoreStr = fs.readFileSync("scores.json", "utf8");
let scoreObj = JSON.parse(scoreStr) as MusicScore[];

//Print bpm change
scoreObj.filter(it => it.music_difficulty==="master"&&it.bpm_change_events.length > 1).forEach(it => {
    let tmp: BpmChangeEvent[] = [it.bpm_change_events[0]];
    for (let i = 1; i < it.bpm_change_events.length; ++i) {
        let t = it.bpm_change_events[i];
        if (t.bpm != tmp[tmp.length - 1].bpm) {
            tmp.push(t);
        }
    }
    if (tmp.length === 1) return;

    console.log(getMusicTitle(it.music_id) + " " + it.music_difficulty + " " + tmp.length)
    console.log(tmp)
})

//Output Max Combo
metaObj
    .filter(it => it.combo >= 1500)
    .sort((a, b) => b.combo - a.combo)
    .forEach(it => console.log(it.combo + " " + getMusicTitle(it.music_id) + " " + it.difficulty));

//Output Average Event Rating
let eventRatingSum = 0;
metaObj.forEach(it => {
    eventRatingSum += it.event_rate;
})
console.log(eventRatingSum / metaObj.length)

//Average Skill Effect
let skillSum = [0, 0, 0, 0, 0, 0];
metaObj.forEach(it => {
    it.skill_score_multi.forEach((it, i) => skillSum[i] += it);
})
skillSum.forEach(it => console.log(it / metaObj.length))