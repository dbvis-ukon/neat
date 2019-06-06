export interface Episode {
    type: 'ADD' | 'REMOVE';
    episode: string;
    startSentence: number;
    endSentence: number;
    columnId: number;
    rowIds: number[];
    id: number;
    color: string;
    lemma: string;
    significance: number;
}
