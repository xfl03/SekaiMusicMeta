export interface MusicMeta {
    music_id:number,
    difficulty:string,
    level:number,
    combo:number,
    music_time:number,
    event_rate:number,

    base_score:number,
    base_score_auto:number,
    skill_score_solo:number[],
    skill_score_auto:number[],
    skill_score_multi:number[],
    skill_note_count:number[],
    fever_score:number,
    fever_end_time:number,
}

export interface MusicScoreResult {
    music_id:number,
    difficulty:string,
    level:number,
    music_time:number,
    solo_score:number,
    auto_score:number,
    multi_score:number
    solo_event_pt:number,
    auto_event_pt:number,
    multi_event_pt:number,
    cheer_event_pt:number
}