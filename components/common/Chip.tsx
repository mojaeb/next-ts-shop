import React from 'react'
import { joinClasses } from '../../utils/style'

interface ChipProps {
    children: React.ReactNode
    color?: 'primary' | 'green' | 'red'
}

const Chip: React.FC<ChipProps> = ({
    children,
    color,
}): JSX.Element => {
    const classes = joinClasses([
        `text-${color}-500`,
        'px-2 py-1',
        'text-sm',
        `bg-${color}-50`,
        'rounded-md',
    ])
    return <p className={classes}>{children}</p>
}

Chip.defaultProps = {
    color: 'primary',
}
export default Chip
