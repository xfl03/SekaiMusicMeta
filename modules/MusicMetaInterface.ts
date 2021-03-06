export interface MusicMeta {
    music_id:number,
    difficulty:string,
    level:number,
    combo:number,
    music_time:number,
    event_rate:number,

    base_score:number,
    skill_score_solo:number[],
    skill_score_multi:number[],
    fever_score:number
}

export interface MusicScoreResult {
    music_id:number,
    difficulty:string,
    level:number,
    music_time:number,
    solo_score:number,
    multi_score:number
    solo_event_pt:number,
    multi_event_pt:number
}