export interface PlayableNote {
    type: string;
    note_class: string;
    note_range: number[];
    measure_offset: number;
    time_offset: number;
    combo_num: number;
}

export interface SkillNote {
    type: string;
    measure_offset: number;
    time_offset: number;
}

export interface PrepareNote {
    type: string;
    measure_offset: number;
    time_offset: number;
    is_start: boolean;
}

export interface BpmChangeEvent {
    type: string;
    measure_offset: number;
    bpm: number;
}

export interface MusicScore {
    music_id: number;
    music_difficulty: string;
    play_level: number;
    note_count: number;
    playable_notes: PlayableNote[];
    skill_notes: SkillNote[];
    prepare_notes: PrepareNote[];
    bpm_change_events: BpmChangeEvent[];
}
