import React from 'react'
import { makeClasses } from '../../utils/style'

const Switch = ({
    active = false,
    onClick,
}: {
    active: boolean
    onClick: () => void
}): JSX.Element => {
    const classes = makeClasses({
        container: [
            'w-14',
            'ring-2',
            'ring-primary-400',
            'h-7',
            'rounded-md',
            'relative',
        ],
        toggle: [
            'w-6',
            'absolute',
            'top-1',
            'bottom-1',
            'transition',
            active ? 'right-1' : 'left-1',
            active ? 'bg-green-500' : 'bg-gray-200',
            'rounded-md',
        ],
    })

    return (
        <div className={classes.container} onClick={onClick}>
            <div className={classes.toggle} />
        </div>
    )
}

export default Switch
