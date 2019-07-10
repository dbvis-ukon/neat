export interface AnnotationNote {
    title: string;
    label2: string;
}
export interface AnnotationPositionInfo {
    date: Date;
    y: number;
}
  
export interface IAnnotationData {
    note: AnnotationNote;
    data: AnnotationPositionInfo;

    dx: number;
    dy: number;

    color: string;

    /**
     * annotation id
     */
    uuid: string;
}