import * as fs from "fs";
import {MusicScore} from "./modules/MusicScoreInterface";

let scoreStr = fs.readFileSync("scores.json", "utf8");
let scoreObj = JSON.parse(scoreStr) as MusicScore[];
let score = scoreObj.filter((it) => it.music_id === 49 && it.music_difficulty === "master");
console.log(score[0].playable_notes
    .filter((it) => !it.note_class.includes("Auto") && !it.note_class.includes("End") && !it.note_class.includes("Mid")).length);