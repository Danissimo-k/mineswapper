export type Cell = {
    value: CellValue;
    state: CellState;
    red?: boolean
};


export enum CellState {
    hidden,
    visible,
    flagged,
    questionable,
}


export enum CellValue {
    none,

    // Bombs quantity
    one,
    two,
    three,
    four,
    five,
    six,
    seven,
    eight,

    bomb
}