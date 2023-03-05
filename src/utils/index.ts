import {Cell, CellState, CellValue} from "../models";

export const MAX_ROWS = 16;
export const MAX_COLS = 16;
export const BOMB_QUANTITY = 40;


/**
 * Get all neighbour cells.
 * @param grid Grid.
 * @param x Row.
 * @param y Column.
 */
const grabAllAdjacentCells = (
    grid: Cell[][],
    x: number,
    y: number
): {
    topLeftCell: Cell | null;
    topCell: Cell | null;
    topRightCell: Cell | null;
    leftCell: Cell | null;
    rightCell: Cell | null;
    bottomLeftCell: Cell | null;
    bottomCell: Cell | null;
    bottomRightCell: Cell | null;
} => {
    const topLeftCell =
        x > 0 && y > 0 ? grid[x - 1][y - 1] : null;
    const topCell = x > 0 ? grid[x - 1][y] : null;
    const topRightCell =
        x > 0 && y < MAX_COLS - 1
            ? grid[x - 1][y + 1]
            : null;
    const leftCell = y > 0 ? grid[x][y - 1] : null;
    const rightCell =
        y < MAX_COLS - 1 ? grid[x][y + 1] : null;
    const bottomLeftCell =
        x < MAX_ROWS - 1 && y > 0
            ? grid[x + 1][y - 1]
            : null;
    const bottomCell =
        x < MAX_ROWS - 1 ? grid[x + 1][y] : null;
    const bottomRightCell =
        x < MAX_ROWS - 1 && y < MAX_COLS - 1
            ? grid[x + 1][y + 1]
            : null;

    return {
        topLeftCell,
        topCell,
        topRightCell,
        leftCell,
        rightCell,
        bottomLeftCell,
        bottomCell,
        bottomRightCell
    };
};

/**
 * Generate grid.
 */
export const initGrid = (): Cell[][] => {
    let grid: Cell[][] = [];

    // generating all cells
    for (let row = 0; row < MAX_ROWS; row++) {
        grid.push([]);
        for (let col = 0; col < MAX_COLS; col++) {
            grid[row].push({
                value: CellValue.none,
                state: CellState.hidden
            });
        }
    }

    let bombsPlaced = 0;
    while (bombsPlaced < BOMB_QUANTITY) {
        const randomRow = Math.floor(Math.random() * MAX_ROWS);
        const randomCol = Math.floor(Math.random() * MAX_COLS);

        const currentCell = grid[randomRow][randomCol];
        if (currentCell.value !== CellValue.bomb) {
            grid = grid.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                    if (randomRow === rowIndex && randomCol === colIndex) {
                        return {
                            ...cell,
                            value: CellValue.bomb
                        };
                    }

                    return cell;
                })
            );
            bombsPlaced++;
        }
    }

    // calculate the numbers for each cell
    for (let rowIndex = 0; rowIndex < MAX_ROWS; rowIndex++) {
        for (let colIndex = 0; colIndex < MAX_COLS; colIndex++) {
            const currentCell = grid[rowIndex][colIndex];
            if (currentCell.value === CellValue.bomb) {
                continue;
            }

            let numberOfBombs = 0;
            const {
                topLeftCell,
                topCell,
                topRightCell,
                leftCell,
                rightCell,
                bottomLeftCell,
                bottomCell,
                bottomRightCell
            } = grabAllAdjacentCells(grid, rowIndex, colIndex);

            if (topLeftCell?.value === CellValue.bomb) {
                numberOfBombs++;
            }
            if (topCell?.value === CellValue.bomb) {
                numberOfBombs++;
            }
            if (topRightCell?.value === CellValue.bomb) {
                numberOfBombs++;
            }
            if (leftCell?.value === CellValue.bomb) {
                numberOfBombs++;
            }
            if (rightCell?.value === CellValue.bomb) {
                numberOfBombs++;
            }
            if (bottomLeftCell?.value === CellValue.bomb) {
                numberOfBombs++;
            }
            if (bottomCell?.value === CellValue.bomb) {
                numberOfBombs++;
            }
            if (bottomRightCell?.value === CellValue.bomb) {
                numberOfBombs++;
            }

            if (numberOfBombs > 0) {
                grid[rowIndex][colIndex] = {
                    ...currentCell,
                    value: numberOfBombs
                };
            }
        }
    }

    return grid;
};


