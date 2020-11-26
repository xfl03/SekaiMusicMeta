import * as fs from "fs";
import {MusicMeta} from "./modules/MusicMetaInterface";

//Read metas
let metaStr = fs.readFileSync("metas.json", "utf8");
let metaObj = JSON.parse(metaStr) as MusicMeta[];

metaObj = metaObj.sort((a, b) => a.music_time - b.music_time);
let lastTime = 0, lastRate = 0;
metaObj.forEach(it => {
    if (it.music_time != lastTime && it.event_rate != lastRate) {
        console.log(it.music_time + " " + it.event_rate);
    }
    lastTime = it.music_time;
    lastRate = it.event_rate;
});