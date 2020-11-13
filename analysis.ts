import * as fs from 'fs';
import {MusicMeta, MusicScoreResult} from "./modules/MusicMetaInterface";
import {eventPoint, levelWeight,} from "./modules/ScoreHelper";
import {musicName} from "./modules/MusicHelper";

const CENTER_SKILL = 80;
const OTHER_SKILL = [60, 40, 50, 40];
const UNIT_SUM = 142840;
const EVENT_UP_RATE = 190;

const LIVE_GAP_TIME = 20;
const DISPLAY_ITEMS = 10;

//Read metas
let metaStr = fs.readFileSync("metas.json", "utf8");
let metaObj = JSON.parse(metaStr) as MusicMeta[];

//Skill
let otherSum = 0;
OTHER_SKILL.forEach(it => {
    otherSum += it
});
let otherAverage = otherSum / OTHER_SKILL.length;
let soloSkillCount = OTHER_SKILL.length + 1;

let soloCenterSkillWeight = CENTER_SKILL / 100;
let soloAverageSkillWeight = (otherAverage * (soloSkillCount - 1) + CENTER_SKILL) / 100 / soloSkillCount;
let multiSkillWeight = (1 + CENTER_SKILL / 100) * Math.pow(1 + otherAverage / 500, 4) - 1;

//Process metas
let scores: MusicScoreResult[] = [];
metaObj.forEach(meta => {
    //Calculate score
    let soloScore = meta.base_score;
    meta.skill_score_solo.forEach((i, index) => {
        soloScore += i * (index == 5 ? soloCenterSkillWeight : (index >= soloSkillCount ? 0 : soloAverageSkillWeight));
    });
    soloScore *= UNIT_SUM * 4;
    let multiScore = meta.base_score + meta.fever_score * 0.5 + 0.05 * levelWeight(meta.level);
    meta.skill_score_multi.forEach(i => {
        multiScore += i * multiSkillWeight;
    });
    multiScore *= UNIT_SUM * 4;
    //Save score
    scores.push({
        music_id: meta.music_id,
        difficulty: meta.difficulty,
        level: meta.level,
        music_time: meta.music_time,
        solo_score: Math.floor(soloScore),
        multi_score: Math.floor(multiScore),
        solo_event_pt: eventPoint(soloScore, 0, meta.event_rate, EVENT_UP_RATE),
        multi_event_pt: eventPoint(multiScore, multiScore * 4, meta.event_rate, EVENT_UP_RATE)
    } as MusicScoreResult);
})

//Write to file
fs.writeFileSync("scores.json", JSON.stringify(scores), {encoding: 'utf8', flag: 'w'});

//Output top score
if (scores.length >= DISPLAY_ITEMS) {
    console.log("TOP SOLO SCORE")
    scores.sort((a, b) => b.solo_score - a.solo_score);
    for (let i = 0; i < DISPLAY_ITEMS; ++i) {
        let score = scores[i];
        console.log("#" + (i + 1) + " " + musicName[score.music_id] + " " + score.difficulty + " Level:" + score.level + " Solo:" + score.solo_score);
    }

    console.log("\nTOP MULTI SCORE")
    scores.sort((a, b) => b.multi_score - a.multi_score);
    for (let i = 0; i < DISPLAY_ITEMS; ++i) {
        let score = scores[i];
        console.log("#" + (i + 1) + " " + musicName[score.music_id] + " " + score.difficulty + " Level:" + score.level + " Multi:" + score.multi_score);
    }

    console.log("\nTOP SOLO EVENT")
    scores.sort((a, b) => b.solo_event_pt - a.solo_event_pt);
    for (let i = 0; i < DISPLAY_ITEMS * 2; ++i) {
        let score = scores[i];
        console.log("#" + (i + 1) + " " + musicName[score.music_id] + " " + score.difficulty + " Level:" + score.level + " SoloEvent:" + score.solo_event_pt);
    }

    console.log("\nTOP MULTI EVENT")
    scores.sort((a, b) => -b.multi_event_pt + a.multi_event_pt);
    for (let i = 0; i < DISPLAY_ITEMS * 2; ++i) {
        let score = scores[i];
        console.log("#" + (i + 1) + " " + musicName[score.music_id] + " " + score.difficulty + " Level:" + score.level + " MultiEvent:" + score.multi_event_pt);
    }

    console.log("\nTOP MULTI EVENT SPEED")
    scores.sort((a, b) => b.multi_event_pt / (b.music_time + LIVE_GAP_TIME) - a.multi_event_pt / (a.music_time + LIVE_GAP_TIME));
    for (let i = 0; i < DISPLAY_ITEMS * 2; ++i) {
        let score = scores[i];
        console.log("#" + (i + 1) + " " + musicName[score.music_id] + " " + score.difficulty + " Level:" + score.level + " MultiEvent:" + score.multi_event_pt + " Time:" + score.music_time);
    }
}

//Output Average Score
let sum = {
    easy: 0,
    normal: 0,
    hard: 0,
    expert: 0,
    master: 0
};
let count = {
    easy: 0,
    normal: 0,
    hard: 0,
    expert: 0,
    master: 0
};
scores.forEach(it => {
    sum[it.difficulty] += it.multi_event_pt;
    count[it.difficulty]++;
});
["easy", "normal", "hard", "expert", "master"].forEach(it => {
    console.log(it + " multi event pt average:" + sum[it] / count[it]);
})