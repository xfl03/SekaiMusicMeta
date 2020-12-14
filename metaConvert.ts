import * as fs from 'fs';
import {MusicScore} from "./modules/MusicScoreInterface";
import * as ScoreHelper from './modules/ScoreHelper'
import {MusicMeta} from "./modules/MusicMetaInterface";
import {eventMusicRate, musicName, musicTime} from "./modules/MusicHelper";

//Read all scores
let scoreStr = fs.readFileSync("scores.json", "utf8");
let scoreObj = JSON.parse(scoreStr) as MusicScore[];

//Process scores
let metas: MusicMeta[] = [];
scoreObj.forEach(score => {
    //Skip illegal score
    if (score.skill_notes.length != 6 || score.prepare_notes.length != 2 || score.note_count != score.playable_notes.length) {
        console.log("!SKIPPED: " + musicName[score.music_id] + " " + score.music_difficulty)
        return
    }

    //Basic info
    let typeWeightSum = 0;
    let basicScore = 0;

    //Skill info
    let isSkill = false;
    let skillNum = 0;
    let skillStartTime: number[] = [0, 0, 0, 0, 0, 0];
    score.skill_notes.forEach((v, i) => {
        skillStartTime[i] = v.time_offset
    });
    let skillEndTime: number[] = [0, 0, 0, 0, 0, 0];
    skillStartTime.forEach((v, i) => {
        skillEndTime[i] = v + 5
    });
    let skillScoresSolo = [0, 0, 0, 0, 0, 0];
    let skillScoresMulti = [0, 0, 0, 0, 0, 0];

    //Fever info
    let isFever = false;
    let hasFevered = false;
    let feverStartTime = !score.prepare_notes[0].is_start ? score.prepare_notes[0].time_offset : score.prepare_notes[1].time_offset;
    let feverEndTime = 0;
    let feverNoteCover = Math.floor(score.playable_notes.length / 10);
    let feverNoteCount = 0;
    let feverScore = 0;

    //Process note
    score.playable_notes.forEach(note => {
        let time = note.time_offset;
        //Process skill
        if (isSkill) {
            //Skill end
            isSkill = time <= skillEndTime[skillNum - 1];
        } else {
            //If skill can begin
            if (skillNum < 6 && skillStartTime[skillNum] <= time) {
                //Skill begin
                isSkill = time <= skillEndTime[skillNum];//To avoid no note in skill
                ++skillNum;
            }
        }
        //Process fever
        if (isFever) {
            //Count note in fever
            feverNoteCount++;
            if (feverNoteCount == feverNoteCover) {
                //Update real fever end time
                feverEndTime = time;
            } else if (feverNoteCount > feverNoteCover) {
                //Fever end
                isFever = time <= feverEndTime;
            }
        } else {
            //If can fever
            if (!hasFevered && time >= feverStartTime) {
                //Fever start
                isFever = true;
                hasFevered = true;
            }
        }
        //Record score info
        let typeWeight = ScoreHelper.noteWeight[note.note_class]
        let comboWeight = ScoreHelper.comboWeight(note.combo_num)
        let noteWeight = typeWeight * comboWeight;
        typeWeightSum += typeWeight;
        basicScore += noteWeight;
        if (isSkill) {
            skillScoresSolo[skillNum - 1] += noteWeight;
            skillScoresMulti[skillNum - 1] += isFever ? noteWeight * 1.5 : noteWeight;
        }
        if (isFever) {
            feverScore += noteWeight;
        }
    })
    //Process Score
    let weight = ScoreHelper.levelWeight(score.play_level) / typeWeightSum;
    basicScore *= weight;
    skillScoresSolo = skillScoresSolo.map(i => i * weight);
    skillScoresMulti = skillScoresMulti.map(i => i * weight);
    feverScore *= weight;
    //Save music meta
    metas.push({
        music_id: score.music_id,
        difficulty: score.music_difficulty,
        level: score.play_level,
        combo: score.note_count,
        music_time: musicTime[score.music_id],
        event_rate: eventMusicRate[score.music_id],

        base_score: basicScore,
        skill_score_solo: skillScoresSolo,
        skill_score_multi: skillScoresMulti,
        fever_score: feverScore
    } as MusicMeta)
    console.log("Processed: " + score.music_id + " " +  musicName[score.music_id] + " " + score.music_difficulty)
})

//Write to file
fs.writeFileSync("metas.json", JSON.stringify(metas), {encoding: 'utf8', flag: 'w'});