/**
 * Open all empty cells.
 * @param grid Grid.
 * @param x Row.
 * @param y Column.
 */
export const openMultipleCells = (
    grid: Cell[][],
    x: number,
    y: number,
): [Cell[][], number] => {
    const currentCell = grid[x][y];

    let quantityOfWrongFlags = 0;

    if (
        currentCell.state === CellState.visible
    ) {
        return [grid, 0];
    }

    if (
        currentCell.state == CellState.flagged
    ) {
        quantityOfWrongFlags++
    }

    let newCells = grid.slice();
    newCells[x][y].state = CellState.visible;

    const {
        topLeftCell,
        topCell,
        topRightCell,
        leftCell,
        rightCell,
        bottomLeftCell,
        bottomCell,
        bottomRightCell
    } = grabAllAdjacentCells(grid, x, y);

    if (
        (topLeftCell?.state === CellState.hidden || topLeftCell?.state === CellState.flagged) &&
        topLeftCell.value !== CellValue.bomb
    ) {
        if (topLeftCell.value === CellValue.none) {
            let res = openMultipleCells(newCells, x - 1, y - 1);
            newCells = res[0];
            quantityOfWrongFlags += res[1];
        } else {
            newCells[x - 1][y - 1].state = CellState.visible;
        }
    }

    if ((topCell?.state === CellState.hidden || topCell?.state === CellState.flagged) && topCell.value !== CellValue.bomb) {
        if (topCell.value === CellValue.none) {
            let res = openMultipleCells(newCells, x - 1, y,);
            newCells = res[0];
            quantityOfWrongFlags += res[1];
        } else {
            newCells[x - 1][y].state = CellState.visible;
        }
    }

    if (
        (topRightCell?.state === CellState.hidden || topRightCell?.state === CellState.flagged) &&
        topRightCell.value !== CellValue.bomb
    ) {
        if (topRightCell.value === CellValue.none) {
            let res = openMultipleCells(newCells, x - 1, y + 1);
            newCells = res[0];
            quantityOfWrongFlags += res[1];
        } else {
            newCells[x - 1][y + 1].state = CellState.visible;
        }
    }

    if (
        (leftCell?.state === CellState.hidden || leftCell?.state === CellState.flagged) &&
        leftCell.value !== CellValue.bomb) {
        if (leftCell.value === CellValue.none) {
            let res = openMultipleCells(newCells, x, y - 1);
            newCells = res[0];
            quantityOfWrongFlags += res[1];
        } else {
            newCells[x][y - 1].state = CellState.visible;
        }
    }

    if (
        (rightCell?.state === CellState.hidden || rightCell?.state === CellState.flagged) &&
        rightCell.value !== CellValue.bomb
    ) {
        if (rightCell.value === CellValue.none) {
            let res = openMultipleCells(newCells, x, y + 1);
            newCells = res[0];
            quantityOfWrongFlags += res[1];
        } else {
            newCells[x][y + 1].state = CellState.visible;
        }
    }

    if (
        (bottomLeftCell?.state === CellState.hidden || bottomLeftCell?.state === CellState.flagged) &&
        bottomLeftCell.value !== CellValue.bomb
    ) {
        if (bottomLeftCell.value === CellValue.none) {
            let res = openMultipleCells(newCells, x + 1, y - 1);
            newCells = res[0];
            quantityOfWrongFlags += res[1];
        } else {
            newCells[x + 1][y - 1].state = CellState.visible;
        }
    }

    if (
        (bottomCell?.state === CellState.hidden || bottomCell?.state === CellState.flagged) &&
        bottomCell.value !== CellValue.bomb
    ) {
        if (bottomCell.value === CellValue.none) {
            let res = openMultipleCells(newCells, x + 1, y);
            newCells = res[0];
            quantityOfWrongFlags += res[1];
        } else {
            newCells[x + 1][y].state = CellState.visible;
        }
    }

    if (
        (bottomRightCell?.state === CellState.hidden || bottomRightCell?.state === CellState.flagged) &&
        bottomRightCell.value !== CellValue.bomb
    ) {
        if (bottomRightCell.value === CellValue.none) {
            let res = openMultipleCells(newCells, x + 1, y + 1);
            newCells = res[0];
            quantityOfWrongFlags += res[1];
        } else {
            newCells[x + 1][y + 1].state = CellState.visible;
        }
    }

    return [newCells, quantityOfWrongFlags];
};
