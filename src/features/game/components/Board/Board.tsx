import React, {FC, useEffect, useRef, useState} from 'react';
import {BOMB_QUANTITY, initGrid, MAX_COLS, MAX_ROWS, openMultipleCells} from "../../../../utils";
import {Cell, CellState, CellValue, Face, GameStatus} from "../../../../models";
import {NumberDisplay} from "../NumberDisplay/NumberDisplay";
import {CellButton} from "../Cell";
import styles from './Board.module.scss';


export const Board: FC = () => {
    const [grid, setGrid] = useState<Cell[][]>(initGrid());
    const [face, setFace] = useState<Face>(Face.smile);
    const [time, setTime] = useState<number>(0);
    const [live, setLive] = useState<boolean>(false);
    const [bombCounter, setBombCounter] = useState<number>(BOMB_QUANTITY);
    const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.playing);
    const boardRef = useRef(null);


    useEffect(() => {
        const handleMouseDown = (): void => {
            setFace(Face.oh);
        };
        const handleMouseUp = (): void => {
            if(gameStatus === GameStatus.lost) {
                setFace(Face.lost);
            } else if (gameStatus === GameStatus.won){
                setFace(Face.won);
            } else {
                setFace(Face.smile);
            }
        };

        if (boardRef.current) {
            boardRef.current.addEventListener("mousedown", handleMouseDown);
            boardRef.current.addEventListener("mouseup", handleMouseUp);
        }

        return () => {
            if (boardRef.current) {
                boardRef.current.removeEventListener("mousedown", handleMouseDown);
                boardRef.current.removeEventListener("mouseup", handleMouseUp);
            }
        };
    }, [boardRef, gameStatus]);


    useEffect(() => {
        // 40 min
        if (live && time < 2400) {
            const timer = setInterval(() => {
                setTime(time + 1);
            }, 1000);

            return () => {
                clearInterval(timer);
            };
        }
    }, [live, time]);

    useEffect(() => {
        if (gameStatus === GameStatus.lost) {
            setLive(false);
            setFace(Face.lost);
        } else if (gameStatus === GameStatus.won) {
            setLive(false);
            setFace(Face.won);
        }
    }, [gameStatus]);

    const handleCellClick = (rowParam: number, colParam: number) => (): void => {
        if (gameStatus!== GameStatus.playing) {
            return;
        }
        let newCells = grid.slice();

        // start the game
        if (!live) {
            let isABomb = newCells[rowParam][colParam].value === CellValue.bomb;
            while (isABomb) {
                newCells = initGrid();
                if (newCells[rowParam][colParam].value !== CellValue.bomb) {
                    isABomb = false;
                    break;
                }
            }
            setLive(true);
        }

        const currentCell = newCells[rowParam][colParam];

        if (currentCell.state === CellState.flagged || currentCell.state === CellState.visible) {
            return;
        }

        if (currentCell.value === CellValue.bomb) {
            setGameStatus(GameStatus.lost);
            newCells[rowParam][colParam].red = true;
            newCells = showAllBombs();
            setGrid(newCells);
            return;
        } else if (currentCell.value === CellValue.none) {
            let res = openMultipleCells(newCells, rowParam, colParam);
            newCells = res[0];
            setBombCounter(prevState => prevState + res[1])
        } else {
            newCells[rowParam][colParam].state = CellState.visible;
        }

        // Check winning.
        let safeOpenCellsExists = false;
        for (let row = 0; row < MAX_ROWS; row++) {
            for (let col = 0; col < MAX_COLS; col++) {
                const currentCell = newCells[row][col];
                if (
                    currentCell.value !== CellValue.bomb
                    &&
                    currentCell.state === CellState.hidden
                ) {
                    safeOpenCellsExists = true;
                    break;
                }
            }
        }

        if (!safeOpenCellsExists) {
            newCells = newCells.map(row =>
                row.map(cell => {
                    if (cell.value === CellValue.bomb) {
                        return {
                            ...cell,
                            state: CellState.flagged
                        };
                    }
                    return cell;
                })
            );
            setGameStatus(GameStatus.won)
        }

        setGrid(newCells);
    };

    const handleCellContext = (rowParam: number, colParam: number) => (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>
    ): void => {
        e.preventDefault();

        if (!live || gameStatus!== GameStatus.playing) {
            return;
        }

        const currentCells = grid.slice();
        const currentCell = grid[rowParam][colParam];

        if (currentCell.state === CellState.visible) {
            return;
        } else if (currentCell.state === CellState.hidden) {
            currentCells[rowParam][colParam].state = CellState.flagged;
            setGrid(currentCells);
            setBombCounter(bombCounter - 1);
        } else if (currentCell.state === CellState.flagged) {
            currentCells[rowParam][colParam].state = CellState.questionable;
            setGrid(currentCells);
            setBombCounter(bombCounter + 1);
        } else if (currentCell.state === CellState.questionable) {
            currentCells[rowParam][colParam].state = CellState.hidden;
            setGrid(currentCells);
            setBombCounter(bombCounter);
        }
    };

    const handleFaceClick = (): void => {
        setBombCounter(BOMB_QUANTITY)
        setFace(Face.smile)
        setLive(false);
        setTime(0);
        setGrid(initGrid());
        setGameStatus(GameStatus.playing);
    };

    const renderCells = (): React.ReactNode => {
        return grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
                <CellButton
                    col={colIndex}
                    key={`${rowIndex}-${colIndex}`}
                    onClick={handleCellClick}
                    onContext={handleCellContext}
                    red={cell.red}
                    row={rowIndex}
                    state={cell.state}
                    value={cell.value}
                />
            ))
        );
    };

    const showAllBombs = (): Cell[][] => {
        const currentCells = grid.slice();
        return currentCells.map(row =>
            row.map(cell => {
                if (cell.value === CellValue.bomb) {
                    return {
                        ...cell,
                        state: CellState.visible
                    };
                }
                return cell;
            })
        );
    };

    const faceSwitcher = (face: Face) => {
        switch (face) {
            case Face.oh:
                return styles.oh
            case Face.smile:
                return styles.smile
            case Face.lost:
                return styles.lost
            case Face.won:
                return styles.won
        }
    }

    return (
        <div className={styles.board}>
            <div className={styles.header}>
                <NumberDisplay value={bombCounter}/>
                <div className={styles.face} onClick={handleFaceClick}>
                  <span className={`${styles.icon} ${faceSwitcher(face)}`} role="img" aria-label="face" />
                </div>
                <NumberDisplay value={time}/>
            </div>
            <div ref={boardRef} className={styles.body}>{renderCells()}</div>
        </div>
    )

};

