import React, {memo} from "react";

import styles from './NumberDisplay.module.scss';

interface NumberDisplayProps {
    value: number;
}

const NumberDisplayComponent: React.FC<NumberDisplayProps> = ({ value }) => {
    const nums = value.toString().padStart(3, '0').split('')
    const numSwitcher = (num: string) => {
        switch (num) {
            case '0':
                return styles.zero
            case '1':
                return styles.one
            case '2':
                return styles.two
            case '3':
                return styles.three
            case '4':
                return styles.four
            case '5':
                return styles.five
            case '6':
                return styles.six
            case '7':
                return styles.seven
            case '8':
                return styles.eight
            case '9':
                return styles.nine
            default:
                return ''
        }
    }
    return (
        <div className={styles.wrapper}>
            {
                nums.map((num, index) => (
                    // Wrong format for key, but array it is not large.
                    <div key={index} className={`${styles.icon} ${numSwitcher(num)}`} />
                ))
            }
        </div>
    );
};

export const NumberDisplay = memo(NumberDisplayComponent);