import React, {FC} from 'react';
import {Board} from "../../components/Board";
import styles from './GamePage.module.scss';

export const GamePage: FC = () => {
    return (
        <div className={styles.wrapper}>
            <Board/>
        </div>
    );
};

