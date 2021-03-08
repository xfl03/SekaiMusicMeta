export interface MusicData {
    id: number;
    seq: number;
    releaseConditionId: number;
    categories: string[];
    title: string;
    lyricist: string;
    composer: string;
    arranger: string;
    dancerCount: number;
    selfDancerPosition: number;
    assetbundleName: string;
    liveTalkBackgroundAssetbundleName: string;
    publishedAt: any;
    liveStageId: number;
    fillerSec: number;
}

export interface CharacterData {
    id: number;
    musicId: number;
    musicVocalId: number;
    characterType: string;
    characterId: number;
    seq: number;
}

export interface MusicVocalData {
    id: number;
    musicId: number;
    musicVocalType: string;
    seq: number;
    releaseConditionId: number;
    caption: string;
    characters: CharacterData[];
    assetbundleName: string;
}