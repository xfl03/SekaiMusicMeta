import * as fs from "fs";
import {MusicMeta} from "./modules/MusicMetaInterface";
import {MusicScore} from "./modules/MusicScoreInterface";
import {getMusicTitle, musicName} from "./modules/MusicHelper";

//Read metas
let metaStr = fs.readFileSync("metas.json", "utf8");
let metaObj = JSON.parse(metaStr) as MusicMeta[];

metaObj = metaObj.filter(it=>it.music_time!==undefined).sort((a, b) => a.music_time - b.music_time);
let lastTime = 0, lastRate = 0;
metaObj.forEach(it => {
    if (it.music_time != lastTime && it.event_rate != lastRate) {
        console.log(it.music_time + "," + it.event_rate + ",");
    }
    lastTime = it.music_time;
    lastRate = it.event_rate;
});

//Read all scores
let scoreStr = fs.readFileSync("scores.json", "utf8");
let scoreObj = JSON.parse(scoreStr) as MusicScore[];
scoreObj.filter(it => it.bpm_change_events.length > 1).forEach(it => {
    console.log(getMusicTitle(it.music_id)+" "+it.music_difficulty)
    console.log(it.bpm_change_events)
})