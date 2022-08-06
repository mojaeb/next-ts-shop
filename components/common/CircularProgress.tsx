import React from 'react'
import styles from '../../styles/circular.progressbar.module.css'
import { blue } from 'tailwindcss/colors'

export default function CircularProgress({
    size = '10',
    stroke = '5',
    color = null,
}: {
    size?: string
    stroke?: string
    color?: string | null
}): JSX.Element {
    return (
        <div className={`${styles.loader} w-${size} h-${size}`}>
            <svg className={styles.circularLoader} viewBox="25 25 50 50">
                <circle
                    className={styles.loaderPath}
                    cx="50"
                    cy="50"
                    r="20"
                    fill="none"
                    stroke={color || blue['500']}
                    strokeWidth={stroke}
                />
            </svg>
        </div>
    )
}
