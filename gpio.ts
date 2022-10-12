import * as fs from "fs";
import {MusicScore} from "./modules/MusicScoreInterface";
import {TouchEvent, comparator} from "./modules/Touchhelper";

let scoreStr = fs.readFileSync("scores.json", "utf8");
let scoreObj = JSON.parse(scoreStr) as MusicScore[];
//let score = scoreObj.filter((it) => it.music_id === 62 && it.music_difficulty === "easy");//JSG
//let score = scoreObj.filter((it) => it.music_id === 11 && it.music_difficulty === "easy");//viva
//let score = scoreObj.filter((it) => it.music_id === 74 && it.music_difficulty === "easy");//独りんぼエンヴィー
let score = scoreObj.filter((it) => it.music_id === 139 && it.music_difficulty === "easy");//夜驱
//let score = scoreObj.filter((it) => it.music_id === 47 && it.music_difficulty === "easy");//Melt

let pq: TouchEvent[] = [];

score[0].playable_notes.forEach((it) => {
    if (it.note_class.includes("Auto") || it.note_class.includes("Mid")) {
        return
    }

    if (it.note_range[1] < 5 || it.note_range[0] > 10 || (it.note_range[0] > 5 && it.note_range[1] < 10)) {
        console.log(`${it.note_range[0]} ${it.note_range[1]}`)
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    }

    let left = it.note_range[0] <= 5;
    let key = left ? "left" : "right";
    let time = Math.round(it.time_offset*1000);

    if (it.note_class.includes("Normal")) {
        pq.push({
            position: key,
            start: true,
            time: time
        } as TouchEvent)
        pq.push({
            position: key,
            start: false,
            time: time+150
        } as TouchEvent)
    } else if (it.note_class.includes("Start")) {
        pq.push({
            position: key,
            start: true,
            time: time
        } as TouchEvent)
    } else if (it.note_class.includes("End")) {
        pq.push({
            position: key,
            start: false,
            time: time
        } as TouchEvent)
    } else {
        console.log(it.note_class)
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    }
});
pq = pq.sort(comparator);
//console.log(pq);
let t0 = -9885;
let lastT = -33;
let out = `from gpiozero import LED
import time

t0 = time.time()
print(time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(t0)))

left = LED(21)
right = LED(20)

def sleepTo(t):
    now = time.time()
    time.sleep(t0+t/1000.0-now)

`;
const output = (t:string)=>out+=t+"\r\n";
pq.forEach((it) => {
    let dt = it.time - t0;
    if (it.time - lastT >= 1) {
        output(`sleepTo(${dt})`)
        lastT = it.time;
    }
    if (it.start) {
        output(`${it.position}.on()`);
    } else {
        output(`${it.position}.off()`);
    }
});


fs.writeFileSync("I:/yq.py", out, {encoding: 'utf8', flag: 'w'});
