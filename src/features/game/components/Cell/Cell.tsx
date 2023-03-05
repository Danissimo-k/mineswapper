import React, {FC, memo, ReactNode} from "react";
import {CellState, CellValue} from "../../../../models";

import styles from './Cell.module.scss';

interface CellProps {
    col: number;
    red?: boolean | undefined;

    onClick(rowParam: number, colParam: number): (...args: any[]) => void;

    onContext(rowParam: number, colParam: number): (...args: any[]) => void;

    row: number;
    state: CellState;
    value: CellValue;
}


const CellButtonComponent: FC<CellProps> = ({
                                                col,
                                                onClick,
                                                onContext,
                                                red,
                                                row,
                                                state,
                                                value
                                            }) => {

    const iconRender  = () => {
        if (red) {
            return styles.red
        }
        if (state === CellState.visible) {
            if (value === CellValue.bomb) {
                return styles.bomb;
            } else if (value === CellValue.none) {
                return styles.visible;
            } else if (value === CellValue.one) {
                return styles.value1;
            } else if (value === CellValue.two) {
                return styles.value2;
            } else if (value === CellValue.three) {
                return styles.value3;
            } else if (value === CellValue.four) {
                return styles.value4;
            } else if (value === CellValue.five) {
                return styles.value5;
            }else if (value === CellValue.six) {
                return styles.value6;
            }else if (value === CellValue.seven) {
                return styles.value7;
            }else if (value === CellValue.eight) {
                return styles.value8;
            }
        } else if (state === CellState.flagged) {
            return styles.flagged;
        } else if (state === CellState.questionable) {
            return styles.question;
        } else {
            return ''
        }
    }

    const classNames = styles.button +
        ` ${styles.icon} ` +
        iconRender()


    return (
        <div
            className={classNames}
            onClick={onClick(row, col)}
            onContextMenu={onContext(row, col)}
        />
    );
};

export const CellButton = memo(CellButtonComponent);
