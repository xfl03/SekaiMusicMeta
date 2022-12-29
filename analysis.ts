import * as fs from 'fs';
import {MusicMeta, MusicScoreResult} from "./modules/MusicMetaInterface";
import {displayScores, eventPoint, paretoOptimality, eventPointCheerful,} from "./modules/ScoreHelper";
import {getMusicTitle} from "./modules/MusicHelper";

//Multi Live
let CENTER_SKILL = 95.4;
let UNIT_SUM = 196137;
let OTHER_SKILL = [95.4, 66.5, 66.5, 66.5];
let EVENT_UP_RATE = 265;

if (process.argv.length > 2) UNIT_SUM = parseFloat(process.argv[2])
if (process.argv.length > 3) CENTER_SKILL = parseFloat(process.argv[3])
if (process.argv.length > 4) EVENT_UP_RATE = parseFloat(process.argv[4])

// const LIVE_GAP_TIME_SOLO = 15;
const LIVE_GAP_TIME_MULTI = 41;
const DISPLAY_ITEMS = 25;

//Read metas
let metaStr = fs.readFileSync("music_metas.json", "utf8");
let metaObj = JSON.parse(metaStr) as MusicMeta[];

//Skill
let otherSum = 0;
OTHER_SKILL.forEach(it => {
    otherSum += it
});
let otherAverage = OTHER_SKILL.length === 0 ? 0 : (otherSum / OTHER_SKILL.length);
let soloSkillCount = OTHER_SKILL.length + 1;

let soloCenterSkillWeight = CENTER_SKILL / 100;
let soloAverageSkillWeight = (otherAverage * (soloSkillCount - 1) + CENTER_SKILL) / 100 / soloSkillCount;
let multiSkillWeight = CENTER_SKILL / 100 + otherAverage / 100 / 5 * 4;

//console.log(soloCenterSkillWeight);
//console.log(soloAverageSkillWeight);

//Process metas
let scores: MusicScoreResult[] = [];
metaObj.forEach(meta => {
    //Calculate score
    let soloScore = meta.base_score;
    meta.skill_score_solo.forEach((i, index) => {
        soloScore += i * (index == 5 ? soloCenterSkillWeight : (index >= soloSkillCount ? 0 : soloAverageSkillWeight));
    });
    soloScore *= UNIT_SUM * 4;

    let autoScore = meta.base_score_auto;
    meta.skill_score_auto.forEach((i, index) => {
        autoScore += i * (index == 5 ? soloCenterSkillWeight : (index >= soloSkillCount ? 0 : soloAverageSkillWeight));
    });
    autoScore *= UNIT_SUM * 2;//Auto has 1/2 score

    let multiScore = meta.base_score + meta.fever_score * 0.5;
    meta.skill_score_multi.forEach(i => {
        multiScore += i * multiSkillWeight;
    });
    multiScore *= UNIT_SUM * 4;
    multiScore += Math.floor(UNIT_SUM * 5 * 0.015 * 5);//Praise Score (5 times)
    //Save score
    scores.push({
        music_id: meta.music_id,
        music_title: getMusicTitle(meta.music_id),
        difficulty: meta.difficulty,
        level: meta.level,
        music_time: meta.music_time,
        solo_score: Math.floor(soloScore),
        auto_score: Math.floor(autoScore),
        multi_score: Math.floor(multiScore),
        solo_event_pt: eventPoint(soloScore, 0, meta.event_rate, EVENT_UP_RATE),
        auto_event_pt: eventPoint(autoScore, 0, meta.event_rate, EVENT_UP_RATE),
        multi_event_pt: eventPoint(multiScore, multiScore * 4, meta.event_rate, EVENT_UP_RATE),
        cheer_event_pt: eventPointCheerful(multiScore, multiScore * 4, 1000, meta.event_rate, EVENT_UP_RATE)
    } as MusicScoreResult);
})

//Output top score
displayScores(scores, s => s.solo_score, true, "TOP SOLO SCORE", DISPLAY_ITEMS);
//displayScores(scores, s => s.multi_score, true, "TOP MULTI SCORE", DISPLAY_ITEMS);

//displayScores(scores, s => s.solo_event_pt, true, "TOP SOLO EVENT", DISPLAY_ITEMS);
//displayScores(scores, b => b.solo_event_pt / (b.music_time + LIVE_GAP_TIME_SOLO) * 3600, true, "TOP SOLO EVENT SPEED", DISPLAY_ITEMS);

displayScores(scores, s => s.auto_event_pt, true, "TOP AUTO EVENT", DISPLAY_ITEMS);

displayScores(scores, s => s.multi_event_pt, true, "TOP MULTI EVENT", DISPLAY_ITEMS);
displayScores(scores, b => b.multi_event_pt / (b.music_time + LIVE_GAP_TIME_MULTI) * 3600, true, "TOP MULTI EVENT SPEED", DISPLAY_ITEMS);

//Output Average Score
let sum: Record<string, number> = {
    easy: 0,
    normal: 0,
    hard: 0,
    expert: 0,
    master: 0
};
let sum_cheer: Record<string, number>  = {
    easy: 0,
    normal: 0,
    hard: 0,
    expert: 0,
    master: 0
};
let count: Record<string, number>  = {
    easy: 0,
    normal: 0,
    hard: 0,
    expert: 0,
    master: 0
};
scores.forEach(it => {
    sum[it.difficulty] += it.multi_event_pt;
    sum_cheer[it.difficulty] += it.cheer_event_pt;
    count[it.difficulty]++;
});
["easy", "normal", "hard", "expert", "master"].forEach(it => {
    console.log(it + " multi event pt average:" + sum[it] / count[it]);
    console.log(it + " cheer event pt average:" + sum_cheer[it] / count[it]);
})
console.log()

//Find pareto optimality
let scores0 = paretoOptimality(scores, it => it.multi_event_pt, true, "multi_pareto_1st");
let scores1 = scores.filter(it => !scores0.includes(it));
paretoOptimality(scores1, it => it.multi_event_pt, true, "multi_pareto_2nd");
